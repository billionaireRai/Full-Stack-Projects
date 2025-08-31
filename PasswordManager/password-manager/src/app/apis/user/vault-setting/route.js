import asyncErrorHandler from "@/middlewares/errorMiddleware";
import { connectWithMongoDB } from "@/db/dbConnection";
import { decodeGivenJWT } from "@/lib/decodejwt";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import vaultitems from "@/db/models/vaultModel";
import sharedvaults from "@/db/models/sharedVaultModel";
import auditlogs from "@/db/models/auditModel";

// Input validation schema
const vaultSearchSchema = z.object({
    infoGivenByUser: z.string().min(3, "Search query must be at least 3 characters").max(100, "Search query too long")
});

// Update validation schema
const vaultUpdateSchema = z.object({
    updateData: z.object({
        id: z.string().min(1, "Vault ID is required"),
        vaultType: z.enum(['private', 'shared']),
        vaultDescription: z.string().optional(),
        encryptedData: z.string().optional()
    }),
    UserLocation: z.object({
        country: z.string().optional(),
        city: z.string().optional(),
        ip: z.string().optional()
    }).optional()
});


// Helper function to get client info
const getClientInfo = (request) => {
    const userAgent = request.headers.get("user-agent") || "Unknown User Agent";
    const ip = request.headers.get("x-forwarded-for") || request.ip || "0.0.0.0";
    return { userAgent, ip };
};

// Helper function to authenticate user
const authenticateUser = async () => {
    const cookiesStore = await cookies();
    const tokenCookie = cookiesStore.get('accessToken')?.value;
    
    if (!tokenCookie) throw new Error("Authentication required");
    
    const decodedToken = decodeGivenJWT(tokenCookie, process.env.SECRET_FOR_ACCESS_TOKEN);
    return decodedToken;
};

const POST = asyncErrorHandler(async (request) => {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate input using Zod schema
    const validationResult = vaultSearchSchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json({
            message: "Invalid input",
            errors: validationResult.error.errors,
        }, { status: 400 });
    }

    const { infoGivenByUser , UserLocation } = validationResult.data;
    
    // Get client info for audit logging
    const { userAgent, ip } = getClientInfo(request);
    // Authenticate user
    const decodedToken = await authenticateUser();
    
    // Connect to database
    await connectWithMongoDB();

    // Create flexible search query with regex escaping
    const searchTerms = infoGivenByUser.trim().split(/\s+/);
    const searchConditions = searchTerms.map(term => ({
        $or: [
            { vaultDescription: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
            { 'vaultType.vaultCategory': { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
        ]
    }));

    // Search both private and shared vaults
    const [privateVaults, sharedVaults] = await Promise.all([
        vaultitems.find({ 
            userId: decodedToken.id,
            $and: searchConditions
        }).select({ 
            _id: 1, 
            encryptedCurrentData: 1, 
            vaultDescription: 1, 
            vaultType: 1, 
            createdAt: 1, 
            updatedAt: 1
        }),
        
        sharedvaults.find({ 
            $or: [
                { ownerId: decodedToken.id },
                { 'sharedWith.userId': decodedToken.id }
            ],
            $and: searchConditions
        }).select({ 
            _id: 1, 
            encryptedData: 1, 
            vaultDescription: 1, 
            vaultCategory: 1, 
            createdAt: 1, 
            updatedAt: 1
        })
    ]);

    // Combine and prioritize results...
    const allVaults = [
        ...privateVaults.map(v => ({ ...v.toObject(), vaultType: 'private' })),
        ...sharedVaults.map(v => ({ ...v.toObject(), vaultType: 'shared' }))
    ];

    if (allVaults.length === 0) {
        // Log failed search attempt...
        await auditlogs.create({
            userId:decodedToken.id,
            action:'vault search - no results',
            ipAddress:ip,
            userAgent:userAgent,
            locationOfAction:UserLocation || {}
        });
        
        return NextResponse.json({
            message: "No vault found matching the search criteria",
        }, { status: 404 });
    }

    // Log successful search...
    await auditlogs.create({
        userId: decodedToken.id,
        action: 'vault search - results found',
        ipAddress: ip,
        userAgent: userAgent,
        locationOfAction: UserLocation || {}
    });

    return NextResponse.json({
        message: "Vault items successfully retrieved",
    }, { status: 200 });
});

const PATCH = asyncErrorHandler(async (request) => {
    const body = await request.json();
    const { userAgent, ip } = getClientInfo(request);
    
    // Validate input
    const validationResult = vaultUpdateSchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json({
            message: "Invalid input",
            errors: validationResult.error.errors,
        }, { status: 400 });
    }
    
    const { updateData, UserLocation } = validationResult.data;
    const decodedToken = await authenticateUser() ; // Authenticate user...

    await connectWithMongoDB(); // establishing Connect to database...

    // Build update query dynamically
    const updateQuery = {};
    if (updateData.vaultDescription) updateQuery.vaultDescription = updateData.vaultDescription;
    if (updateData.vaultType) updateQuery['vaultType.access'] = updateData.vaultType;
    if (updateData.encryptedData) {
        if (updateData.vaultType === 'private') {
            updateQuery.encryptedCurrentData = updateData.encryptedData;
        } else {
            updateQuery.encryptedData = updateData.encryptedData;
        }
    }
    
    updateQuery.updatedAt = new Date();

    // Determine which model to use and update
    let updatedVault;
    
    if (updateData.vaultType === 'private') {
        updatedVault = await vaultitems.findOneAndUpdate(
            { _id: updateData.id, userId: decodedToken.id },
            { $set: updateQuery },
            { new: true, runValidators: true }
        );
    } else {
        updatedVault = await sharedvaults.findOneAndUpdate(
            { _id: updateData.id, ownerId: decodedToken.id },
            { $set: updateQuery },
            { new: true, runValidators: true }
        );
    }

    if (!updatedVault) {
        // Log failed update attempt..
        await auditlogs.create({
            userId:decodedToken.id,
            action:`vault update failed - ${updateData.vaultType} not found`,
            ipAddress:ip,
            userAgent:userAgent,
            locationOfAction:UserLocation || {}
       });
        
        return NextResponse.json({ 
            message: "Vault not found or access denied" 
        }, { status: 404 });
    }

    // Log successful update...
    await auditlogs.create({
        userId:decodedToken.id,
        action:`vault updated - ${updateData.vaultType}`,
        ipAddress:ip,
        userAgent:userAgent,
        locationOfAction:UserLocation || {}
    });

    return NextResponse.json({ message: "Vault item successfully updated", }, { status: 200 });
});

export { POST, PATCH };

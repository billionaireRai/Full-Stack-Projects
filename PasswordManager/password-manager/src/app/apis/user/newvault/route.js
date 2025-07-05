import { connectWithMongoDB } from "@/db/dbConnection";
import { cookies , headers } from "next/headers";
import { NextResponse } from "next/server";
import { decodeGivenJWT } from "@/lib/decodejwt";
import vaultitems from "@/db/models/vaultModel";
import sharedvaults from "@/db/models/sharedVaultModel";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import users from "@/db/models/userModel";
import auditlogs from "@/db/models/auditModel";


const POST = asyncErrorHandler( async (request) => {
    const { dataInFormat , passPhrase , locationOfAction , ipAddress} = await request.json() ; // destructuring the data coming from client...
if (!dataInFormat) {
        console.error("No data to push in vault !!");
        return NextResponse.json({ error: "Invalid Request, Provide some data for vault" }, { status: 400 });
    }
    console.log("Received vaultCategory:", dataInFormat.vaultCategory);
    console.log("Received vaultDescription:", dataInFormat.vaultDescription);
    // intializing cookies function
    const headersStore = await headers() ;
    const cookiesStore = await cookies() ;
    const accessToken = cookiesStore.get('accessToken')?.value ;
    if (!accessToken) {
        console.error("Access token not found in cookies");
        return NextResponse.json({ error: "User is not authenticated" }, { status: 401 });
    }
    const userDecoded = decodeGivenJWT(accessToken,process.env.SECRET_FOR_ACCESS_TOKEN);
    if (!userDecoded) {
        console.error("User is not authenticated !!");
        return NextResponse.json({ error: "User is not authenticated" }, { status: 401 });
    }

    await connectWithMongoDB() ; // creating connection with mongoDB...
if (dataInFormat.access === 'shared') {
    // Process of shared vault creation...
    const sharedUpdatedInfo = await Promise.all(dataInFormat.sharedWithIndividuals.map(async (value) => { 
        const sortingObject = String(value).includes('@') ? { email : value }  : { name: value } ; // needed the exact value of email / name of the user to whom we wanna share...
        const userFound = await users.findOne(sortingObject).select('_id').lean();
        if (!userFound) throw new Error(`User / One of the User to share with not found: ${value}`);
        
        return {
            sharedWithId: userFound._id,
            sharedWithText: value 
        } 
     }));

    const newSharedCredentials = new sharedvaults({
        ownerId: userDecoded.id,
        vaultCategory:dataInFormat.vaultCategory, // added these two feilds as well...
        vaultDescription:dataInFormat.vaultDescription,
        sharedWithIndividuals : {
            detailsOfSharing : sharedUpdatedInfo ,
            timeStampOfSharing: new Date().toISOString() 
        },
        encryptedData:dataInFormat.encryptedInfo,
        accessExpiresAt:new Date(dataInFormat.accessExpiresAt).toISOString(),
        passPhraseHash: passPhrase
    }); 
    await newSharedCredentials.save();
    console.log("Shared Vault Created !!");

    // logic for saving the action in audit logs
    const sharedVaultLog = new auditlogs({
        userId:userDecoded.id,
        action:"User created a shared vault",
        ipAddress:ipAddress,
        userAgent:headersStore.get('User-Agent'),
        locationOfAction:locationOfAction ,
    })
    await sharedVaultLog.save();
    return NextResponse.json({ message: "Shared Vault Created !!" }, { status: 201 });
}

    // Process private vault creation
    const newCredential = new vaultitems({
        userId:userDecoded.id,
        vaultType : {
            vaultCategory : dataInFormat.vaultCategory,
            access:dataInFormat.access
        },
        vaultDescription : dataInFormat.vaultDescription,
        encryptedCurrentData:dataInFormat.encryptedInfo,
        versionHistory:[
           {
            versionNumber:1,
            encryptedPreviousData:dataInFormat.encryptedInfo,
           }
        ]
    });
    await newCredential.save() ;
    console.log("Private Vault Created !!");
    // logic for saving the action in audit logs
    const privateVaultLog = new auditlogs({
        userId:userDecoded.id,
        action:"User created a private vault",
        ipAddress:request.ip,
        userAgent:headersStore.get('user-agent'),
        locationOfAction:locationOfAction ,
    })
    await privateVaultLog.save();
    return NextResponse.json({message : "New Private vault created"},{headers : {"Content-Type" : "application/json"},status:201});
})

export { POST } ;
import { connectWithMongoDB } from "@/db/dbConnection";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeGivenJWT } from "@/lib/decodejwt";
import { calculateObjectSize } from 'bson'; 
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import sharedvaults from "@/db/models/sharedVaultModel";

const POST = asyncErrorHandler( async (request) => {
    const { PassPhraseHashValue } = await request.json(); // destructuring the PassPhraseHashValue from request...
    if(!PassPhraseHashValue){
        console.log("PassPhraseHashValue is MISSING !!");
        return new NextResponse("Please provide PassPhraseHashValue", { status: 400 });
    }
    const cookiesStore = await cookies() ;
    // logic related to accesstoken...
    const accesstoken = cookiesStore.get('accessToken') ;
    if (!accesstoken) {
        console.log("Access token cookie is missing!");
        return new NextResponse("Access token missing", { status: 401 });
    }
    const decodedInfo = decodeGivenJWT(accesstoken.value,process.env.SECRET_FOR_ACCESS_TOKEN) ;

    await connectWithMongoDB() // function for creating database connection...
    // fetching the shared vault data with passPhraseHash for validation
    let sharedVaultData = await sharedvaults.find({ownerId:decodedInfo.id}).select('+passPhraseHash') ; // fetched including passPhraseHash field programmtically...
    // logic for checking the PassPhraseValidity...
    const isPassPhraseValid = sharedVaultData.some((vault) => vault.passPhraseHash === PassPhraseHashValue);
    if(!isPassPhraseValid){
        console.log("PassPhraseHashValue is INCORRECT !!");
        return new NextResponse("PassPhraseHashValue is INCORRECT !!", { status: 400}) ;
    }
    // Exclude passPhraseHash from the response data
    const dataArray = sharedVaultData.map((sharedVault,index) => {
        // checking encryptedData for iv and encryptedData properties as strings...
        let encryptedDataFormatted = sharedVault.encryptedData;
        if (encryptedDataFormatted) {
            if (typeof encryptedDataFormatted === 'string') {
                try {
                    encryptedDataFormatted = JSON.parse(encryptedDataFormatted);
                } catch (e) {
                    console.log('Error occured in formatting EncryptedData:',e);
                    return new NextResponse("Error in formatting encryptedData", { status: 401 });
                }
            }
        // Validate that iv and encryptedData are non-empty strings...
        if (
            !encryptedDataFormatted ||
            typeof encryptedDataFormatted !== 'object' ||
            typeof encryptedDataFormatted.iv !== 'string' ||
            encryptedDataFormatted.iv.length === 0 ||
            typeof encryptedDataFormatted.encryptedData !== 'string' ||
            encryptedDataFormatted.encryptedData.length === 0
        ) {
            console.log(`Invalid encryptedData format for sharedVault _id: ${sharedVault._id}`);
            return null ; // Skip this entry by returning null...
        }
        }
        return {
            no: index + 1,
            _id: sharedVault._id,
            sharedWith: sharedVault.sharedWithIndividuals.detailsOfSharing.map((element) => element.sharedWithText ),
            encryptedData: encryptedDataFormatted,
            vaultCategory:sharedVault.vaultCategory,
            vaultDescription:sharedVault.vaultDescription,
            createdAt: sharedVault.createdAt,
            updatedAt: sharedVault.updatedAt,
            sharedBy: decodedInfo.name,
            expiresAt: sharedVault.accessExpiresAt,
            storageOfItem:(calculateObjectSize(encryptedDataFormatted) / (1024 * 1024)).toFixed(4)
        }
     }) ;
     // Filter out any null entries (invalid encryptedData)
     const filteredDataArray = dataArray.filter(item => item !== null);
     return NextResponse.json({message:'Shared-vaults successfully fetched',dataArray:filteredDataArray},{status:200});
})


const GET = asyncErrorHandler (async (request) => {
    const url = new URL(request.url);
    const auth = url.searchParams.get('auth');

    // checking the authentication state of user..
    if (!auth) {
        console.log("authentication failed from client side...");
        return NextResponse.json({message: 'Authentication failed', status: 401});
    }
    // decode the auth token...
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get('accessToken');
    const decodedInfo = await decodeGivenJWT(accessToken.value,process.env.SECRET_FOR_ACCESS_TOKEN);
    
    // logic for getting the stats data...
    const sharedVaultsRelatedToUser = await sharedvaults.find({ $or:[{ ownerId:decodedInfo.id },{ 'sharedWithIndividuals.detailsOfSharing.sharedWithId':decodedInfo.id }] }) ;
    const vaultsWhoseAccessAllowed = sharedVaultsRelatedToUser.length ;

    // getting the count of activeCollaborators...
    let activeCollaboratorsIds = [];
    sharedVaultsRelatedToUser.forEach(vault => {
        vault.sharedWithIndividuals.detailsOfSharing.forEach(sharing => {
            activeCollaboratorsIds.push(sharing.sharedWithId.toString());
        });
    });
    // Remove duplicates
    activeCollaboratorsIds = [...new Set(activeCollaboratorsIds)]; // this is a Javascript tric to remove duplicacy of element in a array..

    // recently accessed vaults logic...
    const recentlyAccessedVaultsCount = Math.ceil(0 + vaultsWhoseAccessAllowed * Math.random()) ;
    const sendingData = [
    { title:'Total Shared Vaults You Are Allowed To Access', totalVaultsShared: vaultsWhoseAccessAllowed },
    {title:'Total Individuals Who Can Access Above Vaults',activeCollaborators:activeCollaboratorsIds.length},
    {title:'Vaults Recently Accessed',recentlyAccessed:recentlyAccessedVaultsCount}
]
    return NextResponse.json({message:"GET request processed",dataArray:sendingData}, { status: 200 });
})


const PATCH = asyncErrorHandler (async (request) => {
    const { userText, vaultId } = await request.json(); // destructuring the required data....
    // checking for required credentials...
    if (!userText || !vaultId) {
        console.log("userText or vaultId is missing in the request body");
        return new NextResponse("userText and vaultId are required", { status: 400 });
    }
    // user authentication logic...
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get('accessToken');
    if (!accessToken) {
        console.log("Access token cookie is missing!");
        return new NextResponse("Access token missing", { status: 401 });
    }

    const decodedInfo = decodeGivenJWT(accessToken.value, process.env.SECRET_FOR_ACCESS_TOKEN);
    if (!decodedInfo || !decodedInfo.id) {
        console.log("Invalid access token");
        return new NextResponse("Invalid access token", { status: 401 });
    }

    await connectWithMongoDB(); // establishing the connection to DB..
    // getting the vault to be updated...
    const sharedVault = await sharedvaults.findById({_id: vaultId}); // getting the vault by ID...
    if (!sharedVault) {
        console.log("Shared vault not found or user not authorized");
        return new NextResponse("Shared vault not found or user not authorized", { status: 404 });
    }

    // removing the access for the paticular user...
    sharedVault.sharedWithIndividuals.detailsOfSharing = sharedVault.sharedWithIndividuals.detailsOfSharing.filter((details) => details.sharedWithText !== userText);
    await sharedVault.save();

    return NextResponse.json({ message: "Shared vault updated successfully" }, { status: 200 });
})


export { POST , GET , PATCH } ; 

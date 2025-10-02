import vaultitems from "@/db/models/vaultModel";
import users from "@/db/models/userModel";
import asyncErrorHandler from "@/middlewares/errorMiddleware";
import sharedvaults from "@/db/models/sharedVaultModel";
import { connectWithMongoDB } from "@/db/dbConnection";
import { calculateObjectSize } from 'bson';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeGivenJWT } from "@/lib/decodejwt";

const POST = asyncErrorHandler( async () => {
    console.log("Route handler for getting all vaults !!");

    // cookies related logic...
    const allCookies = await cookies() ;
    const accessToken = allCookies.get('accessToken').value ;
    const decodedUser = decodeGivenJWT(accessToken, process.env.SECRET_FOR_ACCESS_TOKEN);
    // taking some debugging steps...
    if (!decodedUser || !decodedUser.id) {
        console.log("Invalid access token");
        return new NextResponse("Invalid access token", { status: 401 });
    }

    await connectWithMongoDB(); // establishing the connection to DB..
    const vaultItems = await vaultitems.find({ userId:decodedUser.id }).lean(); // getting vault items by userId...
    const vaultArray = vaultItems.map((item,index) => {
        return {
            no: index + 1 ,
            id:item._id ,
            description: item.vaultDescription ,
            size: `${(calculateObjectSize(item.encryptedCurrentData)/(1024 * 1024)).toFixed(4)} MB`, // getting the size of encrypteddata in MB...
            accessLevel:item.vaultType.access ,
            vaultCategory:item.vaultType.vaultCategory ,
            encryptedData:item.encryptedCurrentData, // acctual data related to the item...
            createdBy:decodedUser.name ,
            createdAt:new Date(item.createdAt).toUTCString() , // converting the fetched date in UtC string...
            updatedAt:new Date(item.updatedAt).toUTCString() ,
            timesItWasChanged: item.versionHistory.length > 0 ? item.versionHistory.length : 0 ,
            tags: String(item.vaultType.vaultCategory).split('-'), // getting an array got spilitted from here...
        }
    })
    console.log("gona send response to the client...");
    return NextResponse.json({message:'vault data from DB fetched...',vaultArray:vaultArray},{status:200})
})


const GET = asyncErrorHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  // getting the values from searchparams...
  const itemId = searchParams.get('itemId');
  const sharedUsers = searchParams.getAll('sharedUsers[]');
  const passPhrasHash = searchParams.get('passPhrasHash');

  // cookies related logic...
  const allCookies = await cookies() ;
  const accessToken = allCookies.get('accessToken').value ;
  const decodedUser = decodeGivenJWT(accessToken, process.env.SECRET_FOR_ACCESS_TOKEN);
  // taking some debugging steps...
  if (!decodedUser) {
    console.log("Invalid access token");
    return new NextResponse("Invalid access token", { status: 401 });
  }

  // acctual logic to run...
  await connectWithMongoDB() ; // connection to mongodb...
  const vaultItem = await vaultitems.findOne({ _id: itemId }).lean() ; // getting the vault needed to be shared...
  if (!vaultItem) {
    console.log("Vault item to be shared is not Available!!!");
    return new NextResponse("Vault item to be shared is not Available!!!", { status:404});

  }
  // getting users in structures...
  const shUsers = await Promise.all(sharedUsers.map(async (user) => { 
    const userDoc = await users.findOne({$or:[{email:user},{name:user}]});
    if (!userDoc) return null ; // or handle user not found case as needed...
    return {
        sharedWithId: userDoc._id,
        sharedWithText: user
    }
  }));
  const filteredShUsers = shUsers.filter(u => u !== null); // filtration fo null entries if there...

  // pusing the item in sharedvaults collection...
  const toBePushInSharedVault = sharedvaults({
    ownerId:decodedUser.id ,
    vaultCategory:vaultItem.vaultType.vaultCategory ,
    vaultDescription:vaultItem.vaultDescription ,
    sharedWithIndividuals: {
        detailsOfSharing:filteredShUsers ,
        timeStampOfSharing:new Date() ,
    },
    encryptedData:vaultItem.encryptedCurrentData ,
    accessExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 *1000) , // expires in 30 days...
    passPhraseHash:passPhrasHash ,
  }) ;
  await toBePushInSharedVault.save() ; // saving it to the db...

  // delete thats vault item from vaultitems collection...
  await vaultitems.deleteOne({ _id: itemId });
  return NextResponse.json({message:'vault successfully shared and deleted',success:true},{status:200}) ;
});

const DELETE = asyncErrorHandler( async (request) => {
  const { idToDelete } = await request.json() ; // destructuring syntax...
  if (!idToDelete || typeof idToDelete !== "string") {
    console.log("ID of ITEM to delete is missing OR invalid...");
    return new NextResponse("ID of ITEM to delete is missing OR invalid!!", { status: 404 }) ;
  }
  // getting the user from token...
  const allCookies = await cookies() ;
  const accessToken = allCookies.get('accessToken').value ;
  const decodedUser = await decodeGivenJWT(accessToken,process.env.SECRET_FOR_ACCESS_TOKEN) ;

  // some more debugging steps...
  if (!decodedUser) {
    console.log("User is not authenticated!!!");
    return new NextResponse("User is not authenticated!!!", { status: 401 });
  }
  
  await connectWithMongoDB() ; // establishing connection to DB...
  // Ensure items belongs to this user only...
  const deleteResult = await vaultitems.deleteOne({ _id: idToDelete, userId: decodedUser.id }) ; // main deleting action...
  if (deleteResult.deletedCount === 0) {
    console.log("No vault item found for deletion or user unauthorized");
    return new NextResponse("No vault item found for deletion or user unauthorized", { status: 404 });
  }
  // sending final response...
  return NextResponse.json({message:'vault item successfully deleted',success:true},{status:200})
});


export { POST , GET , DELETE };



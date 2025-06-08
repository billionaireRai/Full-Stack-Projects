import useConnectedWithDataBase from "@/state/dbConnected.js"; 
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ; // getting mongoDB uri from environment varibales...
const MONGODB_DB = process.env.MONGODB_DB ;
if (!MONGODB_URI || !MONGODB_DB) throw new Error('Any MONGODB credentials are missing...'); // debugging step..

const { connectToDatabase, isConnected } = useConnectedWithDataBase.getState(); // getting connection state...

export const connectWithMongoDB = async () => { 
    if( !isConnected ) {
    try {
        await mongoose.connect(`${MONGODB_URI}${MONGODB_DB}`, { useNewUrlParser: true, useUnifiedTopology: true,bufferCommands:true ,autoCreate:false , autoIndex:false }) ;
        connectToDatabase (); // getting the state updated...
        // making db collection dynamically in out database Vault-App...
        const db = mongoose.connection.db ; // getting the required db
        const collections = await db.collections() ; // fetching all the collections.
        const toCreate = [process.env.MONGODB_COLLECTION_USERS,process.env.MONGODB_COLLECTION_VAULTITEMS,process.env.MONGODB_COLLECTION_LOGAUDITS ,process.env.MONGODB_COLLECTION_SHAREDVAULTS ,process.env.MONGODB_COLLECTION_BREACHWATCHS]
        // Filter out invalid or undefined collection names
        const validCollections = toCreate.filter(name => {
            if (!name) {
                console.warn('Warning: One of the MongoDB collection environment variables is not set or invalid.');
                console.log("Missing : ",name);
                return false;
            }
            return true;
        });
        for (const collectionName of validCollections) {
            if (!collections.some(c => c.collectionName === collectionName))  await db.createCollection(collectionName);
        }
        console.log('Connected to MongoDB...'); // logging to check code execution...
    } catch (error) {
        console.error('Error connecting to MongoDB:', error); // logging error to check code execution...
        throw new Error('Connection to DB failed...');
    } 
}
}

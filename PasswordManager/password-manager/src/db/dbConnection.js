
import useConnectedWithDataBase from "../state/dbConnected.js"; 
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ; // getting mongoDB uri from environment varibales...
const MONGODB_DB = process.env.MONGODB_DB ;
if (!MONGODB_URI) throw new Error('MongoDB Uri not found in environment variables...'); // debugging step..


export const connectWithMongoDB = async () => { 
    const { connectToDatabase , isConnected } = useConnectedWithDataBase() ; // getting connection state...
    if( !isConnected ) {
    try {
        await mongoose.connect(`${MONGODB_URI}${MONGODB_DB}`, { useNewUrlParser: true, useUnifiedTopology: true,bufferCommands:true ,autoCreate:false , autoIndex:false }) ;
        connectToDatabase (); // getting the state updated...
        // making db collection dynamically in out database Vault-App...
        const db = mongoose.connection.db ; // getting the required db
        const collections = db.collections() ; // fetching all the collections.
        const toCreate = [process.env.MONGODB_COLLECTION_USERS,process.env.MONGODB_COLLECTION_VAULTITEMS,process.env.MONGODB_COLLECTION_LOGAUDITS ,process.env.MONGODB_COLLECTION_SHAREDVAULTS ,process.env.MONGODB_COLLECTION_BREACHWATCH]

        (await collections).forEach(element => {
            if(toCreate.includes(element.collectionName)) return ;
            db.createCollection(element.collectionName, { autoIndexId: true });
        });
        console.log('Connected to MongoDB...'); // logging to check code execution...
    } catch (error) {
        console.error('Error connecting to MongoDB:', error); // logging error to check code execution...
        throw new Error('Connection to DB failed...');
    } 
}
}

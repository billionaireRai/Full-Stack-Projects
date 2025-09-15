import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_CLOUD_URL;
const MONGODB_DB = process.env.MONGODB_DB_NAME;
if (!MONGODB_URI || !MONGODB_DB) throw new Error("Any MONGODB credentials are missing...");

mongoose.set("debug", true); // this logs all DB activity!

export const connectWithMongoDB = async () => {
  try {
    const fullUri = `${MONGODB_URI.replace(/\/+$/, "")}/${MONGODB_DB.replace(/^\/+/, "")}`;
    await mongoose.connect(fullUri, {bufferCommands: true,autoCreate: false,autoIndex: false});

    const db = mongoose.connection.db;
    const collections = await db.collections() ;
    const toCreate = [process.env.MONGODB_COLLECTION_USERS,process.env.MONGODB_COLLECTION_VAULTITEMS,process.env.MONGODB_COLLECTION_LOGAUDITS,process.env.MONGODB_COLLECTION_SHAREDVAULTS,process.env.MONGODB_COLLECTION_BREACHWATCHS,];
    const validCollections = toCreate.filter((name) => {
      if (!name) {
        console.warn("Warning: One of the MongoDB collection env variables is missing.");
        return false;
      }
      return true;
    });

    for (const collectionName of validCollections) {
      if (!collections.some((c) => c.collectionName === collectionName)) {
        await db.createCollection(collectionName);
        console.log(`Created collection: ${collectionName}`);
      }
    }
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw new Error("Connection to DB failed...");
  }
};

import mongoose from "mongoose";

const NODE_ENV = process.env.NODE_ENV || 'development';

mongoose.set("debug", NODE_ENV === 'development'); // logging all queries running on cloud...

function passNodeEnvironment(env:string) {
  if (env === 'development') {
    return env.substring(0,3);
  }
  return env.substring(0,4); 
}

export const connectWithMongoDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_CLOUD_URL;
    const MONGODB_DB = process.env.MONGODB_DB_NAME;
    if (!MONGODB_URI || !MONGODB_DB) throw new Error("Any MONGODB credentials are missing...");

    const fullUri = `${MONGODB_URI.replace(/\/+$/, "")}/${MONGODB_DB.replace(/^\/+/, "")}_${passNodeEnvironment(NODE_ENV)}`;
    await mongoose.connect(fullUri, {bufferCommands: true,autoCreate: false,autoIndex: false,maxPoolSize:10,serverSelectionTimeoutMS:5000,socketTimeoutMS:45000});

    const db = mongoose.connection.db;
    if (!db) throw new Error("Failed to get database instance");

    const collections = await db.collections() ;
    const toCreate = [process.env.DB_COL_USERS,process.env.DB_COL_POSTS,process.env.DB_COL_COMMENTS,process.env.DB_COL_FOLLOWS,process.env.DB_COL_LIKES,process.env.DB_COL_VIEWS,process.env.DB_COL_SHARES,process.env.DB_COL_NOTIFICATIONS,process.env.DB_COL_MESSAGES,process.env.DB_COL_SUBSCRIPTION,process.env.DB_COL_REPORTS,process.env.DB_COL_FEEDBACK,process.env.DB_COL_BLOCKED] ;
    const validCollections = toCreate.filter((name) => {
      if (!name) {
        console.warn("Warning: One of the MongoDB collection env variables is missing.");
        return false;
      }
      return true;
    });

    for (const collectionName of validCollections) {
      if (!collections.some((c) => c.collectionName === collectionName)) {
        await db.createCollection(String(collectionName)); // string validation of collectionName... 
        console.log(`Created collection: ${collectionName}`);
      }
    }
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Connection to DB failed...");
  }
};

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

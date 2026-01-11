import { connectWithMongoDB } from "@/app/db/dbConnection";
import oauthlogs from "@/app/db/models/oauthlogs";

interface oauthType {
    state: string;
    codeVerifier: string;
    intent: 'signup' | 'login' | ' ';
    ipAddress:string,
    userAgent: object;
    used?: boolean;
    createdAt?: Date;
    expiresAt?: Date;
}

export async function saveOAuthState(state: oauthType): Promise<void> {
    await connectWithMongoDB();
    await oauthlogs.create(state);
}

export async function findOAuthState(state: string): Promise<oauthType | undefined> {
    await connectWithMongoDB();
    const doc = await oauthlogs.findOne({ state });
    if (doc) {
        return doc.toObject();
    }
    return undefined;
}

export async function validateAndConsumeState(state: string): Promise<boolean> {
    await connectWithMongoDB();
    const doc = await oauthlogs.findOne({ state });
    if (!doc) return false;
    if (doc.used || doc.expiresAt < new Date()) {
        await oauthlogs.deleteOne({ state });
        return false;
    }
    await oauthlogs.updateOne({ state }, { used: true });
    return true;
}

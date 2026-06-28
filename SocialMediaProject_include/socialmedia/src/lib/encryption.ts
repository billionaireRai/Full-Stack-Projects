
export interface EncryptedMessage {
    cipherText: string;
    iv: string;
    senderEncryptedKey: string;
    receiverEncryptedKey: string;
    algorithm: "AES-256-GCM";
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);

    let binary = "";

    for (const b of bytes) {
        binary += String.fromCharCode(b);
    }

    return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);

    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
}

export type RsaKeyKind = "private" | "public";

function base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

export async function importRespectiveKey(keyBase64:string,keyKind: RsaKeyKind) : Promise<CryptoKey> {
    const keyBytes = base64ToArrayBuffer(keyBase64);

    // private key
    if (keyKind === "private") {
        return crypto.subtle.importKey(
            "pkcs8",
            keyBytes,
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["decrypt"]
        );
    }

    // public key
    return crypto.subtle.importKey(
        "spki",
        keyBytes,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    );
}


async function generateAESKey() : Promise<CryptoKey> {
    return await crypto.subtle.generateKey({ name:"AES-GCM", length:256 } , true , ["encrypt","decrypt"]);
    
}

function generateIV() {
   return crypto.getRandomValues(new Uint8Array(12));
}

async function encryptMessageByAES(aeskey:CryptoKey,msg:string,iv:Uint8Array<ArrayBuffer>) : Promise<string> {
    const encoded = new TextEncoder().encode(msg); // new encoder instance...
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aeskey, encoded);

    return arrayBufferToBase64(cipher);
}

async function decryptMessageByAES(aeskey:CryptoKey,ciper:string,iv:Uint8Array<ArrayBuffer>) : Promise<string> {
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        aeskey,
        base64ToArrayBuffer(ciper)
    );

    return new TextDecoder().decode(decrypted);
}


async function encryptAESKeyByPublicKey(AESkey:CryptoKey,reciverpubkey:CryptoKey) {
    const rawKey = await crypto.subtle.exportKey("raw",AESkey);

    const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" },reciverpubkey,rawKey);

    return arrayBufferToBase64(encrypted);
}

async function decryptAESKeyByPrivateKey(encryptedAESkey:string,recieverprivatekey:CryptoKey) {
    const raw = await crypto.subtle.decrypt({ name: "RSA-OAEP" },recieverprivatekey,base64ToArrayBuffer(encryptedAESkey));

    return await crypto.subtle.importKey("raw",raw,{ name: "AES-GCM" },true,["encrypt", "decrypt"]);

}

export async function messageEncryptionTopLevel(msg:string,senderpubkey:CryptoKey,recieverpubkey:CryptoKey) : Promise<EncryptedMessage> {
    const aesKey = await generateAESKey();
    const iv = generateIV();

    const cipherText = await encryptMessageByAES(aesKey,msg,iv);

    const senderEncryptedKey = await encryptAESKeyByPublicKey(aesKey,senderpubkey);

    const receiverEncryptedKey = await encryptAESKeyByPublicKey(aesKey,recieverpubkey);

    return {
        cipherText,
        iv: arrayBufferToBase64(iv.buffer),
        senderEncryptedKey,
        receiverEncryptedKey,
        algorithm: "AES-256-GCM"
    };
    
}

export async function messageDecryptionTopLevel(encryptedMessage: EncryptedMessage,privateKey: CryptoKey,isSender: boolean) : Promise<string> {

    const encryptedAESKey = isSender ? encryptedMessage.senderEncryptedKey : encryptedMessage.receiverEncryptedKey ;

    const aesKey = await decryptAESKeyByPrivateKey(encryptedAESKey,privateKey);

    const iv = new Uint8Array(base64ToArrayBuffer(encryptedMessage.iv));

    return await decryptMessageByAES(aesKey,encryptedMessage.cipherText,iv);

}
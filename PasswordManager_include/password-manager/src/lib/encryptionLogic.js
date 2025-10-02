// FILE HANDLING THE ENCRPTION LOGIC...
import CRYPTOS from 'crypto';

// function to generate userEncryption key (in backend)...
export const generateUserEncryptionKey = (salt, globalPassword) => {
  const key = CRYPTOS.pbkdf2Sync(globalPassword, salt, 10000, 32, 'sha512'); // Changed length from 64 to 32 bytes
  if (!key) throw new Error("Something went wrong in KEY generation...");

  const hexKey = key.toString('hex');
  return hexKey;
};

// function to encrypt the vault data (on client-side)...
export const encryptionOfVaultData = async (vaultData, userencrpnKey) => {
  if (!userencrpnKey || userencrpnKey.length !== 64) throw new Error("Encryption key must be a 64-character hex string (32 bytes).");
  const encoder = new TextEncoder();

  // Convert the key and data...
  const keyBuffer = new Uint8Array(userencrpnKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const encodedData = encoder.encode(
    typeof vaultData === 'string' ? vaultData : JSON.stringify(vaultData)
  );

  // Import the key
  const cryptoKey = await window.crypto.subtle.importKey("raw", keyBuffer,{ name: "AES-CBC" },false,["encrypt"] );
  // Perform encryption
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: iv,
    },
    cryptoKey,
    encodedData
  );

  // Convert buffers to hex
  const encryptedHex = Array.from(new Uint8Array(encryptedBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const ivHex = Array.from(iv)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // This data is needed to be stored in database... 
  return {
    iv: ivHex,
    encryptedData: encryptedHex,
  };
};

// function to decode the vault data (on client-side)...
export const decryptionOfVaultData = async (vaultData, userencrpnKey) => {
  if (!userencrpnKey || userencrpnKey.length !== 64) throw new Error("Encryption key must be a 64-character hex string (32 bytes).");
  const decoder = new TextDecoder();

  const keyBuffer = new Uint8Array(userencrpnKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))); // Convert hex key to Uint8Array 
  const iv = new Uint8Array(vaultData.iv.match(/.{1,2}/g).map(byte => parseInt(byte, 16))); // Convert IV from hex to Uint8Array

  const encryptedData = new Uint8Array(vaultData.encryptedData.match(/.{1,2}/g).map(byte => parseInt(byte, 16))); // Convert encrypted data from hex to Uint8Array

  // Import the encryption key
  const cryptoKey = await window.crypto.subtle.importKey("raw",keyBuffer,{ name: "AES-CBC" },false,["decrypt"]);
  // Perform decryption
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: iv
    },
    cryptoKey,
    encryptedData
  );

  // Decode result...
  const decryptedData = decoder.decode(decryptedBuffer);
  try {
    const finalData = JSON.parse(decryptedData); // if it was originally an object
    return finalData;
  } catch {
    console.log("Error in parsing and returning finalData...");
    throw new Error("Error in final step , please check it again...")
  }
};

// function to generate passPhase for a user...
export const funtionToMakePassPhraseHass = async (encryptionkey,salt) => { 
  const keyBuffer = new Uint8Array(encryptionkey.match(/.{1,2}/g).map(byte => parseInt(byte, 16))) ;
  const hashBuffer = await crypto.subtle.digest('SHA-256', new Uint8Array([...keyBuffer, salt]));
  // Convert hash buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return { passPhraseHash : hashHex } ;
}

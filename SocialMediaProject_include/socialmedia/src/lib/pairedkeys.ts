
import axios from "axios";
import axiosInstance from "./interceptor";
import usePublicKey from "@/app/states/accountpublickey";
import toast from "react-hot-toast";

export interface keyObjType {
  accId:string ;
  value:string ;
  createdAt:string ;
}

// defining some global variables...
const DB_VERSION = 1;
const DB_NAME = "BriezlIDB";
const STORE_NAME = "privatekeys";

// function for checking retuned key obj type...
export function isKeyObjType(obj:any): obj is keyObjType {
  return (
    typeof obj === "object" && obj !== null && "accId" in obj && "value" in obj
  );
}

export async function getDevicePublicIP() : Promise<string> {
  return await new Promise((resolve,reject) => {
    axiosInstance.get('https://api.ipify.org?format=json')
    .then((res) => {
      console.log("IP fetched successfully : ",res.data.ip);
      resolve(res.data.ip);
    })
    .catch((error) => {
      console.log("An error occured !!");
      reject(error); 
    })
    
  })
}

// function for sending public key to backend..
async function sendingPubkeyToBackend( publicKey:string , accid:string ) {
  try {
    const deviceip = await getDevicePublicIP() ; // getting device IP address...
    const storeapi = await axiosInstance.post('/api/account/public-key',{ publicKey , accid , deviceip });
    if (storeapi.status !== 200) {
      console.log("Backend status code unfavourable : ",storeapi.status);
      toast.error("Server response of public key , unfavourable !!");
    }
  } catch (error) {
    console.log(error);
  }
}

// function handling indexedDB part...
const handleIndexedDBStorage = async (privatekey: string,accountid:string) : Promise<keyObjType> => {
  const request = indexedDB.open(DB_NAME, DB_VERSION); // creating OR opening indexedDB...

  return await new Promise((resolve, reject) => {
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME))  db.createObjectStore(STORE_NAME, { keyPath: "accId" });
    };

    request.onsuccess = () => {
      const db = request.result; // getting the indexedDB instance...
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      const currentDate = new Date() ;
      // storing only private key here...
      const keyobj:keyObjType = { accId:accountid , value: privatekey , createdAt:currentDate.toUTCString() } ;

      if (!store.get(accountid))  store.put(keyobj) ; // handling edge cases...

      tx.oncomplete = () => resolve(keyobj);
      tx.onerror = () => reject(tx.error);

    };

    request.onerror = (e) => {
      console.error("IndexedDB open error:", e);
      reject(e);
    };
  });
};

// DER -> PEM convdersion...
function derToPem(der: ArrayBuffer, label: string): string {
  const bytes = new Uint8Array(der);

  const b64 = typeof Buffer !== "undefined" ? Buffer.from(bytes).toString("base64") : (() => {
          let binary = "";
          for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
          return btoa(binary);
        })();

  const lines = b64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

// used after user registration...
export const generateKeyPairAndStoreBoth = async (accountid:string) => {
  const subtle = globalThis.crypto?.subtle ;
  if (!subtle) throw new Error("Web Crypto API (crypto.subtle) not available");

  const algo: RsaHashedKeyGenParams = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
    hash: "SHA-256",
  };;

  const { privateKey , publicKey } = await subtle.generateKey(algo, true, ["encrypt", "decrypt"]);
  const { setpublickey } = usePublicKey() ; 

  // Export as SPKI (public) and PKCS8 (private) DER.
  const spkiDer = await subtle.exportKey("spki",publicKey);
  const pkcs8Der = await subtle.exportKey("pkcs8",privateKey);

  // Converting DER -> PEM for easier storage/transport.
  const publicPem = derToPem(spkiDer, "PUBLIC_KEY");
  const privatePem = derToPem(pkcs8Der, "PRIVATE_KEY");

  // await sendingPubkeyToBackend(publicPem,accountid);
  // const storeobj:keyObjType = await handleIndexedDBStorage(privatePem,accountid);
  // localStorage.setItem('privatekey',storeobj.value);
  // setpublickey(publicPem);
  
};

// function to check private key storage in IDB...
export const checkForPrivateKeyIDB = async (accountid: string) : Promise<string | null> => {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION); // opening request to IDB...

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME))  db.createObjectStore(STORE_NAME, { keyPath: "accId" });
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);

      const getReq = store.get(accountid);

      getReq.onsuccess = () => {
        const result = getReq.result;
        resolve(result ? result : null);
      };

      getReq.onerror = () => {
        reject(getReq.error);
      };
    };

    request.onerror = (e) => {
      console.error("IndexedDB open error : ", e);
      reject(e);
    };
  });
};




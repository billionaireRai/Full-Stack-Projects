import axios from 'axios';
import { toast } from 'react-toastify';
import cryptoJS from 'crypto-js';

// same encryptio key getting used for decrypting...
const REACT_APP_CHATROOMID_ENCRYPTION_KEY='123456789abcdef89abcdef0123456789abcdef001234567bcdef0123456789a' ;

// Utility function to wait for specified seconds
const waitFor = (seconds) => {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

// function for sending formdata to backend...
export const handleJoiningForm = async (enteredData, navigate, chatroomID) => {
    const generatingToast = toast.loading('Joining your chatroom...');
    try {
        // Generate IV and encrypt data with IV
        const iv = cryptoJS.lib.WordArray.random(16);
        const encrypted = cryptoJS.AES.encrypt(JSON.stringify(enteredData),cryptoJS.enc.Hex.parse(REACT_APP_CHATROOMID_ENCRYPTION_KEY),
            { iv, mode: cryptoJS.mode.CBC, padding: cryptoJS.pad.Pkcs7 }
        );
        const encryptedData = iv.toString() + ':' + encrypted.toString();
        const formData = new FormData();
        formData.append('encryptedData', encryptedData);
        const response = await axios.post('/api/chatroom/join', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.status === 200) {
            toast.dismiss(generatingToast);
            localStorage.setItem("userData", JSON.stringify(enteredData)); // setting userdata to local storage...
            toast.success('Successfully joined the chatroom!', { onClose: () => navigate(`/chatroom/${chatroomID}`),  autoClose: 2000 
            });
        } else {
            toast.dismiss(generatingToast);
            toast.error('Failed to join chatroom...');
        }
    } catch (error) {
        toast.dismiss(generatingToast);
        console.error('Join error:', error.response?.data || error.message);
        toast.error(`Failed to join: ${error.response?.data?.message || error.message}`);
    }
};


// function to decrypt chatroomID once reached on client...
export const decryptEncryptedChatroomID = (EncryptedchatroomID) => { 
    try {
        // Validate input
        if (!EncryptedchatroomID || typeof EncryptedchatroomID !== 'string')  throw new Error('Invalid encrypted chatroom ID');
        // Split into IV and encrypted data
        const [ivHex, encryptedHex] = EncryptedchatroomID.split(':');
        if (!ivHex || !encryptedHex)  throw new Error('Invalid encrypted format - missing IV or encrypted data');
        
        // Parse key from hex
        const key = cryptoJS.enc.Hex.parse(REACT_APP_CHATROOMID_ENCRYPTION_KEY);
        if (key.words.length !== 8)  throw new Error('Invalid key length - must be 32 bytes (256 bits)');
        const iv = cryptoJS.enc.Hex.parse(ivHex); // Parse IV from hex
        // Decrypt using AES-256-CBC
        const decrypted = cryptoJS.AES.decrypt({ ciphertext: cryptoJS.enc.Hex.parse(encryptedHex) },key,
            {
                iv: iv,
                mode: cryptoJS.mode.CBC,
                padding: cryptoJS.pad.Pkcs7
            }
        );
        // Convert to UTF-8 string
        const decryptedText = decrypted.toString(cryptoJS.enc.Utf8);
        if (!decryptedText) throw new Error('Decryption failed - empty result');
        return decryptedText;
    } catch (error) {
        console.error("Decryption failed:", error);
        console.debug("Encrypted input:", EncryptedchatroomID);
        return null;
    }
};


// function which requests for generating a chatroomID...
export const handleCreateChatroomID = async (setchatroomID) => { 
    const loadingToast = toast.loading("Generating ChatroomID..."); // Store the toast ID
    try {
        const response = await axios.post('/api/chatroom/generateID');
        await waitFor(4); // Wait for 4 seconds
        const decryptedChatroomID = decryptEncryptedChatroomID(response.data.Data.chatroomID);
        setchatroomID(decryptedChatroomID);
        toast.dismiss(loadingToast); // Dismiss only the loading toast by targeting its ID...
        toast.success("ChatroomID generated successfully!", { autoClose: 2000 });
    } catch (error) { 
        console.error("Error details:", error.response?.data || error.message);
        toast.dismiss(loadingToast); // Ensure loading toast is dismissed in case of error
        toast.error("Error in generating ChatroomID. Please check console for details.");
    }
};

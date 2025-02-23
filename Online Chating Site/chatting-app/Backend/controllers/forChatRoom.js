require('dotenv').config() ;
const crypto = require('crypto');
const { asyncErrorHandler, apiGeneralError , apiGeneralResponse } = require('../utils/ReusableFunc.js') ;

// function to encrypt original chatroomID...
const encrypt = async (ID) => {
    try {
        if (!process.env.REACT_APP_CHATROOMID_ENCRYPTION_KEY) {
            throw new Error('Encryption key is not configured');
        }
        const iv = crypto.randomBytes(16); // Fixed IV length for AES
        const key = Buffer.from(process.env.REACT_APP_CHATROOMID_ENCRYPTION_KEY, 'hex');
        // Validate key length for AES-256-CBC (32 bytes)
        if (key.length !== 32) {
            throw new Error(`Invalid key length: ${key.length} bytes. Expected 32 bytes for AES-256-CBC`);
        }

        const cipher = crypto.createCipheriv(process.env.CHATROOMID_ENCRYPTION_ALGORITHM, key, iv);
        let encrypted = cipher.update(ID);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
}


// route handler function for generating chatroomID...
const generateEncryptedChatroomID = asyncErrorHandler( async (req,res) => {
  const chatroomID = crypto.randomBytes(20).toString('hex'); // Generate a unique chatroom ID...
  const encryptedchatroomID = await encrypt(chatroomID); // Encrypt the chatroom ID by above function...
  if (!encryptedchatroomID) throw apiGeneralError(res,"Internal Server Error","ISE",500) ; // error in above function.
  // sending positive api response...
  return apiGeneralResponse(res,{chatroomID:encryptedchatroomID,timeStamp:new Date().toISOString()},
    "Encrypted ChatroomID generated with timestamp...",200) ;
})

// function to handle user joining logic in chatroom...
const handleChatroomUserJoin = asyncErrorHandler(async (req, res) => {
    // Extract encryptedData from formData and avatar file
    const encryptedData = req.body.encryptedData;
    const avatarFile = req.files?.avatar?.[0];

    if (!encryptedData) return apiGeneralError(res, "Encrypted data not received.", 400);
    // Split IV and encrypted data
    const parts = encryptedData.split(':'); 
    if (parts.length !== 2) return apiGeneralError(res, "Invalid encrypted data format", 400);

    const [ivHex, encryptedBase64] = parts; 
    const iv = Buffer.from(ivHex, 'hex');  // Convert IV to Buffer (hex format)
    const encrypted = Buffer.from(encryptedBase64, 'base64'); // encoding is base-64

    // Ensure IV is exactly 16 bytes (128 bits)
    if (iv.length !== 16) return apiGeneralError(res, "Invalid IV length", 400);

    // Ensure key is exactly 32 bytes (AES-256-CBC requirement)
    const key = Buffer.from(process.env.REACT_APP_CHATROOMID_ENCRYPTION_KEY, 'hex');
    if (key.length !== 32) return apiGeneralError(res, "Invalid key length", 400);

    try {
        // Create decipher object
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedData = decipher.update(encrypted, 'base64', 'utf8'); // ✅ Changed input encoding to 'base64'
        decryptedData += decipher.final('utf8');

        const userData = JSON.parse(decryptedData); // Parsing JSON format...
        // acctual chatroom joining logic...

        return apiGeneralResponse(
            res,
            {
                message: "User successfully joined chatroom",
                userData: userData,
                avatar: avatarFile
                    ? {
                          originalname: avatarFile.originalname,
                          mimetype: avatarFile.mimetype,
                          size: avatarFile.size,
                      }
                    : null,
            },
            200
        );
    } catch (err) {
        console.error("Decryption error:", err);
        return apiGeneralError(res, "Failed to decrypt data. Invalid or corrupted data.", 400);
    }
});

module.exports = { generateEncryptedChatroomID , handleChatroomUserJoin } ;

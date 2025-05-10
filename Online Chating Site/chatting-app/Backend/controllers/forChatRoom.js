require('dotenv').config() ;
const crypto = require('crypto');
const jsonWebToken = require('jsonwebtoken') ;
const { Server } = require('socket.io') ;
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

        // logic related to jsonWebToken ...
        // const token = jsonWebToken.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });

        return apiGeneralResponse(
            res,
            { message: "User successfully joined chatroom" }, // token: token
            200
        );
    } catch (err) {
        console.error("Decryption error:", err);
        return apiGeneralError(res, "Failed to decrypt data. Invalid or corrupted data.", 400);
    }
});

const decrypt = (encrypted) => {
    try {
        if (!process.env.REACT_APP_CHATROOMID_ENCRYPTION_KEY) {
            throw new Error('Encryption key is not configured');
        }
        const [ivHex, encryptedDataHex] = encrypted.split(':');
        if (!ivHex || !encryptedDataHex) {
            throw new Error('Invalid encrypted data format');
        }
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedData = Buffer.from(encryptedDataHex, 'hex');
        const key = Buffer.from(process.env.REACT_APP_CHATROOMID_ENCRYPTION_KEY, 'hex');
        if (key.length !== 32) {
            throw new Error(`Invalid key length: ${key.length} bytes. Expected 32 bytes for AES-256-CBC`);
        }
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

const createSocketIoConnectionForServer = (serverInstance) => {
    console.log("Setting up Socket.IO connection..."); // Debug log for setup
    const io = new Server(serverInstance, {
        cors: {
            origin: "http://localhost:3000", // <== frontend origin (adjust if different)
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ["polling", "websocket"],
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Decrypt chatroomID from socket handshake auth before joining room
        let decryptedChatroomID = null;
        if (socket.handshake.auth && socket.handshake.auth.chatroomID) {
            decryptedChatroomID = decrypt(socket.handshake.auth.chatroomID);
            if (decryptedChatroomID) {
                console.log(`User ${socket.id} joined decrypted chatroom ID ${decryptedChatroomID}`);
                socket.join(decryptedChatroomID);
            } else {
                console.error(`Failed to decrypt chatroomID for user ${socket.id}`);
            }
        } else {
            console.warn(`No chatroomID provided in auth for user ${socket.id}`);
        }

        socket.on("joinChatroom", (chatroomID) => {
            console.log(`User ${socket.id} joined chatroom of ID ${chatroomID}`);
            socket.join(chatroomID);
        });
        socket.on("Message to Server : New User Joined Chatroom", (chatroomID) => {
            console.log(`New user joined chatroom: ${chatroomID}, socket id: ${socket.id}`);
            // Emit to all clients in the chatroom that a new member has joined
            // Send full member info: socketId, username, avatar (if available)
            const memberInfo = {
                socketId: socket.id,
                username: socket.handshake.auth.username || "Unknown",
                avatar: socket.handshake.auth.avatar || { url: null }
            };
            io.to(chatroomID).emit("newMemberJoined", memberInfo);
        });
        socket.on("sendMessage", (data) => {
            console.log(`User ${socket.id} sent message: ${data.message}`);
            io.to(data.chatroomID).emit("receiveMessage", {
                message: data.message,
                senderid: socket.id,
                timestamp: new Date().toUTCString(),
            });
        });

        // WebRTC signaling handlers
        socket.on("offer", (data) => {
            console.log("Received offer from", data.username);
            socket.broadcast.emit("offer", data);
        });

        socket.on("answer", (data) => {
            console.log("Received answer from", data.username);
            socket.broadcast.emit("answer", data);
        });

        socket.on("iceCandidate", (data) => {
            console.log("Received ICE candidate from", data.username);
            socket.broadcast.emit("iceCandidate", data);
        });

        socket.on("disconnect", () => {
            console.log(`User with socketID ${socket.id} disconnected`);
        });
    });
};

module.exports = { generateEncryptedChatroomID , handleChatroomUserJoin ,createSocketIoConnectionForServer } ;

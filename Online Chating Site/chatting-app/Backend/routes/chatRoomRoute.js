const express = require('express') ;
const multer = require('multer') ;
const { generateEncryptedChatroomID , handleChatroomUserJoin } = require("../controllers/forChatRoom.js") ;


const router = express.Router() ;
const storage = multer.memoryStorage() ; // just for loggin newfiles...
const upload = multer({storage:storage}) ;

router.post('/generateID', generateEncryptedChatroomID) ; // endpoint for generating a strong chatroomID...
router.post('/join',upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'encryptedData', maxCount: 1 }
]), handleChatroomUserJoin) // handling user joining with avatar and encryptedData



module.exports = router ;

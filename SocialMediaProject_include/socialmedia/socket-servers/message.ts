import http from 'http';
import { Server } from 'socket.io';
import express,{ Request , Response } from 'express';
import Presense from '@/app/db/models/presense';
import { messageFinalStatusUpdation } from '@/app/db/services/chat';
import { notificationPayloadType } from '@/app/db/services/notifications';
import { messageCreationService } from '@/app/db/services/chat';
import { NextResponse } from 'next/server';

const app = express();
const port = 5000 ;

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" }});

io.on("connection", (socket) => {

  // for registering account as socket
  socket.on("register_account", async (accountId) => {
  // creating Presense state in DB...
  await Presense.create({ accountId:accountId , onlineStatus:'online' , socketId:socket.id })
  socket.join(accountId);
  });
  
  // for login
  socket.on("login_account", async (accountId) => { 
    await Presense.findOneAndUpdate({ accountId:accountId },{ onlineStatus:'online' }) ;
    socket.join(accountId);
  })

  // getting the real-time message coming...
  socket.on('send_message', async (payload) => {
    try {
      const { conversationId, encryptedMessage, mediaFiles, mentions } = payload ; // destructuring the encrypted message data coming...
      if (!conversationId || !encryptedMessage)  console.error('Conversation Id OR encrypted message missing !!');

      const result = await messageCreationService(payload);
      // checking success result check...
      if (!result || typeof result !== 'object' || !('socketid' in result) || !('msgID' in result))  return ;

      const { socketid , msgID } = result ; // destructuring the wanted data...

      if (socketid && msgID) {
          socket.emit('catch_message',{ encryptedMessage , msgID });
          socket.to(socketid).emit('message_status_update',{ status: 'sent' , msgidx: msgID });
        } 
    } catch (e) {
      console.error('send_message handler failed', e);
    }
  })

  // last status update...
  socket.on('message_final_update', async (payload) => { 
    const { sent , msgID } = payload ;
    const socketid = await messageFinalStatusUpdation(sent,msgID);

    if (typeof socketid !== 'string')  return ; // If socketid is not returned...

    socket.to(socketid).emit('message_status_update_final', { msgidx:msgID, status: sent });
   });
  
});

/* HTTP → Emit Notification */
app.post("/emit-notification", (req: Request, res: Response) => {
  const { recipientSocketId, payload } = req.body as { recipientSocketId: string; payload: notificationPayloadType }; // recipientId means accountId to emit notification

  io.to(recipientSocketId).emit("notification", payload); // emiting via io...
  res.json({ success: true , status:200 });
});


server.listen(port, () => {
  console.log("Realtime server running on port 4000");
});
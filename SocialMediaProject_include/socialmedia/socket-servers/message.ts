import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { messageCreationService } from '@/app/db/services/chat';

const app = express();
const port = 5000 ;

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" }});

// handling socket connection logic...
io.on("connection", (socket) => {

  socket.emit('catch_message',() => {

  })

  // getting the real-time message coming...
  socket.on('send_message', async (payload) => {
    try {
      const { conversationId, encryptedMessage, mediaFiles, mentions } = payload ; // destructuring the encrypted message data coming...
      if (!conversationId || !encryptedMessage)  console.error('Conversation Id OR encrypted message missing !!');

      const presenseState = await messageCreationService(payload);
      // start from here...
        if (clientMessageId) {
          socket.to(String(fromId)).emit('message_status_update', {
            conversationId,
             clientMessageId,
             status: 'sent',
             msgidx: created._id.toString(),
           });
        } else {
          socket.to(String(fromId)).emit('message_status_update', {
            status: 'sent',
            msgidx: created._id.toString(),
          });
        }
    } catch (e) {
      console.error('send_message handler failed', e);
    }
  })
  
});


server.listen(port, () => {
  console.log("Realtime server running on port 4000");
});
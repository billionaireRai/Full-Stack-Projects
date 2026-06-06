import http from 'http';
import { Server } from 'socket.io';
import Presence from '@/app/db/models/presense';
import express, { Request, Response } from 'express';

const app = express();
const port = 4000 ;

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" }});

/* Socket Logic */
io.on("connection", (socket) => {
  // for registering account as socket
  socket.on("register_account", async (accountId) => {
  // creating Presense state in DB...
  await Presence.create({ accountId:accountId , onlineStatus:'online' , socketId:socket.id })
  socket.join(accountId);
  });

  // for login
  socket.on("login_account", async (accountId) => { 
    await Presence.findOneAndUpdate({ accountId:accountId },{ onlineStatus:'online' }) ;
    socket.join(accountId);
  })
});

/* HTTP → Emit Notification */
app.post("/emit-notification", (req: Request, res: Response) => {
  const { recipientId, payload } = req.body as { recipientId: string; payload: unknown }; // recipientId means accountId to emit notification

  io.to(recipientId).emit("notification", payload);

  res.json({ success: true , status:200 });
});

server.listen(port, () => {
  console.log(`Realtime server running on port ${port}`);
});
import http from 'http';
import { Server } from 'socket.io';
import express, { Request, Response } from 'express';

const app = express();
const port = 4000 ;

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" }});

/* Socket Logic */
io.on("connection", (socket) => {
  socket.on("register_account", (accountId) => {
    socket.join(accountId);
  });
});

/* HTTP → Emit Notification */
app.post("/emit-notification", (req: Request, res: Response) => {
  const { recipientId, payload } = req.body as { recipientId: string; payload: unknown }; // recipientId means accountId to emit notification

  io.to(recipientId).emit("notification", payload);

  res.json({ success: true , status:200 });
});

server.listen(port, () => {
  console.log("Realtime server running on port 4000");
});
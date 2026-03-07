import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const port = 4000 ;

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" }});

/* Socket Logic */
io.on("connection", (socket) => {
  socket.on("register_user", (userId) => {
    socket.join(userId);
  });
});

/* HTTP → Emit Notification */
app.post("/emit-notification", (req: Request, res: Response) => {
  const { recipientId, payload } = req.body as { recipientId: string; payload: unknown };

  io.to(recipientId).emit("notification", payload);

  res.json({ success: true , status:200 });
});

server.listen(port, () => {
  console.log("Realtime server running on port 4000");
});
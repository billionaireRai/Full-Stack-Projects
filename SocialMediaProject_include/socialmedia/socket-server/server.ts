import http from 'http' ;
import { Server } from 'socket.io';

const server = http.createServer();
const port = 4000 ;

const io = new Server(server, { cors: { origin: "*" }});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register_user", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


server.listen(port, () => {
  console.log("Realtime server running on port 4000");
});
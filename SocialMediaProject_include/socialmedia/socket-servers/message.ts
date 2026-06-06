import http from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const port = 5000 ;

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" }});

// handling socket connection logic...
io.on("connection", (socket) => {
  
});


server.listen(port, () => {
  console.log("Realtime server running on port 4000");
});
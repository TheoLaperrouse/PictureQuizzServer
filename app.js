import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST'],
}));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('createRoom', (roomId) => {
    console.log(`Room created: ${roomId}`);
    socket.join(roomId);
  });

  socket.on('joinRoom', (roomId) => {
    console.log(`User joined room: ${roomId}`);
    socket.join(roomId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
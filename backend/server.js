import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import router from './routes/userRoutes.js';
import Messagerouter from './routes/messageRoutes.js';

const app = express();
const server = http.createServer(app);

// Configure CORS to allow requests from your frontend origin
const corsOptions = {
  origin: 'https://real-time-chat-app-steel-nine.vercel.app',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '4mb' }));

export const io = new Server(server, {
  cors: {
    origin: 'https://real-time-chat-app-steel-nine.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

export const userSocketMap = {};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// Routes
app.get('/', (req, res) => res.send('mein hu khanlyanak'));
app.use('/api/auth/', router);
app.use('/api/messages/', Messagerouter);

await connectDB();

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;

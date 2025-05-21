import express from 'express'
import cors from 'cors'
import http from 'http'
import 'dotenv/config'
import {connectDB} from './config/db.js'
import router from './routes/userRoutes.js'
import Messagerouter from './routes/messageRoutes.js'
import { Server } from 'socket.io'

//create server with http and express

const app = express();
const server = http.createServer(app)

//initialize socket.io server
export const io = new Server(server, {
      cors: {origin:"*"}
})

//store online users
export const userSocketMap = {}; // {userId: socketId}

//socket.io connection handler function
io.on("connection", (socket)=>{
      const userId = socket.handshake.query.userId
      // console.log("User Connected", userId)

      if(userId) userSocketMap[userId] = socket.id

      //emit online users to all connected clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      socket.on("disconnect", ()=>{
            console.log("User Disconnected", userId)
            delete userSocketMap[userId]
            io.emit("getOnlineUsers",Object.keys(userSocketMap))
      })
})


//middleware setup
app.use(express.json({limit:'4mb'}));
app.use(cors());

//routes setup
app.get('/',(req,res) => res.send('mein hu khanlyanak'));
app.use('/api/auth/', router);
app.use('/api/messages/', Messagerouter);

//Connect to mongoDB
await connectDB()

const port = process.env.PORT || 4001;

server.listen(port, () => {
      console.log('Server is running on Port:', port)
})
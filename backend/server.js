// server.js
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'
import { connectDB } from './config/db.js'
import router from './routes/userRoutes.js'
import Messagerouter from './routes/messageRoutes.js'

 const app = express()
const server = http.createServer(app)

export const io = new Server(server, {
  cors: { origin: "*" }
})

export const userSocketMap = {}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  if (userId) userSocketMap[userId] = socket.id

  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})
// Middleware
app.use(express.json({ limit: '4mb' }))
app.use(cors())

// Routes
app.get('/', (req, res) => res.send('mein hu khanlyanak'))
app.use('/api/auth/', router)
app.use('/api/messages/', Messagerouter)

await connectDB()

if(process.env.NODE_ENV !== 'production'){
    const PORT = process.env.PORT || 4001
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
}

export default server;
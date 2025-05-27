// dev-server.js
import http from 'http'
import { Server } from 'socket.io'
import app from './server.js'
import 'dotenv/config'

// Create HTTP server
const server = http.createServer(app)

// Initialize socket.io
export const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
})

// Store online users
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

const PORT = process.env.PORT || 4001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

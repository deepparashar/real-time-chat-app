import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import router from './routes/userRoutes.js'
import Messagerouter from './routes/messageRoutes.js'

const app = express()

// Middleware
app.use(express.json({ limit: '4mb' }))
app.use(cors())

// Routes
app.get('/', (req, res) => res.send('mein hu khanlyanak'))
app.use('/api/auth/', router)
app.use('/api/messages/', Messagerouter)

export default app

// Connect DB (wrapped in async IIFE to avoid top-level await error on Vercel)
;(async () => {
  try {
    await connectDB()
    console.log("MongoDB connected")
  } catch (err) {
    console.error("DB connection failed:", err)
  }
})()

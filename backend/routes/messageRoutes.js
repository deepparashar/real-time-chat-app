import express from 'express'
import { protectRoute } from '../middlewares/authMiddleware.js';
import { getUserForSidebar, getUserMessage, markSeenMessage, sendMessages } from '../controllers/messageController.js';

const Messagerouter = express.Router();

Messagerouter.get("/users", protectRoute, getUserForSidebar)
Messagerouter.get("/:id", protectRoute, getUserMessage)
Messagerouter.put("/mark/:id", protectRoute, markSeenMessage)
Messagerouter.post("/send/:id", protectRoute, sendMessages)

export default Messagerouter;
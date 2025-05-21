import express from 'express'
import { protectRoute } from '../middlewares/authMiddleware.js';
import { checkAuth, login, register, updateProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/check',protectRoute, checkAuth)
router.post('/signup', register)
router.post('/login', login)
router.put('/update-profile', protectRoute, updateProfile)

export default router;
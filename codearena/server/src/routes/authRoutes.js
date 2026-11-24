import { Router } from 'express';
import { register, login, logout, getMe, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);        // authenticated logout
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

export default router;

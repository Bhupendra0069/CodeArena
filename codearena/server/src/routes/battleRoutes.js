import { Router } from 'express';
import {
  createBattle,
  joinBattle,
  getBattleById,
  getBattleHistory,
} from '../controllers/battleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createBattle);
router.post('/join', protect, joinBattle);
router.get('/history', protect, getBattleHistory);
router.get('/:id', protect, getBattleById);

export default router;

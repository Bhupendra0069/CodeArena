import { Router } from 'express';
import { getProblems, getProblemById, createProblem } from '../controllers/problemController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getProblems);
router.get('/:id', getProblemById);
router.post('/', protect, adminOnly, createProblem); // admins only

export default router;

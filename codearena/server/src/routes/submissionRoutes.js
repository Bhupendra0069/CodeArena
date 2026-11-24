import { Router } from 'express';
import { runCode, submitSolution, getSubmissionHistory } from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { codeLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

router.post('/run', protect, codeLimiter, runCode);
router.post('/submit', protect, codeLimiter, submitSolution);
router.get('/history', protect, getSubmissionHistory);

export default router;

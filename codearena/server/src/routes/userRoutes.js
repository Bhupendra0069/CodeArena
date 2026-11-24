import { Router } from 'express';
import User from '../models/User.js';
import Match from '../models/Match.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/users/me — Full profile of the authenticated user
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    const recentMatches = await Match.find({
      'players.user': req.user._id,
      status: 'finished',
    })
      .populate('problem', 'title difficulty')
      .populate('winner', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate user rank
    const usersWithHigherRating = await User.countDocuments({ rating: { $gt: user.rating } });
    const rank = usersWithHigherRating + 1;

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        recentMatches,
        rank,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id — Public profile
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      'username rating battlesPlayed battlesWon problemsSolved createdAt'
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export default router;

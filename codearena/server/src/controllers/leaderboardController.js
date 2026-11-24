import User from '../models/User.js';

// GET /api/leaderboard
export const getLeaderboard = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find({})
      .select('username rating battlesPlayed battlesWon problemsSolved createdAt')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments();

    const ranked = users.map((user, index) => ({
      rank: skip + index + 1,
      _id: user._id,
      username: user.username,
      rating: user.rating,
      battlesPlayed: user.battlesPlayed,
      battlesWon: user.battlesWon,
      winRate:
        user.battlesPlayed > 0
          ? Math.round((user.battlesWon / user.battlesPlayed) * 100)
          : 0,
      problemsSolved: user.problemsSolved,
    }));

    res.json({
      success: true,
      data: ranked,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

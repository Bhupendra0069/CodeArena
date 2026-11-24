import Match from '../models/Match.js';
import { generateRoomCode } from '../utils/generateRoomCode.js';
import { selectProblemForBattle } from '../services/matchService.js';

// POST /api/battles — Create a new battle room
export const createBattle = async (req, res, next) => {
  try {
    const { difficulty, duration } = req.body;

    if (!difficulty || !duration) {
      return res.status(400).json({ success: false, message: 'Difficulty and duration are required' });
    }
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ success: false, message: 'Invalid difficulty' });
    }
    if (Number(duration) < 5 || Number(duration) > 120) {
      return res.status(400).json({ success: false, message: 'Duration must be between 5 and 120 minutes' });
    }

    // Generate a unique room code
    let roomCode;
    let exists = true;
    while (exists) {
      roomCode = generateRoomCode();
      exists = await Match.findOne({ roomCode });
    }

    const match = await Match.create({
      roomCode,
      players: [
        {
          user: req.user._id,
          username: req.user.username,
          isConnected: true,
          isReady: false,
        },
      ],
      difficulty,
      duration: Number(duration),
      status: 'waiting',
    });

    res.status(201).json({
      success: true,
      message: 'Battle room created',
      data: {
        roomCode: match.roomCode,
        matchId: match._id,
        difficulty,
        duration: match.duration,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/battles/join — Join an existing room
export const joinBattle = async (req, res, next) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({ success: false, message: 'Room code is required' });
    }

    const match = await Match.findOne({ roomCode: roomCode.trim().toUpperCase() });

    if (!match) {
      return res.status(404).json({ success: false, message: 'Room not found. Check the code and try again.' });
    }
    if (match.status !== 'waiting') {
      return res.status(400).json({ success: false, message: 'This battle has already started or ended' });
    }
    if (match.players.length >= 2) {
      return res.status(400).json({ success: false, message: 'This room is full' });
    }

    const alreadyIn = match.players.some(p => p.user.toString() === req.user._id.toString());
    if (alreadyIn) {
      return res.status(400).json({ success: false, message: 'You are already in this room' });
    }

    match.players.push({
      user: req.user._id,
      username: req.user.username,
      isConnected: true,
      isReady: false,
    });
    match.status = 'ready';
    await match.save();

    res.json({
      success: true,
      message: 'Joined battle room',
      data: {
        roomCode: match.roomCode,
        matchId: match._id,
        difficulty: match.difficulty,
        duration: match.duration,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/battles/history
export const getBattleHistory = async (req, res, next) => {
  try {
    const matches = await Match.find({
      'players.user': req.user._id,
      status: { $in: ['finished', 'cancelled'] },
    })
      .populate('problem', 'title difficulty')
      .populate('winner', 'username')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, data: matches });
  } catch (error) {
    next(error);
  }
};

// GET /api/battles/:id — Get match details (participants only)
export const getBattleById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate(
        'problem',
        'title description difficulty inputFormat outputFormat constraints examples sampleTestCases timeLimit memoryLimit category'
      )
      .populate('players.user', 'username rating')
      .populate('winner', 'username');

    if (!match) {
      return res.status(404).json({ success: false, message: 'Battle not found' });
    }

    const isParticipant = match.players.some(
      p => p.user._id.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: match });
  } catch (error) {
    next(error);
  }
};

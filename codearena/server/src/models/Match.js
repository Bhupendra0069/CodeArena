import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  ratingBefore: { type: Number, default: null },
  ratingAfter: { type: Number, default: null },
  ratingChange: { type: Number, default: 0 },
  hasSubmitted: { type: Boolean, default: false },
  submissionVerdict: { type: String, default: null },
  submittedAt: { type: Date, default: null },
  isConnected: { type: Boolean, default: true },
  isReady: { type: Boolean, default: false },
});

const matchSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    players: {
      type: [playerSchema],
      validate: [arr => arr.length <= 2, 'A match can have at most 2 players'],
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      default: null,
    },
    status: {
      type: String,
      enum: ['waiting', 'ready', 'active', 'finished', 'cancelled'],
      default: 'waiting',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    duration: {
      type: Number, // minutes
      required: true,
      min: 5,
      max: 120,
    },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    result: {
      type: String,
      enum: ['player1_win', 'player2_win', 'draw', 'cancelled', null],
      default: null,
    },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  },
  { timestamps: true }
);

matchSchema.index({ roomCode: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ 'players.user': 1 });

const Match = mongoose.model('Match', matchSchema);
export default Match;

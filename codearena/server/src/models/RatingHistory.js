import mongoose from 'mongoose';

const ratingHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    previousRating: { type: Number, required: true },
    newRating: { type: Number, required: true },
    change: { type: Number, required: true },
    result: {
      type: String,
      enum: ['win', 'loss', 'draw'],
      required: true,
    },
  },
  { timestamps: true }
);

ratingHistorySchema.index({ user: 1, createdAt: -1 });

const RatingHistory = mongoose.model('RatingHistory', ratingHistorySchema);
export default RatingHistory;

import Match from '../models/Match.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import RatingHistory from '../models/RatingHistory.js';
import { calculateRatingChange, calculateDrawRatingChange } from './ratingService.js';

/**
 * Randomly selects a problem matching the given difficulty.
 */
export const selectProblemForBattle = async (difficulty) => {
  const problems = await Problem.find({ difficulty, isActive: true }).select('-hiddenTestCases');
  if (!problems.length) {
    throw new Error(`No active problems found for difficulty: ${difficulty}`);
  }
  const randomIndex = Math.floor(Math.random() * problems.length);
  return problems[randomIndex];
};

/**
 * Finalizes a match: saves result, updates ratings and user stats.
 * This function is idempotent — safe to call even if match is already finished.
 * @param {Match} match - The mongoose match document
 * @param {string|null} winnerId - ObjectId of winner, or null for draw
 */
export const finalizeMatch = async (match, winnerId) => {
  // Idempotency guard — prevent double finalization
  if (match.status === 'finished') return match;

  const player1 = match.players[0];
  const player2 = match.players[1];

  match.status = 'finished';
  match.endTime = new Date();

  if (winnerId) {
    match.winner = winnerId;
    const isP1Winner = player1.user.toString() === winnerId.toString();
    const winner = isP1Winner ? player1 : player2;
    const loser = isP1Winner ? player2 : player1;

    const winnerUser = await User.findById(winner.user);
    const loserUser = await User.findById(loser.user);

    const { winnerNew, loserNew, winnerChange, loserChange } = calculateRatingChange(
      winnerUser.rating,
      loserUser.rating
    );

    winner.ratingBefore = winnerUser.rating;
    winner.ratingAfter = winnerNew;
    winner.ratingChange = winnerChange;
    loser.ratingBefore = loserUser.rating;
    loser.ratingAfter = loserNew;
    loser.ratingChange = loserChange;

    match.result = isP1Winner ? 'player1_win' : 'player2_win';

    await User.findByIdAndUpdate(winnerUser._id, {
      $inc: { battlesPlayed: 1, battlesWon: 1 },
      rating: winnerNew,
    });
    await User.findByIdAndUpdate(loserUser._id, {
      $inc: { battlesPlayed: 1 },
      rating: loserNew,
    });

    await RatingHistory.create([
      {
        user: winnerUser._id,
        match: match._id,
        previousRating: winnerUser.rating,
        newRating: winnerNew,
        change: winnerChange,
        result: 'win',
      },
      {
        user: loserUser._id,
        match: match._id,
        previousRating: loserUser.rating,
        newRating: loserNew,
        change: loserChange,
        result: 'loss',
      },
    ]);
  } else {
    // Draw
    match.result = 'draw';
    match.winner = null;

    if (player1 && player2) {
      const user1 = await User.findById(player1.user);
      const user2 = await User.findById(player2.user);
      const { newRatingA, newRatingB, changeA, changeB } = calculateDrawRatingChange(
        user1.rating,
        user2.rating
      );

      player1.ratingBefore = user1.rating;
      player1.ratingAfter = newRatingA;
      player1.ratingChange = changeA;
      player2.ratingBefore = user2.rating;
      player2.ratingAfter = newRatingB;
      player2.ratingChange = changeB;

      await User.findByIdAndUpdate(user1._id, { $inc: { battlesPlayed: 1 }, rating: newRatingA });
      await User.findByIdAndUpdate(user2._id, { $inc: { battlesPlayed: 1 }, rating: newRatingB });

      await RatingHistory.create([
        {
          user: user1._id,
          match: match._id,
          previousRating: user1.rating,
          newRating: newRatingA,
          change: changeA,
          result: 'draw',
        },
        {
          user: user2._id,
          match: match._id,
          previousRating: user2.rating,
          newRating: newRatingB,
          change: changeB,
          result: 'draw',
        },
      ]);
    }
  }

  await match.save();
  return match;
};

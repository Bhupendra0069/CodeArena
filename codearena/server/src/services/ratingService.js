/**
 * Elo-based rating calculation for CodeArena battles.
 * K-factor: 32 (standard for chess-like systems)
 * Expected score formula: E = 1 / (1 + 10^((Rb - Ra) / 400))
 */

const K_FACTOR = 32;

const expectedScore = (ratingA, ratingB) => {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
};

/**
 * Calculates new ratings after a win/loss.
 * @returns {{ winnerNew, loserNew, winnerChange, loserChange }}
 */
export const calculateRatingChange = (winnerRating, loserRating) => {
  const expectedWinner = expectedScore(winnerRating, loserRating);
  const expectedLoser = expectedScore(loserRating, winnerRating);

  const winnerChange = Math.round(K_FACTOR * (1 - expectedWinner));
  const loserChange = Math.round(K_FACTOR * (0 - expectedLoser));

  return {
    winnerNew: winnerRating + winnerChange,
    loserNew: Math.max(0, loserRating + loserChange),
    winnerChange,
    loserChange,
  };
};

/**
 * Calculates rating changes for a draw.
 * @returns {{ newRatingA, newRatingB, changeA, changeB }}
 */
export const calculateDrawRatingChange = (ratingA, ratingB) => {
  const expectedA = expectedScore(ratingA, ratingB);
  const expectedB = expectedScore(ratingB, ratingA);

  const changeA = Math.round(K_FACTOR * (0.5 - expectedA));
  const changeB = Math.round(K_FACTOR * (0.5 - expectedB));

  return {
    newRatingA: Math.max(0, ratingA + changeA),
    newRatingB: Math.max(0, ratingB + changeB),
    changeA,
    changeB,
  };
};

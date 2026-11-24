/**
 * Generates a unique 6-character alphanumeric room code.
 * Excludes ambiguous characters: 0, O, I, 1 to avoid confusion.
 */
export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

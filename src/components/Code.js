export function generateGameCode () {
  return Math.random().toString(36).substring(2, 6);
};
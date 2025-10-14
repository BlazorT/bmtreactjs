export const calculateColorStatus = (val) => {
  if (val < 25) return 'poorColor';
  if (val >= 25 && val < 50) return 'fairColor';
  if (val >= 50 && val < 75) return 'greatColor';
  if (val >= 75 && val <= 100) return 'fantasticColor';
};
export const keepOnlyAlphanumeric = (input) => {
  // Regular expression that matches any character that is NOT:
  // - a-z (lowercase letters)
  // - A-Z (uppercase letters)
  // - 0-9 (numbers)
  return input.replace(/[^a-zA-Z0-9]/g, '');
};

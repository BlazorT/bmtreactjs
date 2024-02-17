export const calculateColorStatus = (val) => {
  if (val < 25) return 'poorColor';
  if (val >= 25 && val < 50) return 'fairColor';
  if (val >= 50 && val < 75) return 'greatColor';
  if (val >= 75 && val <= 100) return 'fantasticColor';
};

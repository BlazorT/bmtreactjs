export const calculateLblColor = (val) => {
  if (val < 25) return 'poorlblColor';
  if (val >= 25 && val < 50) return 'fairlblColor';
  if (val >= 50 && val < 75) return 'greatlblColor';
  if (val >= 75 && val <= 100) return 'fantasticlblColor';
};

export const calculateProgressBarValues = (score) => {
  const progressBarCount = 4;
  const maxScore = 100;
  const progressBarStep = maxScore / progressBarCount;

  const filledProgressBars = Math.floor(score / progressBarStep);

  const remainder = score % progressBarStep;

  const progressBars = Array.from({ length: progressBarCount }, (_, index) => {
    if (index < filledProgressBars) {
      return progressBarStep;
    } else if (index === filledProgressBars) {
      return remainder;
    } else {
      return 0;
    }
  });

  return progressBars;
};

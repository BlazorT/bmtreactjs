const days = [
  { name: 'Sun' },
  { name: 'Mon' },
  { name: 'Tue' },
  { name: 'Wed' },
  { name: 'Thu' },
  { name: 'Fri' },
  { name: 'Sat' },
];
const getDayName = (date) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[date.getDay()];
};

// Helper function to calculate fraction of day
const calculateFractionOfDay = (durationInMinutes) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const durationInMilliseconds = durationInMinutes * 60 * 1000;
  const fractionOfDay = durationInMilliseconds / millisecondsPerDay;
  return parseFloat(fractionOfDay.toFixed(2));
};

// Helper function to get days between dates
function getDaysBetweenDates(startDateString, endDateString) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysBetween = Math.floor((endDate - startDate) / millisecondsPerDay) + 1;

  const daysOfWeek = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < daysBetween; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    daysOfWeek.push(dayNames[currentDate.getDay()]);
  }

  return {
    numberOfDays: daysBetween,
    daysOfWeek: daysOfWeek,
  };
}

// Count days between dates that match scheduled days
const countMatchingDays = (startDate, endDate, scheduleDays) => {
  let count = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const currentDayName = getDayName(currentDate);
    if (scheduleDays.includes(currentDayName)) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
};

// Calculate valid days for one-time interval
const calculateOneTime = (scheduleDays, daysOfWeek) => {
  return scheduleDays.filter((day) => daysOfWeek.includes(day)).length;
};

// Calculate valid days for daily interval
const calculateDaily = (startDate, endDate, scheduleDays) => {
  return countMatchingDays(startDate, endDate, scheduleDays);
};

// Calculate valid days for weekly interval
const calculateWeekly = (numberOfDays, daysOfWeek, scheduleDays) => {
  const weeks = Math.floor(numberOfDays / 7);
  const remainingDays = numberOfDays % 7;

  return scheduleDays.reduce((total, day) => {
    let count = weeks;
    if (daysOfWeek.slice(0, remainingDays).includes(day)) {
      count++;
    }
    return total + count;
  }, 0);
};

// Calculate valid days for monthly interval
const calculateMonthly = (startDate, endDate, scheduleDays) => {
  return countMatchingDays(startDate, endDate, scheduleDays);
};

// Calculate valid days for yearly interval
const calculateYearly = (startDate, endDate, scheduleDays) => {
  return countMatchingDays(startDate, endDate, scheduleDays);
};

// Calculate valid days for custom interval
const calculateCustomInterval = (startDate, endDate, scheduleDays, intervalMinutes) => {
  const validDays = countMatchingDays(startDate, endDate, scheduleDays);
  return validDays * calculateFractionOfDay(intervalMinutes);
};

// Main function to calculate valid days
export const calculateValidDays = (scheduleList) => {
  const { numberOfDays, daysOfWeek } = getDaysBetweenDates(
    scheduleList.startTime,
    scheduleList.finishTime,
  );

  const scheduleDays = scheduleList.days.map((day) => days[day - 1].name);
  const startDate = new Date(scheduleList.startTime);
  const endDate = new Date(scheduleList.finishTime);
  const interval = scheduleList.intervalTypeId;
  const intervalCalculators = {
    1: () => calculateOneTime(scheduleDays, daysOfWeek),
    2: () => calculateDaily(startDate, endDate, scheduleDays),
    3: () => calculateWeekly(numberOfDays, daysOfWeek, scheduleDays),
    4: () => calculateMonthly(startDate, endDate, scheduleDays),
    5: () => calculateYearly(startDate, endDate, scheduleDays),
    6: () => calculateCustomInterval(startDate, endDate, scheduleDays, scheduleList.interval),
  };

  const calculator = intervalCalculators[interval];
  return calculator ? calculator() : 0;
};

export function getFormattedDate() {
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay); // Move to the first day (Sunday) of the current week

  const formatDate = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${month}/${day}/${year}`;
  };

  // Get dates from Sunday to Saturday
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    weekDates.push(formatDate(currentDate));
  }

  return weekDates;
}

export function getWeekRange(startDate, endDate) {
  const startOfWeek = new Date(startDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startDate.getDate() - startDate.getDay()); // Move to the first day (Sunday) of the current week

  const formatDate = (date) => {
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const day = date.getDate().toString().padStart(2, '0');
    return `${dayOfWeek}, ${month} ${day}`;
  };

  // Get dates from Sunday to Saturday within the provided start and end dates
  const weekDates = [];
  let currentDate = new Date(startOfWeek);

  while (currentDate <= endDate) {
    weekDates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  // console.log({ startDate, endDate, weekDates });
  return weekDates;
}

export function matchDateFormat(date1, date2) {
  const formatDate = (inputDate) => {
    const dateToCheck = new Date(inputDate);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateToCheck);
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateToCheck);
    const dayOfMonth = dateToCheck.getDate();
    return `${dayOfWeek}, ${month} ${dayOfMonth}`;
  };

  const formattedDate1 = formatDate(date1);
  const formattedDate2 = date2;

  return formattedDate1 === formattedDate2;
}

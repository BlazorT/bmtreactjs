import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
export const formatDate = (dateString) => {
  // Parse the date using moment
  dayjs.extend(utc);
  const parsedDate = dayjs(dateString);

  // Format the parsed date in the desired format
  const formattedDate = parsedDate.format('MM/DD/YYYY');

  return formattedDate;
};

export const formatDateTime = (dateTimeString) => {
  // Parse the date and time using moment in UTC mode
  const parsedDateTime = dayjs.utc(dateTimeString);

  // Format the parsed date and time in the desired format
  const formattedDateTime = parsedDateTime.format('MM/DD/YYYY HH:mm:ss');
  return formattedDateTime;
};
export const formatTime = (TimeString) => {
  const parsedTime = dayjs.utc(TimeString);
  const formattedTime = parsedTime.format('HH:mm:ss');
  return formattedTime;
};

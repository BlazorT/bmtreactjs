import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
export const formatDate = (dateString) => {
  // Parse the date using moment
  const parsedDate = dayjs(dateString);

  // Format the parsed date in the desired format
  const formattedDate = parsedDate.format('MM/DD/YYYY');

  return formattedDate;
};

export const formatDateTime = (dateTimeString) => {
  // Parse the input as UTC and convert to local time
  const localDateTime = dayjs.utc(dateTimeString).local();
  // Format in desired format
  return localDateTime.format('MM/DD/YYYY hh:mm:ss A');
};
export const formatTime = (TimeString) => {
  const parsedTime = dayjs.utc(TimeString);
  const formattedTime = parsedTime.format('HH:mm:ss');
  return formattedTime;
};

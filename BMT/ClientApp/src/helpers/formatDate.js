import moment from 'moment';

export const formatDate = (dateString) => {
  // Parse the date using moment
  const parsedDate = moment(dateString);

  // Format the parsed date in the desired format
  const formattedDate = parsedDate.format('MM/DD/YYYY');

  return formattedDate;
};

export const formatDateTime = (dateTimeString) => {
  // Parse the date and time using moment in UTC mode
  const parsedDateTime = moment.utc(dateTimeString);

  // Format the parsed date and time in the desired format
  const formattedDateTime = parsedDateTime.format('MM/DD/YYYY HH:mm:ss');
  return formattedDateTime;
};
export const formatTime = (TimeString) => {
  const parsedTime = moment.utc(TimeString);
  const formattedTime = parsedTime.format('HH:mm:ss');
  return formattedTime;
};

export default function calculateTime(timestamps) {
  if (!timestamps || timestamps.length === 0) {
    return { min: null, max: null };
  }

  const parsedTimestamps = timestamps.map((timestamp) => new Date(timestamp).getTime());

  const minTimestamp = new Date(Math.min(...parsedTimestamps));
  const maxTimestamp = new Date(Math.max(...parsedTimestamps));

  // Format options for UTC
  const formatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  };

  const formatter = new Intl.DateTimeFormat('en-US', formatOptions);

  const minTime = formatter.format(minTimestamp);
  const maxTime = formatter.format(maxTimestamp);

  return { min: minTime, max: maxTime };
}
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    (result[group] = result[group] || []).push(item);
    return result;
  }, {});
};

export default function calculateTime(timestamps) {
  if (!timestamps || timestamps.length === 0) {
    return { min: null, max: null };
  }

  // Filter out invalid values and parse timestamps
  const parsedTimestamps = timestamps
    .filter((ts) => ts !== undefined && ts !== '')
    .map((timestamp) => new Date(timestamp).getTime());

  if (parsedTimestamps.length === 0) {
    return { min: null, max: null };
  }

  const minTimestamp = new Date(Math.min(...parsedTimestamps));
  const maxTimestamp = new Date(Math.max(...parsedTimestamps));

  // Format options for local time in 12-hour format
  const formatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // 12-hour format with AM/PM
  };

  const formatter = new Intl.DateTimeFormat('en-US', formatOptions);

  const minTime = formatter.format(minTimestamp);
  const maxTime = formatter.format(maxTimestamp);

  return { min: minTime, max: maxTime };
}

// Utility function to group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    (result[group] = result[group] || []).push(item);
    return result;
  }, {});
};

export default function calculateTime(timestamps) {
  if (!timestamps || timestamps.length === 0) {
    return { min: null, max: null };
  }

  const parsedTimestamps = timestamps.map((timestamp) => new Date(timestamp).getTime());

  const minTimestamp = new Date(Math.min(...parsedTimestamps));
  const maxTimestamp = new Date(Math.max(...parsedTimestamps));

  // Format the timestamps back to the original format
  const formatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  const minTime = minTimestamp.toLocaleDateString('en-US', formatOptions);
  const maxTime = maxTimestamp.toLocaleDateString('en-US', formatOptions);

  return { min: minTime, max: maxTime };
}

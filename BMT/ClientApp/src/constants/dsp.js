export const dsps = [
  'Select DSPS...',
  'DSP',
  'Applied',
  'In Progress',
  'Rejected',
  'Boarded',
  'Off Boarded',
];

export function getDSPById(index) {
  // Check if the index is within the valid range
  if (index >= 0 && index < dsps.length) {
    return dsps[index];
  } else {
    return 'Invalid Index'; // Return a default value for invalid indices
  }
}

export const daTruncateAndCapitalize = (inputString) => {
  const colorIndex = inputString.indexOf('Color');

  if (colorIndex !== -1) {
    const truncatedString = inputString.substring(0, colorIndex);
    const capitalizedString = truncatedString.charAt(0).toUpperCase() + truncatedString.slice(1);
    return capitalizedString;
  }

  return inputString;
};

/* eslint-disable react/react-in-jsx-scope */
export const checkPasswordStrength = (value) => {
  // Regular expressions to check for various criteria
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value);
  const isMinimumLength = value.length >= 8;

  // Calculating strength based on criteria met
  let strengthValue = 'Weak';
  if (isMinimumLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChars) {
    strengthValue = 'Strong';
  } else if (isMinimumLength && (hasUppercase || hasLowercase || hasNumbers || hasSpecialChars)) {
    strengthValue = 'Moderate';
  }
  return <strong className={getClassForStrength(strengthValue)}> {strengthValue}</strong>;
};

const getClassForStrength = (strength) => {
  switch (strength) {
    case 'Weak':
      return 'text-danger';
    case 'Moderate':
      return 'text-warning';
    case 'Strong':
      return 'text-success';
    default:
      return '';
  }
};

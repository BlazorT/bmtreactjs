export default function validateEmail(email: string): boolean {
  // Regular expression pattern for different email extensions
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
 // const isValidEmail = emailRegex.test(email);
 // const emailRegex =
 //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Test the email against the regular expression
  return emailRegex.test(email);
}

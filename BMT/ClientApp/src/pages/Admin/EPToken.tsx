/* eslint-disable react/react-in-jsx-scope */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentConfirmation = () => {
  const location = useLocation();

  // Helper to get query params from the current location
  const getQueryParam = (param: string) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const authToken = getQueryParam('auth_token');
    console.log({ authToken });
    if (authToken) {
      // Prepare the form data
      const formData = {
        auth_token: authToken,
        postBackURL: `${window.location.origin}/campaignadd`,
      };

      // Create a form dynamically
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://easypay.easypaisa.com.pk/easypay/Confirm.jsf';

      // Append hidden inputs for each form field
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      // Submit the form
      document.body.appendChild(form);
      form.submit();
    } else {
      console.error('auth_token not found in URL.');
    }
  }, [location.search]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
      <h3>Processing Payment Confirmation...</h3>
    </div>
  );
};

export default PaymentConfirmation;

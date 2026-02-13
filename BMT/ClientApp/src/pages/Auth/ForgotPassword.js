/* eslint-disable react/react-in-jsx-scope */
// React and third-party libraries
import { useState } from 'react';

// local imports
import EmailForgotPassword from 'src/components/ForgotPswrdComponents/EmailForgotPassword';
import ResetPassword from 'src/components/ForgotPswrdComponents/ResetPassword';
import SecurityCode from 'src/components/ForgotPswrdComponents/SecurityCode';
import Fotter from 'src/layout/AppFooter';

const ForgotPassword = () => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [onTaskName, setOnTaskName] = useState('email');

  return (
    <div className="overflow-hidden">
      <div className="center-screen-div">
        {onTaskName === 'email' && (
          <EmailForgotPassword
            setOnTaskName={setOnTaskName}
            setToken={setToken}
            setEmail={setEmail}
            email={email}
          />
        )}
        {onTaskName === 'securityCode' && (
          <SecurityCode
            setOnTaskName={setOnTaskName}
            setToken={setToken}
            token={token}
            email={email}
          />
        )}
        {onTaskName === 'resetPassword' && (
          <ResetPassword setOnTaskName={setOnTaskName} token={token} email={email} />
        )}
      </div>

      <Fotter />
    </div>
  );
};
export default ForgotPassword;

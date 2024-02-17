// React and third-party libraries
import React, { useState } from 'react';

// local imports
import EmailForgotPassword from 'src/components/ForgotPswrdComponents/EmailForgotPassword';
import Fotter from 'src/layout/AppFooter';
import ResetPassword from 'src/components/ForgotPswrdComponents/ResetPassword';
import SecurityCode from 'src/components/ForgotPswrdComponents/SecurityCode';
import CustomSnackbar from 'src/components/UI/CustomSnackbar';
import { useDispatch, useSelector } from 'react-redux';
import { selectToast, updateToast } from 'src/redux/toast/toastSlice';
import { CCol, CRow } from '@coreui/react';

const ForgotPassword = () => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [onTaskName, setOnTaskName] = useState('email');

  const dispatch = useDispatch();
  const toast = useSelector(selectToast);

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
      <CustomSnackbar
        message={toast.toastMessage}
        variant={toast.toastVariant}
        open={toast.isToastOpen}
        setOpen={() =>
          dispatch(
            updateToast({
              isToastOpen: false,
            }),
          )
        }
      />
    </div>
  );
};
export default ForgotPassword;

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { formValidator } from 'src/helpers/formValidator';
import { cilEnvelopeClosed } from '@coreui/icons';

import CustomInput from '../InputsComponent/CustomInput';
import useApi from 'src/hooks/useApi';
import Button from '../InputsComponent/Button';
import { useShowToast } from 'src/hooks/useShowToast';
import LoadingBtn from '../UI/LoadingBtn';

function SecurityCode(prop) {
  dayjs.extend(utc);
  const { setOnTaskName, token, email, setToken } = prop;
  const [securityCode, setSecurityCode] = useState('');

  const [timer, setTimer] = useState(900); // 15 minutes in seconds
  const [expired, setExpired] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const showToast = useShowToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        setExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const { loading, postData } = useApi('/BlazorApi/forgot');

  const checkToken = async () => {
    const form = document.querySelector('.forgot-password-form');
    formValidator();
    if (form.checkValidity() && token === securityCode) {
      setLoadingMessage('Verifying Token...');
      // const forgotPassword = {
      //   id: 0,
      //   dspid: 0,
      //   userId: '',
      //   userName: '',
      //   firstName: '',
      //   lastName: '',
      //   email: email,
      //   primaryContact: '',
      //   token: securityCode,
      //   roleId: 0,
      //   password: '',
      //   rowVer: 0,
      //   status: 0,
      //   createdAt: moment().utc().format(),
      //   createdBy: 0,
      // };

      // console.log({ token, forgotPassword });
      // const tokenRes = await postData(forgotPassword);

      // console.log({ tokenRes });

      showToast('Token Verified');
      setOnTaskName('resetPassword');
      // if (tokenRes.status === true) {
      // } else {
      //   showToast(
      //     'Sorry, the entered security code doesnt match please double-check and try again',
      //     'error',
      //   );
      //   //
      // }
    } else {
      showToast(
        'Sorry, the entered security code doesnt match please double-check and try again',
        'error',
      );
    }
  };

  const resendCode = async () => {
    setLoadingMessage('Resending Token...');

    const forgotPassword = {
      id: 0,
      dspid: 0,
      userId: '',
      userName: '',
      firstName: '',
      lastName: '',
      email: email,
      primaryContact: '',
      token: '',
      roleId: 0,
      password: '',
      rowVer: 0,
      status: 0,
      createdAt: dayjs().utc().format(),
      createdBy: 0,
    };

    const tokenRes = await postData(forgotPassword);
    console.log({ tokenRes });
    if (tokenRes.status === true) {
      setToken(tokenRes.data.token);
      setTimer(900);
      setExpired(false);
      showToast('Your security code has been resent to your email; please check your inbox');
    } else {
      if (tokenRes.message === '') showToast('Email does not exist or in valid', 'error');
      else showToast(tokenRes.message, 'error');
    }
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const handleForotPassword = (event) => {
    setSecurityCode(event.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form className="needs-validation forgot-password-form" onSubmit={handleSubmit} noValidate>
      <div className="mt-5 centerimage mb-3">
        <img className="forgot-password-img" src="bmtlogo.png" alt="logo" />
        <h2 className="forgot-password-title">Enter Security Code</h2>
        <p className="forgot-password-email-title ">
          Enter security code, open your mail box and get your securtiy code. if could not see
          forgot password email, please check spam filters, to regenerate security code press
          <strong> Resend </strong> button
        </p>
      </div>

      <CustomInput
        label="Secuirty Code"
        value={securityCode}
        autoComplete="off"
        onChange={handleForotPassword}
        icon={cilEnvelopeClosed}
        type="text"
        className="form-control item"
        id="token"
        name="token"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="Enter security code e.g 01526"
        isRequired={true}
        message="Enter secuirty code"
        title="Enter secuirty code"
      />
      <div>
        {!expired ? (
          <div>
            <p>Password reset code will expire in {formatTime(timer)}. (mm:ss)</p>
            {/* Additional UI for input field to enter reset code */}
          </div>
        ) : (
          <p>The password reset code has expired. Please request a new one.</p>
        )}
      </div>
      <div className="CenterAlign mb-5">
        {loading ? (
          <LoadingBtn title={loadingMessage} />
        ) : (
          <React.Fragment>
            <Button title="Back" onClick={() => setOnTaskName('email')} />
            <Button title="Resend" onClick={resendCode} disabled={timer !== 0 && true} />
            <Button
              title="Next"
              type="submit"
              onClick={checkToken}
              disabled={timer === 0 && true}
            />
          </React.Fragment>
        )}
      </div>
    </form>
  );
}
export default SecurityCode;

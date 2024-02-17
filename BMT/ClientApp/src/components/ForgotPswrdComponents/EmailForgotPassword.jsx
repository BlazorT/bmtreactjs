import React, { useState } from 'react';

import { formValidator } from 'src/helpers/formValidator';
import { cilEnvelopeClosed } from '@coreui/icons';

import moment from 'moment';
import CustomInput from '../InputsComponent/CustomInput';
import useApi from 'src/hooks/useApi';
import Button from '../InputsComponent/Button';
import LoadingBtn from '../UI/LoadingBtn';
import { useShowToast } from 'src/hooks/useShowToast';

function EmailForgotPassword(prop) {
  const { setOnTaskName, setToken, email, setEmail } = prop;

  const { data, loading, error, postData } = useApi('/BlazorApi/forgot');
  const showToast = useShowToast();

  const onSend = async () => {
    const form = document.querySelector('.forgot-password-form');
    formValidator();
    if (form.checkValidity()) {
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
        createdAt: moment().utc().format(),
        createdBy: 0,
      };

      const emailRes = await postData(forgotPassword);
      console.log({ emailRes });

      if (emailRes.status === true) {
        setToken(emailRes.data.token);
        showToast(
          `Token successfully sent to ${email}, please check your email for further instructions.`,
        );
        setOnTaskName('securityCode');
      } else {
        if (emailRes.message === '') showToast('Email does not exist or in valid', 'error');
        else showToast(emailRes.message, 'error');
      }
    }
  };

  const handleForotPassword = (event) => {
    setEmail(event.target.value.replace(/\s/g, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="needs-validation forgot-password-form" onSubmit={handleSubmit} noValidate>
      <div className="centerimage">
        <img className="forgot-password-img" src="4dspslogo.svg" alt="logo" />
      </div>
      <div className="text-leftside">
        <h2 className="forgot-password-title text-center">Forgot Password ?</h2>
        <p className="forgot-password-email-title text-start ">
          Forgotten your password? Enter your email address | login name to begin reset process. After successful submission of reset request, your account will become dorment untill security code is applied and password retreival will automatically activate account.
        </p>
      </div>
      <div className="mt-3">
        <CustomInput
          label="Email"
          value={email}
          autoComplete="off"
          onChange={handleForotPassword}
          icon={cilEnvelopeClosed}
          type="text"
          id="email"
          name="email"
          disabled={loading}
          placeholder="Enter email or user id"
          isRequired={true}
          message="Enter email or user id"
          title="Enter email or user id"
        />
      </div>
      <div className="centerimage">
        {loading ? (
          <LoadingBtn title="Generating Token..." />
        ) : (
          <React.Fragment>
            <Button title="Send" type="submit" onClick={onSend} />
          </React.Fragment>
        )}
      </div>
    </form>
  );
}
export default EmailForgotPassword;

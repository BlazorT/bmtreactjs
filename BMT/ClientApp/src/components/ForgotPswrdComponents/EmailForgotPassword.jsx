import { cilEnvelopeClosed } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import { formValidator } from 'src/helpers/formValidator';
import useApi from 'src/hooks/useApi';
import { useShowToast } from 'src/hooks/useShowToast';
import Button from '../InputsComponent/Button';
import CustomInput from '../InputsComponent/CustomInput';
import LoadingBtn from '../UI/LoadingBtn';

function EmailForgotPassword(prop) {
  dayjs.extend(utc);
  const { setOnTaskName, setToken, email, setEmail } = prop;

  const { loading, postData } = useApi('/BlazorApi/forgot');
  const showToast = useShowToast();

  const onSend = async () => {
    const form = document.querySelector('.forgot-password-form');
    formValidator();
    if (form.checkValidity()) {
      const forgotPassword = {
        id: 0,
        orgId: 0,
        userId: '',
        userCode: '',
        userName: '',
        firstName: '',
        lastName: '',
        email: email,
        contact: '',
        securityToken: '',
        roleId: 0,
        genderId: 0,
        password: '',
        rowVer: 0,
        status: 0,
        createdAt: dayjs().utc().subtract(5, 'y').format(),
        createdBy: 0,
      };
      console.log(forgotPassword);
      const emailRes = await postData(forgotPassword);
      console.log({ emailRes });

      if (emailRes != null && emailRes.status === true) {
        setToken(emailRes.data.token);
        showToast(
          `Token successfully sent to ${email}, please check your email for further instructions.`,
        );
        setOnTaskName('securityCode');
      } else if (emailRes != null) {
        if (emailRes.message === '') showToast('Email does not exist or in valid', 'error');
        else showToast(emailRes.message, 'error');
      }
    }
  };

  const handleForgotPassword = (event) => {
    setEmail(event.target.value.replace(/\s/g, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="needs-validation forgot-password-form" onSubmit={handleSubmit} noValidate>
      <div className="centerimage">
        <img className="forgot-password-img" src="bmtlogo.png" alt="logo" />
      </div>
      <div className="text-leftside">
        <h2 className="forgot-password-title text-center">Forgot Password ?</h2>
        <p className="forgot-password-email-title text-start ">
          Forgotten your password? Enter your email address | login name to begin reset process.
          After successful submission of reset request, your account will become dorment untill
          security code is applied and password retreival will automatically activate account.
        </p>
      </div>
      <div className="mt-3">
        <CustomInput
          label="Email"
          value={email}
          autoComplete="off"
          onChange={handleForgotPassword}
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

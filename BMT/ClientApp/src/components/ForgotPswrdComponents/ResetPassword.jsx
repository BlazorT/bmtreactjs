/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';

import { cilLockLocked } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { formValidator } from 'src/helpers/formValidator';
import useApi from 'src/hooks/useApi';
import { useShowToast } from 'src/hooks/useShowToast';
import Button from '../InputsComponent/Button';
import CustomInput from '../InputsComponent/CustomInput';
import LoadingBtn from '../UI/LoadingBtn';
//import moment from 'moment';
import { CCol, CRow } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { checkPasswordStrength } from 'src/helpers/getPasswordStrength';

function ResetPassword(prop) {
  dayjs.extend(utc);
  const { token, email, setOnTaskName } = prop;

  const { loading, postData } = useApi('/BlazorApi/forgot');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const showToast = useShowToast();

  const changePassword = async () => {
    const form = document.querySelector('.forgot-password-form');
    formValidator();
    if (form.checkValidity()) {
      if (password === confirmPassword) {
        const forgotPassword = {
          id: 0,
          dspid: 0,
          userId: '',
          userName: '',
          firstName: '',
          lastName: '',
          email: email,
          primaryContact: '',
          token: token,
          roleId: 0,
          password: btoa(password),
          rowVer: 0,
          status: 0,
          createdAt: dayjs().utc().format(),
          createdBy: 0,
        };

        const passRes = await postData(forgotPassword);
        if (passRes.status === true) {
          showToast('Password is reset successful, log in with your new credentials.');
          navigateToSignIn();
        } else {
          showToast(
            'Apologies, token might be expried; kindly retry later and contact support team',
            'error',
          );
        }
      } else showToast('Password and Confirm Password does not match', 'warning');
    }
  };

  const navigateToSignIn = () => {
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="needs-validation forgot-password-form " onSubmit={handleSubmit} noValidate>
      <div className="centerimage">
        <img className="forgot-password-img" src="bmtlogo.png" alt="logo" />
      </div>
      <div className="text-leftside mb-3">
        <h2 className="forgot-password-title text-center ">Reset Password</h2>
        <p className="forgot-password-email-title">
          This allows you to change password, need to set new password, will be logged out and need
          to login again.
        </p>
      </div>
      <CRow className="justify-content-center align-items-center">
        <CCol>
          {/* <div className="Password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control item"
              value={password}
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              id="password"
              placeholder="Password"
            />
            <FontAwesomeIcon
              onClick={togglePasswordVisibility}
              icon={showPassword ? faEyeSlash : faEye}
              className="Eye-icon"
            />

          </div> */}
          <CustomInput
            label="New Password"
            value={password}
            autoComplete="off"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            icon={cilLockLocked}
            type="password"
            id="password"
            name="password"
            disabled={loading}
            placeholder="xxxxxxxx"
            isRequired={true}
            message="Enter password"
            title="Enter password"
          />
        </CCol>
        {/* <CCol md={1} className="mt-3">
          <FontAwesomeIcon
            className=""
            onClick={() => togglePasswordVisibility(2)}
            icon={showConfirmPassword ? faEyeSlash : faEye}
            // className="Eye-icon"
          />
        </CCol> */}
      </CRow>
      <CustomInput
        label="Confirm New Password"
        value={confirmPassword}
        autoComplete="off"
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon={cilLockLocked}
        type={'text'}
        id="confirmPassword"
        name="confirmPassword"
        disabled={loading}
        placeholder="xxxxxxxx"
        isRequired={true}
        message="Enter confirm password"
        title="Enter confirm password"
      />
      {/* <div className="w-100"> */}
      {password !== '' && (
        <p className="password-strength">Password Strength :{checkPasswordStrength(password)}</p>
      )}

      {/* </div> */}
      {/* <div className="w-100 d-flex flex-column align-items-center mt-2 ">
        <label htmlFor="password" className="login_label m-0 p-0 labelName">
          Password
        </label>
        <div className="input-group position-relative" style={{ justifyContent: 'center' }}>
          <span
            className="input-group-addon"
            title="Email Address"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <CIcon className="stock-toggle-icon mandatory-control" icon={cilLockLocked}></CIcon>
          </span>
          <div style={{ minWidth: '30%', maxWidth: '80%' }} className="form-outline text-start">
            <div className="Password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                style={{ maxWidth: '100%', borderRadius: 'none' }}
                className="form-control item forgot-password-email-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                id="password"
                placeholder="xxxxxxxx"
              />
              <FontAwesomeIcon
                onClick={() => togglePasswordVisibility(1)}
                icon={showPassword ? faEyeSlash : faEye}
                className="Eye-icon"
              />
            </div>
          </div>
        </div>

        <label htmlFor="" style={{ width: '32%' }} className="login_label m-0 p-0 labelName mt-2">
          Confirm Password
        </label>
        <div className="input-group position-relative" style={{ justifyContent: 'center' }}>
          <span
            className="input-group-addon"
            title="Email Address"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <CIcon className="stock-toggle-icon mandatory-control" icon={cilLockLocked}></CIcon>
          </span>
          <div style={{ minWidth: '30%', maxWidth: '80%' }} className="form-outline text-start">
            <div className="Password-field">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                style={{ maxWidth: '100%', borderRadius: 'none' }}
                className="form-control bgTextbox item forgot-password-email-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                name="confirmPassword"
                placeholder="xxxxxxxx"
              />
              <FontAwesomeIcon
                onClick={() => togglePasswordVisibility(2)}
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="Eye-icon"
              />
            </div>
          </div>
        </div>
      </div> */}

      <div className="centerimage mt-2">
        {loading ? (
          <LoadingBtn title="Reseting password..." />
        ) : (
          <div>
            <Button title="Back" onClick={() => setOnTaskName('securityCode')} />
            <Button title="Cancel" onClick={navigateToSignIn} />
            <Button title="Submit" type="submit" onClick={changePassword} />
          </div>
        )}
      </div>
    </form>
  );
}
export default ResetPassword;

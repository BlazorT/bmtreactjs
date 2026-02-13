/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import { CCol, CRow } from '@coreui/react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector } from 'react-redux';
import { formatDate } from 'src/helpers/formatDate';
import { useShowToast } from 'src/hooks/useShowToast';
import Button from '../InputsComponent/Button';
import useApi from 'src/hooks/useApi';

import { useNavigate } from 'react-router-dom';
import LoadingBtn from '../UI/LoadingBtn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { checkPasswordStrength } from 'src/helpers/getPasswordStrength';

function UserProfileModal({ toggle, isOpen, isChangePassword }) {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { loading, postData } = useApi('/BlazorApi/changepassword');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fields = [
    ...(user?.userInfo?.userName
      ? [
          {
            label: 'Login Name',
            value: user.userInfo.userName,
          },
        ]
      : []),
    {
      label: 'Full Name',
      value: user.userInfo.fullName,
    },
    {
      label: 'Email',
      value: user.userInfo.email,
    },
    {
      label: 'Date Of Joining',
      value: formatDate(user.userInfo.doj),
    },
    ...(user?.userInfo?.userContact
      ? [
          {
            label: 'Contact',
            value: user.userInfo.userContact,
          },
        ]
      : []),
    {
      label: 'Organization',
      value: user?.orgInfo?.name || '',
    },
  ];

  const changePassword = async () => {
    if (password === confirmPassword && (password !== '' || confirmPassword !== '')) {
      const forgotPassword = {
        id: user.userInfo.id,
        password: btoa(password),
        email: '',
        lastName: '',
        primaryContact: '',
        userId: '',
        userName: '',
        status: 1,
      };
      const passRes = await postData(forgotPassword);
      //console.log({ passRes, forgotPassword });

      if (passRes.status === true) {
        toggle();
        showToast('Password reset successful; log in with your new credentials.');
        navigate('/');
      } else {
        showToast(
          'Apologies, token might be expried; kindly retry later and contact support if needed.',
          'error',
        );
      }
    } else showToast('Password and Confirm Password does not match', 'warning');
  };

  const closeWindow = () => {
    toggle();
    setPassword('');
    setConfirmPassword('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      backdrop={true}
      fullscreen="lg"
      className="user-profile-modal"
      centered={true}
      toggle={toggle}
    >
      {/* <ModalHeader className="confirmation-modal-header">{header}</ModalHeader> */}
      <ModalBody className="confirmation-modal-body rounded ">
        <CRow>
          <CCol md={3} className="text-left">
            <img
              className="user-profile-img"
              src={user.userInfo.avatar ? user.userInfo.avatar : 'defaultImg.jpg'}
              alt="logo"
            />
          </CCol>
          <CCol md={9} className="text-left align-self-center">
            <h4 className="profile-user-name">{user.userInfo.fullName}</h4>
            <p className="profile-user-email">{user.userInfo.email}</p>
            <p className="profile-user-email">{user.userInfo.id}</p>
            <p className="profile-user-role">{user.userInfo.userRole}</p>
          </CCol>
        </CRow>
        <CRow className="text-left mt-3 mb-3 border-bottom-custom"></CRow>
        {!isChangePassword ? (
          <React.Fragment>
            {fields.map((data, index) => (
              <CRow key={index} className="mb-3">
                <CCol md={3}>
                  <label htmlFor="" className="profile-user-labels mt-2">
                    {data.label}
                  </label>
                </CCol>
                <CCol md={9}>
                  <input
                    type={data.label === 'Password' ? 'password' : 'text'}
                    className="form-control item user-profile-input"
                    id={data.label}
                    name={data.label}
                    placeholder={data.label}
                    value={data.value}
                    disabled
                  />
                </CCol>
              </CRow>
            ))}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <CRow className="mb-3">
              <CCol md={3}>
                <label htmlFor="" className="profile-user-labels mt-2">
                  Password
                </label>
              </CCol>
              <CCol md={9}>
                <div className="Password-field">
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
                </div>
              </CCol>
            </CRow>
            <CRow>
              <CCol md={3}>
                <label htmlFor="" className="profile-user-labels mt-2">
                  Confirm Password
                </label>
              </CCol>
              <CCol md={9}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control item user-profile-input"
                  id={'confirmPassword'}
                  name={'confirmPassword'}
                  placeholder={'Confirm Password'}
                  value={confirmPassword}
                  autoComplete="off"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </CCol>
            </CRow>
            {password !== '' && (
              <p className="password-strength">
                Password Strength:
                {checkPasswordStrength(password)}
              </p>
            )}
          </React.Fragment>
        )}
      </ModalBody>
      <ModalFooter className="confirmation-modal-footer">
        {loading ? (
          <LoadingBtn title="Reseting Password" />
        ) : (
          <React.Fragment>
            <Button title="Close" onClick={closeWindow} />
            {isChangePassword && <Button title="Save" onClick={changePassword} />}
          </React.Fragment>
        )}
      </ModalFooter>
    </Modal>
  );
}
export default UserProfileModal;

/* eslint-disable react/prop-types */
import { CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useState } from 'react';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import Button from '../UI/Button';
import useApi from 'src/hooks/useApi';
import validateEmail from 'src/helpers/validateEmail';
import { useShowToast } from 'src/hooks/useShowToast';
import CustomInput from '../InputsComponent/CustomInput';
import { cibMailchimp, cibMailRu, cibMinutemailer } from '@coreui/icons';

const SendTestEmailModel = ({ isOpen, toggle, subject, body, title }) => {
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();
  const { postData, loading } = useApi('http://192.168.18.163:5000/email/send');
  const [email, setEmail] = useState('');
  const onSubmit = async () => {
    if (!validateEmail(email)) {
      showToast('Enter valid email address!', 'error');
      return;
    }

    const res = await postData({
      recipient: email,
      body,
      subject,
      title,
    });

    if (res?.success) {
      showToast(res?.message, 'success');
      toggle();
      setEmail('');
    } else {
      showToast(res?.message, 'error');
    }
  };

  const onYes = () => {
    showConfirmation({ isOpen: false });
    toggle();
  };

  const confirmationModal = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel?',
      isOpen: true,
      onYes: () => onYes(),
      onNo: () =>
        showConfirmation({
          isOpen: false,
        }),
    });
  };
  return (
    <CModal
      visible={isOpen}
      alignment="center"
      aria-labelledby="email-send"
      aria-describedby="email-send-full-view"
      backdrop="static"
      className="email-send-modal"
    >
      <CModalHeader closeButton={false}>
        <CModalTitle>Send Test Email</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CCol xl={12} className="">
          <CustomInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={'Enter Email'}
            type={'email'}
            icon={cibMailRu}
            className="form-control item"
            id="email"
            name="email"
            disabled={loading}
          />
        </CCol>
        {/* Render the template prop if provided, otherwise show a default message */}
      </CModalBody>
      <CModalFooter>
        <Button title="Cancel" onClick={confirmationModal} disabled={loading} />

        <Button title="Send" onClick={onSubmit} type="submit" loading={loading} />
      </CModalFooter>
    </CModal>
  );
};

export default SendTestEmailModel;

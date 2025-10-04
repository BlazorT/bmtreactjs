/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { cibMailRu } from '@coreui/icons';
import { CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { useState } from 'react';
import validateEmail from 'src/helpers/validateEmail';
import useApi from 'src/hooks/useApi';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import CustomInput from '../InputsComponent/CustomInput';
import Button from '../UI/Button';

const SendTestEmailModel = ({
  isOpen,
  toggle,
  subject,
  body,
  title,
  smtpport,
  smtppswd,
  smtpserver,
  smtpuser,
  ssl,
  sender,
}) => {
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
      smtpport,
      smtppswd,
      smtpserver,
      smtpuser,
      ssl,
      sender,
    });
    if (res?.success) {
      showToast(res?.message, 'success');
      toggle();
      setEmail('');
    } else {
      showToast(res?.error?.message || res?.message, 'error');
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

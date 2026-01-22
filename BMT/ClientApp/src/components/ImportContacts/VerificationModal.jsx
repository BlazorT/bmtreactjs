/* eslint-disable react/prop-types */
// ============================================================================
// COMPONENT: VerificationModal.jsx
// ============================================================================
import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import Button from 'src/components/UI/Button';

const VerificationModal = ({ visible, onClose, onVerify, verification }) => {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (verification.verifyCode(code)) {
      setCode('');
      onVerify();
    }
  };

  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle>Enter Verification Code</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAlert color="info">
          <CIcon icon={cilInfo} className="me-2" />A verification email has been sent to the
          organization admin. Once they approve, you will receive a 6-digit code via email. Enter
          that code below.
        </CAlert>
        <CustomInput
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          width="w-100"
          maxLength={6}
        />
      </CModalBody>
      <CModalFooter>
        <Button title="Cancel" onClick={onClose} />
        <Button
          title="Verify & Import"
          onClick={handleVerify}
          className="w-auto px-2"
          disabled={code.length !== 6}
        />
      </CModalFooter>
    </CModal>
  );
};

export default VerificationModal;

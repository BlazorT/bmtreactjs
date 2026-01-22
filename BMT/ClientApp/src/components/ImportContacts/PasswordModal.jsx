/* eslint-disable react/prop-types */
// ============================================================================
// COMPONENT: PasswordModal.jsx
// ============================================================================
import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import { cilLockLocked } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import Button from 'src/components/UI/Button';

const PasswordModal = ({ visible, onClose, onSubmit, loading }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(password);
    setPassword('');
  };

  return (
    <CModal visible={visible} alignment="center" backdrop="static" size="lg" onClose={onClose}>
      <CModalHeader closeButton>
        <CModalTitle>Prove your identity</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p className="text-muted mb-3">Please enter your password to send verification email.</p>
        <CustomInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          icon={cilLockLocked}
          isRequired={true}
        />
      </CModalBody>
      <CModalFooter>
        <Button title="Verify" onClick={handleSubmit} className="w-auto px-4" loading={loading} />
        <Button title="Cancel" onClick={onClose} className="w-auto px-4" disabled={loading} />
      </CModalFooter>
    </CModal>
  );
};

export default PasswordModal;

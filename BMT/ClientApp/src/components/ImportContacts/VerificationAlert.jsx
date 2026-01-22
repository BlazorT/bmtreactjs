/* eslint-disable react/prop-types */
// ============================================================================
// COMPONENT: VerificationAlert.jsx
// ============================================================================
import React from 'react';
import { CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilLockUnlocked } from '@coreui/icons';
import Button from 'src/components/UI/Button';

const VerificationAlert = ({ onSendVerification, loading, isVerified }) => {
  if (isVerified) {
    return (
      <CAlert color="success" className="d-flex align-items-center">
        <CIcon icon={cilLockUnlocked} className="me-2" />
        <span>Organization verified! You can now select albums to import.</span>
      </CAlert>
    );
  }

  return (
    <CAlert color="warning" className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <CIcon icon={cilLockLocked} className="me-2" />
        <span>You need to verify this organization before importing albums.</span>
      </div>
      <Button
        title="Send Verification Request"
        onClick={onSendVerification}
        className="w-auto"
        disabled={loading}
        loading={loading}
      />
    </CAlert>
  );
};

export default VerificationAlert;

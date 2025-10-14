/* eslint-disable react/prop-types */
import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CSpinner } from '@coreui/react';
import { cilClock } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const JCInitiateLoading = ({ isOpen }) => {
  return (
    <CModal visible={isOpen} alignment="center" backdrop="static">
      <CModalHeader className="justify-content-center">
        <CModalTitle>Awaiting JazzCash Payment</CModalTitle>
      </CModalHeader>

      <CModalBody className="text-center d-flex flex-column align-items-center">
        <CSpinner color="primary" className="mb-3" />
        <p className="small mb-2" style={{ maxWidth: '350px' }}>
          Your payment request has been sent to the JazzCash app. Please open the app and approve
          the transaction to complete your order.
        </p>
        <p className="small d-flex align-items-center">
          <CIcon icon={cilClock} className="me-1" />
          If the payment isn&apos;t confirmed within 10 minutes, the request will be canceled
          automatically.
        </p>
      </CModalBody>
    </CModal>
  );
};

export default JCInitiateLoading;

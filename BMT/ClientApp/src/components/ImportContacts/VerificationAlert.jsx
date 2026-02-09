/* eslint-disable react/prop-types */
// ============================================================================
// COMPONENT: VerificationAlert.jsx - Updated with DB status
// ============================================================================
import React from 'react';
import { CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo, cilCheckCircle, cilClock } from '@coreui/icons';
import Button from 'src/components/UI/Button';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const VerificationAlert = ({ onSendVerification, loading, verificationData }) => {
  const getAlertColor = () => {
    if (!verificationData) return 'info';

    if (verificationData.status === 1) {
      // Pending - check if expired
      const now = new Date();
      const expiry = new Date(verificationData.authexpiry);
      return now > expiry ? 'warning' : 'info';
    }

    return 'info';
  };

  const getAlertMessage = () => {
    if (!verificationData) {
      return {
        icon: cilInfo,
        title: 'Verification Required',
        message: 'To import albums from this organization, you need approval from their admin.',
        action: 'Send Verification Request',
      };
    }

    if (verificationData.status === 1) {
      const now = new Date();
      const expiry = new Date(verificationData.authexpiry);
      const isExpired = now > expiry;

      if (isExpired) {
        return {
          icon: cilClock,
          title: 'Verification Expired',
          message: 'Your previous verification request has expired. Please send a new request.',
          action: 'Resend Verification Request',
        };
      }

      return {
        icon: cilClock,
        title: 'Verification Pending',
        message: `A verification email has been sent to the organization admin. The request will expire ${dayjs(expiry).fromNow()}.`,
        action: 'Resend Verification Request',
      };
    }

    if (verificationData.status === 2) {
      return {
        icon: cilCheckCircle,
        title: 'Verified',
        message: 'This organization has been verified. You can now import albums.',
        action: null,
      };
    }

    if (verificationData.status === 3) {
      return {
        icon: cilInfo,
        title: 'Request Rejected',
        message: 'Your previous import request was rejected. You can send a new request.',
        action: 'Send New Verification Request',
      };
    }

    return {
      icon: cilInfo,
      title: 'Verification Required',
      message: 'To import albums from this organization, you need approval from their admin.',
      action: 'Send Verification Request',
    };
  };

  const alertData = getAlertMessage();

  return (
    <CAlert color={getAlertColor()} className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-start">
        <CIcon icon={alertData.icon} className="me-2 mt-1" size="lg" />
        <div>
          <strong>{alertData.title}</strong>
          <p className="mb-0 mt-1">{alertData.message}</p>
          {verificationData?.status === 1 && !loading && (
            <small className="text-muted">
              Request ID: {verificationData.id} | Created:{' '}
              {dayjs(verificationData.createdAt).format('MMM DD, YYYY HH:mm')}
            </small>
          )}
        </div>
      </div>
      {alertData.action && (
        <Button
          title={alertData.action}
          onClick={onSendVerification}
          loading={loading}
          className="ms-3 btn-sm w-auto px-3"
        />
      )}
    </CAlert>
  );
};

export default VerificationAlert;

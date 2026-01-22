/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CAlert, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilWarning, cilX } from '@coreui/icons';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const VerifyImportRequest = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [requestInfo, setRequestInfo] = useState(null);

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const orgId = urlParams.get('orgId');
  const requesterId = urlParams.get('requesterId');
  const requesterOrgId = urlParams.get('requesterOrgId');
  const requesterOrgName = urlParams.get('requesterOrgName');

  useEffect(() => {
    validateRequest();
  }, [user]);

  const validateRequest = async () => {
    if (!user || user?.orgId !== orgId || user?.roleId !== 2) {
      setError('Invalid verification link');
      setLoading(false);
      return;
    }
    if (!token || !orgId || !requesterId) {
      setError('Invalid verification link');
      return;
    }

    // Check if verification exists in localStorage
    const key = `album_import_verification_${orgId}`;
    const stored = localStorage.getItem(key);

    if (!stored) {
      setError('Verification request not found or has expired');
      setLoading(false);
      return;
    }

    try {
      const data = JSON.parse(stored);
      const now = new Date().getTime();

      // Check if expired
      if (now > data.expiresAt) {
        setError('Verification link has expired (24 hours limit)');
        setLoading(false);
        return;
      }

      // Check if token matches
      if (data.token !== token) {
        setError('Invalid verification token');
        setLoading(false);
        return;
      }

      // Check if already verified
      if (data.verified) {
        setError('This request has already been verified');
        setLoading(false);
        return;
      }

      setRequestInfo({
        orgId,
        requesterId,
        requesterOrgId,
        code: data.code,
        requestedAt: data.requestedAt,
      });
      setLoading(false);
    } catch (e) {
      console.error('Error validating request:', e);
      setError('Error validating verification request');
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);

    try {
      // Send verification code to super admin via email
      const emailBody = {
        networkId: 3,
        recipients: ['superadmin@example.com'], // Replace with actual super admin email
        subject: 'Album Import Verification Code',
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Import Request Approved!</h2>
            <p>Your request to import albums has been approved by the organization admin.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your Verification Code:</p>
              <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; margin: 10px 0;">
                ${requestInfo.code}
              </h1>
            </div>

            <p>Please enter this code in the import interface to complete the verification process.</p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0;">
                <strong>Note:</strong> This code will expire in 24 hours from the time of request.
              </p>
            </div>

            <p style="color: #666; font-size: 12px;">Request ID: ${requesterId}</p>
            <p style="color: #666; font-size: 12px;">Organization ID: ${orgId}</p>
          </div>
        `,
        title: 'Album Import Verification',
        notificationPriority: 'immediate',
        attachments: [],
      };

      const response = await fetch('http://192.168.18.203:5001/send/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailBody),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code email');
      }

      // Mark as verified (but not completed - super admin still needs to enter code)
      const key = `album_import_verification_${orgId}`;
      const stored = localStorage.getItem(key);

      if (stored) {
        const data = JSON.parse(stored);
        data.adminApproved = true;
        data.approvedAt = new Date().getTime();
        localStorage.setItem(key, JSON.stringify(data));
      }

      setVerified(true);
      setLoading(false);
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Failed to send verification code. Please try again.');
      setLoading(false);
    }
  };

  const handleReject = () => {
    const key = `album_import_verification_${orgId}`;
    localStorage.removeItem(key);
    window.location.href = '/';
  };

  const goToDashboard = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <CSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <CCard>
              <CCardHeader className="bg-danger text-white">
                <h5 className="mb-0">
                  <CIcon icon={cilX} className="me-2" />
                  Verification Error
                </h5>
              </CCardHeader>
              <CCardBody>
                <CAlert color="danger" className="mb-0">
                  {error}
                </CAlert>
                <div className="mt-3 text-center">
                  <button className="btn btn-primary" onClick={goToDashboard}>
                    Go to Dashboard
                  </button>
                </div>
              </CCardBody>
            </CCard>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <CCard>
              <CCardHeader className="bg-success text-white">
                <h5 className="mb-0">
                  <CIcon icon={cilCheckCircle} className="me-2" />
                  Request Approved!
                </h5>
              </CCardHeader>
              <CCardBody>
                <CAlert color="success">
                  <h6>Verification Successful</h6>
                  <p className="mb-0">
                    The verification code has been sent to the requester's email. They can now
                    complete the import process.
                  </p>
                </CAlert>
                <div className="mt-3 text-center">
                  <button className="btn btn-primary" onClick={goToDashboard}>
                    Close
                  </button>
                </div>
              </CCardBody>
            </CCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <CCard>
            <CCardHeader>
              <h5 className="mb-0">Album Import Request Verification</h5>
            </CCardHeader>
            <CCardBody>
              <CAlert color="info">
                <CIcon icon={cilWarning} className="me-2" />
                <strong>Action Required:</strong> Another organization is requesting to import
                albums from your organization.
              </CAlert>

              <div className="mt-4">
                <h6 className="mb-3">Request Details:</h6>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th className="text-white" style={{ width: '40%' }}>
                        Requester Organization ID:
                      </th>
                      <td className="text-white">{requesterOrgId}</td>
                    </tr>
                    <tr>
                      <th className="text-white">Requester User ID:</th>
                      <td className="text-white">{requesterId}</td>
                    </tr>
                    <tr>
                      <th className="text-white">Your Organization ID:</th>
                      <td className="text-white">{orgId}</td>
                    </tr>
                    <tr>
                      <th className="text-white">Request Date:</th>
                      <td className="text-white">
                        {requestInfo?.requestedAt
                          ? dayjs(requestInfo.requestedAt).format('MMM DD, YYYY hh:mm A')
                          : 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <CAlert color="warning" className="mt-4">
                <h6>Important Information:</h6>
                <ul className="mb-0">
                  <li>
                    Approving this request will allow the requester to <strong>copy</strong> your
                    albums and recipients to their organization.
                  </li>
                  <li>
                    Your original data will <strong>remain intact</strong> - nothing will be removed
                    from your organization.
                  </li>
                  <li>
                    The requester will receive a verification code to complete the import process.
                  </li>
                  <li>This verification link expires in 24 hours from the time of request.</li>
                </ul>
              </CAlert>

              <div className="mt-4 d-flex gap-3 justify-content-center">
                <button className="btn btn-danger" onClick={handleReject}>
                  Reject Request
                </button>
                <button className="btn btn-success" onClick={handleApprove} disabled={loading}>
                  {loading ? 'Processing...' : 'Approve Request'}
                </button>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </div>
  );
};

export default VerifyImportRequest;

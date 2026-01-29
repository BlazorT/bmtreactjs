/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
import { cilCheckCircle, cilWarning, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CAlert, CCard, CCardBody, CCardHeader } from '@coreui/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PasswordModal from 'src/components/ImportContacts/PasswordModal';
import AppContainer from 'src/components/UI/AppContainer';
import Button from 'src/components/UI/Button';
import Loading from 'src/components/UI/Loading';
import useApi from 'src/hooks/useApi';
import { useShowToast } from 'src/hooks/useShowToast';
import { setUserData } from 'src/redux/user/userSlice';

const VerifyImportRequest = () => {
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const user = useSelector((state) => state.user);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [requestInfo, setRequestInfo] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { postData: sendEmail, loading: emailLoading } = useApi(
    process.env.REACT_APP_BMT_SERVIVE + '/send/message',
    'POST',
    null,
    {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.socialApiKey || ''}`,
    },
  );

  const { postData: getSocialApiKey, loading: passwordLoading } = useApi(
    process.env.REACT_APP_BMT_SERVIVE + '/auth/login',
  );

  const {
    postData: getOrgs,
    loading: orgsLoading,
    data: orgsData,
  } = useApi('/BlazorApi/orgsfulldata');

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const orgId = urlParams.get('orgId');
  const requesterId = urlParams.get('requesterId');
  const requesterOrgId = urlParams.get('requesterOrgId');
  const requesterOrgName = urlParams.get('requesterOrgName');
  const code = urlParams.get('code');
  const expiresAt = urlParams.get('expiresAt');

  useEffect(() => {
    if (!user) return;
    validateRequest();
    fetchInitialData();
  }, [user]);

  const fetchInitialData = async () => {
    const orgsBody = {
      id: 0,
      roleId: 0,
      orgId: 0,
      email: '',
      name: '',
      contact: '',
      rowVer: 0,
      cityId: 0,
      status: 0,
      createdAt: dayjs().utc().subtract(5, 'year').format('YYYY-MM-DD'),
      lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
      createdBy: 0,
      lastUpdatedBy: 0,
    };
    await getOrgs(orgsBody);
  };

  const validateRequest = async () => {
    if (!user || user?.orgId != orgId || user?.roleId != 2) {
      setError('Invalid verification link');
      return;
    }
    if (!orgId || !requesterId || !code || !expiresAt) {
      setError('Invalid verification link');
      return;
    }

    // Check if verification exists in localStorage

    try {
      const now = new Date().getTime();

      // Check if expired
      if (now > expiresAt) {
        setError('Verification link has expired (24 hours limit)');
        return;
      }

      setRequestInfo({
        orgId,
        requesterId,
        requesterOrgId,
        code: code,
      });
    } catch (e) {
      console.error('Error validating request:', e);
      setError('Error validating verification request');
    }
  };

  const org = orgsData?.data?.find((o) => o.id == orgId);

  const handleApprove = async () => {
    try {
      // Send verification code to super admin via email
      const org = orgsData?.data?.find((o) => o.id == orgId);
      if (!org || !org?.email) {
        setError('Failed to get organization. Please try again.');
        return;
      }
      const emailBody = {
        networkId: 3,
        recipients: [org?.email], // Replace with actual super admin email
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

      const { response, status } = await sendEmail(emailBody, true);

      if (status === 401) {
        showToast(response?.error?.code + ': ' + response?.error?.message, 'warning');
        setShowPasswordModal(true);
        return;
      }

      if (response?.success) {
        setVerified(true);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Failed to send verification code. Please try again.');
    }
  };
  const handlePasswordSubmit = async (password) => {
    if (!password) {
      showToast('Password is required', 'error');
      return;
    }

    try {
      const { response: data, status } = await getSocialApiKey(
        {
          email: user?.userInfo?.email,
          password,
        },
        true,
      );

      if (status !== 200) {
        showToast(data?.error?.code + ': ' + data?.error?.message, 'error');
        return;
      }

      if (data?.token) {
        showToast('Access key generated', 'success');
        dispatch(
          setUserData({
            socialApiKey: data?.token,
          }),
        );
        setShowPasswordModal(false);
        setTimeout(() => {
          handleApprove();
        }, 2000);
      } else {
        showToast('Authentication failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Authentication failed. Please try again.', 'error');
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

  if (emailLoading || orgsLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <AppContainer>
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
                  <Button onClick={goToDashboard} title="Go To Dashboard" className="w-auto" />
                </div>
              </CCardBody>
            </CCard>
          </div>
        </div>
      </AppContainer>
    );
  }

  if (verified) {
    return (
      <AppContainer>
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
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <PasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        loading={passwordLoading}
      />
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
                        Requester Organization:
                      </th>
                      <td className="text-white">{requesterOrgName}</td>
                    </tr>
                    <tr>
                      <th className="text-white">Requester User ID:</th>
                      <td className="text-white">{requesterId}</td>
                    </tr>
                    <tr>
                      <th className="text-white">Your Organization ID:</th>
                      <td className="text-white">{orgId}</td>
                    </tr>
                    {/* <tr>
                      <th className="text-white">Request Date:</th>
                      <td className="text-white">
                        {expiresAt
                          ? dayjs(expiresAt).subtract(24, 'hours').format('MMM DD, YYYY hh:mm A')
                          : 'N/A'}
                      </td>
                    </tr> */}
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
                <button className="btn btn-success" onClick={handleApprove} disabled={emailLoading}>
                  {emailLoading ? 'Processing...' : 'Approve Request'}
                </button>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
    </AppContainer>
  );
};

export default VerifyImportRequest;

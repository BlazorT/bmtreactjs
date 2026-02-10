/* eslint-disable no-undef */
// ============================================================================
// HOOK: useVerification.js - Database-based verification
// ============================================================================
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from 'src/redux/user/userSlice';
import useApi from 'src/hooks/useApi';
import dayjs from 'dayjs';

export const useVerification = (user, selectedOrg, showToast) => {
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);

  // API Hooks
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

  const { postData: createOrUpdateRequest, loading: requestLoading } = useApi(
    '/Organization/addupdateapprequest',
  );

  const { postData: getApprovalRequests, loading: checkLoading } = useApi(
    '/Organization/approvalrequests',
  );

  /**
   * Check if there's an existing pending request for this org
   */
  const checkExistingRequest = useCallback(async () => {
    if (!selectedOrg) return null;

    try {
      const { response, status } = await getApprovalRequests(
        {
          id: 0,
          orgId: user.orgId,
          targetorgid: selectedOrg.id,
          createdAt: dayjs().subtract(7, 'days').format(),
          lastUpdatedAt: dayjs().utc().format(),
          status: 1, // Pending status
          rowVer: 1,
        },
        true,
      );

      if (status === 200 && response?.data?.length > 0) {
        const findExistingReq = response?.data?.find((r) => r?.targetorgid == selectedOrg.id);
        if (!findExistingReq) return null;
        // Find the most recent pending request
        const pendingRequest = findExistingReq;

        // Check if it's still valid (not expired)
        if (pendingRequest.authexpiry) {
          const expiryDate = new Date(pendingRequest.authexpiry);
          const now = new Date();

          if (now < expiryDate) {
            return pendingRequest;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error checking existing request:', error);
      return null;
    }
  }, [selectedOrg, user.orgId]);

  /**
   * Check verification status from database
   */
  const checkStatus = useCallback(async () => {
    if (!selectedOrg) return;

    const existingRequest = await checkExistingRequest();

    if (existingRequest) {
      setCurrentRequestId(existingRequest.id);
      setVerificationData(existingRequest);

      // Check if approved (status = 2)
      if (existingRequest.status === 2) {
        setIsVerified(false);
        // showToast('Import request already approved', 'success');
      } else if (existingRequest.status === 1) {
        // Still pending
        setIsVerified(false);
      } else if (existingRequest.status === 3) {
        // Rejected
        setIsVerified(false);
        showToast('Previous import request was rejected', 'warning');
      }
    } else {
      setIsVerified(false);
      setVerificationData(null);
      setCurrentRequestId(null);
    }
  }, [selectedOrg, checkExistingRequest, showToast]);

  /**
   * Generate 6-digit verification code
   */
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  /**
   * Create or update approval request in database
   */
  const createApprovalRequest = async (verificationCode, expiresAt) => {
    if (!selectedOrg) return null;

    try {
      const requestBody = {
        id: currentRequestId || 0, // 0 for new, existing ID for update
        targetorgid: selectedOrg.id, // Source org (who owns the albums)
        orgId: user.orgId, // Requesting org
        albumid: 0, // Not tracking specific album for now
        description: '', // Empty for now
        remarks: '', // Empty for now
        authcode: '', // Empty for now as per requirements
        reqcode: verificationCode, // Store verification code here
        authexpiry: dayjs(expiresAt).format('YYYY-MM-DDTHH:mm:ss'),
        status: 1, // Pending
        createdBy: user.userId,
        createdAt: dayjs().format(),
        lastUpdatedBy: user.userId,
        lastUpdatedAt: dayjs().format(),
        approvalTime: null,
        rowVer: currentRequestId ? (verificationData?.rowVer || 0) + 1 : 0,
      };

      const { response, status } = await createOrUpdateRequest(requestBody, true);

      if (status === 200 && response?.data?.id) {
        setCurrentRequestId(response.data.id);
        return response.data;
      } else {
        showToast('Failed to create approval request', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error creating approval request:', error);
      showToast('Failed to create approval request', 'error');
      return null;
    }
  };

  /**
   * Send verification email to org admin
   */
  const sendVerificationEmail = async (token) => {
    if (!selectedOrg) {
      showToast('Please select an organization first', 'error');
      return false;
    }

    const verificationCode = generateVerificationCode();
    const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours

    // Create/update approval request in database
    const approvalRequest = await createApprovalRequest(verificationCode, expiresAt);

    if (!approvalRequest) {
      return false;
    }

    try {
      const orgAdminEmail = selectedOrg.email || selectedOrg.adminEmail;
      if (!orgAdminEmail) {
        showToast('Organization admin email not found', 'error');
        return false;
      }

      const approvalLink = `${window.location.origin}/ApprovalRequests/${approvalRequest.id}`;

      const emailBody = {
        networkId: 3,
        recipients: [orgAdminEmail],
        subject: `Album Import Request from ${user?.orgInfo?.name || 'Organization'}`,
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Album Import Request</h2>
            <p>Hello ${selectedOrg?.name},</p>
            <p>Organization <strong>${user?.orgInfo?.name || user.orgId}</strong> has requested to import albums from your organization.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Requester Details:</strong></p>
              <ul>
                <li>Email: ${user?.userInfo?.email}</li>
                <li>Organization: ${user?.orgInfo?.name || 'N/A'}</li>
              </ul>
            </div>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Verification Code:</strong></p>
              <h1 style="text-align: center; color: #333; letter-spacing: 5px;">${verificationCode}</h1>
              <p style="text-align: center; color: #666; font-size: 14px;">Share this code with the requester to approve their import request.</p>
            </div>

            <p>You can review this request by clicking the link below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${approvalLink}" 
                 style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Request Details
              </a>
            </div>

            <p style="color: #666; font-size: 12px;">This request will expire in 24 hours.</p>
            <p style="color: #666; font-size: 12px;">If you did not expect this request, please ignore this email or reject it from the link above.</p>
          </div>
        `,
        title: 'Album Import Verification',
        notificationPriority: 'immediate',
        attachments: [],
      };

      const { response, status } = await sendEmail(emailBody, true, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || user?.socialApiKey || ''}`,
      });

      if (status === 401) {
        showToast(response?.error?.code + ': ' + response?.error?.message, 'error');
        setShowPasswordModal(true);
        return false;
      }

      if (response?.success) {
        showToast('Verification email sent to organization admin!', 'success');
        setVerificationData(approvalRequest);
        return true;
      } else {
        showToast('Failed to send verification email', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      showToast('Failed to send verification email', 'error');
      return false;
    }
  };

  /**
   * Check if there's an active verification code
   */
  const isCodeActive = useCallback(async () => {
    if (!selectedOrg) return false;

    const existingRequest = await checkExistingRequest();

    if (!existingRequest) {
      return false;
    }

    const now = new Date().getTime();
    const expiry = new Date(existingRequest.authexpiry).getTime();

    return (now < expiry && existingRequest.status === 1) || existingRequest.status === 2; // Pending or approved and not expired
  }, [selectedOrg, checkExistingRequest]);

  /**
   * Verify the code entered by user
   */
  const verifyCode = useCallback(
    async (code) => {
      if (!selectedOrg || !currentRequestId) {
        showToast('No verification request found', 'error');
        return false;
      }

      try {
        // Fetch the current request to verify code
        const { response, status } = await getApprovalRequests(
          {
            id: currentRequestId,
            orgId: 0,
            createdAt: dayjs().subtract(7, 'days').format(),
            lastUpdatedAt: dayjs().utc().format(),
            status: 0, // Get all statuses to check current state
            rowVer: 1,
          },
          true,
        );

        if (status === 200 && response?.data?.length > 0) {
          const request = response.data[0];

          // Check if expired
          const now = new Date().getTime();
          const expiry = new Date(request.authexpiry).getTime();

          if (now > expiry) {
            showToast('Verification code expired. Please request a new one.', 'error');
            return false;
          }

          // Check if code matches
          if (code.trim() === request.reqcode) {
            // Update request status to approved (2)
            const updateBody = {
              ...request,
              status: 2, // Approved
              approvalTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              lastUpdatedBy: user.userId,
              lastUpdatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              rowVer: request.rowVer + 1,
            };

            const { status: updateStatus } = await createOrUpdateRequest(updateBody, true);

            if (updateStatus === 200) {
              setIsVerified(true);
              setVerificationData(updateBody);
              showToast('Organization verified successfully!', 'success');
              return true;
            } else {
              showToast('Failed to update verification status', 'error');
              return false;
            }
          } else {
            showToast('Invalid verification code', 'error');
            return false;
          }
        } else {
          showToast('Verification request not found', 'error');
          return false;
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        showToast('Error verifying code', 'error');
        return false;
      }
    },
    [
      selectedOrg,
      currentRequestId,
      user.userId,
      showToast,
      createOrUpdateRequest,
      getApprovalRequests,
    ],
  );

  /**
   * Handle password submission for API key generation
   */
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
          sendVerificationEmail(data?.token);
        }, 2000);
      } else {
        showToast('Authentication failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Authentication failed. Please try again.', 'error');
    }
  };

  /**
   * Reset verification state
   */
  const reset = () => {
    setIsVerified(false);
    setVerificationData(null);
    setCurrentRequestId(null);
  };

  return {
    isVerified,
    verificationData,
    currentRequestId,
    loading: emailLoading || requestLoading || checkLoading,
    showPasswordModal,
    setShowPasswordModal,
    passwordLoading,
    checkStatus,
    sendVerificationEmail,
    verifyCode,
    handlePasswordSubmit,
    reset,
    isCodeActive,
  };
};

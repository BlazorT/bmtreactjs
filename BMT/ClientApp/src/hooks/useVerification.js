/* eslint-disable no-undef */
// ============================================================================
// HOOK: useVerification.js
// ============================================================================
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from 'src/redux/user/userSlice';
import useApi from 'src/hooks/useApi';
import dayjs from 'dayjs';

const VERIFICATION_KEY_PREFIX = 'album_import_verification_';

export const useVerification = (user, selectedOrg, showToast) => {
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
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

  const checkStatus = useCallback(() => {
    if (!selectedOrg) return;

    const key = `${VERIFICATION_KEY_PREFIX}${selectedOrg.id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = new Date().getTime();

        if (data.expiresAt && now < data.expiresAt) {
          setIsVerified(data.verified);
          setVerificationData(data);
        } else {
          localStorage.removeItem(key);
          setIsVerified(false);
          setVerificationData(null);
        }
      } catch (e) {
        console.error('Error parsing verification data:', e);
        setIsVerified(false);
        setVerificationData(null);
      }
    } else {
      setIsVerified(false);
      setVerificationData(null);
    }
  }, [selectedOrg]);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async () => {
    if (!selectedOrg) {
      showToast('Please select an organization first', 'error');
      return false;
    }

    const verificationCode = generateVerificationCode();
    const token = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;

    try {
      const orgAdminEmail = selectedOrg.email || selectedOrg.adminEmail;
      if (!orgAdminEmail) {
        showToast('Organization admin email not found', 'error');
        return false;
      }

      const approvalLink = `${window.location.origin}/verify-import?code=${verificationCode}&expiresAt=${expiresAt}&orgId=${selectedOrg.id}&requesterId=${user.userId}&requesterOrgId=${user.orgId}&requesterOrgName=${user?.orgInfo?.name}`;

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

            <p>If you approve this request, please click the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${approvalLink}" 
                 style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Approve Import Request
              </a>
            </div>

            <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
            <p style="color: #666; font-size: 12px;">If you did not expect this request, please ignore this email.</p>
          </div>
        `,
        title: 'Album Import Verification',
        notificationPriority: 'immediate',
        attachments: [],
      };

      const { response, status } = await sendEmail(emailBody, true);

      if (status === 401) {
        showToast(response?.error?.code + ': ' + response?.error?.message, 'error');
        setShowPasswordModal(true);
        return false;
      }

      if (response?.success) {
        const verificationInfo = {
          orgId: selectedOrg.id,
          verified: false,
          code: verificationCode,
          token: token,
          expiresAt: expiresAt,
          requestedAt: new Date().getTime(),
        };

        localStorage.setItem(
          `${VERIFICATION_KEY_PREFIX}${selectedOrg.id}`,
          JSON.stringify(verificationInfo),
        );

        showToast('Verification email sent to organization admin!', 'success');
        return true;
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      showToast('Failed to send verification email', 'error');
      return false;
    }
  };

  const isCodeActive = useCallback(() => {
    if (!selectedOrg) return false;

    const key = `${VERIFICATION_KEY_PREFIX}${selectedOrg.id}`;
    const stored = localStorage.getItem(key);

    if (!stored) {
      return false;
    }

    try {
      const data = JSON.parse(stored);
      const now = new Date().getTime();

      if (now > data.expiresAt) {
        return false;
      }

      return true;
    } catch (e) {
      console.error('Error verifying code:', e);
      return false;
    }
  }, [selectedOrg, showToast]);

  const verifyCode = useCallback(
    (code) => {
      if (!selectedOrg) return false;

      const key = `${VERIFICATION_KEY_PREFIX}${selectedOrg.id}`;
      const stored = localStorage.getItem(key);

      if (!stored) {
        showToast('No verification request found', 'error');
        return false;
      }

      try {
        const data = JSON.parse(stored);
        const now = new Date().getTime();

        if (now > data.expiresAt) {
          localStorage.removeItem(key);
          showToast('Verification code expired. Please request a new one.', 'error');
          return false;
        }

        if (code.trim() === data.code) {
          const updatedData = { ...data, verified: true };
          localStorage.setItem(key, JSON.stringify(updatedData));

          setIsVerified(true);
          setVerificationData(updatedData);
          showToast('Organization verified successfully!', 'success');
          return true;
        } else {
          showToast('Invalid verification code', 'error');
          return false;
        }
      } catch (e) {
        console.error('Error verifying code:', e);
        showToast('Error verifying code', 'error');
        return false;
      }
    },
    [selectedOrg, showToast],
  );

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
          sendVerificationEmail();
        }, 2000);
      } else {
        showToast('Authentication failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Authentication failed. Please try again.', 'error');
    }
  };

  const reset = () => {
    setIsVerified(false);
    setVerificationData(null);
  };

  return {
    isVerified,
    verificationData,
    loading: emailLoading,
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

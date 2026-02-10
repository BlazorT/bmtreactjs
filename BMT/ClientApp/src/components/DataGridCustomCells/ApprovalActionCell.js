/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { cilCheck, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CRow, CTooltip, CBadge } from '@coreui/react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from 'src/redux/user/userSlice';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from '../UI/Spinner';
import useApi from 'src/hooks/useApi';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import PasswordModal from '../ImportContacts/PasswordModal';

export const approvalStatus = [
  {
    id: 1,
    name: 'Pending',
    color: 'warning',
    textColor: 'text-warning',
  },
  {
    id: 2,
    name: 'Approved',
    color: 'success',
    textColor: 'text-success',
  },
  {
    id: 3,
    name: 'Rejected',
    color: 'danger',
    textColor: 'text-danger',
  },
];

const ApprovalActionCell = (prop) => {
  const { value, org, fetchApprovalReq, allOrgs } = prop;
  const { id } = useParams();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // Store pending action info

  useEffect(() => {
    if (id && value.row.id == id && value.row.status === 1) {
      toggleStatus(2);
    }
  }, [value.row, id]);

  const { postData: createOrUpdateRequest, loading: requestLoading } = useApi(
    '/Organization/addupdateapprequest',
  );

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

  /**
   * Get organization details by ID
   */
  const getOrgById = (orgId) => {
    return allOrgs?.find((o) => o.id === orgId);
  };

  /**
   * Send approval/rejection email
   */
  const sendNotificationEmail = async (status, requestData, token) => {
    try {
      // Get the requesting organization (who wanted to import)
      const requestingOrg = getOrgById(requestData.targetorgid);
      const requestingOrgEmail = requestingOrg?.email || requestingOrg?.adminEmail;

      if (!requestingOrgEmail) {
        showToast('Requesting organization email not found', 'error');
        return false;
      }

      const isApproved = status === 2;
      const actionText = isApproved ? 'Approved' : 'Rejected';
      const statusColor = isApproved ? '#4CAF50' : '#f44336';

      const emailBody = {
        networkId: 3,
        recipients: [requestingOrgEmail],
        subject: `Import Request ${actionText} - ${user?.orgInfo?.name || 'Organization'}`,
        message: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: ${statusColor};">Import Request ${actionText}</h2>
            <p>Hello ${requestingOrg?.name},</p>
            <p>Your request to import albums from <strong>${user?.orgInfo?.name || user.orgId}</strong> has been <strong>${actionText.toLowerCase()}</strong>.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Request Details:</strong></p>
              <ul>
                <li>Source Organization: ${user?.orgInfo?.name || 'N/A'}</li>
                <li>Request Date: ${dayjs(requestData.createdAt).format('MMM DD, YYYY HH:mm')}</li>
                <li>Decision Date: ${dayjs().format('MMM DD, YYYY HH:mm')}</li>
                <li>Status: <span style="color: ${statusColor}; font-weight: bold;">${actionText}</span></li>
              </ul>
            </div>

            ${
              isApproved
                ? `
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
              <p><strong>✓ Your verification code:</strong></p>
              <h1 style="text-align: center; color: #333; letter-spacing: 5px; margin: 15px 0;">${requestData.reqcode}</h1>
              <p style="text-align: center; color: #666; font-size: 14px;">
                Enter this code in the Import Albums page to proceed with the import.
              </p>
            </div>
            <p>You can now proceed with importing albums from ${user?.orgInfo?.name}. Please use the verification code above when prompted.</p>
            `
                : `
            <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f44336;">
              <p><strong>✗ Request Rejected</strong></p>
              <p>Your import request has been declined. If you believe this was in error, please contact the organization directly.</p>
            </div>
            ${requestData.remarks ? `<p><strong>Remarks:</strong> ${requestData.remarks}</p>` : ''}
            `
            }

            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This is an automated notification from the Album Management System.
            </p>
          </div>
        `,
        title: `Import Request ${actionText}`,
        notificationPriority: 'immediate',
        attachments: [],
      };

      const { response, status: emailStatus } = await sendEmail(emailBody, true, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || user?.socialApiKey || ''}`,
      });
      if (emailStatus === 401) {
        showToast(response?.error?.code + ': ' + response?.error?.message, 'error');
        // Store the pending action to retry after password verification
        setPendingAction({ status, requestData });
        setShowPasswordModal(true);
        return false;
      }

      if (response?.success) {
        showToast(`${actionText} notification sent successfully!`, 'success');
        return true;
      } else {
        showToast('Failed to send notification email', 'warning');
        // Don't fail the entire operation if email fails
        return true;
      }
    } catch (error) {
      console.error('Error sending notification email:', error);
      showToast('Failed to send notification email', 'warning');
      // Don't fail the entire operation if email fails
      return true;
    }
  };

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

        // Retry the pending action
        if (pendingAction) {
          setTimeout(async () => {
            await sendNotificationEmail(
              pendingAction.status,
              pendingAction.requestData,
              data?.token,
            );
            setPendingAction(null);
          }, 1000);
        }
      } else {
        showToast('Authentication failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast('Authentication failed. Please try again.', 'error');
    }
  };

  /**
   * Show confirmation dialog
   */
  const toggleStatus = (status) => {
    const action = status === 2 ? 'approve' : 'reject';
    const requestingOrg = getOrgById(value.row.targetorgid);

    showConfirmation({
      header: 'Confirmation Required',
      body: `Are you sure you want to ${action} the import request from "${requestingOrg?.name || 'Unknown Organization'}"?`,
      isOpen: true,
      onYes: () => onYesToggle(status),
      onNo: () => onNoConfirm(),
    });
  };

  /**
   * Handle approval/rejection
   */
  const onYesToggle = async (status) => {
    onNoConfirm();

    try {
      const updateBody = {
        ...value.row,
        status,
        approvalTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        lastUpdatedAt: dayjs().utc().format(),
        lastUpdatedBy: user?.userId,
        rowVer: 1,
      };

      const response = await createOrUpdateRequest(updateBody);

      if (response?.status === true) {
        const statusName = approvalStatus.find((s) => s.id === status)?.name || '';
        showToast(`Request ${statusName.toLowerCase()} successfully`, 'success');

        // Send notification email

        const isSend = await sendNotificationEmail(status, updateBody);

        // Refresh the approval requests list
        if (isSend) await fetchApprovalReq();
      } else {
        showToast(response.message || 'Failed to update request', 'error');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      showToast('Failed to update request', 'error');
    }
  };

  /**
   * Close confirmation dialog
   */
  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  if (requestLoading || emailLoading) {
    return (
      <div className="approval-action-cell__loading">
        <Spinner />
      </div>
    );
  }

  const currentStatus = approvalStatus.find((s) => s.id === value.row.status);
  return (
    <>
      <div className="approval-action-cell">
        {value.row.status === 1 && user?.orgId === value.row?.orgId ? (
          <CRow className="g-2 justify-content-center align-items-center">
            <div className="col-auto">
              <CTooltip content="Reject Request" placement="top">
                <button
                  onClick={() => toggleStatus(3)}
                  className="approval-action-cell__btn approval-action-cell__btn--reject"
                  aria-label="Reject request"
                >
                  <CIcon icon={cilX} size="lg" />
                </button>
              </CTooltip>
            </div>
            <div className="col-auto">
              <CTooltip content="Approve Request" placement="top">
                <button
                  onClick={() => toggleStatus(2)}
                  className="approval-action-cell__btn approval-action-cell__btn--approve"
                  aria-label="Approve request"
                >
                  <CIcon icon={cilCheck} size="lg" />
                </button>
              </CTooltip>
            </div>
          </CRow>
        ) : (
          <CBadge
            color={currentStatus?.color}
            shape="rounded-pill"
            className="approval-action-cell__badge"
            // onClick={() => toggleStatus(1)}
          >
            {currentStatus?.name || 'Unknown'}
          </CBadge>
        )}
      </div>

      <PasswordModal
        visible={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPendingAction(null);
        }}
        onSubmit={handlePasswordSubmit}
        loading={passwordLoading}
      />
    </>
  );
};

export default ApprovalActionCell;

import React from 'react';
import { cilSend } from '@coreui/icons'; // ← added cilSend
//import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import { useToggleUserStatus } from 'src/hooks/api/useToggleUserStatus';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from '../UI/Spinner';

const CampaignResultActionCell = (prop) => {
  const { value } = prop;
  console.log("value", value);
  //const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { loading, /*updateStatus*/ } = useToggleUserStatus();

  // You can rename this function if you add actual resend logic later
  const handleResend = () => {
    // For now: just a placeholder confirmation + toast
    // Replace with real resend API call when you implement it
    showConfirmation({
      header: 'Resend Confirmation',
      body: `Are you sure you want to resend ${value.row?.networkId ?? '—'}   (${value.row?.recipient ?? '—'}) ?`,
      isOpen: true,
      onYes: async () => {
        // TODO: Call your real resend API here, e.g.:
        // const res = await resendInvitation(user[0].id);
        // if (res.status) { showToast('Resent successfully', 'success'); }
        showToast('Resend action triggered (placeholder)', 'success');
        showConfirmation({ isOpen: false });
      },
      onNo: () => showConfirmation({ isOpen: false }),
    });
  };

  //const toggleStatus = (status) => {
  //  showConfirmation({
  //    header: 'Confirmation!',
  //    body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'} ${user[0]?.userName || 'this user'
  //      }?`,
  //    isOpen: true,
  //    onYes: () => onYesToggle(status),
  //    onNo: () => onNoConfirm(),
  //  });
  //};

  //const onYesToggle = async (status) => {
  //  const response = await updateStatus(user, status);
  //  console.log(response, 'response');
  //  if (response.status) {
  //    showToast(`${user[0]?.userName || 'User'} ${status === 1 ? 're activated' : 'deleted'} successfully`);
  //  } else {
  //    showToast(response.message, 'error');
  //  }
  //  onNoConfirm();
  //};

  //const onNoConfirm = () => {
  //  showConfirmation({ isOpen: false });
  //};

  //const editUser = () => {
  //  navigate('/UserRegister', { state: { id: value.row.id, user: user } });
  //};

  if (loading) {
    return <Spinner />;
  }

  const row = value?.row;
  const status = row?.deliveryStatus;

  // Only show actions if there's a row and status
  if (!row) return null;

  return (
    <React.Fragment>
      <CRow>
        <CCol className="d-flex justify-content-center">
          <div className="d-flex align-items-center justify-content-center gap-4">
            

            {/* Resend icon - only when status !== 14 */}
            {status === 8 && (
              <CTooltip content="Resend Notification">
                <CIcon
                  onClick={handleResend}
                  className="stock-toggle-icon"
                  icon={cilSend}          // ← or use cilReload if preferred
                  size="lg"
                  style={{ cursor: 'pointer', color: '#007bff' }} // optional: blue for send/action
                />
              </CTooltip>
            )}
          </div>
        </CCol>
      </CRow>
    </React.Fragment>
  );
};

export default CampaignResultActionCell;

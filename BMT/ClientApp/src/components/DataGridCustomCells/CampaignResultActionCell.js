import React from 'react';
import { cilSend } from '@coreui/icons'; // ← added cilSend
//import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import { useResendNotification } from 'src/hooks/api/useResendNotification';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from '../UI/Spinner';

const CampaignResultActionCell = (prop) => {
  const { value } = prop;
  console.log("value", value);
  //const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { loading, resendNotification } = useResendNotification();

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
        const response = await resendNotification(value, status);
        if (response.status)
        { showToast('Resent successfully', 'success'); } else {
          showToast(response.message, 'error');
        }
        showConfirmation({ isOpen: false });
      },
      onNo: () => showConfirmation({ isOpen: false }),
    });
  };

  

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
            {status === 8 ? (
              <CTooltip content="Resend Notification">
                <CIcon
                  onClick={handleResend}
                  className="stock-toggle-icon"
                  icon={cilSend}
                  size="xl"
                  style={{ cursor: 'pointer', color: 'rgb(235 241 237)' }}
                />
              </CTooltip>
            ) : (
              <span className="text-muted">---</span>
            )}

          </div>
        </CCol>
      </CRow>
    </React.Fragment>
  );
};

export default CampaignResultActionCell;

import React from 'react';

import { cilMediaPause, cilMediaStop, cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

import CIcon from '@coreui/icons-react';

import { CBadge, CCol, CRow, CTooltip } from '@coreui/react';

import { useSelector } from 'react-redux';
import { useToggleCampaignStatus } from 'src/hooks/api/useFetchUpdateCampaign';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from '../UI/Spinner';

const CampaignActionCell = (prop) => {
  const { value, campaign, canDelete, fetching } = prop;
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();

  const { loading, updateStatus } = useToggleCampaignStatus();

  const toggleStatus = (status) => {
    if (status === 1 && !user?.orgInfo?.signature) {
      showConfirmation({
        header: 'Information!',
        body: `Campaign will be auto activated once admin sign the contract!!!?`,
        isOpen: true,
        onYes: null,
        onNo: () => onNoConfirm(),
      });
      return;
    }
    const campaignName = campaign?.[0]?.name || value?.row?.name || 'this campaign';

    // Define action labels based on status code
    let actionLabel = '';
    switch (status) {
      case 1:
        actionLabel = 're-activate';
        break;
      case 4:
        actionLabel = 'delete';
        break;
      case 6:
        actionLabel = 'pause';
        break;
      case 7:
        actionLabel = 'stop';
        break;
      default:
        actionLabel = 'update';
    }

    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${actionLabel} ${campaignName}?`,
      isOpen: true,
      onYes: () => onYesToggle(status),
      onNo: () => onNoConfirm(),
    });
  };
  const onYesToggle = async (status) => {
    onNoConfirm();
    try {
      const response = await updateStatus(campaign, status);
      console.log('response', response);
      if (response?.status) {
        fetching();
        showToast(`${campaign[0].name} ${status === 1 ? 're activated' : 'deleted'} successfully`);
      } else {
        showToast(response?.message, 'error');
      }
    } catch (e) {
      console.log(e, 'error');
    }
  };

  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  const editCampaign = () => {
    navigate('/campaignadd', { state: { id: value.row.id, campaign: campaign?.[0] } });
  };

  if (loading) {
    return <Spinner />;
  }
  // console.log("canUpdate", canUpdate);
  // console.log("canDelete", canDelete);
  const isPaid = value.row?.paymentStatus === 1;
  return (
    <React.Fragment>
      {isPaid ? (
        <CRow>
          <CCol className="d-flex justify-content-center">
            <div className="d-flex align-items-center justify-content-center gap-4">
              <CBadge color="success">Paid</CBadge>
              <CTooltip content="Pause Campaign">
                <CIcon
                  onClick={() => toggleStatus(6)} // 6 = Pause
                  className="stock-toggle-icon"
                  icon={cilMediaPause}
                  style={{ cursor: 'pointer' }}
                />
              </CTooltip>
            </div>
          </CCol>
        </CRow>
      ) : (
        <>
          {value.row.status === 4 ? (
            <CRow>
              <CCol className="d-flex justify-content-center">
                <div className="d-flex align-items-center justify-content-center gap-4">
                  <CTooltip content="Re-Activate Campaign">
                    <CIcon
                      onClick={() => toggleStatus(1)}
                      className="stock-toggle-icon"
                      icon={cilReload}
                      style={{ cursor: 'pointer' }}
                    />
                  </CTooltip>
                </div>
              </CCol>
            </CRow>
          ) : (
            <CRow>
              <CCol className="d-flex justify-content-center">
                <div className="d-flex align-items-center justify-content-center gap-4">
                  {/* Edit Campaign */}
                  <CTooltip content="Edit Campaign">
                    <CIcon
                      onClick={() => editCampaign(value.row.id)}
                      className="stock-toggle-icon"
                      icon={cilPencil}
                      style={{ cursor: 'pointer' }}
                    />
                  </CTooltip>

                  {/* Pause Campaign */}
                  <CTooltip content="Pause Campaign">
                    <CIcon
                      onClick={() => toggleStatus(6)} // 6 = Pause
                      className="stock-toggle-icon"
                      icon={cilMediaPause}
                      style={{ cursor: 'pointer' }}
                    />
                  </CTooltip>

                  {/* Stop Campaign */}
                  <CTooltip content="Stop Campaign">
                    <CIcon
                      onClick={() => toggleStatus(7)} // 7 = Stop
                      className="stock-toggle-icon"
                      icon={cilMediaStop}
                      style={{ cursor: 'pointer' }}
                    />
                  </CTooltip>

                  {/* Delete Campaign */}
                  {canDelete === 1 && (
                    <CTooltip content="Delete Campaign">
                      <CIcon
                        className="stock-toggle-icon IconColorRed"
                        icon={cilTrash}
                        onClick={() => toggleStatus(4)}
                        style={{ cursor: 'pointer' }}
                      />
                    </CTooltip>
                  )}
                </div>
              </CCol>
            </CRow>
          )}
        </>
      )}
    </React.Fragment>
  );
};
export default CampaignActionCell;

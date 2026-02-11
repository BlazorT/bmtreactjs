import React from 'react';
import {
  cilMediaPause,
  cilMediaPlay,
  cilMediaStop,
  cilPencil,
  cilReload,
  cilTrash,
} from '@coreui/icons';
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

  // Status constants
  const STATUS = {
    REACTIVATE: 1,
    DELETE: 4,
    PAUSE: 6,
    RESUME: 7,
  };

  const toggleStatus = (status) => {
    if (status === STATUS.REACTIVATE && !user?.orgInfo?.signature) {
      showConfirmation({
        header: 'Information!',
        body: `Campaign will be auto activated once admin signs the contract!`,
        isOpen: true,
        onYes: null,
        onNo: () => onNoConfirm(),
      });
      return;
    }

    const campaignName =
      campaign?.[0]?.name || value?.row?.name || 'this campaign';

    let actionLabel = '';

    switch (status) {
      case STATUS.REACTIVATE:
        actionLabel = 're-activate';
        break;
      case STATUS.DELETE:
        actionLabel = 'delete';
        break;
      case STATUS.PAUSE:
        actionLabel = 'pause';
        break;
      case STATUS.RESUME:
        actionLabel = 'resume';
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

      if (response?.status) {
        fetching();

        const campaignName =
          campaign?.[0]?.name || value?.row?.name || 'Campaign';

        let successMessage = '';

        switch (status) {
          case STATUS.REACTIVATE:
            successMessage = 're-activated';
            break;
          case STATUS.DELETE:
            successMessage = 'deleted';
            break;
          case STATUS.PAUSE:
            successMessage = 'paused';
            break;
          case STATUS.RESUME:
            successMessage = 'resumed';
            break;
          default:
            successMessage = 'updated';
        }

        showToast(`${campaignName} ${successMessage} successfully`);
      } else {
        showToast(response?.message || 'Something went wrong', 'error');
      }
    } catch (error) {
      console.log(error);
      showToast('Something went wrong', 'error');
    }
  };

  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  const editCampaign = () => {
    navigate('/campaignadd', {
      state: { id: value.row.id, campaign: campaign?.[0] },
    });
  };

  if (loading) {
    return <Spinner />;
  }

  const isPaid = value.row?.paymentStatus === 1;
  const currentStatus = value.row?.status;

  return (
    <>
      {isPaid ? (
        <CRow>
          <CCol className="d-flex justify-content-center">
            <div className="d-flex align-items-center justify-content-center gap-4">
              <CBadge color="success">Paid</CBadge>

              {currentStatus === STATUS.PAUSE ? (
                <CTooltip content="Resume Campaign">
                  <CIcon
                    onClick={() => toggleStatus(STATUS.RESUME)}
                    className="stock-toggle-icon"
                    icon={cilMediaPlay}
                    size="lg"
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>
              ) : (
                <CTooltip content="Pause Campaign">
                  <CIcon
                    onClick={() => toggleStatus(STATUS.PAUSE)}
                    className="stock-toggle-icon"
                      icon={cilMediaPause}
                    size="lg"
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>
              )}
            </div>
          </CCol>
        </CRow>
      ) : (
        <>
          {currentStatus === STATUS.DELETE ? (
            <CRow>
              <CCol className="d-flex justify-content-center">
                <div className="d-flex align-items-center justify-content-center gap-4">
                  <CTooltip content="Re-Activate Campaign">
                    <CIcon
                      onClick={() => toggleStatus(STATUS.REACTIVATE)}
                      className="stock-toggle-icon"
                        icon={cilReload}
                        size="lg"
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
                  {/* Edit */}
                  <CTooltip content="Edit Campaign">
                    <CIcon
                      onClick={editCampaign}
                      className="stock-toggle-icon"
                          icon={cilPencil}
                          size="lg"
                      style={{ cursor: 'pointer' }}
                    />
                  </CTooltip>

                  {/* Pause / Resume */}
                  {currentStatus === STATUS.PAUSE ? (
                    <CTooltip content="Resume Campaign">
                      <CIcon
                        onClick={() => toggleStatus(STATUS.RESUME)}
                        className="stock-toggle-icon"
                            icon={cilMediaPlay}
                            size="lg"
                        style={{ cursor: 'pointer' }}
                      />
                    </CTooltip>
                  ) : (
                    <CTooltip content="Pause Campaign">
                      <CIcon
                        onClick={() => toggleStatus(STATUS.PAUSE)}
                        className="stock-toggle-icon"
                              icon={cilMediaPause}
                              size="lg"
                        style={{ cursor: 'pointer' }}
                      />
                    </CTooltip>
                  )}

                  {/* Stop */}
                  {/*<CTooltip content="Stop Campaign">*/}
                  {/*  <CIcon*/}
                  {/*    onClick={() => toggleStatus(STATUS.RESUME)}*/}
                  {/*    className="stock-toggle-icon"*/}
                  {/*    icon={cilMediaStop}*/}
                  {/*    style={{ cursor: 'pointer' }}*/}
                  {/*  />*/}
                  {/*</CTooltip>*/}

                  {/* Delete */}
                  {canDelete === 1 && (
                    <CTooltip content="Delete Campaign">
                      <CIcon
                        className="stock-toggle-icon IconColorRed"
                            icon={cilTrash}
                            size="lg"
                        onClick={() => toggleStatus(STATUS.DELETE)}
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
    </>
  );
};

export default CampaignActionCell;

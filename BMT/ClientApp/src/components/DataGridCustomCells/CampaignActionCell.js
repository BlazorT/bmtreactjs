import React, { useState } from 'react';

import {
  cilBell,
  cilCalendarCheck,
  cilMediaPause,
  cilMediaStop,
  cilLibrary,
  cilPencil,
  cilReload,
  cilTrash,
  cilTruck,
} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

import CIcon from '@coreui/icons-react';

import { CCol, CRow, CTooltip } from '@coreui/react';

import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useToggleCampaignStatus } from 'src/hooks/api/useFetchUpdateCampaign';
import Spinner from '../UI/Spinner';
import { useSelector } from 'react-redux';

const CampaignActionCell = (prop) => {
  const { value, user, fetching, canUpdate, canDelete } = prop;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const loginUser = useSelector((state) => state.user);

  const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { data, error, loading, updateStatus } = useToggleCampaignStatus();
  const toggleStatus = (status) => {
    handleClose();

    const campaignName = user?.[0]?.name || value?.row?.name || 'this campaign';

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
    try {
      const response = await updateStatus(user, status);
      console.log('response', response);
      if (response?.status) {
        showToast(`${user[0].name} ${status === 1 ? 're activated' : 'deleted'} successfully`);
        //  fetching();
      } else {
        showToast(response?.message, 'error');
      }
    } catch (e) {
      console.log(e, 'error');
    } finally {
      onNoConfirm();
    }
  };

  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  const editCampaign = () => {
    handleClose();
    navigate('/campaignadd', { state: { id: value.row.id, user: user } });
  };

  if (loading) {
    return <Spinner />;
  }
  // console.log("canUpdate", canUpdate);
  // console.log("canDelete", canDelete);
  return (
    <React.Fragment>
      {value.row.status === 4 ? (
        <CRow>
          <CCol className="d-flex justify-content-center">
            <div className="d-flex align-items-center justify-content-center gap-4">
              <CTooltip content="Re-Activate Campaign">
                <CIcon
                  onClick={() => toggleStatus(5)}
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
    </React.Fragment>


  );
};
export default CampaignActionCell;

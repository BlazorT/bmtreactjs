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

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import CIcon from '@coreui/icons-react';
import DADetailModal from 'src/components/Modals/DADetailModal';
import Tooltip from '@mui/material/Tooltip';
import DAInventoryModal from '../Modals/DAInventoryModal';

import { CCol, CRow } from '@coreui/react';

import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useToggleCampaignStatus } from 'src/hooks/api/useFetchUpdateCampaign';
import Spinner from '../UI/Spinner';
import { useSelector } from 'react-redux';
import Popover from '../UI/Popover';
import { AppSpeedDial } from '../UI/AppSpeedDial';

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
    console.log("response", response);
    if (response?.status) {
      showToast(`${user[0].name} ${status === 1 ? 're activated' : 'deleted'} successfully`);
      //  fetching();
    } else {
      showToast(response?.message, 'error');
    }

  } catch (e) {
    console.log(e, 'error')
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
          <CCol>
            <Tooltip title="Re-Activate Campaign">
              <CIcon
                onClick={() => toggleStatus(5)}
                className="stock-toggle-icon"
                icon={cilReload}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </CCol>
        </CRow>
      ) : (
        <CRow>
       {/*   {canUpdate === 1 && (*/}
            <CCol>
              <Tooltip title="Edit Campaign">
                <CIcon
                  onClick={() => editCampaign(value.row.id)}
                  className="stock-toggle-icon"
                  icon={cilPencil}
                  style={{ cursor: 'pointer' }}
                />
              </Tooltip>
            </CCol>
        {/*  )}*/}

          {/* Pause Campaign */}
          <CCol>
            <Tooltip title="Pause Campaign">
              <CIcon
                onClick={() => toggleStatus(6)} // Assuming 6 = Pause
                className="stock-toggle-icon"
                icon={cilMediaPause}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </CCol>

          {/* Stop Campaign */}
          <CCol>
            <Tooltip title="Stop Campaign">
              <CIcon
                onClick={() => toggleStatus(7)} // Assuming 7 = Stop
                className="stock-toggle-icon"
                icon={cilMediaStop}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </CCol>

          {canDelete === 1 && (
            <CCol>
              <Tooltip title="Delete Campaign">
                <CIcon
                  className="stock-toggle-icon"
                  icon={cilTrash}
                  onClick={() => toggleStatus(4)}
                  style={{ cursor: 'pointer' }}
                />
              </Tooltip>
            </CCol>
          )}
        </CRow>
      )}
    </React.Fragment>
  );

};
export default CampaignActionCell;

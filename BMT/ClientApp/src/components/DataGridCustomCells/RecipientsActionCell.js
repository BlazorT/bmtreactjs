import React, { useState } from 'react';

import {
  cilBell,
  cilCalendarCheck,
  cilCog,
  cilInfo,
  cilLibrary,
  cilPencil,
  cilReload,
  cilTrash,
  cilTruck,
} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import Tooltip from '@mui/material/Tooltip';
import { CCol, CRow } from '@coreui/react';
import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useToggleUserStatus } from 'src/hooks/api/useToggleUserStatus';
import Spinner from '../UI/Spinner';
import { useSelector } from 'react-redux';


const RecipientsActionCell = (prop) => {
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

  const [DADetailModalOpen, setDADetailModalOpen] = useState(false);
 
  const loginUser = useSelector((state) => state.user);

  const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { data, error, loading, updateStatus } = useToggleUserStatus();

  const toggleStatus = (status) => {
    handleClose();
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${
        user[0].name
      }?`,
      isOpen: true,
      onYes: () => onYesToggle(status),
      onNo: () => onNoConfirm(),
    });
  };

  const onYesToggle = async (status) => {
    const response = await updateStatus(user, status);

    if (response.status) {
      showToast(`${user[0].name} ${status === 1 ? 're activated' : 'deleted'} successfully`);
    //  fetching();
    } else {
      showToast(response.message, 'error');
    }

    onNoConfirm();
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
              />
            </Tooltip>
          </CCol>
        </CRow>
      ) : (
        <CRow>
          {/*{canUpdate === 1 && (*/}
            <CCol>
                <Tooltip title="Edit Recipients">
                <CIcon
                    onClick={() => editCampaign(value.row.id)}
                  className="stock-toggle-icon"
                  icon={cilPencil}
                />
              </Tooltip>
            </CCol>
          {/*)}*/}
        
          {canDelete === 1 && (
            <CCol>
              <Tooltip title="Delete Recipients">
                <CIcon
                  className="stock-toggle-icon"
                  icon={cilTrash}
                  onClick={() => toggleStatus(4)}
                />
              </Tooltip>
            </CCol>
          )}
        
        </CRow>
      )}

    
    </React.Fragment>
  );
};
export default RecipientsActionCell;

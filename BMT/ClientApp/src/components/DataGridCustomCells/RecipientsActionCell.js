import React, { useState } from 'react';

import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToggleUserStatus } from 'src/hooks/api/useToggleUserStatus';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from '../UI/Spinner';

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
      body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${user[0].name}?`,
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
            <CTooltip content="Re-Activate Campaign">
              <CIcon
                onClick={() => toggleStatus(5)}
                className="stock-toggle-icon"
                icon={cilReload}
              />
            </CTooltip>
          </CCol>
        </CRow>
      ) : (
        <CRow>
          {/*{canUpdate === 1 && (*/}
          <CCol>
            <CTooltip content="Edit Recipients">
              <CIcon
                onClick={() => editCampaign(value.row.id)}
                className="stock-toggle-icon"
                icon={cilPencil}
              />
            </CTooltip>
          </CCol>
          {/*)}*/}

          {canDelete === 1 && (
            <CCol>
              <CTooltip content="Delete Recipients">
                <CIcon
                  className="stock-toggle-icon"
                  icon={cilTrash}
                  onClick={() => toggleStatus(4)}
                />
              </CTooltip>
            </CCol>
          )}
        </CRow>
      )}
    </React.Fragment>
  );
};
export default RecipientsActionCell;

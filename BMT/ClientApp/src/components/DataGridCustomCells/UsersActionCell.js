import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

import Spinner from '../UI/Spinner';

import { useToggleUserStatus } from 'src/hooks/api/useToggleUserStatus';
import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
const UsersActionCell = (prop) => {
  const { params, fetching, user, canEdit, canDelete } = prop;
  const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { loading, updateStatus } = useToggleUserStatus();

  const [userStatus, setUserStatus] = React.useState(params.row.status);
  console.log(params.row);
  const editUser = (id) => {
    navigate('/UserRegister', { state: { id: id, user: user } });
  };

  const toggleStatus = (status) => {
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${status === 1 ? 're-activate' : 'delete'} ${user[0].userName}?`,
      isOpen: true,
      onYes: () => onYesToggle(status),
      onNo: () => onNoConfirm(),
    });
  };

  const onYesToggle = async (status) => {
    const response = await updateStatus(user, status);
    console.log(response);
    if (response.status) {
      setUserStatus(status);
      showToast(`${user[0].userName} ${status === 1 ? 're-activated' : 'deleted'} successfully`);
      fetching();
    } else {
      showToast(response.message, 'error');
    }
    onNoConfirm();
  };

  const onNoConfirm = () => {
    showConfirmation({ isOpen: false });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <CRow>
          {userStatus === 6 ? (
            <CCol>
              <Tooltip title="Re-Activate User">
                <CIcon
                  onClick={() => toggleStatus(5)}
                  className="stock-toggle-icon"
                  icon={cilReload}
                />
              </Tooltip>
            </CCol>
          ) : (
            <>
             
                <CCol>
                  <Tooltip title="Edit User">
                    <CIcon
                      onClick={() => editUser(params.id)}
                      className="stock-toggle-icon"
                      icon={cilPencil}
                    />
                  </Tooltip>
                </CCol>
             
              {canDelete === 1 && (
                <CCol>
                  <Tooltip title="Delete User">
                    <CIcon
                      className="stock-toggle-icon"
                      onClick={() => toggleStatus(4)}
                      icon={cilTrash}
                    />
                  </Tooltip>
                </CCol>
              )}
            </>
          )}
        </CRow>
      )}
    </>
  );
};
export default UsersActionCell;

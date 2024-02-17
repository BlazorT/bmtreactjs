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

  const { data, loading, error, updateStatus } = useToggleUserStatus();

  const editUser = (id) => {
    navigate('/UserRegister', { state: { id: id, user: user } });
  };

  const toggleStatus = (status) => {
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${
        user[0].userName
      }?`,
      isOpen: true,
      onYes: () => onYesToggle(status),
      onNo: () => onNoConfirm(),
    });
  };
  const onYesToggle = async (status) => {
    const response = await updateStatus(user, status);
    if (response.status) {
      showToast(`${user[0].userName} ${status === 1 ? 're activated' : 'deleted'} successfully`);
      fetching();
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
  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {params.row.status === 6 ? (
            <CRow>
              <CCol>
                <Tooltip title="Re-Active User">
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
              {canEdit === 1 && (
                <CCol>
                  <Tooltip title="Edit User">
                    <CIcon
                      onClick={() => editUser(params.id)}
                      className="stock-toggle-icon"
                      icon={cilPencil}
                    />
                  </Tooltip>
                </CCol>
              )}
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
            </CRow>
          )}
        </>
      )}
    </React.Fragment>
  );
};
export default UsersActionCell;

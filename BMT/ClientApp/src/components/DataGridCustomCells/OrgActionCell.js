import React, { useState } from 'react';

import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

import CIcon from '@coreui/icons-react';

import { CCol, CRow, CTooltip } from '@coreui/react';

import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useToggleOrgStatus } from 'src/hooks/api/useToggleOrgStatus';
import Spinner from '../UI/Spinner';

const OrgActionCell = (prop) => {
  const { value, user, fetching, canUpdate, canDelete } = prop;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { data, error, loading, updateStatus } = useToggleOrgStatus();

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
    console.log(response, 'response');
    if (response.status) {
      showToast(`${user[0].userName} ${status === 1 ? 're activated' : 'deleted'} successfully`);
      // fetching();
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

  const editUser = () => {
    handleClose();
    navigate('/organizationadd', { state: { id: value.row.id, user: user } });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      {value.row.status === 4 ? (
        <CRow>
          <CCol className="d-flex justify-content-center">
            <div className="d-flex align-items-center justify-content-center gap-4">
              <CTooltip content="Re-Activate Organization">
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
              {canUpdate === 1 && (
                <CTooltip content="Edit Organization">
                  <CIcon
                    onClick={() => editUser(value.row.id)}
                    className="stock-toggle-icon"
                    icon={cilPencil}
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>
              )}

              {canDelete === 1 && (
                <CTooltip content="Delete Organization">
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
export default OrgActionCell;

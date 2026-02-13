import React from 'react';

import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

import CIcon from '@coreui/icons-react';

import { CCol, CRow, CTooltip } from '@coreui/react';

import { useToggleUserStatus } from 'src/hooks/api/useToggleUserStatus';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from '../UI/Spinner';

const OrgUserActionCell = (prop) => {
  const { value, user, canUpdate, canDelete } = prop;

  const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { loading, updateStatus } = useToggleUserStatus();

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
    navigate('/UserRegister', { state: { id: value.row.id, user: user } });
  };

  if (loading) {
    return <Spinner />;
  }
  console.log('ROW DATA:', value?.row);
  console.log('STATUS:', value?.row?.status);
  console.log('canUpdate:', canUpdate);
  console.log('canDelete:', canDelete);
  return (
    <React.Fragment>
      {value.row.status === 4 ? (
        <CRow>
          <CCol className="d-flex justify-content-center">
            <div className="d-flex align-items-center justify-content-center gap-4">
              <CTooltip content="Re-Activate Organization User">
                <CIcon
                  onClick={() => toggleStatus(5)}
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
              {canUpdate === 1 && (
                <CTooltip content="Edit Organization User">
                  <CIcon
                    onClick={() => editUser(value.row.id)}
                    className="stock-toggle-icon"
                    icon={cilPencil}
                    size="lg"
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>
              )}

              {canDelete === 1 && (
                <CTooltip content="Delete Organization User">
                  <CIcon
                    className="stock-toggle-icon IconColorRed"
                    icon={cilTrash}
                    size="lg"
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
export default OrgUserActionCell;

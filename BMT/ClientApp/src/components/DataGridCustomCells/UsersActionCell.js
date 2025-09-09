import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Spinner from '../UI/Spinner';

import { useToggleUserStatus } from 'src/hooks/api/useToggleUserStatus';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
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
            <CCol className="d-flex justify-content-center">
              <div className="d-flex align-items-center justify-content-center gap-4">
                <CTooltip content="Re-Activate User">
                  <CIcon
                    onClick={() => toggleStatus(5)}
                    className="stock-toggle-icon"
                    icon={cilReload}
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>
              </div>
            </CCol>
          ) : (
            <CCol className="d-flex justify-content-center">
              <div className="d-flex align-items-center justify-content-center gap-4">
                <CTooltip content="Edit User">
                  <CIcon
                    onClick={() => editUser(params.id)}
                    className="stock-toggle-icon"
                    icon={cilPencil}
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>

                {canDelete === 1 && (
                  <CTooltip content="Delete User">
                    <CIcon
                      className="stock-toggle-icon IconColorRed"
                      onClick={() => toggleStatus(4)}
                      icon={cilTrash}
                      style={{ cursor: 'pointer' }}
                    />
                  </CTooltip>
                )}
              </div>
            </CCol>
          )}
        </CRow>
      )}
    </>

  );
};
export default UsersActionCell;

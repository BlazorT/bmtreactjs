import React, { useState } from 'react';

import { cilLockLocked, cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

import CIcon from '@coreui/icons-react';

import { CCol, CRow, CTooltip } from '@coreui/react';

import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useToggleOrgStatus } from 'src/hooks/api/useToggleOrgStatus';
import Spinner from '../UI/Spinner';
import { useSelector } from 'react-redux';
import OrgAccessKeyModal from '../Modals/OrgAccessKeyModal';

const OrgActionCell = (prop) => {
  const { value, org, fetching, canUpdate, canDelete } = prop;

  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { loading, updateStatus } = useToggleOrgStatus();

  const [isShowApiKeysMdl, setIsShowApiKeysMdl] = useState(false);

  const toggleIsShowApysMdl = () => setIsShowApiKeysMdl((prev) => !prev);

  const toggleStatus = (status) => {
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${org[0].name}?`,
      isOpen: true,
      onYes: () => onYesToggle(status),
      onNo: () => onNoConfirm(),
    });
  };

  const onYesToggle = async (status) => {
    const response = await updateStatus(org, status);
    console.log(response, 'response');
    if (response.status) {
      showToast(`${org[0].userName} ${status === 1 ? 're activated' : 'deleted'} successfully`);
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
    navigate('/organizationadd', { state: { id: value.row.id, org: org } });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      <OrgAccessKeyModal isOpen={isShowApiKeysMdl} toggle={toggleIsShowApysMdl} />
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
              {user?.roleId === 2 && (
                <CTooltip content="Api Access keys">
                  <CIcon
                    onClick={toggleIsShowApysMdl}
                    className="stock-toggle-icon"
                    icon={cilLockLocked}
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>
              )}
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

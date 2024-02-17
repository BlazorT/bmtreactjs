import React, { useState } from 'react';

import { cilPencil, cilSettings } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow } from '@coreui/react';
import DSPRolesModal from '../Modals/DSPRolesModal';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
const DspRolesCustomCell = (prop) => {
  const { value, canUpdate } = prop;
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);

  const {
    response: settingRes,
    error: settingErr,
    loading: settingLoading,
    fetchData: fetchRoles,
  } = useFetch();

  const getRolesSetting = async () => {
    const fetchBody = {
      roleId: value.row.id.toString(),
    };

    await fetchRoles('/Common/rolemenus', { method: 'POST', body: JSON.stringify(fetchBody) });

    if (settingRes.current?.status === true) {
      setModalOpen(true);
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong',
          toastVariant: 'error',
        }),
      );
    }
  };

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <CRow>
      {canUpdate !== 1 && (
        <CCol>
          <Tooltip title="Setting Dsp roles">
          <CIcon
            className="stock-toggle-icon"
            icon={cilSettings}
            onClick={() => getRolesSetting()}
            />
          </Tooltip>
        </CCol>
      )}
      {canUpdate === 1 && (
        <CCol>
          <Tooltip title="Edit Dsp roles">
          <CIcon className="stock-toggle-icon" onClick={() => getRolesSetting()} icon={cilPencil} />
          </Tooltip>
        </CCol>
      )}
      <DSPRolesModal
        isOpen={modalOpen}
        toggle={() => toggleModal()}
        roleId={value.row.id}
        header={'Role Access Priveledges ' + '( ' + value.row.roleName + ' )'}
        rolesData={settingRes.current?.data}
        canUpdate={canUpdate}
      />
    </CRow>
  );
};
export default DspRolesCustomCell;

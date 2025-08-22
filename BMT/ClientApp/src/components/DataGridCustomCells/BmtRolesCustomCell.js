import React, { useEffect, useState } from 'react';
import { cilPencil, cilSettings } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
//import { Tooltip } from '@material-ui/core';
import Tooltip from '@mui/material/Tooltip';
import CIcon from '@coreui/icons-react';
import BmtRolesModal from '../Modals/BmtRolesModal';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch } from 'react-redux';
import ActionButton from '../UI/ActionButton';
import useApi from 'src/hooks/useApi';
import { useShowSnackbar } from 'src/hooks/useShowSnackbar';
import Spinner from '../UI/Spinner';
const BmtRolesCustomCell = (prop) => {
  const { value, canUpdate } = prop;
  const dispatch = useDispatch();
  const showSnackbar = useShowSnackbar();

  const [modalOpen, setModalOpen] = useState(false);

  const { data: settingRes, loading, postData: fetchRoles } = useApi('/Common/rolemenus');

  const getRolesSetting = async () => {
    
    const fetchBody = {
      roleId: value.row.id.toString(),
    };

    const res = await fetchRoles(fetchBody);
    console.log({ res });
    if (res?.status === true) {
      setModalOpen(true);
    } else {
      showSnackbar(res?.message, 'error');
    }
  };

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <CRow>
      {canUpdate !== 1 && (
        <CCol>
          <Tooltip title={'Setting Bmt roles'}>
            <CIcon className="stock-toggle-icon" onClick={getRolesSetting} icon={cilSettings} />
          </Tooltip>
        </CCol>
      )}
      {canUpdate === 1 && (
        <CCol>
          <Tooltip title={'Edit Bmt roles'}>
            <CIcon className="stock-toggle-icon" onClick={getRolesSetting} icon={cilPencil} />
          </Tooltip>
        </CCol>
      )}
      <BmtRolesModal
        isOpen={modalOpen}
        toggle={() => toggleModal()}
        roleId={value.row.id}
        header={'Role Access Privileges ' + '( ' + value.row.roleName + ' )'}
        rolesData={settingRes?.data}
        canUpdate={canUpdate}
      />
    </CRow>
  );
};
export default BmtRolesCustomCell;

/* eslint-disable react/react-in-jsx-scope */
import { cilPencil, cilSettings } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import { useState } from 'react';
import useApi from 'src/hooks/useApi';
import { useShowToast } from 'src/hooks/useShowToast';
import BmtRolesModal from '../Modals/BmtRolesModal';
import Spinner from '../UI/Spinner';

const BmtRolesCustomCell = (prop) => {
  const { value, canUpdate } = prop;
  const showToast = useShowToast();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: settingRes, loading, postData: fetchRoles } = useApi('/Common/rolemenus');

  const getRolesSetting = async () => {
    const fetchBody = {
      roleId: value.row.id.toString(),
    };

    const res = await fetchRoles(fetchBody);
    if (res?.status === true) {
      setModalOpen(true);
    } else {
      showToast(res?.message, 'error');
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
          <CTooltip content={'Setting Bmt roles'}>
            <CIcon className="stock-toggle-icon" onClick={getRolesSetting} icon={cilSettings}
              size="lg"
            />
          </CTooltip>
        </CCol>
      )}
      {canUpdate === 1 && (
        <CCol>
          <CTooltip content={'Edit Bmt roles'}>
            <CIcon className="stock-toggle-icon" onClick={getRolesSetting} icon={cilPencil}
              size="lg"
            />
          </CTooltip>
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

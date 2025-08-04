import React, { useState } from 'react';

import {
  cilBell,
  cilCalendarCheck,
  cilCog,
  cilInfo,
  cilLibrary,
  cilPencil,
  cilReload,
  cilTrash,
  cilTruck,
} from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import CIcon from '@coreui/icons-react';
import DADetailModal from 'src/components/Modals/DADetailModal';
import Tooltip from '@mui/material/Tooltip';
import DAInventoryModal from '../Modals/DAInventoryModal';

import { CCol, CRow } from '@coreui/react';

import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useToggleUserStatus } from 'src/hooks/api/useToggleUserStatus';
import Spinner from '../UI/Spinner';
import { useSelector } from 'react-redux';
import Popover from '../UI/Popover';
import { AppSpeedDial } from '../UI/AppSpeedDial';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isJustDispMdlOpen, setIsJustDispMdlOpen] = useState(false);

  const loginUser = useSelector((state) => state.user);

  const navigate = useNavigate();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { data, error, loading, updateStatus } = useToggleUserStatus();

  const toggleStatus = (status) => {
    handleClose();
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${
        user[0].name
      }?`,
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
  const DADetailInfoModal = () => {
    setDADetailModalOpen((prev) => !prev);
  };

  if (loading) {
    return <Spinner />;
  }

  // const actions = [
  //   {
  //     icon: <EditOutlinedIcon />,
  //     title: 'Edit DA',
  //     onClick: editUser,
  //     disabled: !canUpdate === 1,
  //   },
  //   {
  //     icon: <DeleteOutlineOutlinedIcon />,
  //     title: 'Delete DA',
  //     onClick: () => toggleStatus(4),
  //     disabled: !canUpdate === 1,
  //   },
  //   {
  //     icon: <InventoryOutlinedIcon />,
  //     title: 'Daily Dispatchments',
  //     onClick: () => {
  //       setIsOpen(true);
  //     },
  //   },
  //   {
  //     icon: <LocalShippingOutlinedIcon />,
  //     title: 'Dispatchments',
  //     onClick: () => {
  //       setIsJustDispMdlOpen(true);
  //     },
  //     disabled: loginUser.roleId !== 1,
  //   },
  //   {
  //     icon: <InfoOutlinedIcon />,
  //     title: 'See DA detail',
  //     onClick: () => {
  //       setDADetailModalOpen(true);
  //     },
  //   },
  // ];
  return (
    <React.Fragment>

      {value.row.status === 4 ? (
        <CRow>
          <CCol>
            <Tooltip title="Re-Activate Campaign">
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
          {/*{canUpdate === 1 && (*/}
            <CCol>
                <Tooltip title="Edit Recipients">
                <CIcon
                    onClick={() => editCampaign(value.row.id)}
                  className="stock-toggle-icon"
                  icon={cilPencil}
                />
              </Tooltip>
            </CCol>
          {/*)}*/}
        
          {canDelete === 1 && (
            <CCol>
              <Tooltip title="Delete Recipients">
                <CIcon
                  className="stock-toggle-icon"
                  icon={cilTrash}
                  onClick={() => toggleStatus(4)}
                />
              </Tooltip>
            </CCol>
          )}
        
        </CRow>
      )}

      <DAInventoryModal
        header={`${value.row.firstName}, ${value.row.state}, ID # ${value.row.code}`}
        isOpen={isOpen}
        value={value}
        toggle={() => setIsOpen(!isOpen)}
        isSingleDis={false}
      />
      <DAInventoryModal
        header={`${value.row.firstName}, ${value.row.state}, ID # ${value.row.code}`}
        isOpen={isJustDispMdlOpen}
        value={value}
        toggle={() => setIsJustDispMdlOpen(!isJustDispMdlOpen)}
        isSingleDis={true}
      />
      <DADetailModal isOpen={DADetailModalOpen} user={user} toggle={DADetailInfoModal} />
    </React.Fragment>
  );
};
export default RecipientsActionCell;

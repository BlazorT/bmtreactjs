import React, { useState } from 'react';

import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';

import CIcon from '@coreui/icons-react';
import DADetailModal from 'src/components/Modals/DADetailModal';
import DAInventoryModal from '../Modals/DAInventoryModal';

import { CCol, CRow, CTooltip } from '@coreui/react';

import { useSelector } from 'react-redux';
import { useToggleUserStatus } from 'src/hooks/api/useToggleUserStatus';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from '../UI/Spinner';

const OrgUserActionCell = (prop) => {
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

  const editUser = () => {
    handleClose();
    navigate('/UserRegister', { state: { id: value.row.id, user: user } });
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
  //     content: 'Edit DA',
  //     onClick: editUser,
  //     disabled: !canUpdate === 1,
  //   },
  //   {
  //     icon: <DeleteOutlineOutlinedIcon />,
  //     content: 'Delete DA',
  //     onClick: () => toggleStatus(4),
  //     disabled: !canUpdate === 1,
  //   },
  //   {
  //     icon: <InventoryOutlinedIcon />,
  //     content: 'Daily Dispatchments',
  //     onClick: () => {
  //       setIsOpen(true);
  //     },
  //   },
  //   {
  //     icon: <LocalShippingOutlinedIcon />,
  //     content: 'Dispatchments',
  //     onClick: () => {
  //       setIsJustDispMdlOpen(true);
  //     },
  //     disabled: loginUser.roleId !== 1,
  //   },
  //   {
  //     icon: <InfoOutlinedIcon />,
  //     content: 'See DA detail',
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
            <CTooltip content="Re-Activate Organization User">
              <CIcon
                onClick={() => toggleStatus(5)}
                className="stock-toggle-icon"
                icon={cilReload}
              />
            </CTooltip>
          </CCol>
        </CRow>
      ) : (
        <CRow>
          {canUpdate === 1 && (
            <CCol>
              <CTooltip content="Edit Organization User">
                <CIcon
                  onClick={() => editUser(value.row.id)}
                  className="stock-toggle-icon"
                  icon={cilPencil}
                />
              </CTooltip>
            </CCol>
          )}
          {/*<CCol>*/}
          {/*    <CTooltip content="Organization User Actions">*/}
          {/*    <CIcon*/}
          {/*      className="stock-toggle-icon"*/}
          {/*      icon={cilCog}*/}
          {/*      onClick={handleClick}*/}
          {/*      aria-describedby={id}*/}
          {/*    />*/}
          {/*  </CTooltip>*/}
          {/*</CCol>*/}
          {canDelete === 1 && (
            <CCol>
              <CTooltip content="Delete Organization User">
                <CIcon
                  className="stock-toggle-icon"
                  icon={cilTrash}
                  onClick={() => toggleStatus(4)}
                />
              </CTooltip>
            </CCol>
          )}
          {/* <CCol>
            <AppSpeedDial actions={actions} />
          </CCol> */}

          {/*<Popover*/}
          {/*  id={id}*/}
          {/*  anchorEl={anchorEl}*/}
          {/*  handleClose={handleClose}*/}
          {/*  anchorVer="left"*/}
          {/*  anchorHori="left"*/}
          {/*  content={*/}
          {/*    <div className="fade-in-out">*/}
          {/*      <div className="bckgrndTransprnt">*/}
          {/*        <div className="da-popover bg-dark-color ">*/}
          {/*          <div className="tab-style">*/}
          {/*            <CCol>*/}
          {/*              */}
          {/* <span className="fs-6 text-dim">Daily Dispatchments</span> */}
          {/*              <CTooltip content="Daily Dispatchments">*/}
          {/*                <CIcon*/}
          {/*                  className="stock-toggle-icon"*/}
          {/*                  icon={cilLibrary}*/}
          {/*                  size="xl"*/}
          {/*                  onClick={() => {*/}
          {/*                    setIsOpen(true);*/}
          {/*                    handleClose();*/}
          {/*                  }}*/}
          {/*                />*/}
          {/*                <br></br>*/}
          {/*                <div className="text-dim">Daily Disp.</div>*/}
          {/*              </CTooltip>*/}
          {/*            </CCol>*/}
          {/*          </div>*/}
          {/*          <div className="tab-style">*/}
          {/*            <CCol className="">*/}
          {/*              <CTooltip content="Dispatchments">*/}
          {/*                <CIcon*/}
          {/*                  className={`stock-toggle-icon user-select-none ${*/}
          {/*                    loginUser.roleId !== 1 && 'pe-none'*/}
          {/*                  }`}*/}
          {/*                  icon={cilTruck}*/}
          {/*                  size="xl"*/}
          {/*                  onClick={() => {*/}
          {/*                    setIsJustDispMdlOpen(true);*/}
          {/*                    handleClose();*/}
          {/*                  }}*/}
          {/*                />*/}
          {/*                <br></br>*/}
          {/*                <div className="text-dim">Dispatchment</div>*/}
          {/*              </CTooltip>*/}
          {/*            </CCol>*/}
          {/*          </div>*/}
          {/*          <div className="tab-style">*/}
          {/*            <CCol>*/}
          {/*              <CTooltip content="Send Notification">*/}
          {/*                <CIcon*/}
          {/*                  className="stock-toggle-icon"*/}
          {/*                  icon={cilBell}*/}
          {/*                  size="xl"*/}
          {/*                  onClick={() => {*/}
          {/*                    // setDADetailModalOpen(true);*/}
          {/*                    handleClose();*/}
          {/*                  }}*/}
          {/*                />*/}
          {/*                <br></br>*/}
          {/*                <div className=" text-dim">Notification</div>*/}
          {/*              </CTooltip>*/}
          {/*            </CCol>*/}
          {/*          </div>*/}
          {/*          <div className="tab-style">*/}
          {/*            <CCol>*/}
          {/*              <CTooltip content="See DA detail">*/}
          {/*                <CIcon*/}
          {/*                  className="stock-toggle-icon"*/}
          {/*                  icon={cilInfo}*/}
          {/*                  size="xl"*/}
          {/*                  onClick={() => {*/}
          {/*                    setDADetailModalOpen(true);*/}
          {/*                    handleClose();*/}
          {/*                  }}*/}
          {/*                />*/}
          {/*                <br></br>*/}
          {/*                <div className=" text-dim">DA Detail</div>*/}
          {/*              </CTooltip>*/}
          {/*            </CCol>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  }*/}
          {/*  open={open}*/}
          {/*/>*/}
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
export default OrgUserActionCell;

import React, { useState } from 'react';

import {
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilLockLocked,
  cilChevronBottom,
  cilUser,
  cilAccountLogout,
  cilUserX,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { setUserData } from 'src/redux/user/userSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import UserProfileModal from '../components/Modals/UserProfileModal';
import useFetch from 'src/hooks/useFetch';
import { setNavItems } from 'src/redux/navItems/navItemsSlice';
import { keysToKeep } from './AppHeader';
import { useToggleUserStatus } from 'src/hooks/api/useToggleUserStatus';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import Spinner from 'src/components/UI/Spinner';
import { useShowToast } from 'src/hooks/useShowToast';
import { faMonument } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import Unsubscribe from 'src/components/Modals/UnsubscribeModal';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();

  const { loading, updateStatus } = useToggleUserStatus();

  const user = useSelector((state) => state.user);

  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [UnsubscribeModalOpen, setUnsubscribeModalOpen] = useState(false);

  const toggleModal = () => setIsUserProfileModalOpen((prev) => !prev);
  const togglePasswordModal = () => setIsPasswordModalOpen((prev) => !prev);
  const UnsubscribeModal = () => {
    setUnsubscribeModalOpen((prev) => !prev);
  };
  const {
    response: logoutRes,
    error: logoutmenuErr,
    loading: logoutLoading,
    fetchData: userLogout,
  } = useFetch();

  const handleLogout = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to Logout?`,
        isOpen: true,
        onYes: () => onYesLogOut(),
        onNo: () => onNo(),
      }),
    );
  };

  const onYesLogOut = async () => {
    dispatch(
      setConfirmation({
        body: (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status"></div>
          </div>
        ),
      }),
    );
    await userLogout('/Common/logout', { method: 'POST' });
    if (logoutRes.current?.status === true) {
      navigate('/');
      dispatch(setNavItems([]));
      dispatch(
        setUserData({
          userId: '',
          dspId: '',
          roleId: '',
          userInfo: {},
          isAuthenticated: false,
        }),
      );

      Object.keys(localStorage).forEach((key) => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      onNo();
    } else {
      onNo();
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong try again later',
          toastVariant: 'error',
        }),
      );
    }
  };

  const onNo = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const toggleStatus = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to unsubscribe ${user?.userInfo?.fullName}?`,
      isOpen: true,
      onYes: () => onYesToggle(2),
      onNo: () => onNoConfirm(),
    });
  };

  const onYesToggle = async (status) => {
    showConfirmation({
      body: (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ),
    });
    const body = {
      id: user?.userInfo?.id,
      email: user?.userInfo?.email,
      roleId: user?.userInfo?.roleId,
      firstName: user?.userInfo?.firstName || user?.userInfo?.fullName?.split(' ')[0] || '',
      lastName: user?.userInfo?.lastName || user?.userInfo?.fullName?.split(' ')[1] || '',
      status: 2,
      rowVer: user?.userInfo?.rowVer, // MUST match DB rowVer
      lastUpdatedBy: user?.userInfo?.id,
      UserCode: '',
      GenderId: 0,
      CreatedAt: dayjs().utc().format(),
    };
    const response = await updateStatus(null, status, body);
    console.log(response);
    if (response.status) {
      showToast(`${user?.userInfo?.fullName} has been unsubscribe successfully`);
      await userLogout('/Common/logout', { method: 'POST' });
      if (logoutRes.current?.status === true) {
        navigate('/');
        dispatch(setNavItems([]));
        dispatch(
          setUserData({
            userId: '',
            dspId: '',
            roleId: '',
            userInfo: {},
            isAuthenticated: false,
          }),
        );

        Object.keys(localStorage).forEach((key) => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        onNo();
      }
    } else {
      showToast(response.message, 'error');
    }
    onNoConfirm();
  };

  const onNoConfirm = () => {
    showConfirmation({ isOpen: false });
  };
  return (
    <CDropdown variant="nav-item">
      {loading && <Spinner />}
      <CDropdownItem className="text-center UserNameNav">{user.userInfo.fullName}</CDropdownItem>
      <CDropdownToggle className="py-0 text-center labelName RoleNameIconNav" caret={false}>
        {user.userInfo.userRole}
        <CIcon className="stock-toggle-icon labelName RoleNameIcon" icon={cilChevronBottom} />
      </CDropdownToggle>
      <CDropdownMenu className="p-0 m-0 MainViewToggle input-bg" placement="bottom-end Logout">
        <CDropdownItem
          role="button"
          className="text-center labelName border-bottom-1px d-flex justify-content-center align-items-center pb-2 pt-2"
          onClick={toggleModal}
        >
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
         <CDropdownDivider /> 
        <CDropdownItem
          className="text-center labelName border-bottom-1px d-flex justify-content-center align-items-center pb-2 pt-2"
          role="button"
          onClick={UnsubscribeModal}
        >
          <CIcon icon={cilUserX} className="me-2 " />
          Unsubscribe
        </CDropdownItem>
        <CDropdownItem
          className="text-center labelName border-bottom-1px d-flex justify-content-center align-items-center pb-2 pt-2"
          role="button"
          onClick={togglePasswordModal}
        >
          <CIcon icon={cilLockLocked} className="me-2 " />
          Change Password
        </CDropdownItem>
        {/* <CDropdownDivider /> */}
        <CDropdownItem
          className="text-center labelName d-flex justify-content-center align-items-center pb-2 pt-2"
          role="button"
          onClick={handleLogout}
        >
          <CIcon icon={cilAccountLogout} className="me-2 " />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
      <UserProfileModal isOpen={isUserProfileModalOpen} toggle={toggleModal} />
      <Unsubscribe isOpen={UnsubscribeModalOpen} toggle={UnsubscribeModal} />
      <UserProfileModal
        isOpen={isPasswordModalOpen}
        toggle={togglePasswordModal}
        isChangePassword={true}
      />
    </CDropdown>
  );
};

export default AppHeaderDropdown;

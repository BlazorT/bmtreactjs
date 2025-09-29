import React, { useState } from 'react';

import {
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilLockLocked, cilChevronBottom, cilUser, cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { setUserData } from 'src/redux/user/userSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import UserProfileModal from '../components/Modals/UserProfileModal';
import useFetch from 'src/hooks/useFetch';
import { setNavItems } from 'src/redux/navItems/navItemsSlice';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const toggleModal = () => setIsUserProfileModalOpen((prev) => !prev);
  const togglePasswordModal = () => setIsPasswordModalOpen((prev) => !prev);

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
      const keysToKeep = ['dastatuses', 'states', 'countries'];

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
  return (
    <CDropdown variant="nav-item">
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
        {/* <CDropdownDivider /> */}
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
      <UserProfileModal
        isOpen={isPasswordModalOpen}
        toggle={togglePasswordModal}
        isChangePassword={true}
      />
    </CDropdown>
  );
};

export default AppHeaderDropdown;

/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';

import {
  cilAccountLogout,
  cilChevronBottom,
  cilLockLocked,
  cilUser,
  cilUserX,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';

import Unsubscribe from 'src/components/Modals/UnsubscribeModal';
import { useLogout } from 'src/hooks/api/useLogout';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import UserProfileModal from '../components/Modals/UserProfileModal';

const AppHeaderDropdown = () => {
  const dispatch = useDispatch();
  const showConfirmation = useShowConfirmation();

  const { logout, logoutLoading } = useLogout();

  const user = useSelector((state) => state.user);
  const confirMdl = useSelector((state) => state.confirMdl);

  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [UnsubscribeModalOpen, setUnsubscribeModalOpen] = useState(false);

  const toggleModal = () => setIsUserProfileModalOpen((prev) => !prev);
  const togglePasswordModal = () => setIsPasswordModalOpen((prev) => !prev);
  const UnsubscribeModal = () => {
    setUnsubscribeModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (confirMdl.isOpen && confirMdl.body === 'Are you sure you want to Logout?') {
      showConfirmation({
        ...confirMdl,
        loading: logoutLoading,
      });
    }
  }, [logoutLoading]);

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
    await logout();
    onNo();
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

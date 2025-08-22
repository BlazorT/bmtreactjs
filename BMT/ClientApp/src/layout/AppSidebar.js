import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';
import AppHeaderDropdown from './AppHeaderDropdown';

import SimpleBar from 'simplebar-react';

//import 'simplebar/dist/simplebar.min.css';
import 'simplebar-react/dist/simplebar.min.css';


// sidebar nav config
import navigation, { mapNavItem } from '../_nav';
import { toggleSidebar, setSidebar } from '../redux/sidebar/sidebarSlice';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebar.value);
  const navItem = useSelector((state) => state.navItems);
  const user = useSelector((state) => state.user);

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebar(visible));
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img
          src={user.userInfo.avatar ? user.userInfo.avatar : 'defaultImg.jpg'}
          alt="Logo"
          className="profileImgViewNav"
          height="55"
        />
      </CSidebarBrand>
      <CSidebarNav>
        <AppHeaderDropdown />
        <SimpleBar>
          <AppSidebarNav items={mapNavItem(navItem.navItems)} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler className="d-none d-lg-flex" onClick={() => dispatch(toggleSidebar())} />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);

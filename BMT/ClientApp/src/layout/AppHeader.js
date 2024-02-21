/* eslint-disable prettier/prettier */
import React from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../redux/sidebar/sidebarSlice';
import { CContainer, CHeader, CHeaderNav, CHeaderToggler, CNavLink, CNavItem } from '@coreui/react';
import { cilBell, cilEnvelopeOpen, cilAccountLogout, cilList, cilMenu } from '@coreui/icons';

import CIcon from '@coreui/icons-react';
import useFetch from 'src/hooks/useFetch';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import { setUserData } from 'src/redux/user/userSlice';
import Loading from 'src/components/UI/Loading';
import { setNavItems } from 'src/redux/navItems/navItemsSlice';

const AppHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const {
    response: logoutRes,
    error: logoutmenuErr,
    loading: logoutLoading,
    fetchData: userLogout,
  } = useFetch();

  const divElem = document.querySelector('body > div');
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.target.handleResize) entry.target.handleResize(entry);
    }
  });
  resizeObserver.observe(divElem);

  const Logout = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to Logout?`,
        isOpen: true,
        onYes: () => onYesLogout(),
        onNo: () => onNo(),
      }),
    );
  };
  const onYesLogout = async () => {
    dispatch(
      setConfirmation({
        body: (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status"></div>
          </div>
        ),
      }),
    );
    // Need to pass id
    await userLogout('/Common/logout?id=' + user.userId, { method: 'POST' });

    if (logoutRes.current?.status === true) {
      navigate('');
      const keysToKeep = ['dastatuses', 'states', 'countries'];

      Object.keys(localStorage).forEach((key) => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      dispatch(
        setUserData({
          userId: '',
          dspId: '',
          roleId: '',
          userInfo: {},
          isAuthenticated: false,
        }),
      );
      dispatch(setNavItems([]));
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
    <CHeader position="sticky" className="bg-body-color">
      <CContainer fluid>
        <CHeaderToggler className="" onClick={() => dispatch(toggleSidebar())}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav>
          <CNavItem>
            <CNavLink>
              <CIcon className="labelName" icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>
              <CIcon className="labelName" icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink>
              <CIcon className="labelName" icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem className="d-flex align-items-center ">
            <CNavLink className="text-white d-flex align-items-center fw-bold ">
              {user.userInfo.whatsApp ? user.userInfo.whatsApp : ''} &nbsp;
              <img className="socialMediaIconHeader" src="whatsapp.png" alt="logo" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink role="button" onClick={() => Logout()} className="text-white fw-bold">
              Log out &nbsp;
              <CIcon
                // onClick={() => Logout()}
                className="labelName"
                icon={cilAccountLogout}
                size="lg"
              />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;

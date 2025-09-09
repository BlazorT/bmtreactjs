/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { CListGroup, CListGroupItem } from '@coreui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../redux/sidebar/sidebarSlice';
import { CContainer, CHeader, CHeaderNav, CHeaderToggler, CNavLink, CNavItem } from '@coreui/react';
import {
  cilBell,
  cilEnvelopeOpen,
  cilAccountLogout,
  cilList,
  cilMenu,
  cilPeople,
} from '@coreui/icons';
import { CPopover } from '@coreui/react';
//import Blazorhub from '../Blazorhub';
import CIcon from '@coreui/icons-react';
import useFetch from 'src/hooks/useFetch';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import { setUserData } from 'src/redux/user/userSlice';
import Loading from 'src/components/UI/Loading';
import { setNavItems } from 'src/redux/navItems/navItemsSlice';
import { CBadge } from '@coreui/react';
const AppHeader = (phoneNumber) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const {
    response: logoutRes,
    error: logoutmenuErr,
    loading: logoutLoading,
    fetchData: userLogout,
  } = useFetch();

  // ✅ ResizeObserver inside useEffect
  useEffect(() => {
    const divElem = document.querySelector('body > div');
    if (!divElem) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target.handleResize) {
          requestAnimationFrame(() => {
            entry.target.handleResize(entry);
          });
        }
      }
    });

    resizeObserver.observe(divElem);

    // ✅ Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
      navigate('/');
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
  const notificationCount = 3;
  const handleChatClick = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=923337069742`;
    window.open(whatsappUrl, '_blank');
  };
  const popoverContent = (
    <div>
      <CListGroup>
        <CListGroupItem as="a" href="#">
          <div className="row d-flex w-100 justify-content-between">
            <div className="col-md-3">
              <img className="noti-profile-img" src={'defaultImg.jpg'} alt="logo" />
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-8">
                  <h5 className="mb-1">Ahmad Raza</h5>
                </div>
                <div className="col-md-4">
                  <small className="text-time">3 days ago</small>
                </div>
              </div>
              <p className="mb-1">Donec id elit non mi porta gravida at eget metus.</p>
            </div>
          </div>
        </CListGroupItem>
        <CListGroupItem as="a" href="#">
          <div className="row d-flex w-100 justify-content-between">
            <div className="col-md-3">
              <img className="noti-profile-img" src={'defaultImg.jpg'} alt="logo" />
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-8">
                  <h5 className="mb-1">Almas Arshad</h5>
                </div>
                <div className="col-md-4">
                  <small className="text-time">3 days ago</small>
                </div>
              </div>
              <p className="mb-1">Donec id elit non mi porta gravida at eget metus.</p>
            </div>
          </div>
        </CListGroupItem>
        <CListGroupItem as="a" href="#">
          <div className="row d-flex w-100 justify-content-between">
            <div className="col-md-3">
              <img className="noti-profile-img" src={'defaultImg.jpg'} alt="logo" />
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-8">
                  <h5 className="mb-1">Abu Bakar</h5>
                </div>
                <div className="col-md-4">
                  <small className="text-time">3 days ago</small>
                </div>
              </div>
              <p className="mb-1">Donec id elit non mi porta gravida at eget metus.</p>
            </div>
          </div>
        </CListGroupItem>
      </CListGroup>
    </div>
  );
  return (
    <CHeader position="sticky" className="bg-body-color">
      <CContainer fluid>
        <CHeaderToggler className="" onClick={() => dispatch(toggleSidebar())}>
          <CIcon icon={cilMenu} />
        </CHeaderToggler>
        <CHeaderNav>
          <CNavItem>
            <CNavLink>
              <CPopover
                className="customPopover"
                title="Notifications"
                content={popoverContent}
                placement="bottom"
              >
                <CIcon className="labelName" icon={cilBell} size="xxl">
                  {/*  {notificationCount > 0 && <CBadge shape="pill" color="danger">{notificationCount}</CBadge>}*/}
                </CIcon>
              </CPopover>
              {notificationCount > 0 && (
                <CBadge shape="pill" color="danger">
                  {notificationCount}
                </CBadge>
              )}
            </CNavLink>
          </CNavItem>
          <div>{/*  <Blazorhub />*/}</div>
          {/*<CNavItem>*/}
          {/*  <CNavLink>*/}
          {/*    <CIcon className="labelName" icon={cilList} size="lg" />*/}

          {/*  </CNavLink>*/}
          {/*</CNavItem>*/}
          <CNavItem>
            <CNavLink>
              <CIcon icon={cilPeople} className="color-set" />
              {notificationCount > 0 && (
                <CBadge shape="pill" color="danger">
                  {notificationCount}
                </CBadge>
              )}

              {/*  <CIcon className="labelName" icon={cilEnvelopeOpen} size="lg" />*/}
            </CNavLink>
          </CNavItem>
          <CNavItem className="d-flex align-items-center ">
            <CNavLink
              onClick={handleChatClick}
              className="text-white d-flex align-items-center fw-bold "
            >
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

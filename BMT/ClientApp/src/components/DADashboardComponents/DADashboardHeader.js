import React, { useState } from 'react';

import CIcon from '@coreui/icons-react';
import { CCol, CContainer, CRow } from '@coreui/react';
import { cilEnvelopeClosed, cilPencil, cilPhone } from '@coreui/icons';

import RightSidebar from './RightSidebar';
import { useSelector } from 'react-redux';
import ImagePicker from '../UI/ImagePicker';
import { formatDate } from 'src/helpers/formatDate';

const DADashboardHeader = () => {
  const [isRightSideVisible, setIsRightSideVisible] = useState(false);
  const user = useSelector((state) => state.user);

  return (
    <CContainer fluid className="dashboard-header">
      <RightSidebar visible={isRightSideVisible} setVisible={setIsRightSideVisible} />

      <CRow>
        <CCol
          className="dashboard-header-input d-flex justify-content-center align-items-center"
          md={2}
        >
          <div>
            <ImagePicker
              image={user.userInfo.avatar ? user.userInfo.avatar : 'defaultImg.jpg'}
              onChange={(e) => console.log(e)}
            />
            <p className="dashboard-header-text">Edit Photo </p>
          </div>
        </CCol>
        <CCol className="dashboard-header-input" md={4}>
          <div style={{ justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
            <div>
              <h1 className="dashboard-card-number">{user.userInfo.fullName}</h1>
              <strong className=" dashboard-header-light-text">{user.userInfo.id}</strong>
              <p className="dashboard-header-light-text txtWeight">{user.userInfo.userRole}</p>
              <p className="dashboard-header-light-text">
                Onboarded {formatDate(user.userInfo.doj)}
              </p>
            </div>
          </div>
        </CCol>
        <CCol className="dashboard-header-input" md={4}>
          <div style={{ justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
            <div>
              <h1 className="">
                <span
                  onClick={() => setIsRightSideVisible(!isRightSideVisible)}
                  className="txtborderheading"
                >
                  See Drivers in-app metrics{' '}
                </span>
              </h1>
              <div className=" dashboard-header-light-text" />
              <CIcon
                className="stock-toggle-icon  dashboard-header-light-text "
                icon={cilPhone}
              ></CIcon>
              <span className="txtNmbr">{user.userInfo.userContact}</span>
            </div>
            {/*  <div>*/}
            <div className=" dashboard-header-light-text" />
            <CIcon
              className="stock-toggle-icon  dashboard-header-light-text iconColor"
              icon={cilEnvelopeClosed}
            ></CIcon>
            <span className="txtNmbr">{user.userInfo.email}</span>
          </div>
          {/* </div>*/}
        </CCol>
        <CCol className="dashboard-header-input" md={2}>
          <div className="sidebar-brand d-md-flex" to="/">
            <CIcon
              className="stock-toggle-icon dashboard-header-light-text"
              size="xxl"
              icon={cilPencil}
            ></CIcon>
          </div>
          <div className="txtCenter">
            <span className="txtNmbr">Edit Info</span>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  );
};
export default DADashboardHeader;

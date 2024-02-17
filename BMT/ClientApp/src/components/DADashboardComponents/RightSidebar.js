import React from 'react';

import CIcon from '@coreui/icons-react';
import { cilX } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';

import RoadSafetyCard from '../Cards/RoadSafetyCard';

const Sidebar = (prop) => {
  const { visible, setVisible } = prop;
  const handleSidebarOpen = () => {
    setVisible(true);
  };

  const handleSidebarClose = () => {
    setVisible(false);
  };

  return (
    <div className="Rightsidebar">
      {!visible ? (
        <div className="sidebar_icon" onClick={handleSidebarOpen}></div>
      ) : (
        <>
          <div className="sidebar_items">
            <div className="sidebar_icon border-bottom-1px pb-2" onClick={handleSidebarClose}>
              <CIcon className="stock-toggle-icon" icon={cilX}></CIcon>
            </div>
            <CRow className="mb-3 border-bottom-1px mt-2">
              <CCol md={12}>
                <strong id="Nametext">Hello Jhomar!</strong>
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol className="" md={6}>
                Routes Completed
              </CCol>
              <CCol md={6}>
                <strong id="Nametext">No Data</strong>
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol className="" md={6}>
                Packages Delivered
              </CCol>
              <CCol md={6}>
                <strong id="Nametext">788</strong>
              </CCol>
            </CRow>
            <CRow className="mb-2 border-bottom-1px">
              <CCol className="" md={6}>
                Packages Dispatched
              </CCol>
              <CCol md={6}>
                <strong id="Nametext">830</strong>
              </CCol>
            </CRow>
            <CRow className="mb-2 border-bottom-1px">
              <CCol className="" md={12}>
                <RoadSafetyCard
                  title="OnRoadSafety"
                  overAllStatus="4 Event"
                  workStatus="0 Events"
                  Awards="Awards"
                />
              </CCol>
            </CRow>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;

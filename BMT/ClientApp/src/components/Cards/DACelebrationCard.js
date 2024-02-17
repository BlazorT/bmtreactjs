import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBirthdayCake } from '@coreui/icons';

const DACelebrationCard = (prop) => {
  const { title, overAllStatus, workStatus, Awards } = prop;
  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CRow className="pb-2 border-bottom-1px">
          <CCol xs="auto" className="me-auto">
            <div className="dashboard-card-number">{title}</div>
          </CCol>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <div className="d-flex justify-content-start align-items-center ">
            <CIcon
              style={{ marginRight: '8px', marginTop: '-16px' }}
              icon={cilBirthdayCake}
              size="xl"
            />
            <p className="dashboard-card-status">Birthday</p>
          </div>
          <p className="dashboard-light-text">{overAllStatus}</p>
        </CRow>
        <CRow>
          <div className="d-flex justify-content-start align-items-center ">
            <CIcon
              style={{ marginRight: '8px', marginTop: '-16px' }}
              icon={cilBirthdayCake}
              size="xl"
            />
            <p className="dashboard-card-status">Work Anniversary</p>
          </div>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <p className="dashboard-light-text">{workStatus}</p>
        </CRow>
        <CRow className="pb-2">
          <CCol xs="auto" className="me-auto">
            <div className="dashboard-card-number d-flex justify-content-start align-items-center">
              {Awards}
            </div>
          </CCol>
          <p className="dashboard-light-text">
            Have a DA who perform a extraordinary act while delivering in the community?{' '}
          </p>
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default DACelebrationCard;

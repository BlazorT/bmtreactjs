import React from 'react';
import { CCard, CCardBody, CCol, CProgress, CRow } from '@coreui/react';

const DAStaticticsCard = (prop) => {
  const { RoutesOutput, workStatus } = prop;

  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CRow className="pb-2 border-bottom-1px">
          <CCol md={4}>
            <div className="f-flex text-center justify-content-start  align-self-center ">
              <p className="dashboard-card-number2">Routes Completed</p>
            </div>
            <p className="dashboard-light-text">{RoutesOutput}</p>
          </CCol>
          <CCol md={4}>
            <div className="f-flex text-center justify-content-start  align-self-center ">
              <p className="dashboard-card-number2">Work Block Restored</p>
            </div>
            <p className="dashboard-light-text">{workStatus}</p>
          </CCol>
          <CCol md={4}>
            <div className="f-flex text-center justify-content-start  align-self-center ">
              <p className="dashboard-card-number2">Packages</p>
            </div>
            <CRow>
              <CCol md={6}>
                <p className="dashboard-card-number2">
                  <strong>90</strong> of 100 delivered
                </p>
              </CCol>
              <CCol md={6}>
                <p className="dashboard-card-number2 FloatRight">90%</p>
              </CCol>
            </CRow>
            <CProgress className="dashboard-card-progress-bar mt-2" height={15} value={90} />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default DAStaticticsCard;

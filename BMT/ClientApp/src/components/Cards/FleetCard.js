import React from 'react';

import { CContainer, CCard, CCardBody, CCardTitle, CRow } from '@coreui/react';

import PropTypes from 'prop-types';

const FleetCard = ({ heading, fotterContent, headerContent, fotterList }) => {
  FleetCard.propTypes = {
    heading: PropTypes.string,
    fotterContent: PropTypes.any,
    headerContent: PropTypes.any,
    fotterList: PropTypes.any,
  };

  const HeaderContent = () => {
    return (
      <div className="d-flex  flex-row  justify-content-evenly  align-items-center mt-2">
        {headerContent?.map((data, index) => (
          <div key={index} className="mt-1">
            <p className="dashboard-card-number text-center m-0">{data.number}</p>
            <p className="dashboard-light-text text-center m-0">{data.title}</p>
          </div>
        ))}
      </div>
    );
  };

  const FotterContent = () => {
    return (
      <CRow className="border-top-1px mt-2 ">
        {fotterList?.map((data, index) => (
          <div
            key={index}
            className="d-flex flex-row flex-wrap justify-content-between align-items-center"
          >
            <p className="communication-card-message-text text-secondary-color">{data.title}</p>
            <p className="communication-card-message-text">{data.number}</p>
          </div>
        ))}
        <div className="d-flex flex-row flex-wrap justify-content-evenly align-items-center mt-2">
          {fotterContent?.map((data, index) => (
            <div key={index} className="d-flex justify-content-start align-items-center ">
              <p className="dashboard-card-number m-0">{data.number}</p>
              <p className="m-0 ms-1 text-dull-color">{data.title}</p>
            </div>
          ))}
        </div>
      </CRow>
    );
  };
  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CCardTitle className="mb-2 dashboard-card-title">{heading}</CCardTitle>
        <CContainer fluid>
          <CRow className="pb-2">
            <HeaderContent />
          </CRow>
          {(fotterContent || fotterList) && <FotterContent />}
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default FleetCard;

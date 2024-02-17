import React from 'react';

import { cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCard, CCardBody, CRow } from '@coreui/react';

const TipsCard = () => {
  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CRow>
          <div className="d-flex text-center flex-row justify-content-start align-items-center">
            <CIcon className="me-2" icon={cilInfo} size="sm" />
            Tips
          </div>
          <p className="dashboard-light-text mt-2">Fleet compliance can save your money.</p>
          <p className="dashboard-light-text">
            An opportunity to lead As a DSP, you are only as strong as your team of delivery associates.
          </p>
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default TipsCard;

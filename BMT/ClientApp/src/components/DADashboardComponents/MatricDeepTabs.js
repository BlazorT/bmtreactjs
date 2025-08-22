import React, { useState } from 'react';
import { CCol, CCollapse, CContainer, CRow } from '@coreui/react';

import DriverTripHistory from './DriverTripHistory';
import CollapseHeader from './CollapseHeader';
import LineCharCard from 'src/components/Cards/LineCharCard';
import FicoData from './FicoData';
import DistractionData from './DistractionData';
import FollowingDistanceData from './FollowingDistanceData';
import SignalViolationData from './SignalViolationData';

const MatricDeepTabs = (prop) => {
  const { title, attributesStatus2, attributesStatus3 } = prop;
  const [driverGridVisible, setDriverGridVisible] = useState(true);
  return (
    <CContainer fluid className="dashboard-header">
      <CRow>
        <CCol md={12}>
          <LineCharCard
            attributesStatus2={attributesStatus2}
            attributesStatus3={attributesStatus3}
          />
        </CCol>
      </CRow>
      <CollapseHeader
        title="Driver Trip History"
        isVisible={driverGridVisible}
        toggleVisible={() => setDriverGridVisible(!driverGridVisible)}
        isFilter={true}
      />
      <div className="mt-2">
        <CCollapse visible={driverGridVisible} className="mt-3">
          {title === 'overview' && <DriverTripHistory />}
          {title === 'fico' && <FicoData />}
          {title === 'distraction' && <DistractionData />}
          {title === 'following distance' && <FollowingDistanceData />}
          {title === 'violations' && <SignalViolationData />}
        </CCollapse>
      </div>
    </CContainer>
  );
};
export default MatricDeepTabs;

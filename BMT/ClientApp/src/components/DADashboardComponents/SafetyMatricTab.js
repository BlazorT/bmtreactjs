import React, { useState } from 'react';
import { CCollapse } from '@coreui/react';

import FleetDashboardTabs from '../FleetComponents/FleetDashboardTabs';
import MatricDeepTabs from './MatricDeepTabs';

const SafetyMatricTab = (prop) => {
  const [safetyActiveTab, setSafetyActiveTab] = useState(0);
  const { isCollapse } = prop;
  const Safetytabs = [
    'OverView',
    'FICO',
    'Distraction',
    'Following Distance',
    'Sign/Signal Violations',
  ];
  return (
    <CCollapse visible={isCollapse} className="mt-3">
      <div className="mb-3">
        <FleetDashboardTabs
          title="DA"
          fleetTabs={Safetytabs}
          activeTab={safetyActiveTab}
          handleActiveTab={setSafetyActiveTab}
        />
      </div>
      {Safetytabs[safetyActiveTab] === 'OverView' && (
        <MatricDeepTabs
          title="overview"
          attributesStatus2={[
            { title: 'Safe Driving Metrics - FICO', status: 'Rolling 7 days average' },
            { title: 'Seatbelt-Off Rate', status: 'Events per trip' },
            { title: 'Speeding Event Rate', status: 'Events per trip' },
          ]}
          attributesStatus3={[
            { title: 'Distraction Rate', status: 'Events per trip' },
            { title: 'Following Distance Rate', status: 'Events per trip' },
            { title: 'Sign/Signal Violation', status: 'Events per trip' },
          ]}
        />
      )}
      {Safetytabs[safetyActiveTab] === 'FICO' && (
        <MatricDeepTabs
          title="fico"
          attributesStatus2={[
            { title: 'Safe Driving Metrics - FICO', status: 'Rolling 7 days average' },
          ]}
        />
      )}
      {Safetytabs[safetyActiveTab] === 'Distraction' && (
        <MatricDeepTabs
          title="distraction"
          attributesStatus2={[
            { title: 'Safe Driving Metrics - FICO', status: 'Rolling 7 days average' },
          ]}
        />
      )}
      {Safetytabs[safetyActiveTab] === 'Following Distance' && (
        <MatricDeepTabs
          title="following distance"
          attributesStatus2={[
            { title: 'Safe Driving Metrics - FICO', status: 'Rolling 7 days average' },
          ]}
        />
      )}
      {Safetytabs[safetyActiveTab] === 'Sign/Signal Violations' && (
        <MatricDeepTabs
          title="violations"
          attributesStatus2={[
            { title: 'Safe Driving Metrics - FICO', status: 'Rolling 7 days average' },
          ]}
        />
      )}
    </CCollapse>
  );
};
export default SafetyMatricTab;

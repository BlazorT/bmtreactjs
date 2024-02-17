import React, { useState } from 'react';
import { CCollapse } from '@coreui/react';

import FleetDashboardTabs from '../FleetComponents/FleetDashboardTabs';
import MatricDeepTabs from './MatricDeepTabs';

const QualityMatricTab = (prop) => {
  const [qualityActiveTab, setqualityActiveTab] = useState(0);
  const { isCollapse } = prop;
  const Qualitytabs = [
    'OverView',
    'Delivery Completion Rate',
    'Delivery Success Behaviours',
    'Photo On Delivery',
    'Customer Delivery Feedback',
  ];
  return (
    <CCollapse visible={isCollapse} className="mt-3">
      <div className="mb-3">
        <FleetDashboardTabs
          title="DA"
          fleetTabs={Qualitytabs}
          activeTab={qualityActiveTab}
          handleActiveTab={setqualityActiveTab}
        />
      </div>
      {Qualitytabs[qualityActiveTab] === 'OverView' && (
        <MatricDeepTabs
          title="overview"
          attributesStatus2={[
            { title: 'Delivery Completion Rate' },
            { title: 'SWC-Photo On Delivery ' },
            { title: 'Packages Delivery Not Recieved' },
          ]}
          attributesStatus3={[{ title: 'Routes Completed' }]}
        />
      )}
      {Qualitytabs[qualityActiveTab] === 'Delivery Completion Rate' && (
        <MatricDeepTabs
          title="fico"
          attributesStatus2={[
            { title: 'Safe Driving Metrics - FICO', status: 'Rolling 7 days average' },
          ]}
        />
      )}
      {Qualitytabs[qualityActiveTab] === 'Delivery Success Behaviours' && (
        <MatricDeepTabs
          title="distraction"
          attributesStatus2={[
            { title: 'Safe Driving Metrics - FICO', status: 'Rolling 7 days average' },
          ]}
        />
      )}
      {Qualitytabs[qualityActiveTab] === 'Photo On Delivery' && (
        <MatricDeepTabs
          title="following distance"
          attributesStatus2={[
            { title: 'Safe Driving Metrics - FICO', status: 'Rolling 7 days average' },
          ]}
        />
      )}
      {Qualitytabs[qualityActiveTab] === 'Customer Delivery Feedback' && (
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
export default QualityMatricTab;

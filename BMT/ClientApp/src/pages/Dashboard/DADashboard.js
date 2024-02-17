import React, { useState } from 'react';

import { CContainer } from '@coreui/react';

import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';
import DADashboardHeader from 'src/components/DADashboardComponents/DADashboardHeader';

import DAOverviewTab from 'src/components/DADashboardComponents/Tabs/DAOverviewTab';
import DAPerformanceTab from 'src/components/DADashboardComponents/Tabs/DAPerformanceTab';
import DASafetyTab from 'src/components/DADashboardComponents/Tabs/DASafetyTab';
import DATrendTab from 'src/components/DADashboardComponents/Tabs/DATrendTab';
import DAAssociateTab from 'src/components/DADashboardComponents/Tabs/DAAssociateTab';
import DAQualityTab from 'src/components/DADashboardComponents/Tabs/DAQualityTab';

const DADashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Overview', 'Performance', 'Safety', 'Quality', 'Trend', 'Associate Details'];

  return (
    <>
      <DADashboardHeader />
      <FleetDashboardTabs
        title="DA"
        fleetTabs={tabs}
        activeTab={activeTab}
        handleActiveTab={setActiveTab}
      />
      <CContainer fluid className="mt-4">
        {tabs[activeTab] === 'Overview' && <DAOverviewTab />}
        {tabs[activeTab] === 'Performance' && <DAPerformanceTab />}
        {tabs[activeTab] === 'Safety' && <DASafetyTab />}
        {tabs[activeTab] === 'Quality' && <DAQualityTab />}
        {tabs[activeTab] === 'Trend' && <DATrendTab />}
        {tabs[activeTab] === 'Associate Details' && <DAAssociateTab />}
      </CContainer>
    </>
  );
};

export default DADashboard;

// react and third party libraries
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CContainer } from '@coreui/react';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import moment from 'moment';

// local imports

import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';
import FleetDashboardTab from '../../components/FleetComponents/FleetDashboardTab';
import FleetVehicleTab from 'src/components/FleetComponents/FleetVehicleTab';
import FleetServiceTab from 'src/components/FleetComponents/FleetServiceTab';
import FleetRecordTab from 'src/components/FleetComponents/FleetRecordTab';
import FleetBrandedTab from 'src/components/FleetComponents/FleetBrandedTab';
import FleetInspectionTab from 'src/components/FleetComponents/FleetInspectionTab';
import FleetServiceHistoryTab from 'src/components/FleetComponents/FleetServiceHistoryTab ';

import DashboardBreadCrumb from 'src/components/UI/DashboardBreadCrumb';
import useFetch from 'src/hooks/useFetch';

import { updateToast } from 'src/redux/toast/toastSlice';
import { getUserbyRole } from 'src/api/usersApi';
import AppContainer from 'src/components/UI/AppContainer';

const FleetDashboard = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [vehicleId, setvehicleId] = useState(0);
  const [fleetVin, setFleetVin] = useState('');

  const { response: daRes, fetchData: fetchDasList } = useFetch();

  const tabs = [
    'Dashboard',
    'My Vehicles',
    'Inspection Type',
    'Service History',
    'Service',
    'Record Reservations',
    'Branded Vehicle Orders',
  ];

  useEffect(() => {
    getDasList();
  }, []);

  const getDasList = async () => {
    await getUserbyRole(user, 3, fetchDasList, dispatch);
  };
  return (
    <AppContainer>
      <DashboardBreadCrumb
        breadcrumbs={[
          { crumb: 'Administrator', to: '/dashboard' },
          { crumb: 'Fleet', to: '/fleet-dashboard' },
          { crumb: tabs[activeTab] },
        ]}
      />
      <FleetDashboardTabs
        fleetTabs={tabs}
        activeTab={activeTab}
        handleActiveTab={setActiveTab}
        // onAddVehicle={() => setIsAddVehicleModalOpen(true)}
      />
      <CContainer fluid className="mt-4">
        {tabs[activeTab] === 'Dashboard' && <FleetDashboardTab />}
        {tabs[activeTab] === 'My Vehicles' && (
          <FleetVehicleTab
            setActiveTab={setActiveTab}
            daList={daRes.current?.data?.data}
            setvehicleId={setvehicleId}
            setFleetVin={setFleetVin}
          />
        )}
        {tabs[activeTab] === 'Inspection Type' && (
          <FleetInspectionTab
            setActiveTab={setActiveTab}
            daList={daRes.current?.data?.data}
            vehicleId={vehicleId}
            setvehicleId={setvehicleId}
            fleetVin={fleetVin}
          />
        )}
        {tabs[activeTab] === 'Service History' && <FleetServiceHistoryTab />}
        {tabs[activeTab] === 'Service' && <FleetServiceTab />}
        {tabs[activeTab] === 'Record Reservations' && <FleetRecordTab />}
        {tabs[activeTab] === 'Branded Vehicle Orders' && <FleetBrandedTab />}
      </CContainer>
    </AppContainer>
  );
};

export default FleetDashboard;

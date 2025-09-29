/* eslint-disable react/prop-types */
import { CCol, CContainer, CRow } from '@coreui/react';
import React, { useEffect, useMemo, useState } from 'react';
import CustomSearch from 'src/components//InputsComponent/CustomSearch';

import { cilUser } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';
import BlazorNetworkInput from 'src/components/Component/BlazorNetworkInputs';
import AppContainer from 'src/components/UI/AppContainer';
import Loading from 'src/components/UI/Loading';
import useApi from 'src/hooks/useApi';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';

//import globalutil from '../../util/globalutil';
//import NetworkInputs from 'src/components/Component/NetworkInputs';

const SingleDispatchment = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);
  const orgId = user.orgId;
  const [activeTab, setActiveTab] = React.useState(1);
  const [organization, setOrganization] = useState(1);
  const [tabs, setTabs] = useState([]);
  const [networkList, setNetworkList] = useState([]);

  const orgBody = useMemo(
    () => ({
      id: 0,
      roleId: user.roleId,
      orgId: 0,
      email: '',
      name: '',
      contact: '',
      rowVer: 0,
      cityId: 0,
      status: 1,
      createdAt: dayjs().utc().subtract(1, 'year').format(), // ISO 8601 string
      lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
      createdBy: user.userId,
      lastUpdatedBy: user.userId,
    }),
    [user],
  );
  const body = useMemo(() => ({}), []);

  const { data, loading } = useApi('/BlazorApi/orgsfulldata', 'POST', orgBody);

  const { data: networkRes, loading: networksLoading } = useApi('/Admin/networks', 'POST', body);

  useEffect(() => {
    setTabs(networkRes?.data || []);
  }, [networkRes]);

  useEffect(() => {
    if (data?.data?.length > 0) {
      const findUserOrg = data?.data?.find((item) => item.id === orgId);
      if (findUserOrg) {
        setOrganization(findUserOrg); // store the whole object or just label/value depending on CustomSearch
      }
    }
  }, [data, orgId]);
  // console.log({ orglist });

  if (loading || networksLoading) {
    return <Loading />;
  }

  return (
    <AppContainer>
      <CRow>
        <CCol className="" md={12}>
          <CustomSearch
            label="Organization"
            icon={cilUser}
            type="text"
            id="name"
            value={organization}
            onChange={(e, value) => setOrganization(e)}
            placeholder="Organization"
            name="name"
            data={data?.data || []}
            className="form-control item"
            isRequired={true}
            title="Select Organization"
            message="Select Organization"
            disabled={user?.roleId !== 1}
          />
        </CCol>
      </CRow>
      <BlazorTabs
        title="Networks"
        tabs={tabs}
        activeTab={activeTab}
        handleActiveTab={setActiveTab}
      />
      <CContainer fluid className="m-0 p-0 mt-1">
        {tabs.map(
          (tab) =>
            activeTab == tab.id && (
              <BlazorNetworkInput
                key={tab.id}
                header={tab.name}
                networkId={tab.id}
                organizationId={organization?.id || 1}
                setNetworkList={setNetworkList}
                networkList={networkList}
              />
            ),
        )}
      </CContainer>
    </AppContainer>
  );
};
export default SingleDispatchment;

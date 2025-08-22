/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { CCol, CContainer, CRow } from '@coreui/react';
import useFetch from 'src/hooks/useFetch';
import CustomSearch from 'src/components//InputsComponent/CustomSearch';

import { useSelector } from 'react-redux';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import BlazorNetworkInput from 'src/components/Component/BlazorNetworkInputs';
import { cilUser } from '@coreui/icons';
import AppContainer from 'src/components/UI/AppContainer';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
//import globalutil from '../../util/globalutil';
//import NetworkInputs from 'src/components/Component/NetworkInputs';

const SingleDispatchment = () => {
  dayjs.extend(utc);
  const [activeTab, setActiveTab] = useState(1);
  const [organization, setOrganization] = useState(1);
  const [tabs, setTabs] = useState([]);
  const dispatch = useDispatch();
  const [networkList, setNetworkList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const orgId = user.orgId;
  const handleSubmit = (e) => {
    // console.log(e);
    e.preventDefault();
  };

  const {
    response: GetNetworkRes,
    loading: NetworkLoading,
    error: createNetworkError,
    fetchData: GetNetworks,
  } = useFetch();
  useEffect(() => {
    getNetworksList();
  }, []);
  const getNetworksList = async () => {
    await GetNetworks(
      '/Admin/networks',
      {
        method: 'POST',
        // body: JSON.stringify(fetchBody),
      },
      (res) => {
        // console.log(res, 'networks');
        if (res.status === true) {
          const T = [];
          res.data.map((tab, index) => T.push({ id: tab.id, name: tab.name }));
          //alert(JSON.stringify(tabs));
          setTabs(T);
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          /*   setRows([]);*/
        }
        setIsLoading(NetworkLoading.current);
      },
    );
  };
  const {
    response: GetOrgRes,
    loading: OrgLoading,
    error: GetOrgError,
    fetchData: GetOrg,
  } = useFetch();
  useEffect(() => {
    getOrganizationLst();
  }, []);
  const getOrganizationLst = async () => {
    const orgBody = {
      id: 0,
      roleId: user.roleId,
      orgId: 0,
      email: '',
      name: '',
      contact: '',
      rowVer: 0,
      cityId: 0,
      status: 1,
      // keyword: filters ? filters.keyword : '',
      createdAt: dayjs().utc().subtract(1, 'year').format(), // ISO 8601 string
      lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
      createdBy: user.userId,
      lastUpdatedBy: user.userId,
    };
    await GetOrg(
      '/BlazorApi/orgsfulldata',
      { method: 'POST', body: JSON.stringify(orgBody) },
      (res) => {
        // console.log(res, 'orgs');
        setIsLoading(OrgLoading.current);
      },
    );
  };
  useEffect(() => {
    if (GetOrgRes?.current?.data?.length > 0) {
      const orgData = GetOrgRes?.current?.data;
      const findUserOrg = orgData?.find((item) => item.id === orgId);
      console.log(findUserOrg, 'findUserOrg');

      if (findUserOrg) {
        setOrganization(findUserOrg); // store the whole object or just label/value depending on CustomSearch
      }
    }
  }, [GetOrgRes?.current?.data, orgId]);
  const orglist = React.useMemo(() => {
    return GetOrgRes?.current?.data ?? [];
  }, [GetOrgRes?.current?.data]);

  console.log(orglist, 'org listt');
  return (
    <AppContainer>
      <form
        className="needs-validation service-integration-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <CRow>
          <CCol className="" md={12}>
            <CustomSearch
              label="Organization"
              icon={cilUser}
              type="text"
              id="name"
              onChange={(e, value) => setOrganization(value)}
              placeholder="Organization"
              name="name"
              data={orglist}
              className="form-control item"
              isRequired={true}
              title="Select Organization"
              message="Select Organization"
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
          {tabs.map((tab, index) => (
            <>
              {activeTab == tab.id && (
                <BlazorNetworkInput
                  key={tab.id}
                  header={tab.name}
                  networkId={tab.id}
                  setNetworkList={setNetworkList}
                  networkList={networkList}
                />
              )}
            </>
          ))}
        </CContainer>
      </form>
    </AppContainer>
  );
};
export default SingleDispatchment;

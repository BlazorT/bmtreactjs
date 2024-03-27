/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { CCol, CContainer, CRow } from '@coreui/react';
import useFetch from 'src/hooks/useFetch';

import { useSelector } from 'react-redux';
import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
//import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import NetworkInput from 'src/components/Component/NetworkInputs';
import moment from 'moment';
import {
  cilUser,
} from '@coreui/icons';
import AppContainer from 'src/components/UI/AppContainer';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from '../../util/globalutil';
//import NetworkInputs from 'src/components/Component/NetworkInputs';

const SingleDispatchment = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs,setTabs] =useState( []);
  const dispatch = useDispatch();
  const [networkList,setNetworkList]=useState([])
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const T = []
    globalutil.networks().map((tab, index) => T.push(tab.name))
    setTabs(T)
  },[])

  const initialData = {
    id: 0,
    orgId: 0,
    networkId:1,
    rowVer: 0,
    status: 0,
    createdAt: moment().utc().startOf('month').format(),
    lastUpdatedAt: moment().utc().format(),
    startTime: moment().utc().format(),
    finishTime: moment().utc().format(),
  };
  const handleSubmit = (e) => {
   // console.log(e);
    e.preventDefault();
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
  const getOrganizationLst = async (compaign) => {
    const orgBody = {
      id: 0,
      roleId: compaign,
      orgId: 0,
      email: '',
      name: '',
      contact: "",
      rowVer: 0,
      cityId:1,
      status:1,
      // keyword: filters ? filters.keyword : '',
      createdAt:  moment().utc().format('YYYY-MM-DD'),
      lastUpdatedAt: moment().utc().format('YYYY-MM-DD'),
      createdBy: 0,
      lastUpdatedBy: 0,
    };
    await GetOrg(
      '/BlazorApi/orgsfulldata', { method: 'POST', body: JSON.stringify(orgBody), },
      (res) => {
        console.log(res, 'orgs');
        if (res.status === true) {
          //const mappedArray = res.data.map((data, index) => ({
          //  //id: data.id,
          //  //userId: data.userId,
          //  //dspid: user.dspId.toString(),
          //  //logDesc: data.logDesc,
          //  //entityName: data.entityName,
          //  //menuId: data.menuId,
          //  //machineIp: data.machineIp,
          //  //actionType: data.actionType,
          //  //logTime: formatDateTime(data.logTime),
          //}));

          // setRows(mappedArray);
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
        setIsLoading(OrgLoading.current);
      },
    );
  };
  const orglist = GetOrgRes?.current?.data || [];
  console.log(orglist, 'listt');
  return (
    <AppContainer>
      <form
        className="needs-validation service-integration-form"
        onSubmit={handleSubmit}
        noValidate
      >
      <CRow>
        <CCol className="" md={12}>
          <CustomInput
            label="Organization"
            icon={cilUser}
            type="text"
            value=""
            id="name"
            placeholder="organization"
            name="name"
            data={orglist}
            className="form-control item"
            isRequired={false}
            title="choose image for attachment "
          // message="Enter Buisness Name"
          />
        </CCol>

      </CRow>

      <FleetDashboardTabs
        title="Networks"
        fleetTabs={tabs}
        activeTab={activeTab}
          handleActiveTab={setActiveTab}
      />
      
    
            <CContainer fluid className="m-0 p-0 mt-1">
              {tabs.map((item, index) => <>
                {activeTab == index && <NetworkInput key={index} header={item} networkId={index + 1} setNetworkList={setNetworkList} networkList={networkList} />}
              </>)}

            
        </CContainer>
      

      </form>
    </AppContainer>
  );
};

export default SingleDispatchment;

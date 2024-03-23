/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { CFormSwitch } from '@coreui/react';
import { CCol, CContainer, CRow } from '@coreui/react';
import useFetch from 'src/hooks/useFetch';
import { formValidator } from 'src/helpers/formValidator';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';

import { useSelector } from 'react-redux';
import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
//import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { CFormCheck } from '@coreui/react';
import NetworkInput from 'src/components/Component/NetworkInputs';
import moment from 'moment';
import {
  cilUser,
  cilCloudDownload,
  cilCalendar,
  cilChevronBottom,
  cilFlagAlt,
} from '@coreui/icons';
import { useShowToast } from 'src/hooks/useShowToast';
//import { getDaInventoryCols } from 'src/configs/ColumnsConfig/daInventoryCols';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import CustomSearch from 'src/components/InputsComponent/CustomSearch';
import Loading from 'src/components/UI/Loading';
//import DaNewAssignment from 'src/components/Component/DaNewAssignment';
//import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
//import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import Button from 'src/components/InputsComponent/Button';
import LoadingBtn from 'src/components/UI/LoadingBtn';
import AppContainer from 'src/components/UI/AppContainer';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from '../../util/globalutil';
//import NetworkInputs from 'src/components/Component/NetworkInputs';

const globalpreference = () => {
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(0);
  const [networkSelect, setNetworkSelect] = useState(0);
  const [dataList, setdataList] = useState([]);
  const [tabs,setTabs] =useState( []);
  const dispatch = useDispatch();
  const [networkList,setNetworkList]=useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFilters, setshowFilters] = useState(false);
  const [showIntegration, setShowIntegration] = useState(false);
  const {
    response: createNetworkSettingRes,
    loading: createNetworkSettingLoading,
    error: createNetworkSettingError,
    fetchData: createNetworkSetting,
  } = useFetch();

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
  const [networkSettingData, setNetworkSettingData] = useState(initialData);
  const handleSubmit = (e) => {
   // console.log(e);
    e.preventDefault();
  };
 
  const toggleStock = () => {
    setshowFilters((prev) => !prev);
  };
  const showIntegrationfn = () => {
    setShowIntegration((prev) => !prev);
  };
  const handleNetworkSetting = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    //alert(fieldValue);
    setNetworkSettingData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };
  const handleTabSelectionChange = (event) => {
   // alert((event));
    setNetworkSelect(event);
    //setActiveTab();
  };
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
            id="keyword"
            placeholder="organization"
            name="keyword"
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
      
      {isLoading ? (
        <Loading />
      ) : (
            <CContainer fluid className="m-0 p-0 mt-1">
              {tabs.map((item, index) => <>
                {activeTab == index && <NetworkInput key={index} header={item} networkId={index + 1} setNetworkList={setNetworkList} networkList={networkList} />}
              </>)}

            
        </CContainer>
        )}

      </form>
    </AppContainer>
  );
};

export default globalpreference;

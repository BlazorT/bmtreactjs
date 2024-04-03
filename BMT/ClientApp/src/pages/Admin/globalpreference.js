/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { CCol, CContainer, CRow } from '@coreui/react';
import useFetch from 'src/hooks/useFetch';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';
//import CustomInput from 'src/components/InputsComponent/CustomInput';
//import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import BlazorNetworkInput from 'src/components/Component/BlazorNetworkInputs';
import {
  cilUser,
} from '@coreui/icons';
import Loading from 'src/components/UI/Loading';
import AppContainer from 'src/components/UI/AppContainer';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';

const globalpreference = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs,setTabs] =useState( []);
  const dispatch = useDispatch();
  const [networkList,setNetworkList]=useState([])
  const [isLoading, setIsLoading] = useState(false);
 

  //useEffect(() => {
  //  const T = []
  //  globalutil.networks().map((tab, index) => T.push(tab.name))
  //  setTabs(T)
  //},[])
  const {
    response: GetNetworkRes,
    loading: NetworkLoading,
    error: createNetworkError,
    fetchData: GetNetworks,
  } = useFetch();
  useEffect(() => {
    getNetworksList()
  }, [])
  const getNetworksList = async () => {

    await GetNetworks(
      '/Admin/networks',
      {
        method: 'POST',
        // body: JSON.stringify(fetchBody),
      },
      (res) => {
        //console.log(res, 'networks');
        if (res.status === true) {
          const T = []
          res.data.map((tab, index) => T.push({ name: tab.name, id: tab.id }))
          setTabs(T)
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
  
  const handleSubmit = (e) => {
   // console.log(e);
    e.preventDefault();
  };
 
 
  return (
    <AppContainer>
      <form
        className="needs-validation service-integration-form"
        onSubmit={handleSubmit}
        noValidate
      >
      <BlazorTabs
        title="Networks"
        tabs={tabs}
        activeTab={activeTab}
          handleActiveTab={setActiveTab}
      />
      
            <CContainer fluid className="m-0 p-0 mt-1">
              {tabs.map((tab, index) => <>
                {activeTab == tab.id && <BlazorNetworkInput key={tab.id} header={tab.name} networkId={tab.id} setNetworkList={setNetworkList} networkList={networkList} />}
              </>)}

            
        </CContainer>
       

      </form>
    </AppContainer>
  );
};

export default globalpreference;

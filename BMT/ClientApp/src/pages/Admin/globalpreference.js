/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { CContainer } from '@coreui/react';
import { useEffect, useMemo, useState } from 'react';
import BlazorNetworkInput from 'src/components/Component/BlazorNetworkInputs';
import AppContainer from 'src/components/UI/AppContainer';
import Loading from 'src/components/UI/Loading';
import useApi from 'src/hooks/useApi';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';
import { useFetchPricing } from 'src/hooks/api/useFetchPricing';

const globalpreference = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [tabs, setTabs] = useState([]);
  const [networkList, setNetworkList] = useState([]);

  const body = useMemo(() => ({}), []);

  const { data, loading } = useApi('/Admin/networks', 'POST', body);

  const { data: pricingRes, loading: pricingLoading, fetchPricing } = useFetchPricing();

  const pricingData = useMemo(() => pricingRes?.data || [], [pricingRes]);

  useEffect(() => {
    fetchPricing();
  }, []);

  useEffect(() => {
    setTabs(data?.data || []);
  }, [data]);

  if (loading || pricingLoading) {
    return <Loading />;
  }
  return (
    <AppContainer>
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
                organizationId={1}
                pricingData={pricingData}
              />
            )}
          </>
        ))}
      </CContainer>
    </AppContainer>
  );
};

export default globalpreference;

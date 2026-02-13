/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import AppContainer from 'src/components/UI/AppContainer';
import { getPricingCols } from 'src/configs/ColumnsConfig/pricingCols';
import { formatDate } from 'src/helpers/formatDate';
import { useFetchPricing } from 'src/hooks/api/useFetchPricing';
import usePageRoles from 'src/hooks/usePageRoles';
import globalutil from 'src/util/globalutil';

const Products = () => {
  useEffect(() => {
    getProducts();
  }, []);

  const getNetworkName = (networkId) => {
    const findNetwork = globalutil.networks()?.find((n) => n.id == networkId);
    return findNetwork?.name || '';
  };

  const pageRoles = usePageRoles('pricing');
  const user = useSelector((state) => state.user);

  const [pricingRows, setPricingRows] = useState([]);

  const { data, loading, fetchPricing } = useFetchPricing();

  const getProducts = async () => {
    const pricingList = await fetchPricing();
    console.log('pricingList', pricingList);
    // const gByNetwork = _.groupBy(pricingList, (item) => item.networkId);
    // const groupedData = Object.entries(gByNetwork);
    const networkGroup = pricingList?.map((data) => ({
      ...data,
      name: getNetworkName(data?.networkId),
      unitName: globalutil.campaignunits()?.find((c) => c.id === data?.unitId)?.name || '',
      unitPrice: data?.unitPrice?.toFixed(2),
      discount: data?.discount?.toFixed(2),
      freeAllowed: data.freeAllowed,
      startTime: formatDate(data.startTime),
      lastUpdatedAt: data.lastUpdatedAt,
    }));

    setPricingRows(networkGroup);
  };
  // console.log({ user });
  const pricingCols = getPricingCols(user, getProducts);
  const headerTitle = `Network Prices${user?.orgInfo?.currencyName ? ` (${user.orgInfo.currencyName})` : ''}`;
  return (
    <AppContainer>
      <CustomDatagrid
        rows={pricingRows}
        columns={pricingCols}
        loading={loading || !data}
        rowHeight={50}
        maxHeight={700}
        isHeader={true}
        groupBy={['name']}
        enableGrouping
        defaultExpandedGroups
        headerProps={{
          title: headerTitle,
          filterDisable: true,
          canPrint: pageRoles?.canPrint === 1,
          canExport: pageRoles?.canExport === 1,
          fileName: 'Network_Pricing',
        }}
      />
    </AppContainer>
  );
};

export default Products;

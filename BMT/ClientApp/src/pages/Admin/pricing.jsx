/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import AppContainer from 'src/components/UI/AppContainer';
import { getPricingCols } from 'src/configs/ColumnsConfig/pricingCols';
import { formatDate } from 'src/helpers/formatDate';
import { useFetchPricing } from 'src/hooks/api/useFetchPricing';
import globalutil from 'src/util/globalutil';

const Products = () => {
  useEffect(() => {
    getProducts();
  }, []);

  const getNetworkName = (networkId) => {
    const findNetwork = globalutil.networks()?.find((n) => n.id == networkId);
    return findNetwork?.name || '';
  };

  const user = useSelector((state) => state.user);

  const [pricingRows, setPricingRows] = useState([]);

  const { data, loading, fetchPricing } = useFetchPricing();

  const getProducts = async () => {
    const pricingList = await fetchPricing();
    const gByNetwork = _.groupBy(pricingList, (item) => item.networkId);
    const groupedData = Object.entries(gByNetwork);
    const networkGroup = groupedData?.flatMap(([networkKey, networkItems], networkIndex) => {
      const networkGroup = {
        id: `hour-group-${networkKey}-${networkIndex}`,
        name: getNetworkName(networkKey),
        unitName: '',
        unitPrice: '',
        discount: '',
        freeAllowed: '',
        startTime: '',
        lastUpdatedAt: '',
      };
      const childRows = networkItems.map((data, i) => ({
        ...data,
        id: `${data.id}-${i}`,
        name: '',
        networkName: getNetworkName(data?.networkId),
        unitName: globalutil.campaignunits()?.find((c) => c.id === data?.unitId)?.name || '',
        unitPrice: data?.unitPrice?.toFixed(2),
        discount: data?.discount?.toFixed(2),
        freeAllowed: data.freeAllowed,
        startTime: formatDate(data.startTime),
        lastUpdatedAt: data.lastUpdatedAt,
      }));
      return [networkGroup, ...childRows];
    });
    setPricingRows(networkGroup);
  };
  // console.log({ user });
  const pricingCols = getPricingCols(user, getProducts);
  return (
    <AppContainer>
      <DataGridHeader title="Network Prices" filterDisable />
      <CustomDatagrid
        rows={pricingRows}
        columns={pricingCols}
        pagination={true}
        loading={loading || !data}
        rowHeight={50}
        isHeader={true}
        // sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
      />
    </AppContainer>
  );
};

export default Products;

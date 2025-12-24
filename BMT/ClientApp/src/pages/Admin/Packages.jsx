/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import AppContainer from 'src/components/UI/AppContainer';
//import Loading from 'src/components/UI/Loading';
import { getProductsCols } from 'src/configs/ColumnsConfig/productsCols';
//import { countries } from 'src/constants/countries';
import { useFetchProducts } from 'src/hooks/api/useFetchProducts';
import usePageRoles from 'src/hooks/usePageRoles';
//import globalutil from 'src/util/globalutil';

const Packages = () => {
  useEffect(() => {
    getPackages();
  }, []);

  const pageRoles = usePageRoles('Packages');

  const [showAddPackageModal, setShowAddPackageModal] = useState(false);

  const [packages, setPackages] = useState([]);
  const [packageRows, setPackageRows] = useState([]);

  const { data, loading, fetchProducts } = useFetchProducts();

  const toggleAddPackageModal = () => {
    setShowAddPackageModal(!showAddPackageModal);
  };

  const getPackages = async () => {
    const packagesList = await fetchProducts();

    const mappedArray = packagesList.map((data) => ({
      id: data.id,
      //name: `${data.name} ,${data.shortCode}`,
      name: data.name,
      fee: data.fee,
      earlyBirdDiscount: data.earlyBirdDiscount,
      discount: data.discount,
      packageInDays: data.packageInDays,
      //category:
      //  globalutil.productGroup().find((item: any) => item.id === data.categoryId)?.name || null,
      lastUpdatedAt: data.lastUpdatedAt,
    }));

    setPackages(packagesList);
    setPackageRows(mappedArray);
  };

  const packagesCols = getProductsCols(pageRoles, getPackages, packages);

  return (
    <AppContainer>
      <CustomDatagrid
        isHeader
        headerProps={{
          title: 'Packages List',
          addBtnClick: toggleAddPackageModal,
          filterDisable: true,
          canPrint: pageRoles?.canPrint === 1,
          canExport: pageRoles?.canExport === 1,
          fileName: 'Packages',
        }}
        rows={packageRows}
        columns={packagesCols}
        pagination={true}
        loading={loading || !data}
        rowHeight={50}
        hiddenCols={{
          columnVisibilityModel: {
            lastUpdatedAt: false,
          },
        }}
        sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
      />
    </AppContainer>
  );
};

export default Packages;

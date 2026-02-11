/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import AppContainer from 'src/components/UI/AppContainer';
import { getPackagesCols } from 'src/configs/ColumnsConfig/productsCols';
import { useFetchPackages } from 'src/hooks/api/useFetchProducts';
import usePageRoles from 'src/hooks/usePageRoles';

const Packages = () => {
  useEffect(() => {
    getPackages();
  }, []);

  const pageRoles = usePageRoles('Packages');
  const { data, loading, fetchPackages } = useFetchPackages();

  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [packageRows, setPackageRows] = useState([]);

  const toggleAddPackageModal = () => {
    setShowAddPackageModal(!showAddPackageModal);
  };

  const getPackages = async () => {
    const packagesList = await fetchPackages();

    const mappedArray = packagesList.map((data) => ({
      id: data.id,
      name: data.name,
      fee: data.fee,
      earlyBirdDiscount: data.earlyBirdDiscount,
      discount: data.discount,
      packageInDays: data.packageInDays,
      lastUpdatedAt: data.lastUpdatedAt,
    }));

    setPackageRows(mappedArray);
  };

  const packagesCols = getPackagesCols();

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

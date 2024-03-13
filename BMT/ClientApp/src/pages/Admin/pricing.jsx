/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import InventoryProductModal from 'src/components/Modals/InventoryProductModal';

import AppContainer from 'src/components/UI/AppContainer';
import Loading from 'src/components/UI/Loading';
import { getPricingCols } from 'src/configs/ColumnsConfig/pricingCols';
import { countries } from 'src/constants/countries';
import { useFetchPricing } from 'src/hooks/api/useFetchPricing';
import globalutil from 'src/util/globalutil';

const Products = () => {
  useEffect(() => {
    getProducts();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Products',
  );

  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [pricingRows, setPricingRows] = useState([]);

  const { data, loading, fetchPricing } = useFetchPricing();

  const toggleAddProductModal = () => {
    setShowAddProductModal(!showAddProductModal);
  };

  const getProducts = async () => {
    const pricingList = await fetchPricing();

    const mappedArray = pricingList.map((data) => ({
      id: data.id,
      //name: `${data.name} ,${data.shortCode}`,
      name: data.name,
      unitName: data.unitName,
      unitPrice: data.unitPrice,
      discount: data.discount,
      freeAllowed: data.freeAllowed,
      //category:
      //  globalutil.productGroup().find((item: any) => item.id === data.categoryId)?.name || null,
      startTime: data.startTime,
      lastUpdatedAt: data.lastUpdatedAt,
    }));

    setProducts(pricingList);
    setPricingRows(mappedArray);
  };

  const pricingCols = getPricingCols(pageRoles, getProducts, products);

  return (
    <AppContainer>
      <DataGridHeader
        title="Packages List"
        addBtnClick={toggleAddProductModal}
      />
      <CustomDatagrid
        rows={pricingRows}
        columns={pricingCols}
        pagination={true}
        loading={loading || !data}
        rowHeight={50}
        hiddenCols={{
          columnVisibilityModel: {
            lastUpdatedAt: false,
          },
        }}
        canExport={pageRoles.canExport}
        canPrint={pageRoles.canPrint}
        sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
      />
    </AppContainer>
  );
};

export default Products;

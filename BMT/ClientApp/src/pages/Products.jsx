/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import InventoryProductModal from 'src/components/Modals/InventoryProductModal';

import AppContainer from 'src/components/UI/AppContainer';
import Loading from 'src/components/UI/Loading';
import { getProductsCols } from 'src/configs/ColumnsConfig/productsCols';
import { countries } from 'src/constants/countries';
import { useFetchProducts } from 'src/hooks/api/useFetchProducts';
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
  const [productRows, setProductRows] = useState([]);

  const { data, loading, fetchProducts } = useFetchProducts();

  const toggleAddProductModal = () => {
    setShowAddProductModal(!showAddProductModal);
  };

  const getProducts = async () => {
    const productsList = await fetchProducts();

    const mappedArray = productsList.map((data) => ({
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

    setProducts(productsList);
    setProductRows(mappedArray);
  };

  const productsCols = getProductsCols(pageRoles, getProducts, products);

  return (
    <AppContainer>
      <DataGridHeader
        title="Packages List"
        addBtnClick={toggleAddProductModal}
      />
      <CustomDatagrid
        rows={productRows}
        columns={productsCols}
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

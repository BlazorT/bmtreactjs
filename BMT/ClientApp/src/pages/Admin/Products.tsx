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

const Products: React.FC = () => {
  useEffect(() => {
    getProducts();
  }, []);

  const pageRoles = useSelector((state: any) => state.navItems.pageRoles).find(
    (item: any) => item.name === 'Products',
  );

  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const [products, setProducts] = useState<any>([]);
  const [productRows, setProductRows] = useState<any[]>([]);

  const { data, loading, fetchProducts } = useFetchProducts();

  const toggleAddProductModal = () => {
    setShowAddProductModal(!showAddProductModal);
  };

  const getProducts = async () => {
    const productsList = await fetchProducts();

    const mappedArray = productsList.map((data) => ({
      id: data.id,
      productName: `${data.name} ,${data.shortCode}`,
      manufactured: countries.find((item) => item.id === data.manufactureCountryId)?.name || null,
      productFor: data.businessEntityId === 1 ? 'DA' : data.businessEntityId === 2 ? 'Vehicle' : '',
      category:
        globalutil.productGroup().find((item: any) => item.id === data.categoryId)?.name || null,
      status: data.status,
      lastUpdatedAt: data.lastUpdatedAt,
    }));

    setProducts(productsList);
    setProductRows(mappedArray);
  };

  const productsCols = getProductsCols(pageRoles, getProducts, products);

  return (
    <AppContainer>
      <DataGridHeader
        title="Product List"
        addButton={pageRoles.canAdd === 1 ? 'Add Product' : ''}
        addBtnClick={toggleAddProductModal}
      />
      <InventoryProductModal
        header="Add Product"
        isOpen={showAddProductModal}
        toggle={toggleAddProductModal}
        getProducts={getProducts}
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

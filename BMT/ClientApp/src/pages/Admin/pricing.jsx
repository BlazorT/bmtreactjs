/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import AppContainer from 'src/components/UI/AppContainer';
import { getPricingCols } from 'src/configs/ColumnsConfig/pricingCols';
import { useFetchPricing } from 'src/hooks/api/useFetchPricing';

const Products = () => {
  useEffect(() => {
    getProducts();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name.toLowerCase() === 'Pricing'.toLowerCase(),
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
    // alert(JSON.stringify(pricingList));
    const mappedArray = pricingList.map((data) => ({
      id: data.id,
      //name: `${data.name} ,${data.shortCode}`,
      name: data.name,
      unitName: data.unitName == null || data.unitName.length <= 0 ? ' - ' : data.unitName,
      unitPrice: data.unitPrice,
      discount: data.discount,
      freeAllowed: data.freeAllowed,
      //category:
      //  globalutil.productGroup().find((item: any) => item.id === data.categoryId)?.name || null,
      startTime: formatDate(data.startTime),
      lastUpdatedAt: data.lastUpdatedAt,
    }));

    setProducts(pricingList);
    //alert(JSON.stringify(mappedArray));
    setPricingRows(mappedArray);
  };

  const pricingCols = getPricingCols(pageRoles, getProducts, products);
  //alert(JSON.stringify(pricingRows));
  return (
    <AppContainer>
      {/* <DataGridHeader title="Network Prices" addBtnClick={toggleAddProductModal} /> */}
      <CustomDatagrid
        rows={pricingRows}
        columns={pricingCols}
        pagination={true}
        loading={loading || !data}
        rowHeight={50}
        canExport={pageRoles.canExport}
        canPrint={pageRoles.canPrint}
        isHeader={true}
        headerProps={{ title: 'Network Prices', filterDisable: true }}
        sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
      />
    </AppContainer>
  );
};

export default Products;

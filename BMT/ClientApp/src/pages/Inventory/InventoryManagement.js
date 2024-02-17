import React, { useEffect, useState } from 'react';

import { cilChevronBottom } from '@coreui/icons';

import InventoryProductModal from '../../components/Modals/InventoryProductModal';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';

import useFetch from 'src/hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import Loading from 'src/components/UI/Loading';
import moment from 'moment';

import AddInventoryModal from 'src/components/Modals/AddInventoryModal';

import { formatDateTime } from 'src/helpers/formatDate';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import LoadingBtn from 'src/components/UI/LoadingBtn';
import { countries } from 'src/constants/countries';
import CustomFilters from 'src/components/Filters/CustomFilters';
import { getInventoryDispatchFiltersFields } from 'src/configs/FiltersConfig/inventoryDisptachFilterConfig';
import { getInventoryCols } from 'src/configs/ColumnsConfig/inventoryCols';
import AppContainer from 'src/components/UI/AppContainer';
import Button from 'src/components/InputsComponent/Button';

const MyDataGrid = () => {
  dayjs.extend(utc);

  useEffect(() => {
    getInventory();
    getProducts();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Inventory Management',
  );
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [showFilters, setShwFilters] = useState(false);
  const [showAddProducutModal, setShowAddProducutModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [submitData, setSubmtiData] = useState([]);
  const initialFilter = {
    keyword: '',
    categoryId: '',
    businessEntityId: '',
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);

  const { response: getProductRes, fetchData: getProduct } = useFetch();
  const { response: inventoryDataRes, fetchData: fetchInventoryData } = useFetch();
  const { fetchData: submitInventoryData } = useFetch();

  const changeFilter = (e, date) => {
    if (date === 'createdAt' || date === 'lastUpdatedAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: e,
      }));
    } else {
      const { name, value } = e.target;

      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const applyFilters = () => {
    const filterBody = {
      keyword: filters.keyword,
      categoryId: filters.categoryId === '' ? 0 : filters.categoryId,
      businessEntityId: filters.businessEntityId === '' ? 0 : filters.businessEntityId,
      createdAt: moment(filters.createdAt).utc().format().toString().split('T')[0],
      lastUpdatedAt: moment(filters.lastUpdatedAt).utc().format().toString().split('T')[0],
    };
    getInventory(filterBody);
  };

  const getInventory = async (filters) => {
    const invBody = {
      dspid: user.dspId.toString(),
      barCode: '',
      id: 0,
      productDetailId: 0,
      purchasedQty: 0,
      rowVer: 0,
      ...filters,
    };
    await fetchInventoryData('/Inventory/inventoryfulldetails', {
      method: 'POST',
      body: JSON.stringify(invBody),
    });
    if (inventoryDataRes.current?.data?.status === true) {
      const mappedArray = inventoryDataRes.current.data.data.map((data, index) => ({
        id: index,
        invId: data.id,
        partName: data.productName + ` ,${data.shortCode}`,
        code: data.shortCode,
        manufacturer: countries.find((item) => item.id === data.manufactureCountryId)?.name || null,
        barCode: data.barCode,
        newStock: data.purchasedQty,
        availableStock: data.totalAvailableStock,
        totalStock: data.totalSoldStock,
        damaged: 0,
        expired: 0,
        stockOut: data.soldQty,
        productDetailId: data.productDetailId,
        dspid: data.dspid,
        lastUpdatedBy: user.userId,
        createdBy: data.createdBy ? data.createdBy : user.userId,
        rowVer: data.rowVer,
        status: data.status,
        createdAt: data.createdAt ? data.createdAt : moment().utc().format(),
        lastUpdated: formatDateTime(data.lastUpdatedAt),
      }));
      console.log({ mappedArray });

      setRowData(mappedArray);
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'somthing went wrong try again later',
          toastVariant: 'error',
        }),
      );
    }
    setIsLoading(false);
  };

  const submitInventory = async () => {
    setIsUpdating(true);
    if (submitData.length > 0) {
      const inventoryBody = submitData.map((data, index) => ({
        id: data.invId,
        barCode: data.barCode ? data.barCode : '',
        shortCode: data.code,
        purchasedQty: data.newStock,
        soldQty: data.stockOut,
        productDetailId: data.productDetailId,
        dspid: user.dspId,
        lastUpdatedBy: user.dspId,
        createdBy: data.createdBy,
        rowVer: data.rowVer,
        status: 1,
        createdAt: data.invId === 0 ? moment().utc().format() : data.createdAt,
        lastUpdatedAt: moment().utc().format(),
      }));
      console.log(JSON.stringify(inventoryBody));
      await submitInventoryData(
        '/Inventory/submitinventory',
        {
          method: 'POST',
          body: JSON.stringify(inventoryBody),
        },
        (res) => {
          if (res.status === true) {
            getInventory();
            setSubmtiData([]);
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: res.message,
                toastVariant: 'success',
              }),
            );
          } else {
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: res.message,
                toastVariant: 'error',
              }),
            );
          }
        },
      );
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'no data is changed',
          toastVariant: 'warning',
        }),
      );
    }
    setIsUpdating(false);
  };

  const getProducts = async (toggle) => {
    const body = {
      id: 0,
      name: '',
      manufactureCountryId: 0,
      groupId: 0,
      status: 0,
      rowVer: 0,
    };

    await getProduct(
      '/BlazorApi/products',
      { method: 'POST', body: JSON.stringify(body) },
      (res) => {
        if (res.status === true) {
          if (toggle) toggleAddInventoryModal();
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'warning',
            }),
          );
        }
      },
    );
  };

  const toggleAddProducutModal = () => {
    setShowAddProducutModal(!showAddProducutModal);
  };
  const toggleAddInventoryModal = () => {
    setShowAddInventoryModal(!showAddInventoryModal);
  };

  const toggleFilters = () => {
    setShwFilters(!showFilters);
  };

  const handleReset = () => {
    setFilters(initialFilter);
    getInventory();
  };

  const inventoryDispatchFiltersFields = getInventoryDispatchFiltersFields(filters, changeFilter);
  const columnDefs = getInventoryCols(isEdit, pageRoles, setRowData, setSubmtiData);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <AppContainer>
        <DataGridHeader
          title="Advance Search"
          otherControls={[{ icon: cilChevronBottom, fn: toggleFilters }]}
          filterDisable={true}
        />
        {showFilters && (
          <CustomFilters
            filters={filters}
            changeFilter={changeFilter}
            fetching={applyFilters}
            handleReset={handleReset}
            filterFields={inventoryDispatchFiltersFields}
          />
        )}
      </AppContainer>
      <AppContainer>
        <DataGridHeader
          title="Invertory Management"
          addButton={pageRoles.canAdd === 1 ? 'Add Inventory' : ''}
          addBtnClick={() => getProducts(true)}
          addSecButton={pageRoles.canAdd === 1 ? 'Add Product (+)' : ''}
          addSecBtnClick={() => toggleAddProducutModal()}
        />
        <InventoryProductModal
          header="Add Product"
          isOpen={showAddProducutModal}
          toggle={toggleAddProducutModal}
          getProducts={getInventory}
        />
        <AddInventoryModal
          header="Add Inventory Item"
          isOpen={showAddInventoryModal}
          toggle={toggleAddInventoryModal}
          productData={getProductRes.current?.data}
          getInventory={getInventory}
        />

        <CustomDatagrid
          rows={rowData}
          columns={columnDefs}
          pagination={true}
          sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
          rowHeight={50}
          // onEditCellChange={handleEditCellChange}
          loading={isUpdating}
          canExport={pageRoles.canExport}
          canPrint={pageRoles.canPrint}
          hiddenCols={{
            columnVisibilityModel: {
              totalStock: false,
              // availableStock: false,
            },
          }}
          summary={[
            {
              field: 'availableStock',
              aggregates: [{ aggregate: 'sum', caption: 'Total Available Stock' }],
            },
            {
              field: 'totalStock',
              aggregates: [{ aggregate: 'sum', caption: 'Total Consumed Stock' }],
            },
          ]}
        />
        <div className="text-end mt-2">
          {isUpdating ? (
            <LoadingBtn title="Updating" />
          ) : (
            <Button title="Save" onClick={submitInventory} />
          )}
        </div>
      </AppContainer>
    </React.Fragment>
  );
};

export default MyDataGrid;

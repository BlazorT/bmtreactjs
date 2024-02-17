import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CRow } from '@coreui/react';
import { cilChevronBottom } from '@coreui/icons';
import dayjs from 'dayjs';
import moment from 'moment';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Loading from 'src/components/UI/Loading';
import LoadingBtn from 'src/components/UI/LoadingBtn';
import { formatDate } from 'src/helpers/formatDate';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import utc from 'dayjs/plugin/utc';
import { getDispatchmentCols } from 'src/configs/ColumnsConfig/disptachmentCols';
import CustomFilters from 'src/components/Filters/CustomFilters';
import { getInventoryDispatchFiltersFields } from 'src/configs/FiltersConfig/inventoryDisptachFilterConfig';

import { getVehicles } from 'src/api/vehicleApi';
import AppContainer from 'src/components/UI/AppContainer';
import DAInventoryModal from 'src/components/Modals/DAInventoryModal';
import Button from 'src/components/InputsComponent/Button';
import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import globalutil from 'src/util/globalutil';
import { useShowToast } from 'src/hooks/useShowToast';

const Dispatchment = () => {
  dayjs.extend(utc);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Dispatchment',
  );
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const initialFilter = {
    keyword: '',
    categoryId: '',
    businessEntityId: '',
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);
  const [showFilters, setshowFilters] = useState(false);
  const [rows, setRows] = useState([]);
  const [daList, setDaList] = useState([]);
  const [submitAssignment, setSubmitAssignment] = useState([]);
  const [addDispatchmentMdl, setAddDispatchmentMdl] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const { response: inventoryDataRes, fetchData: fetchInventoryData } = useFetch();

  const { fetchUsers: getUserbyRole } = useFetchUsers();

  const { response: submitDataRes, fetchData: submitInventoryData } = useFetch();

  const { response: vehicleRes, fetchData: getVehicle } = useFetch();

  const showToast = useShowToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getInventory(), getAssignedList(), fetchVehicleData()]);

        setIsLoading(false);
      } catch (error) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: 'somthing went wrong try again later',
            toastVariant: 'error',
          }),
        );

        setIsLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

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
      id: 0,
      dspid: user.dspId,
      inventoryOf: 0,
      assignedTo: 0,
      isAssigned: 1,
      createdAt: moment().startOf('month').utc().format(),
      lastUpdatedAt: moment().utc().format(),
      remarks: '',
      status: 0,
      rowVer: 0,
      assignmentType: 29,
      ...filters,
    };
    console.log(JSON.stringify(invBody));
    await fetchInventoryData(
      '/Dispatchment/dispatchments',
      {
        method: 'POST',
        body: JSON.stringify(invBody),
      },
      (res) => {
        if (res.data.status) {
          console.log({ res });
          const groupedData = res.data.data.map((data, index) => ({
            ...data,
            index,
            id: index,
            rowId: data.id,
            product: data.productName + `, ${data.shortcode}`,
            availableStock: data.availableQty, // data.inventoryOf == 2 ? 0 :if dont want to count vehic;e in total stock
            maxValue: data.availableQty + data.assignedQty,
            quantity: data.assignedQty,
            businessEntityId: data.businessEntityId,
            isAssigned: data.assignedTo !== 0,
            assignment: data.assignedTo === 0 ? '' : data.assignedTo,
            lastUpdated: data.lastUpdatedAt,
          }));

          setRows(groupedData.map((item, index) => ({ ...item, id: index, index })));
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: inventoryDataRes.current.message
                ? inventoryDataRes.current.message
                : 'somthing went wrong try again later',
              toastVariant: 'error',
            }),
          );
        }
      },
    );

    // setIsLoading(inventoryDataLoading.current);
  };

  const getAssignedList = async () => {
    const daList = await getUserbyRole(3);

    setDaList(daList.filter((da) => da.status !== 4));
  };

  const fetchVehicleData = async () => {
    await getVehicles(user, getVehicle, dispatch);
  };

  function hasDuplicateAssignments(arr) {
    const seenCombinations = {};

    for (const obj of arr) {
      if (obj.assignedTo === 0) return;
      const key = `${obj.productDetailId}_${obj.assignedTo}`;
      console.log({ key });
      if (seenCombinations[key]) {
        return true; // Combination already seen, indicating a duplicate
      }

      seenCombinations[key] = true;
    }

    return false; // No duplicate combinations found
  }
  async function onSave() {
    if (submitAssignment.length > 0) {
      setIsUpdating(true);

      const inventoryBody = submitAssignment.map((data) => {
        return {
          id: data.rowId === 0 ? 0 : data.rowId,
          assignedQty: data.isAssigned ? data.quantity : 0,
          availableQty: data.availableQty,
          assignedTo: data.isAssigned
            ? data.assignment === ''
              ? 0
              : parseInt(data.assignment)
            : 0,
          dspid: user.dspId,
          productDetailId: data.productDetailId,
          vehicleId: data.vehicleId,
          inventoryOf: data.inventoryOf,
          isAssigned: data.isAssigned ? 1 : 0,
          assignmentType: 29,
          remarks: '',
          status: data.status,
          rowVer: data.rowVer,
          createdAt: data.rowId === 0 ? moment().utc().format() : data.createdAt,
          lastUpdatedAt: moment().utc().format(),
          createdBy: data.rowId === 0 ? user.userId : data.createdBy,
          lastUpdatedBy: user.userId,
        };
      });

      if (hasDuplicateAssignments(inventoryBody)) {
        showToast("Can't Assign Same Product to Same Associate", 'warning');
        setIsUpdating(false);
        return;
      }

      console.log(JSON.stringify(inventoryBody));
      console.log({ inventoryBody });
      if (inventoryBody.length > 0) {
        await submitInventoryData('/Dispatchment/submitdadispatchments', {
          method: 'POST',
          body: JSON.stringify(inventoryBody),
        });
        console.log(submitDataRes.current, 'submit res');
        if (submitDataRes.current?.status === true) {
          getInventory();

          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: submitDataRes.current?.message,
              toastVariant: 'success',
            }),
          );
          setSubmitAssignment([]);
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: submitDataRes.current?.message,
              toastVariant: 'error',
            }),
          );
        }
      } else {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: 'No quantity is assigned',
            toastVariant: 'warning',
          }),
        );
      }
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
  }

  const toggleFilters = () => {
    setshowFilters(!showFilters);
  };

  const toggleDispMdl = () => {
    setAddDispatchmentMdl(!addDispatchmentMdl);
  };

  const handleReset = () => {
    setFilters(initialFilter);
    getInventory();
  };

  const dispatchmentCols = getDispatchmentCols(
    setSubmitAssignment,
    vehicleRes,
    setRows,
    daList,
    pageRoles,
    rows,
  );

  const inventoryDispatchFiltersFields = getInventoryDispatchFiltersFields(filters, changeFilter);

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
        <CustomDatagrid
          rows={rows}
          columns={dispatchmentCols}
          rowHeight={50}
          pagination={true}
          loading={isUpdating}
          canExport={pageRoles.canExport}
          canPrint={pageRoles.canPrint}
          sorting={[{ field: 'lastUpdated', sort: 'desc' }]}
          isHeader={true}
          headerProps={{
            title: 'Dispatchment',
            addButton: pageRoles.canAdd === 1 ? 'Add Dispatchment' : '',
            addBtnClick: toggleDispMdl,
          }}
          summary={[
            {
              field: 'quantity',
              aggregates: [{ aggregate: 'sum', caption: 'Total Assigned Quantity' }],
            },
            {
              field: 'availableStock',
              aggregates: [{ aggregate: 'sum', caption: 'Total Available Quantity' }],
            },
            {
              field: 'lastUpdated',
              aggregates: [{ aggregate: 'max', caption: 'Last Disp. Time' }],
            },
          ]}
        />
        <DAInventoryModal
          header="New Dispatchment"
          isOpen={addDispatchmentMdl}
          toggle={toggleDispMdl}
          value={{ id: 0 }}
          daList={daList}
          getInventory={getInventory}
        />
        <CRow className="w-100 d-flex justify-content-end">
          {isUpdating ? (
            <LoadingBtn title="Submiting..." />
          ) : (
            <Button title={'Save'} onClick={onSave} />
          )}
        </CRow>
      </AppContainer>
    </React.Fragment>
  );
};

export default Dispatchment;

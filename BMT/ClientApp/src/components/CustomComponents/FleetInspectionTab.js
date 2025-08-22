/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { updateToast } from 'src/redux/toast/toastSlice';
import useFetch from 'src/hooks/useFetch';
import { formatDateTime } from 'src/helpers/formatDate';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import DataGridHeader from '../DataGridComponents/DataGridHeader';
import AddInspectionModal from '../Modals/AddInspectionModal';
import Loading from '../UI/Loading';
import CustomFilters from '../Filters/CustomFilters';

import { getFleetInspectionCols } from 'src/configs/ColumnsConfig/fleetInspectionCols';
import { getInspectionFiltersFields } from 'src/configs/FiltersConfig/inspectionFiltersConfig';

import { cilChevronBottom } from '@coreui/icons';
import { getUserbyRole } from 'src/api/usersApi';

const FleetInspectionTab = ({ vehicleId, fleetVin, setvehicleId }) => {
  dayjs.extend(utc);
  useEffect(() => {
    fetchVehicleInspection();
    fetchUsersList();
    return () => {
      setvehicleId(0);
    };
  }, []);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [gridMessage, setGridMessage] = useState('');
  const [isAddInspectionMdl, setIsAddInspectionMdl] = useState(false);
  const [rows, setRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    driverName: '',
    status: '',
    lastUpdatedAt: dayjs().utc().format(),
    createdAt: dayjs().subtract(30, 'days').utc().format(),
  });

  const {
    response: vehicleInspRes,
    error: vehicleInspErr,
    loading: vehicleInspLoading,
    fetchData: getVehicleIsnp,
  } = useFetch();

  const {
    response: usersData,
    error: usersDataErr,
    loading: userDataLoading,
    fetchData: fetchUsersGrid,
  } = useFetch();

  const changeFilter = (e, date) => {
    if (date === 'driverName') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: e,
      }));
    } else {
      if (date === 'lastUpdatedAt' || date === 'createdAt') {
        setFilters((prevFilters) => ({
          ...prevFilters,
          [date]: dayjs(e).utc().format(),
        }));
      } else {
        const { name, value, type, checked } = e.target;
        setFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value,
        }));
      }
    }
  };

  const fetchVehicleInspection = async (filter) => {
    const inspBody = {
      id: 0,
      rowVer: 0,
      vehicleId: vehicleId,
      status: 0,
      dspId: user.dspId,
      inspectedBy: filter ? (filters.driverName !== '' ? filters.driverName?.id : 0) : 0,
      reportTypeId: filter ? (filters.status !== '' ? filters.status : 0) : 0,
      createdAt: dayjs(filters.createdAt).utc().format('YYYY-MM-DD'),
      lastUpdatedAt: dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD') 
    };

    await getVehicleIsnp(
      '/Vehicles/inspectionswithitems',
      { method: 'POST', body: JSON.stringify(inspBody) },
      (res) => {
        if (res.data.status && res.errorCode !== '407') {
          if (res.data.data.length < 1) {
            setGridMessage('No Inspection Reports');
            setRows([]);
          } else {
            const mappedRows = res.data.data.map((data) => ({
              id: data.id,
              date: formatDateTime(data.createdAt),
              vin: data.vehicleWinCode,
              type: data.reportTypeId,
              inspector: data.inspectorName,
              result: data.status,
              defectCategory: '',
              lastUpdatedAt: data.lastUpdatedAt,
            }));
            setRows(mappedRows);
          }
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          setRows([]);
        }
      },
    );
    setIsLoading(false);
  };

  const fetchUsersList = async () => {
    await getUserbyRole(user, 0, fetchUsersGrid, dispatch);
    setIsLoading(userDataLoading.current);
  };

  const handleReset = () => {
    setFilters({
      driverName: '',
      status: '',
      lastUpdatedAt: dayjs().utc().format(),
      createdAt: dayjs().subtract(30, 'days').utc().format(),
    });
    fetchVehicleInspection();
  };

  const fleetInspectionCols = getFleetInspectionCols(fetchVehicleInspection, vehicleInspRes, rows);
  const inspectionFiltersFields = getInspectionFiltersFields(usersData, filters, changeFilter);
  return (
    <React.Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <div className="mt-2 bg_Div d-flex flex-column">
            <DataGridHeader
              title="Advance Search"
              otherControls={[{ icon: cilChevronBottom, fn: () => setShowFilters(!showFilters) }]}
              filterDisable={true}
            />
            {showFilters && (
              <CustomFilters
                filters={filters}
                changeFilter={changeFilter}
                fetching={fetchVehicleInspection}
                handleReset={handleReset}
                filterFields={inspectionFiltersFields}
              />
            )}
          </div>
          <div className="mt-2 bg_Div d-flex flex-column">
            <DataGridHeader
              title="Inspection Detail"
              addButton={vehicleId !== 0 && 'Add Inspection'}
              addBtnClick={() => setIsAddInspectionMdl(true)}
            />
            <CustomDatagrid
              rows={rows}
              columns={fleetInspectionCols}
              rowHeight={40}
              pagination={true}
              pageNumber={10}
              canExport={1}
              canPrint={1}
              sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
              noRowsMessage={gridMessage}             
            />
            <AddInspectionModal
              header="Inspection Report"
              isOpen={isAddInspectionMdl}
              toggle={() => setIsAddInspectionMdl(!isAddInspectionMdl)}
              vehicleId={vehicleId}
              fleetVin={fleetVin}
              fetchInspection={fetchVehicleInspection}
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default FleetInspectionTab;

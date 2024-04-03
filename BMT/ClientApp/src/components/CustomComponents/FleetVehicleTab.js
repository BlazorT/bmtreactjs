/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import VehicleCustomCell from '../DataGridCustomCells/VehicleCustomCell';
import OwnershipCustomCell from '../DataGridCustomCells/OwnershipCustomCell';
import StatusCustomCell from '../DataGridCustomCells/StatusCustomeCell';
import DataGridHeader from '../DataGridComponents/DataGridHeader';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from 'src/hooks/useFetch';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import { updateToast } from 'src/redux/toast/toastSlice';
import { getVehicleGridValueById } from 'src/constants/vehicle_util';
import Loading from '../UI/Loading';
import VehicleActionCell from '../DataGridCustomCells/VehicleActionCell';
import { cilChevronBottom, cilFlagAlt, cilUser } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import CustomInput from '../InputsComponent/CustomInput';
import moment from 'moment';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import globalutil from 'src/util/globalutil';
import AddVehicleModal from '../Modals/AddVehicleModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

function FleetVehicleTab({ daList, setActiveTab, setvehicleId, setFleetVin }) {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    status: '',
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
    createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
    ownership: '',
  });

  useEffect(() => {
    fetchVehicleData();
  }, []);

  const {
    response: vehicleRes,
    error: vehicleErr,
    loading: vehicleLoading,
    fetchData: getVehicle,
  } = useFetch();

  const changeFilter = (e, date) => {
    if (date === 'lastUpdatedAt' || date === 'createdAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: moment(e).utc().format(),
      }));
    } else {
      const { name, value, type, checked } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const fetchVehicleData = async (filter) => {
    const getVehicleBody = {
      dspid: user.dspId,
      color: '',
      createdAt: moment(filters.createdAt).utc().format().toString().split('T')[0],
      lastUpdatedAt: moment(filters.lastUpdatedAt).utc().format().toString().split('T')[0],
      stateId: 0,
      id: 0,
      status: filter ? (filters.status === '' ? 0 : filters.status) : 0,
      ownershipTypeId: filter ? (filters.ownership === '' ? 0 : filters.ownership) : 0,
      name: filter ? filters.name : '',
    };

    await getVehicle(
      '/Vehicles/vehiclesdata',
      {
        method: 'POST',
        body: JSON.stringify(getVehicleBody),
      },
      (res) => {
        if (res.status === true && res.errorCode != '407') {
          const mappedRows = res.data.data.map((data) => ({
            id: data.id,
            Vehicle: getVehicleGridValueById('make', data.makeDetailId) + ', ' + data.name,
            VIN: data.code,
            VehicleId: data.fleetCode + ' | ' + data.numberPlate,
            Expiration: data.expiryDate && formatDate(data.expiryDate),
            Ownership: data.ownershipTypeId,
            OwnershipType:
              data.categoryId !== null &&
              data.address !== null &&
              data.address + ' ' + getVehicleGridValueById('vehicleType', data.categoryId),
            OwnershipStatus: 'Active',
            status: data.status,
            lastUpdatedAt: data.lastUpdatedAt,
          }));

          setvehicleRows(mappedRows);
          setColumns(cols);
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          setvehicleRows([]);
        }
      },
    );
    setIsLoading(false);
  };
  const cols = [
    {
      field: 'Vehicle',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Vehicle',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => <VehicleCustomCell value={params} />,
    },
    {
      field: 'Ownership',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Ownership & Type',
      flex: 1,
      minWidth: 170,
      renderCell: (params) => <OwnershipCustomCell value={params} />,
    },
    {
      field: 'Expiration',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Expiration',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'Operational',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Operational ',
      sortable: false,
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <StatusCustomCell value={params} />,
    },
    {
      field: 'lastUpdatedAt',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Last Update Time ',
      sortable: false,
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDateTime(params.row.lastUpdatedAt),
    },
    {
      field: 'status',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Action',
      sortable: false,
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <VehicleActionCell
          daList={daList}
          value={params}
          vehicle={vehicleRes.current.data.data.find((item) => item.id === params.row.id)}
          fetchVehicleData={fetchVehicleData}
          setActiveTab={setActiveTab}
          setvehicleId={setvehicleId}
          setFleetVin={setFleetVin}
        />
      ),
    },
  ];
  const [vehicleColumns, setColumns] = useState([]);

  const [vehicleRows, setvehicleRows] = useState([]);

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
              <form onSubmit={(e) => e.preventDefault()}>
                <CRow className="">
                  <CRow>
                    <CCol sm={4}>
                      <CustomInput
                        label="Fieldword"
                        value={filters.name}
                        onChange={changeFilter}
                        icon={cilUser}
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Vehicle Name"
                        className="form-control item"
                        isRequired={false}
                        // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol sm={4}>
                      <CustomSelectInput
                        label="Status"
                        icon={cilFlagAlt}
                        id="status"
                        options={globalutil.vehiclestatuss()}
                        className="form-control item form-select"
                        value={filters.status}
                        name="status"
                        onChange={(e) => changeFilter(e)}
                      />
                    </CCol>
                    <CCol sm={4}>
                      <CustomSelectInput
                        label="Ownership"
                        icon={cilFlagAlt}
                        id="ownership"
                        options={globalutil.ownerships()}
                        className="form-control item form-select"
                        value={filters.ownership}
                        name="ownership"
                        onChange={(e) => changeFilter(e)}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="d-flex justify-content-end align-items-center">
                    <button
                      type="button"
                      className="btn_Default m-2 sales-btn-style alignLeft"
                      onClick={() => {
                        fetchVehicleData();
                        setFilters({
                          name: '',
                          status: '',
                          lastUpdatedAt: dayjs().utc().startOf('day').format(),
                          createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
                          ownership: '',
                        });
                      }}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn_Default m-2 sales-btn-style alignLeft"
                      onClick={() => fetchVehicleData(filters)}
                    >
                      Search
                    </button>
                  </CRow>
                </CRow>
              </form>
            )}
          </div>
          <div className="mt-2 bg_Div d-flex flex-column">
            <DataGridHeader
              title="Vehicle"
              addButton={'Add Vehicle'}
              addBtnClick={() => setIsAddVehicleModalOpen(true)}
            />
            <CustomDatagrid
              rows={vehicleRows}
              columns={vehicleColumns}
              rowHeight={'auto'}
              pagination={true}
              loading={isLoading}
              pageNumber={4}
              sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
              canPrint={1}
              canExport={1}
            />
            <AddVehicleModal
              header="Add Vehicle"
              isOpen={isAddVehicleModalOpen}
              onSave={() => setIsAddVehicleModalOpen(false)}
              onCancel={() => setIsAddVehicleModalOpen(false)}
              daList={daList}
              fetchVehicleData={fetchVehicleData}
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default FleetVehicleTab;

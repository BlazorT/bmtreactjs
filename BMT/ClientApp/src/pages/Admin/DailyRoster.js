import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import moment from 'moment';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Loading from 'src/components/UI/Loading';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import utc from 'dayjs/plugin/utc';
import { getDailyRosterCols } from 'src/configs/ColumnsConfig/dailyRosterCols';
import { getUserbyRole } from 'src/api/usersApi';
import AddRosterModel from 'src/components/Modals/AddRosterModel';
import { getVehicles } from 'src/api/vehicleApi';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import { cilInfo } from '@coreui/icons';
import { CCol } from '@coreui/react';
import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';

const DailyRoster = () => {
  dayjs.extend(utc);
  useEffect(() => {
    getRoster();
    fetchUsersData();
    fetchVehicleData();
  }, []);

  const { response: rosterList, fetchData: fetchRosterData } = useFetch();
  const { fetchData: fetchVehicle } = useFetch();
  const { fetchData: fetchUsers } = useFetch();
  const { fetchData: fetchRoster } = useFetch();
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();

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
  const [currRosterId, setCurrRosterId] = useState(0);
  const [daList, setDaList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRosterMdlOpen, setIsRosterMdlOpen] = useState(false);

  // const changeFilter = (e, date) => {
  //   if (date === 'createdAt' || date === 'lastUpdatedAt') {
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       [date]: e,
  //     }));
  //   } else {
  //     const { name, value } = e.target;

  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       [name]: value,
  //     }));
  //   }
  // };

  // const applyFilters = () => {
  //   const filterBody = {
  //     keyword: filters.keyword,
  //     categoryId: filters.categoryId === '' ? 0 : filters.categoryId,
  //     businessEntityId: filters.businessEntityId === '' ? 0 : filters.businessEntityId,
  //     createdAt: moment(filters.createdAt).utc().format().toString().split('T')[0],
  //     lastUpdatedAt: moment(filters.lastUpdatedAt).utc().format().toString().split('T')[0],
  //   };
  //   getInventory(filterBody);
  // };

  const getRoster = async (filters) => {
    const rosterBody = {
      dspId: user.dspId,
      id: 0,
      rosterTypeId: 0,
      rowVer: 0,
      status: 0,
      lastUpdatedAt: moment().utc().format('YYYY-MM-DD'),
      createdAt: moment().subtract(1, 'month').utc().format('YYYY-MM-DD'),
      ...filters,
    };

    await fetchRosterData(
      '/RosterPlan/rosterplans',
      {
        method: 'POST',
        body: JSON.stringify(rosterBody),
      },
      (res) => {
        if (res.status) {
          const mappedArray = res.data.map((data, index) => ({
            ...data,
            id: data.id,
            index: index + 1,
            transportId: 'ASTKW8TTR5565',
            importName: 'Kenneth Vincent',
            associate: 14308,
            sunday: 'Active',
            monday: 'Active',
            tuesday: 'Active',
            wednesday: 'Active',
            thursday: 'Active',
            friday: 'Active',
            saturday: 'Active',
            imageUrl: '',
          }));

          const firstObject = {
            id: 0,
            index: 0,
            transportId: '',
            importName: '',
            associate: '',
            sunday: '',
            saturday: '',
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            sunToggle: false,
            monToggle: true,
            tueToggle: true,
            wedToggle: false,
            thuToggle: true,
            friToggle: true,
            satToggle: true,
          };
          setRows([firstObject, ...mappedArray]);
        } else {
          showToast(res.message, 'error');
          setRows([]);
        }
      },
    );
    setIsLoading(false);
  };

  const fetchRosterById = async (id) => {
    const rosterBody = {
      dspId: user.dspId,
      id: id,
      rosterTypeId: 1,
      rowVer: 0,
      status: 1,
      lastUpdatedAt: moment().utc().format('YYYY-MM-DD'),
      createdAt: moment().subtract(1, 'month').utc().format('YYYY-MM-DD'),
    };

    await fetchRoster(
      '/RosterPlan/rosterfleetplan',
      {
        method: 'POST',
        body: JSON.stringify(rosterBody),
      },
      (res) => {},
    );
  };

  const fetchUsersData = async () => {
    const das = await getUserbyRole(user, 3, fetchUsers, dispatch);
    setDaList(das);
  };

  const fetchVehicleData = async () => {
    const vehicle = await getVehicles(user, fetchVehicle);
    if (vehicle.status) {
      setVehicleList(vehicle.data);
    } else {
      showToast(vehicle.message, 'error');
    }
  };

  const handleRosterId = (e) => {
    setCurrRosterId(e.target.value);
    if (e.target.value !== '') {
      fetchRosterById(e.target.value);
    }
  };

  const toggleFilters = () => {
    setshowFilters(!showFilters);
  };

  const toggleRosterMdl = () => {
    setIsRosterMdlOpen(!isRosterMdlOpen);
  };

  const handleReset = () => {
    setFilters(initialFilter);
    getRoster();
  };

  const dailyRoasterCols = getDailyRosterCols(setRows, pageRoles, daList, rows, vehicleList);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      {/* <div className="bg_Div d-flex flex-column">
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
      </div> */}
      <div className="bg_Div mt-2 d-flex flex-column">
        <DataGridHeader
          title="Daily Roster"
          addButton={pageRoles.canAdd === 1 ? 'Roster' : ''}
          addBtnClick={toggleRosterMdl}
        />
        <CCol sm={4}>
          <CustomSelectInput
            label="Roster"
            value={currRosterId}
            onChange={handleRosterId}
            icon={cilInfo}
            id="currRosterId"
            name="currRosterId"
            options={rosterList.current?.data}
            isRequired={true}
            disableOption="Select Roster"
            message="select Roster"
          />
        </CCol>
        <CustomDatagrid
          rows={rows}
          columns={dailyRoasterCols}
          rowHeight={55}
          pagination={true}
          loading={isLoading}
          canExport={pageRoles.canExport}
          canPrint={pageRoles.canPrint}
          justifyContent="left"
        />
        <AddRosterModel
          header="Create Roster"
          isOpen={isRosterMdlOpen}
          toggle={toggleRosterMdl}
          daList={daList}
          vehicleList={vehicleList}
          user={user}
          getRoster={getRoster}
        />
      </div>
    </React.Fragment>
  );
};

export default DailyRoster;

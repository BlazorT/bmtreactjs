/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  cilUser,
  cilCarAlt,
  cilCalendar,
  cilChevronBottom,
  cilFlagAlt,
} from '@coreui/icons';
import { GridToolbarQuickFilter } from '@mui/x-data-grid';

import CustomSearch from 'src/components//InputsComponent/CustomSearch';
import { getVehicles } from 'src/api/vehicleApi';
import CIcon from '@coreui/icons-react';
import { getWeekRange } from 'src/helpers/getWeekDate';
import DateRangeSelector from 'src/components/Component/DateRangeSelector';
import RosterWeeksCell from 'src/components/DataGridCustomCells/RosterWeeksCell';
import ColapseRosterCell from 'src/components/DataGridCustomCells/ColapseRosterCell';

import { formatDate, formatDateTime, formatTime } from 'src/helpers/formatDate';
import { getDAPerformancePdf } from 'src/helpers/getDAPerformancePdf';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import moment from 'moment';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import dayjs from 'dayjs';
import { CContainer } from '@coreui/react';
import { getVehicleGridValueById } from 'src/constants/vehicle_util';
import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import Tooltip from '@mui/material/Tooltip';
import RosterGridHeader from 'src/components/DataGridCustomCells/RosterGridHeader';

import utc from 'dayjs/plugin/utc';
import Loading from 'src/components/UI/Loading';
import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';

const DailyPerformanceReport = ({ reportField, fetchInspection, value }) => {
  dayjs.extend(utc);

  // const getDispatchmentCols = (setSubmitAssignment, vehicleRes, setRows, daRes, pageRoles);
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Dispatchment Report',
  );
  const [da, setDa] = useState('');
  const [daList, setDaList] = useState([]);
  const [rows, setRows] = useState([]);

  const [vehicleData, setVehicleData] = useState([]);
  const { fetchUsers } = useFetchUsers();

  const {
    response: vehicleRes,
    error: vehicleErr,
    loading: vehicleLoading,
    fetchData: getVehicle,
  } = useFetch();
  useEffect(() => {
    fetchVehicleData();
    getDasList();
  }, []);
  const getDasList = async () => {
    const usersList = await fetchUsers(3);
    const filterOffBoardedDa = usersList.filter((da) => da.status !== 4);
    setDaList(filterOffBoardedDa);
    setDa(filterOffBoardedDa[0]);
    // getDaInventory(filterOffBoardedDa[0].id);
  };
  const fetchVehicleData = async (filter) => {
    const getVehicleBody = {
      dspid: user.dspId,
      color: '',
      createdAt: moment().utc().startOf('year').format().toString().split('T')[0],
      lastUpdatedAt: moment().utc().format(),
      stateId: 0,
      id: 0,
      status: 0,
      ownershipTypeId: filter ? (filters.ownership === '' ? 0 : filters.ownership) : 0,
      name: '',
      VehicleId: 0,
    };
    console.log({ getVehicleBody });
    await getVehicle(
      '/Vehicles/vehiclesdata',
      {
        method: 'POST',
        body: JSON.stringify(getVehicleBody),
      },
      (res) => {
        if (res) {
          setVehicleData(res.data.data);
          console.log({ res }, 'vehicle');
        }
      },
    );
    setIsLoading(false);
  };
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const initialFilter = {
    dspid: user.dspId.toString(),
    keyword: '',
    VehicleId: '',
    da: '',
    status: 0,
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
    createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
  };
  const [filters, setFilters] = useState(initialFilter);

  const generatePdf = async () => {
    
    const reportRows = makeGroupingRows(rows);
    const doc = getDAPerformancePdf(reportRows, reportField);
    doc.output('dataurlnewwindow');
  };

 

  const [vehDisprows, setVehDispRow] = useState([
    {
      id: 1,
      sunday: 'Sun, Feb 04',
      monday: 'Mon, Feb 05',
      tuesday: 'Tue, Feb 06',
      wednesday: 'Wed, Feb 07',
      thursday: 'Thu, Feb 08',
      friday: 'Fri, Feb 09',
      saturday: 'Sat, Feb 10',
      Ave: '',
    
    },
    {
      id: 2,
      name:'POD',
      sunday: '98.51%',
      monday: '',
      tuesday: '98.66%',
      wednesday: '',
      thursday: '98.78%',
      friday: '',
      saturday: '',
      Ave: '98.7%',

    },
    {
      id: 3,
      name: 'CC',
      sunday: '98.51%',
      monday: '',
      tuesday: '',
      wednesday: '98.78%',
      thursday: '',
      friday: '',
      saturday: '98.66%',
      Ave: '98.7%',

    },
    {
      id: 4,
      name: 'DSB',
      sunday: '98.51%',
      monday: '',
      tuesday: '98.78%',
      wednesday: '',
      thursday: '98.66%',
      friday: '',
      saturday: '',
      Ave: '98.7%',

    },
    
  ]);

  const [vehDispcolumns, setVehDispcolumns] = useState([
    
    {
      field: 'name',
      headerClassName: 'custom-header-data-grid',
      minWidth: 100,
      // maxWidth:180,
      flex: 1,
      headerName: 'Name',
      editable: false,
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) =>
        params.row.name && <strong className="m-0 p-0 ">{params.row.name}</strong>,

    },
    {
      field: 'sunday',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      // maxWidth:180,
      flex: 1,
      editable: false,
      headerName: 'Sunday',
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
   
    },
    {
      field: 'monday',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      flex: 1,
      headerName: 'Monday',
      editable: false,
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
     
    },
    {
      field: 'tuesday',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      flex: 1,
      headerName: 'Tuesday',
      editable: false,
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
     
    },
    {
      field: 'wednesday',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      flex: 1,
      headerName: 'Wednesday',
      editable: false,
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
     
    },
    {
      field: 'thursday',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      headerName: 'Thursday',
      flex: 1,
      editable: false,
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
     
    },
    {
      field: 'friday',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      flex: 1,
      headerName: 'Friday',
      editable: false,
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      
    },
    {
      field: 'saturday',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      flex: 1,
      headerName: 'Saturday',
      editable: false,
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
     
    },
    {
      field: 'Ave',
      headerClassName: 'custom-header-data-grid',
      minWidth: 110,
      flex: 1,
      editable: false,
      filterable: false,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
     
    },



  ]);
  const [showStock, setShowStock] = useState(false);
  //const [filters, setFilters] = useState({
  //  keyword: '',
  //  status: '',
  //  lastUpdatedAt: moment().utc().format(),
  //  createdAt: moment().utc().startOf('year').format(),
  //  dsp: '',
  //});
  const makeGroupingRows = (data) => {
    const updatedData = [];
    const uniqueDescValues = [...new Set(data.map((item) => item.daName))];

    uniqueDescValues.forEach((uniqueDesc) => {
      const id = Math.floor(Math.random() * 900) + 100; // Replace this with your actual parent name
      const group = uniqueDesc;

      updatedData.push({ group, id });

      data
        .filter((item) => item.daName === uniqueDesc)
        .forEach((item) => {
          updatedData.push(item);
        });
    });
    const mappedArray = updatedData.map((field) => {
      let mappedObject;

      if (field.group) {
        mappedObject = {
          group: field.daName,
        };
      } else {
        mappedObject = {
          vehicleName: field.vehicleName,
          quantity: field.quantity,
          lastUpdated: field.lastUpdated,
        };
      }

      return mappedObject;
    });
    const grouping = mappedArray.flatMap((item, index) => {
      if (item.group) {
        const group = [item.group, '', ''];
        const headerRow = ['Part and Accessories', 'Defects', '4'];
        return [group, headerRow];
      } else {
        const rowData = [item.vehicleName, item.quantity, item.lastUpdated];
        return [rowData];
      }
    });
    console.log({ grouping });
    return grouping;
  };
  const toggleStock = () => {
    setShowStock((prev) => !prev);
  };
  const changeFilter = (e, date) => {
    if (date === 'lastUpdatedAt' || date === 'createdAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: moment(e).utc().format(),
      }));
    }
    else if (date == 'VehicleId') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        VehicleId: e,
      }));

    }
    else {
      const { name, value, type, checked } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };
  const [showFilters, setshowFilters] = useState(false);

  const toggleFilters = () => {
    setshowFilters(!showFilters);
  };
  if (isLoading) {
    return <Loading />;
  }

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const sundayThisWeek = new Date(
    today.getTime() - (dayOfWeek === 0 ? 0 : dayOfWeek) * 24 * 60 * 60 * 1000,
  );

  const saturdayNextWeek = new Date(sundayThisWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

  const isWithinWeek = (start, end, weekStart, weekEnd) => {
    return start <= weekEnd && end >= weekStart;
  };
  const [startDate, setStartDate] = useState(sundayThisWeek);
  const [endDate, setEndDate] = useState(saturdayNextWeek);
  const weeks = getWeekRange(startDate, endDate);
  //const dispatchmentCols = getDispatchmentCols(

  //  vehicleRes,
  //  setRows,
  //  daRes,
  //  pageRoles,
  //);
  return (
    <>
      <div className="">
        <div className="bg_Div mb-2 d-flex flex-column">
          <div className="dashboard-stock-header dashboard-drop">
            <div className="pointer" onClick={() => toggleStock()}>
              Advance Search
            </div>
            <CIcon
              className="stock-toggle-icon"
              onClick={() => toggleStock()}
              icon={cilChevronBottom}
            />
          </div>
          {showStock == true ? (
            <div className="show-stock">
              <div className="mb-0 dashboard-table padLeftRight">
                <div className="row">
                  <div className="col-md-6">
                    <CustomSearch
                      label="DA"
                      value={filters.da}
                      onChange={(e) => {
                        setDa(e);
                      }}
                      //onChange={changeFilter}
                      icon={cilUser}
                      type="text"
                      id="dispatchDa"
                      name="dispatchDa"
                      data={daList}
                      isRequired={false}
                      title="using by DA name"
                      placeholder="search DA..."

                    />
                  </div>

                  <div className="col-md-6">

                    <CustomSearch
                      label="Vehicle"
                      value={filters.VehicleId}
                      onChange={(e) => changeFilter(e, 'VehicleId')}
                      icon={cilCarAlt}
                      type="text"
                      id="vehicleName"
                      name="vehicleName"
                      data={vehicleData}
                      isRequired={false}
                      title="using by vehicle name"
                      placeholder="search vehicle..."

                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mt-3">
                    <label className="login_label labelName mb-2">Week</label>
                    <DateRangeSelector
                      icon={cilCalendar}
                      title="Week"
                      startDate={startDate}
                      endDate={endDate}
                      setEndDate={setEndDate}
                      setStartDate={setStartDate}
                    />
                  </div>
                  <div className="col-md-6 mt-2">
                    <CustomDatePicker
                      icon={cilCalendar}
                      label="Roster Date (>=)"
                      id="lastUpdatedAt"
                      name="lastUpdatedAt"
                      value={filters.lastUpdatedAt}
                      title="Roster Date"
                      onChange={(e) => changeFilter(e, 'lastUpdatedAt')}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6"> </div>
                  <div className="col-md-6">
                    <div className="mt-2">
                      <button
                        type="button"
                        title="Click for searching user report data"
                        className="btn_Default m-2 sales-btn-style alignLeft"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="bg_Div mb-2 d-flex flex-column">
          <DataGridHeader exportFn={() => generatePdf()} title="DA Performance Report" />
          <div className="show-stock">
            <div className="row ">
              <div className="col-md-12 col-xl-12">
                <CustomDatagrid
                  rows={vehDisprows}
                  columns={vehDispcolumns}
                  rowHeight={55}
                  pagination={true}
                  canExport={pageRoles.canExport}
                  canPrint={pageRoles.canPrint}

                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-xl-12 mt-2">
            <div className="d-flex justify-content-end align-items-center ">
              <button type="button" className="btn_Default m-2 sales-btn-style">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};
export default DailyPerformanceReport;

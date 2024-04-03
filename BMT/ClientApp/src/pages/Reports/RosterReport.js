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
import CustomSearch from 'src/components//InputsComponent/CustomSearch';
import { getVehicles } from 'src/api/vehicleApi';
import CIcon from '@coreui/icons-react';
import { getWeekRange } from 'src/helpers/getWeekDate';
import DateRangeSelector from 'src/components/Component/DateRangeSelector';

import { formatDate, formatDateTime, formatTime } from 'src/helpers/formatDate';
import { getRosterPdf } from 'src/helpers/getRosterPdf';
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

import utc from 'dayjs/plugin/utc';
import Loading from 'src/components/UI/Loading';
//import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';

const rosterReport = ({ reportField, fetchInspection, value }) => {
  dayjs.extend(utc);

  // const getDispatchmentCols = (setSubmitAssignment, vehicleRes, setRows, daRes, pageRoles);
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Dispatchment Report',
  );
  const [da, setDa] = useState('');
  const [daList, setDaList] = useState([]);

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
      status:  0,
      ownershipTypeId: filter ? (filters.ownership === '' ? 0 : filters.ownership) : 0,
      name:  '',
      VehicleId:  0,
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
          console.log({res}, 'vehicle');
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
    const body = {
      id: rows[0].id,
    };
    const reportRows = makeGroupingRows(rows);
    const doc = getRosterPdf(reportRows, reportField);
    doc.output('dataurlnewwindow');
  };

  const [rows, setRows] = useState([
    {
      id: 1,
      date: '01/16/2024',
      vName: 'Toyota Gli, V4546846, Sedan',
      quantity: '--',
      daName: 'Amir Yameen',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
    //{
    //  id: 2,
    //  date: '01/10/2024',
    //  //vName: 'Toyota Xli',
    //  quantity: '22',
    //  daName: 'Asif hussain, 20989029',
    //  lastUpdated: '9:45:13',

    //},
    {
      id: 2,
      /* date: '01/16/2024',*/
      pName: 'Geraldine, 837899',
      quantity: '--',
      //daName: 'M Junaid',
      lastUpdated: '9:45:13',
     // vehicleCount: 5,
    },
    {
      id: 3,
      /* date: '01/16/2024',*/
      pName: ' Left Side Mirror, L987',
      quantity: '10',
      daName: 'M Junaid',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
    {
      id: 12,
      /* date: '01/16/2024',*/
      pName: ' right Side Mirror, L987',
      quantity: '12',
      daName: 'M Junaid',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
    {
      id: 7,
      /* date: '01/16/2024',*/
      pName: ' Exterior toxic, u6988',
      quantity: '--',
      daName: 'M salman',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
    {
      id: 4,
      /* date: '01/16/2024',*/
      vName: 'Honda Civic, V45008, Sedan',
      //quantity: '22',
      //daName: 'Amir hussain, 20989029',
      //lastUpdated: '9:45:13',
    },
    {
      id: 5,
      /* date: '01/16/2024',*/
      pName: '888722,Sneakers, U7789',
      quantity: '--',
      daName: 'Amir hussain',
      lastUpdated: '9:45:13',
      vehicleCount: 0,
    },
  ]);

  const [vehDisprows, setVehDispRow] = useState([
    {
      id: 1,
      date: '01/16/2024',
      daName: '5',
      quantity: '10',
      //vinCode: '22U88',
      //daName: 'Basedine, 089029',
      //lastUpdated: '9:45:13',
      vehicleCount: 0,
    },
    //{
    //  id: 2,
    //  date: '01/10/2024',
    //  //vName: 'Toyota Xli',
    //  quantity: '22',
    //  daName: 'Asif hussain, 20989029',
    //  lastUpdated: '9:45:13',

    //},
    {
      id: 3,
      daName: 'Basedine, 089029',
      startWeek: 'Sun, Jan 28',
      quantity: 'Toyota Grandee,U8078',
      // daName: '776389'
      endWeek: 'Sat, Feb 03',
      vehicleCount: 5,
    },
    {
      id: 8,
      daName: 'Geraldine, 089029',
      startWeek: 'Sun, Jan 28',
      quantity: 'Toyota Gli,U87998',
      // daName: 'Zeeshan ahmad',
      endWeek: 'Sat, Feb 03',
      vehicleCount: 5,
    },

    {
      id: 5,
      date: '02/01/2024',
      daName: '8',
      quantity: '12',
      // vehicleName: 'Toyota Revo,U878',
      // vCode: 'UNO2898',
    //  daName: 'Geraldine, 837899',
      // lastUpdated: '9:45:13',
      vehicleCount: 0,
    },
    {
      id: 6,
      daName: 'palisten, 837009',
      startWeek: 'Sun, Jan 28',
      quantity: 'Toyota Corolla,U998',
      //daName: 'Abdul Basit, 2098',
      endWeek: 'Sat, Feb 03',
      vehicleCount: 5,
    },
    {
      id: 9,
      daName: 'dinewarm, 834499',
      startWeek: 'Sun, Jan 28',
      quantity: 'Toyota Revo,U878',
      //daName: 'Abdul Basit, 2098',
      endWeek: 'Sat, Feb 03',
      vehicleCount: 5,
    },
  ]);
 
  const [vehDispcolumns, setVehDispcolumns] = useState([
    {
      field: 'date',
      headerClassName: 'custom-header-data-grid',
      width: 150,
      //   flex: 1,
      headerName: 'Roster Date',
      filterable: false,
      sortable: false,
      renderCell: (params) =>
        params.row.date && <h6 className="m-0 p-0 fw-bold">{params.row.date}</h6>,
    },
    {
      /* flex: 1,*/
      minWidth: 220,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: 'DA',
      type: 'text',
      align: 'left',
      headerAlign: 'left',
      field: 'daName',
      editable: false,
      renderCell: (params) =>
        params.row.daName && <strong className="m-0 p-0 ">{params.row.daName}</strong>,
    },

    {
      field: 'startWeek',
      headerClassName: 'custom-header-data-grid',
      minWidth: 150,
      flex: 1,
      headerName: 'Start Week',
      editable: false,
      filterable: true,
    },
    {
      field: 'endWeek',
      headerClassName: 'custom-header-data-grid',
      minWidth: 130,
      /* flex: 1,*/
      headerName: 'End Week',
      sortable: false,
      filterable: false,

      //renderCell: (params) => !params.row.date && formatTime(params.row.lastUpdated),
    },
    {
      /*flex: 1,*/
      minWidth: 220,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: 'Vehicle',
      type: 'text',
      align: 'left',
      headerAlign: 'left',
      field: 'quantity',
      editable: false,
      renderCell: (params) =>  params.row.quantity,
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
                      onChange={(e) => changeFilter(e,'VehicleId')}
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
              <DataGridHeader exportFn={() => generatePdf()} title="Roster Report" />
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
export default rosterReport;

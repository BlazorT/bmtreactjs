/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  cilUser,
  cilCloudDownload,
  cilCalendar,
  cilChevronBottom,
  cilFlagAlt,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { formatDate, formatDateTime, formatTime } from 'src/helpers/formatDate';
import { getDispatchmentPdf } from 'src/helpers/getDispatchmentPdf';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import moment from 'moment';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import dayjs from 'dayjs';
import { CContainer } from '@coreui/react';
import utc from 'dayjs/plugin/utc';
import Loading from 'src/components/UI/Loading';
import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';

const DispatchmentReport = ({ reportField, fetchInspection, value }) => {
  dayjs.extend(utc);
  const { response: inventoryDataRes, fetchData: fetchInventoryData } = useFetch();

  // const getDispatchmentCols = (setSubmitAssignment, vehicleRes, setRows, daRes, pageRoles);
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Dispatchment Report',
  );

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['DA Dispatchment', 'Vehicle Dispatchment'];
  //useEffect(() => {
  //  //const fetchData = async () => {
  //  //  try {
  //  //    await Promise.all(getInventory());
  //  //    setIsLoading(false);
  //  //  } catch (error) {
  //  //    dispatch(
  //  //      updateToast({
  //  //        isToastOpen: true,
  //  //        toastMessage: 'somthing went wrong try again later',
  //  //        toastVariant: 'error',
  //  //      }),
  //  //    );

  //  //    setIsLoading(false);
  //  //  }
  //  //};

  //  // Call the fetchData function
  //  fetchData();
  //}, []);

  //const getInventory = async (filters) => {
  //  const invBody = {
  //    dspid: user.dspId.toString(),
  //    barCode: '',
  //    id: 0,
  //    productDetailId: 0,
  //    purchasedQty: 0,
  //    rowVer: 0,
  //    ...filters,
  //  };

  //  await fetchInventoryData('/Inventory/inventoryfulldetails', {
  //    method: 'POST',
  //    body: JSON.stringify(invBody),
  //  });

  //  if (inventoryDataRes.current?.data?.status === true) {
  //    const groupedData = [];
  //    inventoryDataRes.current.data.data.forEach((data, index) => {
  //      const dateKey = formatDate(data.createdAt);
  //      // Find the existing group or create a new one
  //      let group = groupedData.find((group) => group.date === dateKey);
  //      if (!group) {
  //        group = {
  //          date: dateKey,
  //          items: [],
  //        };
  //        groupedData.push(group);
  //      }

  //      // Add the data to the array for the corresponding date
  //      group.items.push({
  //        id: data.id,
  //        product: data.productName + ` ,${data.shortCode}`,
  //        availableStock: data.totalAvailableStock,
  //        quantity: data.assignedQty,
  //        businessEntityId: data.businessEntityId,
  //        isAssigned: data.assignedTo !== 0,
  //        assignment: data.assignedTo === 0 ? '' : data.assignedTo,
  //        lastUpdated: data.lastUpdatedAt,
  //        // lastUpdatedAt: formatDateTime(data.lastUpdatedAt),
  //      });
  //    });

  //    // Create a new array with an additional row for each group date

  //    const extendedArray = groupedData.reduce((acc, group) => {
  //      // Add the date row

  //      acc.push({
  //        date: group.date,
  //        isDateRow: true,
  //        availableStock: 0,
  //        quantity: 0,
  //        // index: index,
  //      });

  //      // Add the items
  //      acc.push(
  //        ...group.items.map((data) => ({
  //          id: data.id,
  //          product: data.product,
  //          availableStock: parseInt(data.availableStock),
  //          quantity: parseInt(data.quantity),
  //          businessEntityId: data.businessEntityId,
  //          isAssigned: data.isAssigned,
  //          assignment: data.assignment,
  //          lastUpdated: data.lastUpdated,
  //        })),
  //      );

  //      return acc;
  //    }, []);

  //    // Now, extendedArray is an array containing additional date rows and items

  //    // setRows(extendedArray.map((item, index) => ({ ...item, index })));
  //    // setVehDispRow(extendedArray.map((item, index) => ({ ...item, index })));
  //  } else {
  //    dispatch(
  //      updateToast({
  //        isToastOpen: true,
  //        toastMessage: inventoryDataRes.current.message
  //          ? inventoryDataRes.current.message
  //          : 'somthing went wrong try again later',
  //        toastVariant: 'error',
  //      }),
  //    );
  //  }
  //  // setIsLoading(inventoryDataLoading.current);
  //};

  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const initialFilter = {
    dspid: user.dspId.toString(),
    keyword: '',
    status: '0',
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);

  const generatePdf = async () => {
    const body = {
      id: rows[0].id,
    };

    const reportRows = makeGroupingRows(rows);
    const doc = getDispatchmentPdf(reportRows, reportField);
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
      //vehicleCode: 'Ubl488',
      //vinCode: '22U88',
      daName: 'Basedine, 089029',
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
      /* date: '01/16/2024',*/
      vehicleName: 'Honda civic, V45008, Sedan',
      quantity: '--',
      // daName: '776389'
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
    {
      id: 8,
      /* date: '01/16/2024',*/
      vehicleName: ' Left Side Miror, 995008',
      quantity: '9',
      // daName: 'Zeeshan ahmad',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },

    {
      id: 5,
      /* date: '01/16/2024',*/
      // vehicleName: 'Toyota Revo,U878',
      // vCode: 'UNO2898',
      daName: 'Geraldine, 837899',
      // lastUpdated: '9:45:13',
      vehicleCount: 0,
    },
    {
      id: 6,
      /* date: '01/16/2024',*/
      vehicleName: 'Toyota Grandee, Vb9973, Sedan',
      quantity: '--',
      //daName: 'Abdul Basit, 2098',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
    {
      id: 9,
      /* date: '01/16/2024',*/
      vehicleName: 'headphone, Hb9973',
      quantity: '15',
      //daName: 'Abdul Basit, 2098',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
  ]);
  const [columns, setColumns] = useState([
    {
      field: 'date',
      headerClassName: 'custom-header-data-grid',
      width: 100,
      //   flex: 1,
      headerName: 'Date',
      filterable: false,
      sortable: false,
      renderCell: (params) =>
        params.row.date && <h6 className="m-0 p-0 fw-bold">{params.row.date}</h6>,
    },
    {
      field: 'vName',
      headerClassName: 'custom-header-data-grid',
      minWidth: 150,
      flex: 1,
      headerName: 'Vehicle',
      editable: false,
      filterable: true,
      renderCell: (params) =>
        params.row.vName && <strong className="m-0 p-0 fw-bold">{params.row.vName}</strong>,
    },
    //{
    //  flex: 1,
    //  minWidth: 130,
    //  headerClassName: 'custom-header-data-grid',
    //  filterable: false,
    //  sortable: false,
    //  disableColumnMenu: false,
    //  headerName: 'Assign DA ',
    //  type: 'text',
    //  align: 'left',
    //  headerAlign: 'left',
    //  field: 'daName',
    //  editable: false,
    //  renderCell: (params) => !params.row.date && params.row.daName,
    //},
    {
      field: 'pName',
      headerClassName: 'custom-header-data-grid',
      minWidth: 280,
      flex: 1,
      headerName: 'Assignments',
      editable: false,
      filterable: true,
    },
    {
      /* flex: 1,*/
      minWidth: 150,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: 'Quantity',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      field: 'quantity',
      editable: false,
      renderCell: (params) => !params.row.date && params.row.availableStock,
    },
    {
      /* flex: 1,*/
      minWidth: 150,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: ' DA Count',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      field: 'vehicleCount',
      editable: false,
      renderCell: (params) => !params.row.date && params.row.availableStock,
    },

    {
      field: 'lastUpdated',
      headerClassName: 'custom-header-data-grid',
      minWidth: 100,
      flex: 1,
      headerName: 'Disp. Time',
      sortable: false,
      filterable: false,
      type: 'timestamp',
      //renderCell: (params) => !params.row.date && formatTime(params.row.lastUpdated),
    },
  ]);
  const [vehDispcolumns, setVehDispcolumns] = useState([
    {
      field: 'date',
      headerClassName: 'custom-header-data-grid',
      width: 100,
      //   flex: 1,
      headerName: 'Date',
      filterable: false,
      sortable: false,
      renderCell: (params) =>
        params.row.date && <h6 className="m-0 p-0 fw-bold">{params.row.date}</h6>,
    },
    {
      /* flex: 1,*/
      minWidth: 130,
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
      field: 'vehicleName',
      headerClassName: 'custom-header-data-grid',
      minWidth: 250,
      flex: 1,
      headerName: 'Assignments',
      editable: false,
      filterable: true,
    },

    {
      /*flex: 1,*/
      minWidth: 200,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: 'Quantity',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      field: 'quantity',
      editable: false,
      renderCell: (params) => !params.row.date && params.row.availableStock,
    },
    {
      /* flex: 1,*/
      minWidth: 150,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: ' vehicle Count',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      field: 'vehicleCount',
      editable: false,
      renderCell: (params) => !params.row.date && params.row.availableStock,
    },

    {
      field: 'lastUpdated',
      headerClassName: 'custom-header-data-grid',
      minWidth: 130,
      /* flex: 1,*/
      headerName: 'Disp. Time',
      sortable: false,
      filterable: false,
      type: 'timestamp',
      //renderCell: (params) => !params.row.date && formatTime(params.row.lastUpdated),
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
    } else {
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
  //const dispatchmentCols = getDispatchmentCols(

  //  vehicleRes,
  //  setRows,
  //  daRes,
  //  pageRoles,
  //);
  return (
    <>
      <FleetDashboardTabs
        title="DA"
        fleetTabs={tabs}
        activeTab={activeTab}
        handleActiveTab={setActiveTab}
      />
      <CContainer fluid className="mt-4">
        {tabs[activeTab] === 'Vehicle Dispatchment' && (
          <React.Fragment>
            <div>
              <div className="bg_Div mb-2  d-flex flex-column">
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
                          <CustomInput
                            label="Vehicle Name"
                            value={filters.keyword}
                            onChange={changeFilter}
                            icon={cilUser}
                            type="text"
                            id="keyword"
                            name="keyword"
                            placeholder="vehicle name"
                            className="form-control item"
                            isRequired={false}
                            title="using by Vehicle Name "
                            // message="Enter Buisness Name"
                          />
                        </div>

                        <div className="col-md-6">
                          <CustomSelectInput
                            label="DA Status"
                            icon={cilFlagAlt}
                            disableOption="Select Status"
                            id="status"
                            options={globalutil.commonstatuses()}
                            className="form-control item form-select"
                            value={filters.status}
                            name="status"
                            title=" user status "
                            onChange={(e) => changeFilter(e)}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mt-2">
                          <CustomDatePicker
                            icon={cilCalendar}
                            label="Date From "
                            id="createdAt"
                            name="createdAt"
                            value={filters.createdAt}
                            title=" user registration date  "
                            onChange={(e) => changeFilter(e, 'createdAt')}
                          />
                        </div>
                        <div className="col-md-6 mt-2">
                          <CustomDatePicker
                            icon={cilCalendar}
                            label="Date To"
                            id="lastUpdatedAt"
                            name="lastUpdatedAt"
                            value={filters.lastUpdatedAt}
                            title=" user registration date  "
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
            </div>
            <div className="bg_Div mt-2 d-flex flex-column">
              <DataGridHeader exportFn={() => ''} title="Vehicle Dispatchment" />
              <CustomDatagrid
                rows={rows}
                columns={columns}
                rowHeight={50}
                pagination={true}
                canExport={pageRoles.canExport}
                canPrint={pageRoles.canPrint}
                summary={[
                  {
                    field: 'vehicleCount',
                    aggregates: [{ aggregate: 'sum', caption: 'Total Vehicle' }],
                  },
                ]}
                hiddenCols={{
                  columnVisibilityModel: {
                    vehicleCount: false,
                  },
                }}
              />
            </div>
          </React.Fragment>
        )}
        {tabs[activeTab] === 'DA Dispatchment' && (
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
                        <CustomInput
                          label="Vehicle Name"
                          value={filters.keyword}
                          onChange={changeFilter}
                          icon={cilUser}
                          type="text"
                          id="keyword"
                          name="keyword"
                          placeholder="vehicle name"
                          className="form-control item"
                          isRequired={false}
                          title="using by Vehicle Name "
                          // message="Enter Buisness Name"
                        />
                      </div>

                      <div className="col-md-6">
                        <CustomSelectInput
                          label="DA Status"
                          icon={cilFlagAlt}
                          disableOption="Select Status"
                          id="status"
                          options={globalutil.commonstatuses()}
                          className="form-control item form-select"
                          value={filters.status}
                          name="status"
                          title=" user status "
                          onChange={(e) => changeFilter(e)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mt-2">
                        <CustomDatePicker
                          icon={cilCalendar}
                          label="Date From "
                          id="createdAt"
                          name="createdAt"
                          value={filters.createdAt}
                          title=" user registration date  "
                          onChange={(e) => changeFilter(e, 'createdAt')}
                        />
                      </div>
                      <div className="col-md-6 mt-2">
                        <CustomDatePicker
                          icon={cilCalendar}
                          label="Date To"
                          id="lastUpdatedAt"
                          name="lastUpdatedAt"
                          value={filters.lastUpdatedAt}
                          title=" user registration date  "
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
              <DataGridHeader exportFn={() => generatePdf()} title="DA Dispatchment" />
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
                      summary={[
                        {
                          field: 'vehicleCount',
                          aggregates: [{ aggregate: 'sum', caption: 'Total DA' }],
                        },
                      ]}
                      hiddenCols={{
                        columnVisibilityModel: {
                          vehicleCount: false,
                        },
                      }}
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
        )}
      </CContainer>
    </>
  );
};
export default DispatchmentReport;

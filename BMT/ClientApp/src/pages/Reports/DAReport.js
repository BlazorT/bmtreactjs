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
import { getDAreportPdf } from 'src/helpers/getDAreportPdf';

import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import moment from 'moment';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import dayjs from 'dayjs';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';

import utc from 'dayjs/plugin/utc';
import Loading from 'src/components/UI/Loading';

const DAReport = ({ reportField, fetchInspection, value }) => {
  dayjs.extend(utc);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Users Report',
  );
  const generatePdf = async () => {
    const body = {
      id: rows[0].id,
    };
    const reportRows = makeGroupingRows(rows);
   const doc = getDAreportPdf(reportRows, reportField);
    doc.output('dataurlnewwindow');
    console.log(reportRows,'repoertdata');
  };
 
  useEffect(() => {
    applyFilters();
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const initialFilter = {
    orgId: user.orgId,
    keyword: '',
    status: '0',
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);
  const applyFilters = async () => {
    const filterBody = {
      keyword: filters.keyword,
      status: filters.status === '' ? 0 : filters.status,
      createdAt: moment(filters.createdAt).utc().format().toString().split('T')[0],
      lastUpdatedAt: moment(filters.lastUpdatedAt).utc().format().toString().split('T')[0],
    };

    getDAuserList(filterBody);
    getDAuserList(filterBody);
  };
  const {
    response: GetDAUserRes,
    loading: LogLoading,
    error: createServiceError,
    fetchData: GetDAUser,
  } = useFetch();
  useEffect(() => {
    getDAuserList();
  }, []);
  const getDAuserList = async (filters) => {
    const fetchBody = {
      id: 0,
      roleId: 0,
      userId: '',
      orgId: user.orgId,
      userRole: '',
      email: '',
      userCode: '',
      firstName: '',
      lastName: '',
      password: '',
      primaryContact: '',
      userName: '',
      performance: '',
      violations: 0,
      status: 0,
      genderId: 0,
      rowVer: 0,
      //licenseExpiryDate: moment().utc().startOf('year').format(),
      createdAt: moment().utc().subtract(1, 'year').format(),
      lastUpdatedAt: moment().utc().format(),
      ...filters,
      //logTime: moment().utc().startOf('year').format(),
    };
    //alert(JSON.stringify(fetchBody));
    await GetDAUser(
      '/Report/dausersreportdata',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        //console.log(res, 'res');

        if (res.status) {
          const mappedArray = res.data.map((data) => ({
            id: data.id,
            // roleId: data.roleId,
            // userId: data.userId,
            // dspid: user.dspId.toString(),
            userRole: data.userRole,
            userName: data.userName,
            orgName: data.orgName,
            performance: data.performance,
            contact: data.primaryContact,
            violations: data.violations,
            status: globalutil.statuses().find((item) => item.id === data.status)
              ? globalutil.statuses().find((item) => item.id === data.status).name
              : '',
            createdAt: formatDate(data.createdAt),
            // lastUpdatedAt: moment(filters.lastUpdatedAt).utc().format().toString().split('T')[0],
            licenseExpiryDate: formatDate(data.licenseExpiryDate),
          }));

          setRows(mappedArray);
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
        setIsLoading(false);
      },
    );
    setIsLoading(false);
  };
  const [rows, setRows] = useState([]);

  const [columns, setColumns] = useState([
    {
      field: 'userName',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Name',
      flex: 1,
      width: 100,
      editable: false,
      filterable: true,
    },
    {
      field: 'orgName',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Organization',
      flex: 1,
      minWidth: 120,
      editable: false,
      sortable: false,
      filterable: true,
     // align: 'center',
     // headerAlign: 'center',
      disableColumnMenu: false,
    },
    {
      field: 'contact',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Contact',
      flex: 1,
      width: 100,
      editable: false,
      filterable: true,
    },

    
    
    {
      field: 'status',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Current Status',
      flex: 1,
      minWidth: 120,
      editable: false,
      sortable: false,
      filterable: true,
      disableColumnMenu: false,
    },
    
    {
      field: 'createdAt',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Date of joining ',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      type: 'timestamp',
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

  const toggleStock = () => {
    setShowStock((prev) => !prev);
  };
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
    const mappedArray = data.map((field,index) => {
      let mappedObject;

      if (index == 0) {
        mappedObject = {
          userName: 'name',
          primaryContact: 'contact',
          performance: 'performance',
          status: 'status',
          createdAt:'date of joining'
        }

      }
      else { 
        mappedObject = {
        userName: field.userName,
        primaryContact: field.primaryContact,
        performance: field.performance,
        status: field.status,
        createdAt: field.createdAt,
      }
      }
      return mappedObject;
    });
   // const header = ['name', 'contact', 'performance','status','date of joining'];

    const grouping = mappedArray.flatMap((item, index) => {
      const rowData = [item.userName, item.primaryContact, item.performance, item.status, item.createdAt];
        return [rowData];
      
    });
    console.log({ grouping });
    return grouping;
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
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className=" ">
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
                    label="Keyword"
                    value={filters.keyword}
                    onChange={changeFilter}
                    icon={cilUser}
                    type="text"
                    id="keyword"
                    name="keyword"
                    title=" using by name, contact "
                    placeholder=" name, contact, performance"
                    className="form-control item"
                    isRequired={false}
                    // message="Enter Buisness Name"
                  />
                </div>

                <div className="col-md-6">
                  <CustomSelectInput
                    label="Status"
                    icon={cilFlagAlt}
                    id="status"
                    options={globalutil.statuses()}
                    className="form-control item form-select"
                    value={filters.status}
                    disableOption="Select Status"
                    title=" DA Status "
                    name="status"
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
                    title=" DA registration date "
                    value={filters.createdAt}
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
                    title=" DA registration date "
                    onChange={(e) => changeFilter(e, 'lastUpdatedAt')}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6"> </div>
                <div className="col-md-6">
                  <div className="mt-2">
                    <button
                      title="Click for searching DA report data"
                      type="button"
                      onClick={() => applyFilters()}
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
        <DataGridHeader exportFn={() => generatePdf()} title="DA Report" />
        <div className="show-stock">
          <div className="row ">
            <div className="col-md-12 col-xl-12">
              <CustomDatagrid
                rows={rows}
                columns={columns}
                rowHeight={'normal'}
                pagination={true}
                canExport={pageRoles.canExport}
                canPrint={pageRoles.canPrint}
                // summary={
                //   [
                //     //{
                //     //  field: 'logTime',
                //     //  aggregates: [
                //     //    { aggregate: 'count', caption: 'Count' },
                //     //    { aggregate: 'max', caption: 'Last log Time' },
                //     //  ],
                //     //},
                //   ]
                // }
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
  );
};
export default DAReport;

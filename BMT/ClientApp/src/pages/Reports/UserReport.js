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
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import { CContainer } from '@coreui/react';

import Loading from 'src/components/UI/Loading';
import { getUserReportPdf } from 'src/helpers/getUserReportPdf';

//import FleetInspectionTab from 'src/components/FleetComponents/FleetInspectionTab';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';
import AppContainer from 'src/components/UI/AppContainer';
import useApi from 'src/hooks/useApi';
import usePageRoles from 'src/hooks/usePageRoles';
dayjs.extend(utc);

const columns = [
  {
    key: 'userName',
    name: 'Name',
    editable: false,
    filterable: true,
  },
  {
    key: 'roleName',
    name: 'Role',
    editable: false,
    filterable: true,
  },
  {
    key: 'contact',
    name: 'Contact',
    editable: false,
    filterable: true,
  },
  {
    key: 'email',
    name: 'Email',
    editable: false,
    filterable: true,
  },
  {
    key: 'status',
    name: 'Current Status',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    renderCell: (params) => (params.row.status === 1 ? 'Active' : 'In Active'),
  },
  {
    key: 'createdAt',
    name: 'Date',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    type: 'timestamp',
  },
];

const tabs = [
  { id: 1, name: 'Users' },
  { id: 2, name: 'Summary' },
];
const UserReport = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const pageRoles = usePageRoles('User Report');

  const { loading, postData: fetchUserReport } = useApi('/BlazorApi/users');

  const [activeTab, setActiveTab] = useState(1);
  const initialFilter = {
    orgId: user.orgId,
    UserName: '',
    status: 0,
    createdAt: dayjs().subtract(1, 'year').utc().startOf('year').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);
  const [rows, setRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const generatePdf = async () => {
    const reportRows = makeGroupingRows(rows);
    const doc = getUserReportPdf(reportRows);
    doc.output('dataurlnewwindow');
    // console.log(reportRows, 'repoertdata');
  };

  const applyFilters = async () => {
    const filterBody = {
      UserName: filters.UserName === '' ? '' : filters.UserName,
      status: filters.status === '' ? 0 : filters.status,
      //createdAt: dayjs(filters.createdAt).subtract(1, 'year').utc().format().split('T')[0],

      createdAt: dayjs(filters.createdAt).utc().format().split('T')[0],
      lastUpdatedAt: dayjs(filters.lastUpdatedAt).utc().format().split('T')[0],
    };

    getLogList(filterBody);
  };

  useEffect(() => {
    getLogList();
  }, []);

  const getLogList = async (filters) => {
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
      UserName: '',
      performance: '',
      violations: 0,
      status: 0,
      genderId: 0,
      rowVer: 0,
      createdAt: dayjs().utc().subtract(1, 'year').format(),
      lastUpdatedAt: dayjs().utc().format(),
      ...filters,
    };
    const res = await fetchUserReport(fetchBody);
    if (res?.status === true) {
      const mappedArray = res.data.map((data) => ({
        id: data.id,
        roleName: data.roleName,
        userName: data.userName,
        status: data.status,
        contact: data.contact,
        email: data.email,
        createdAt: formatDate(data.createdAt)
          ? formatDate(data.createdAt)
          : formatDate(data.createdAt),
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
    const mappedArray = data.map((key, index) => {
      let mappedObject;

      if (index == 0) {
        mappedObject = {
          userName: 'name',
          roleName: 'Role',
          contact: 'Contact',
          email: 'Email',
          status: 'status',
          createdAt: 'Date Of Joining',
        };
      } else {
        mappedObject = {
          userName: key.userName,
          roleName: key.roleName,
          contact: key.contact,
          email: key.email,
          status: key.status,
          createdAt: key.createdAt,
        };
      }
      return mappedObject;
    });

    const grouping = mappedArray.flatMap((item, index) => {
      const rowData = [
        item.userName,
        item.roleName,
        item.contact,
        item.email,
        item.status.toString(),
        item.createdAt,
      ];
      return [rowData];
    });
    // console.log({ grouping });
    return grouping;
  };

  const changeFilter = (e, date) => {
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
  };

  return (
    <>
      <BlazorTabs
        title="Show Room Users"
        tabs={tabs}
        activeTab={activeTab}
        handleActiveTab={setActiveTab}
      />
      {tabs.find((s) => s.id === 1).id === activeTab && (
        <>
          <AppContainer>
            <DataGridHeader
              title="Advance Search"
              onClick={toggleFilters}
              otherControls={[{ icon: cilChevronBottom, fn: toggleFilters }]}
              filterDisable={true}
            />
            {showFilters && (
              <div>
                <div className="row">
                  <div className="col-md-6">
                    <CustomInput
                      label="Keyword"
                      value={filters.UserName}
                      onChange={changeFilter}
                      icon={cilUser}
                      type="text"
                      id="UserName"
                      name="UserName"
                      placeholder="Name,Contact"
                      className="form-control item"
                      isRequired={false}
                      title="using by user code,user name,contact "
                      // message="Enter Buisness Name"
                    />
                  </div>

                  <div className="col-md-6">
                    <CustomSelectInput
                      label="Status"
                      icon={cilFlagAlt}
                      disableOption="Select Status"
                      id="status"
                      options={globalutil.statuses()}
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
                        onClick={() => applyFilters()}
                        className="btn_Default m-2 sales-btn-style alignLeft"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AppContainer>

          <AppContainer>
            <CustomDatagrid
              rows={rows}
              columns={columns}
              pagination={true}
              loading={loading}
              headerProps={{
                title: 'Users Report',
                filterDisable: true,
                canPrint: pageRoles?.canPrint === 1,
                canExport: pageRoles?.canExport === 1,
                fileName: 'Users Report',
              }}
            />
          </AppContainer>
        </>
      )}
      {tabs.find((s) => s.id === 2).id === activeTab && <h1>User Summary</h1>}
    </>
  );
};
export default UserReport;

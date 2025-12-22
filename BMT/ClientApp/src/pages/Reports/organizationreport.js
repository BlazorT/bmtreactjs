/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { cilCalendar, cilChevronBottom, cilFlagAlt, cilUser } from '@coreui/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrgReportPdf } from 'src/helpers/getOrgReportPdf';
import { updateToast } from 'src/redux/toast/toastSlice';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import AppContainer from 'src/components/UI/AppContainer';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { formatDate } from 'src/helpers/formatDate';
import useApi from 'src/hooks/useApi';
import globalutil from 'src/util/globalutil';

const columns = [
  {
    key: 'orgName',
    headerCellClass: 'custom-header-data-grid',
    name: 'Organization Name',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'contact',
    headerCellClass: 'custom-header-data-grid',
    name: 'Contact',
    editable: false,
    filterable: true,
  },
  {
    key: 'strength',
    headerCellClass: 'custom-header-data-grid',
    name: 'Strength',
    editable: false,
    filterable: true,
  },
  {
    key: 'packageName',
    headerCellClass: 'custom-header-data-grid',
    name: 'Package',
    editable: false,
    filterable: true,
  },

  {
    key: 'status',
    headerCellClass: 'custom-header-data-grid',
    name: 'Current Status',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },

  {
    key: 'expiryTime',
    headerCellClass: 'custom-header-data-grid',
    name: 'Expiry Date',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    type: 'timestamp',
  },
];

dayjs.extend(utc);

const organizationreport = () => {
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Organizations',
  );
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { loading, postData: fetchOrgReport } = useApi('/Report/organizationsreportdata');

  const [showFilters, setShowFilters] = useState(false);
  const [rows, setRows] = useState([]);
  const initialFilter = {
    orgId: user.orgId,
    name: '',
    status: 0,
    createdAt: dayjs().subtract(1, 'year').utc().startOf('year').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);

  useEffect(() => {
    getDAuserList();
  }, []);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const generatePdf = async () => {
    const reportRows = makeGroupingRows(rows);
    const doc = getOrgReportPdf(reportRows);
    doc.output('dataurlnewwindow');
    console.log(reportRows, 'repoertdata');
  };

  const applyFilters = async () => {
    const filterBody = {
      name: filters.name,
      status: filters.status === '' ? 0 : filters.status,
      createdAt: dayjs(filters.createdAt).utc().format().split('T')[0],
      lastUpdatedAt: dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD'),
    };

    getDAuserList(filterBody);
    // getDAuserList(filterBody);
  };

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
      createdAt: dayjs().utc().subtract(1, 'year').format(),
      lastUpdatedAt: dayjs(filters?.lastUpdatedAt ?? dayjs())
        .utc()
        .format('YYYY-MM-DD'),
      ...filters,
    };

    const res = await fetchOrgReport(fetchBody);

    if (res?.status) {
      const mappedArray = res?.data?.map((data) => ({
        id: data.id,
        userRole: data.userRole,
        userName: data.userName,
        orgName: data.name + ', ' + data.stateName,
        performance: data.performance,
        strength: data.strength,
        contact: data.contact,
        packageName: data.packageName,
        violations: data.violations,
        status: data.status == 0 ? 'Active' : 'In-Active',
        createdAt: formatDate(data.createdAt),
        expiryTime: formatDate(data.expiryTime),
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
          orgName: 'Organization Name',
          contact: 'Contact',
          strength: 'Strength',
          packageName: 'Package',
          status: 'Status',
          expiryTime: 'Expiry Date',
        };
      } else {
        mappedObject = {
          orgName: key.orgName,
          contact: key.contact,
          strength: key.strength,
          packageName: key.packageName,
          status: key.status,
          expiryTime: key.expiryTime,
        };
      }
      return mappedObject;
    });
    // const header = ['name', 'contact', 'performance','status','date of joining'];

    const grouping = mappedArray.flatMap((item, index) => {
      const rowData = [
        item.orgName,
        item.contact,
        item.strength.toString(),
        item.packageName,
        item.status.toString(),
        item.expiryTime,
      ];
      return [rowData];
    });
    console.log({ grouping });
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
      <AppContainer>
        <DataGridHeader
          title="Advance Search"
          onClick={toggleFilters}
          otherControls={[{ icon: cilChevronBottom, fn: toggleFilters }]}
          filterDisable={true}
        />
        {showFilters == true ? (
          <div className="show-stock">
            <div className="mb-0 dashboard-table padLeftRight">
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Keyword"
                    value={filters.name}
                    onChange={changeFilter}
                    icon={cilUser}
                    type="text"
                    id="name"
                    name="name"
                    title=" using by name, contact, email"
                    placeholder=" name, contact, email"
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
                    title=" Status "
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
                    title="Registration start date (Greater Than)"
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
                    title=" Registration end date (Less Than)"
                    onChange={(e) => changeFilter(e, 'lastUpdatedAt')}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6"> </div>
                <div className="col-md-6">
                  <div className="mt-2">
                    <button
                      title="Click for searching Org report data"
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
      </AppContainer>
      <AppContainer>
        <DataGridHeader exportFn={() => generatePdf()} title="Organization Report" filterDisable />
        <div className="show-stock">
          <div className="row ">
            <div className="col-md-12 col-xl-12">
              <CustomDatagrid
                rows={rows}
                columns={columns}
                pagination={true}
                canExport={pageRoles.canExport}
                canPrint={pageRoles.canPrint}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </AppContainer>
    </>
  );
};
export default organizationreport;

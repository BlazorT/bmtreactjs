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
import Loading from 'src/components/UI/Loading';

const Logs = () => {
  dayjs.extend(utc);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'BMT Log',
  );

  useEffect(() => {
    applyFilters();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const initialFilter = {
    OrgId: user.orgId,
    LogDesc: '',
    businessEntityId: '',
    menuId: '',
    status: '0',
    logTimeFrom: dayjs().subtract(1, 'year').utc().startOf('year').format(),
    logTimeTo: dayjs().utc().format().split('T')[0],

  };
  const [filters, setFilters] = useState(initialFilter);
  const applyFilters = async () => {
    const filterBody = {
      LogDesc: filters.LogDesc,
      menuId: filters.menuId === '' ? 0 : filters.menuId,
      logTimeFrom: dayjs(filters.logTimeFrom).subtract(1, 'year').utc().format().split('T')[0],
      logTimeTo: dayjs(filters.logTimeTo).utc().format().split('T')[0],
    };

    getLogList(filterBody);

    // getLogList(filterBody);
  };
  const {
    response: GetLogRes,
    loading: LogLoading,
    error: createServiceError,
    fetchData: GetLog,
  } = useFetch();

  useEffect(() => {
    getLogList();
  }, []);

  const getLogList = async (filters) => {
    const fetchBody = {
      id: 0,
      userId: 0,
      OrgId: user.orgId,
      LogDesc: '',
      menuId: 0,
      actionType: 0,
      logTimeFrom: dayjs().subtract(1, 'year').utc().startOf('year').format(),
      logTimeTo: dayjs().utc().format().split('T')[0],

      ...filters,
    };
    console.log(JSON.stringify(fetchBody));

    await GetLog(
      '/Log/applog',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        console.log(res, 'res');
        if (res.status === true) {
          const mappedArray = res.data.map((data, index) => ({
            id: data.id,
            userId: data.userId,
            orgId: user.orgId.toString(),
            logDesc: data.logDesc,
            entityName: data.entityName,
            menuId: data.menuId,
            machineIp: data.machineIp,
            actionType: data.actionType,
            logTimeFrom: formatDateTime(data.logTime),
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
      },
    );
  };
  const [rows, setRows] = useState([]);

  const columns = [
    //{
    //  key: 'entityName',
    //  headerClassName: 'custom-header-data-grid',
    //  name: 'Entity',
    //  /* flex: 1,*/
    //  width: 100,
    //  editable: false,
    //  filterable: true,
    //},
    {
      key: 'logDesc',
      headerClassName: 'custom-header-data-grid',
      name: 'Log',
      flex: 1,
      minWidth: 180,
      editable: false,
      sortable: false,
      filterable: true,
      disableColumnMenu: false,
    },
    {
      key: 'machineIp',
      headerClassName: 'custom-header-data-grid',
      name: 'Machine ',
      /*  flex: 1,*/
      width: 120,
      editable: false,
      filterable: true,
    },
    {
      key: 'logTimeFrom',
      name: 'Log Time',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      type: 'timestamp',
    },
  ];
  const [showStock, setShowStock] = useState(false);

  const toggleStock = () => {
    setShowStock((prev) => !prev);
  };
  const changeFilter = (e, date) => {
    if (date === 'logTimeTo' || date === 'logTimeFrom') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: dayjs(e).utc().format(),
      }));
    } else {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value, // ✅ now matches LogDesc
      }));
    }
  };


  console.log(LogLoading.current);
  // if (isLoading) {
  //   return <Loading />;
  // }
  return (
    <div>
      <div className="bg_Div mb-2 d-flex flex-column">
        <div className="dashboard-stock-header dashboard-drop">
          <div className="pointer" onClick={toggleStock}>
            Log → Advance Search ( Log name, Date From, Date To)
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
                <div className="col-md-12">
                  <CustomInput
                    label="Keyword"
                    value={filters.LogDesc}
                    onChange={changeFilter}
                    icon={cilUser}
                    type="text"
                    id="LogDesc"
                    name="LogDesc"
                    placeholder=" log name"
                    className="form-control item"
                    isRequired={false}
                    title=" using by entity name, log name "
                  />

                </div>

                {/*<div className="col-md-6">*/}
                {/*  <CustomSelectInput*/}
                {/*    label="Business Entity"*/}
                {/*    icon={cilFlagAlt}*/}
                {/*    id="menuId"*/}
                {/*    disableOption="Select Business Entity"*/}
                {/*    // options={globalutil.businessentities()}*/}
                {/*    className="form-control item form-select"*/}
                {/*    value={filters.menuId}*/}
                {/*    name="menuId"*/}
                {/*    title=" Business Entity"*/}
                {/*    onChange={(e) => changeFilter(e)}*/}
                {/*  />*/}
                {/*</div>*/}
              </div>
              <div className="row">
                <div className="col-md-6 mt-2">
                  <CustomDatePicker
                    icon={cilCalendar}
                    label="Date From "
                    id="logTimeFrom"
                    name="logTimeFrom"
                    value={filters.logTimeFrom}
                    title=" Log login time date from"
                    onChange={(e) => changeFilter(e, 'logTimeFrom')}
                  />
                </div>
                <div className="col-md-6 mt-2">
                  <CustomDatePicker
                    icon={cilCalendar}
                    label="Date To"
                    id="logTimeTo"
                    name="logTimeTo"
                    value={filters.logTimeTo}
                    title=" Log login time date to"
                    onChange={(e) => changeFilter(e, 'logTimeTo')}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6"> </div>
                <div className="col-md-6">
                  <div className="mt-2">
                    <button
                      title="Click for searching logs data"
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
        <DataGridHeader exportFn={() => ''} title="Log Viewer" filterDisable />
        <div className="show-stock">
          <div className="row ">
            <div className="col-md-12 col-xl-12">
              <CustomDatagrid
                rows={rows}
                columns={columns}
                loading={LogLoading?.current}
                // rowHeight={'normal'}
                pagination={true}
                summary={[
                  {
                    field: 'logTime',
                    aggregates: [
                      { aggregate: 'count', caption: 'Count' },
                      { aggregate: 'max', caption: 'Last log Time' },
                    ],
                  },
                ]}
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
export default Logs;

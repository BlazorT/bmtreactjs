/* eslint-disable react/react-in-jsx-scope */
import { cilCalendar, cilChevronBottom, cilUser } from '@coreui/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import { updateToast } from 'src/redux/toast/toastSlice';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import AppContainer from 'src/components/UI/AppContainer';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { formatDateTime } from 'src/helpers/formatDate';
import useApi from 'src/hooks/useApi';
import usePageRoles from 'src/hooks/usePageRoles';

const columns = [
  {
    key: 'logDesc',
    name: 'Log',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'machineIp',
    name: 'Machine ',
    editable: false,
    filterable: true,
  },
  {
    key: 'logTimeFrom',
    name: 'Log Time',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    type: 'timestamp',
  },
];

dayjs.extend(utc);
const Logs = () => {
  const { loading, postData: fetchLogs } = useApi('/Log/applog');

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const pageRoles = usePageRoles('Logs');

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
  const [rows, setRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  useEffect(() => {
    getLogList();
  }, []);

  const applyFilters = async () => {
    const filterBody = {
      LogDesc: filters.LogDesc,
      menuId: filters.menuId === '' ? 0 : filters.menuId,
      logTimeFrom: dayjs(filters.logTimeFrom).subtract(1, 'year').utc().format().split('T')[0],
      logTimeTo: dayjs(filters.logTimeTo).utc().format().split('T')[0],
    };
    getLogList(filterBody);
  };

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

    const res = await fetchLogs(fetchBody);
    if (res?.status === true) {
      const mappedArray = res.data.map((data) => ({
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

  return (
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
        )}
      </AppContainer>

      <AppContainer>
        <CustomDatagrid
          rows={rows}
          columns={columns}
          loading={loading}
          pagination={true}
          summary={[
            {
              field: 'logTimeFrom',
              aggregates: [
                { aggregate: 'count', caption: 'Count' },
                { aggregate: 'max', caption: 'Last log Time' },
              ],
            },
          ]}
          headerProps={{
            title: '',
            filterDisable: true,
            canPrint: pageRoles?.canPrint === 1,
            canExport: pageRoles?.canExport === 1,
            fileName: 'LOGS',
          }}
        />
      </AppContainer>
    </>
  );
};
export default Logs;

/* eslint-disable react/react-in-jsx-scope */
import { cilCalendar, cilChevronBottom, cilUser } from '@coreui/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import { updateToast } from 'src/redux/toast/toastSlice';
//import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
//import globalutil from 'src/util/globalutil';
import AppContainer from 'src/components/UI/AppContainer';
import { formatDateTime } from 'src/helpers/formatDate';
import useApi from 'src/hooks/useApi';
import usePageRoles from 'src/hooks/usePageRoles';

const columns = [
  {
    key: 'attributeName',
    name: 'Attribute',
    editable: false,
    filterable: true,
  },

  {
    key: 'oldValue',
    name: 'Previous Value ',
    editable: false,
    filterable: true,
  },
  {
    key: 'newValue',
    name: 'New Value',
    editable: false,
    filterable: true,
  },
  {
    key: 'username',
    name: 'Updated By',
    editable: false,
    filterable: true,
  },
  {
    key: 'createdAt',
    name: 'Updated At',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    type: 'timestamp',
  },
];

dayjs.extend(utc);
const AuditLogs = () => {
  const { loading, postData: fetchAuditLogs } = useApi('/Log/auditlogdetails');

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const pageRoles = usePageRoles('AuditLogs');

  const initialFilter = {
    orgId: user.orgId,
    businessEntityId: '',
    KeyValue: '',
    keyword: '',
    oldValue: '',
    createdAt: dayjs().utc().subtract(2, 'year').format(),
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
      orgId: user.orgId,
      keyword: filters.keyword,
      KeyValue: filters.KeyValue,
      oldValue: filters.oldValue,
      createdAt: dayjs(filters.createdAt).utc().subtract(2, 'year').format(),
    };

    getLogList(filterBody);
  };

  //console.log(getLogList);
  const getLogList = async (filters) => {
    const fetchBody = {
      id: 0,
      auditEntityId: 0,
      orgId: user.orgId,
      attributeName: '',
      userName: '',
      oldValue: '',
      newValue: '',
      KeyValue: '',
      createdBy: 0,
      createdAt: dayjs().utc().subtract(2, 'year').format(),
      ...filters,
    };
    const res = await fetchAuditLogs(fetchBody);

    if (res?.status === true) {
      const mappedArray = res.data.map((data, index) => ({
        id: data.id,
        attributeName: data.attributeName,
        orgId: data.orgId,
        username: data.username,
        fieldName: data.fieldName,
        keyValue: data.keyValue,
        oldValue: data.oldValue,
        newValue: data.newValue,
        createdAt: formatDateTime(data.createdAt),
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
    if (date === 'createdAt' || date === 'createdBy') {
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
        {showFilters && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <CustomInput
                  label="Keyword"
                  value={filters.KeyValue}
                  onChange={changeFilter}
                  icon={cilUser}
                  type="text"
                  id="KeyValue"
                  name="KeyValue"
                  placeholder="Attribute name, Previous value, New value"
                  className="form-control item"
                  isRequired={false}
                  title=" Using By Attribute name,Previous value, New value"
                  // message="Enter Buisness Name"
                />
              </div>
              <div className="col-md-6">
                <CustomDatePicker
                  icon={cilCalendar}
                  label="Update Date (>=)"
                  id="createdAt"
                  name="createdAt"
                  title=" Audit Logs Created At "
                  value={filters.createdAt}
                  onChange={(e) => changeFilter(e, 'createdAt')}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="mt-2">
                  <button
                    title="Click for searching Audit logs data"
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
          rowHeight={45}
          pagination={true}
          loading={loading}
          summary={[
            {
              field: 'createdAt',
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
            fileName: 'Audit Logs',
          }}
        />
      </AppContainer>
    </>
  );
};
export default AuditLogs;

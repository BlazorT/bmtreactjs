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
//import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
//import globalutil from 'src/util/globalutil';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';

const AuditLogs = () => {
  dayjs.extend(utc);
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Audit Log',
  );

  useEffect(() => {
    applyFilters();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const initialFilter = {
    orgId: user.orgId,
    businessEntityId: '',
    keyValue: '',
    keyword: '',
    oldValue: '',
    createdAt: dayjs().utc().startOf('year').format(),
  };
  const [filters, setFilters] = useState(initialFilter);
  const applyFilters = async () => {
    const filterBody = {
      orgId: user.orgId,
      keyword: filters.keyword,
      keyValue: filters.keyValue,
      oldValue: filters.oldValue,
      createdAt: dayjs(filters.createdAt).utc().startOf('month').format(),
    };

    getLogList(filterBody);
    console.log({ filterBody });
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
      keyValue: '',
      createdBy: 0,
      createdAt: dayjs().utc().subtract(1, 'year').format(),
      ...filters,
    };

    await GetLog(
      '/Log/auditlogdetails',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        console.log(res, 'res');
        if (res.status === true) {
          const mappedArray = res.data.map((data, index) => ({
            id: data.id,
            entityName: data.entityName,
            orgId: data.orgId,
            userName: data.userName,
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
        setIsLoading(LogLoading.current);
      },
    );
  };

  const [rows, setRows] = useState([]);

  const [columns, setColumns] = useState([
    {
      key: 'entityName',
      headerClassName: 'custom-header-data-grid',
      name: 'Entity',
      /* flex: 1,*/
      width: 120,
      editable: false,
      filterable: true,
    },

    {
      key: 'fieldName',
      headerClassName: 'custom-header-data-grid',
      name: 'Field Name',
      flex: 1,
      minWidth: 150,
      editable: false,
      sortable: false,
      filterable: true,
      disableColumnMenu: false,
    },
    {
      key: 'oldValue',
      headerClassName: 'custom-header-data-grid',
      name: 'Previous Value ',
      flex: 1,
      width: 120,
      editable: false,
      filterable: true,
      //align: 'center',
    },
    {
      key: 'newValue',
      headerClassName: 'custom-header-data-grid',
      name: 'New Value',
      flex: 1,
      minWidth: 150,
      editable: false,
      filterable: true,
      // align: 'center',
    },
    {
      key: 'userName',
      headerClassName: 'custom-header-data-grid',
      name: 'Updated By',
      /*flex: 1,*/
      minWidth: 120,
      editable: false,
      filterable: true,
    },

    {
      key: 'createdAt',
      name: 'Updated At',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      sortable: true,
      disableColumnMenu: true,
      type: 'timestamp',
      //   renderCell: (params) => <EditFeildMapping value={params} />,
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
                    label="Keyword"
                    value={filters.keyword}
                    onChange={changeFilter}
                    icon={cilUser}
                    type="text"
                    id="keyword"
                    name="keyword"
                    placeholder="entity name, key name, old value"
                    className="form-control item"
                    isRequired={false}
                    title=" Using By entity name,key name, old value"
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
                rowHeight={45}
                pagination={true}
                // canExport={pageRoles.canExport}
                // canPrint={pageRoles.canPrint}
                summary={[
                  {
                    field: 'createdAt',
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
export default AuditLogs;

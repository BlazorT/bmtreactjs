/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { cilCalendar, cilChevronBottom, cilFlagAlt, cilUser } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import AppContainer from 'src/components/UI/AppContainer';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import useApi from 'src/hooks/useApi';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from 'src/util/globalutil';

const columns = [
  {
    key: 'campaignDate',
    headerClassName: 'custom-header-data-grid',
    name: 'Campiagn Date',
    flex: 1,
    width: 140,
    editable: false,
    filterable: true,
    type: 'timestamp',
  },
  {
    key: 'createdAt',
    headerClassName: 'custom-header-data-grid',
    name: 'Campiagn Time',
    flex: 1,
    width: 140,
    editable: false,
    filterable: true,
    type: 'timestamp',
  },
  {
    key: 'name',
    headerClassName: 'custom-header-data-grid',
    name: 'Campaign Name',
    width: 160,
    editable: false,
    filterable: true,
  },
  {
    key: 'networkName',
    headerClassName: 'custom-header-data-grid',
    name: 'Network',
    flex: 1,
    width: 130,
    editable: false,
    filterable: true,
  },
  {
    key: 'sent', // ✅ match with mapped row key
    headerClassName: 'custom-header-data-grid',
    name: 'Sent',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
    renderCell: (params) => {
      return params.row?.isGroupRow ? null : params.row.sent;
    },
  },
  {
    key: 'failed', // ✅ match with mapped row key
    headerClassName: 'custom-header-data-grid',
    name: 'Failed',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
    renderCell: (params) => {
      return params.row?.isGroupRow ? null : params.row.failed;
    },
  },
  {
    key: 'delivered', // ✅ match with mapped row key
    headerClassName: 'custom-header-data-grid',
    name: 'Delivered',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
    renderCell: (params) => {
      return params.row?.isGroupRow ? null : params.row.delivered;
    },
  },
  {
    key: 'readCount',
    headerClassName: 'custom-header-data-grid',
    name: 'Reads',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
  },
  {
    key: 'commentsCount',
    headerClassName: 'custom-header-data-grid',
    name: 'Comments',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
  },
  {
    key: 'clicksCount',
    headerClassName: 'custom-header-data-grid',
    name: 'Clicks',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
  },
  {
    key: 'sharesCount',
    headerClassName: 'custom-header-data-grid',
    name: 'Shares',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
  },
  {
    key: 'likesCount',
    headerClassName: 'custom-header-data-grid',
    name: 'Likes',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
  },
];

dayjs.extend(utc);
const CampaignNotificationReport = ({ reportField, fetchInspection, value }) => {
  const { loading, postData: fetchNotifications } = useApi('/Report/notificationsreportdata');

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const initialFilter = {
    orgId: user.orgId,
    recipient: '',
    deliveryStatus: '',
    status: 0,
    createdAt: dayjs().subtract(1, 'year').utc().format(),
    lastUpdatedAt: dayjs().utc().format(),
  };
  const [filters, setFilters] = useState(initialFilter);
  const [rows, setRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getNotiList();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // avoid form default submit if inside input
        applyFilters();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filters]); // dependencies so it uses the latest filters

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleReset = () => {
    setFilters(initialFilter);
    getNotiList();
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

  const applyFilters = async () => {
    const filterBody = {
      recipient: filters.recipient,
      deliveryStatus: String(filters.deliveryStatus || '0'), // ✅ Always string
      createdAt: dayjs(filters.createdAt).utc().format(),
      lastUpdatedAt: dayjs(filters.lastUpdatedAt).utc().format(),
    };
    getNotiList(filterBody);
  };

  const getNotiList = async (filters) => {
    const fetchBody = {
      Id: 0,
      Status: 1,
      OrgId: user.orgId,
      createdAt: dayjs().utc().subtract(1, 'year').format(),
      lastUpdatedAt: dayjs().utc().format(),
      ...filters,
    };

    const res = await fetchNotifications(fetchBody);
    if (res && res?.status) {
      // 🔑 First group by DATE, then by HOUR
      const groupedByDate = _.groupBy(
        res.data,
        (item) => dayjs(item.createdAt).utc().local().format('YYYY-MM-DD'), // Group by date only
      );

      // ✅ Sort dates descending (latest first)
      const sortedDates = Object.entries(groupedByDate).sort(
        ([a], [b]) => dayjs(b).valueOf() - dayjs(a).valueOf(),
      );

      const mappedArray = sortedDates.flatMap(([dateKey, dateItems], dateIndex) => {
        // DATE GROUP ROW (Level 1)
        const dateGroupRow = {
          id: `date-group-${dateIndex}`,
          name: '',
          campaignDate: formatDate(dateKey), // e.g., "Thursday, October 02, 2025"
          createdAt: '',
          sent: '',
          failed: '',
          delivered: '',
          networkName: '',
          isDateGroupRow: true, // New flag for date-level grouping
        };

        // Now group items within this date by HOUR
        const groupedByHour = _.groupBy(
          dateItems,
          (item) => dayjs(item.createdAt).utc().startOf('hour').local().format('hh:00 A'), // Just the hour part
        );

        // Sort hours descending within the date
        const sortedHours = Object.entries(groupedByHour).sort(
          ([a], [b]) => dayjs(b, 'hh:00 A').valueOf() - dayjs(a, 'hh:00 A').valueOf(),
        );

        const hourGroups = sortedHours.flatMap(([hourKey, hourItems], hourIndex) => {
          // Calculate status counts ONCE per hour group
          const statusCounts = {};
          globalutil.deliverstatus().forEach((statusObj) => {
            const statusId = statusObj.id.toString();
            statusCounts[statusObj.name.toLowerCase()] = hourItems.filter(
              (d) => d.deliveryStatus === statusId,
            ).length;
          });

          // HOUR GROUP ROW (Level 2)
          const hourGroupRow = {
            id: `hour-group-${dateIndex}-${hourIndex}`,
            name: '',
            campaignDate: '',
            createdAt: hourKey, // e.g., "02:00 PM"
            sent: '',
            failed: '',
            delivered: '',
            networkName: '',
            isGroupRow: true, // Hour-level grouping
          };

          // CHILD ROWS (Level 3 - actual data)
          const childRows = hourItems.map((data, i) => ({
            id: `${data.id}-${i}`,
            name: data?.name,
            campaignDate: '',
            // createdAt: dayjs(data.createdAt).utc().local().format('hh:mm:ss A'), // Exact time
            createdAt: '', // Exact time
            networkName: data?.networkName,
            readCount: data.readCount || 0,
            commentsCount: data.commentsCount || 0,
            clicksCount: data.clicksCount || 0,
            sharesCount: data.sharesCount || 0,
            likesCount: data.likesCount || 0,
            sent: statusCounts['sent'] || 0,
            delivered: statusCounts['delivered'] || 0,
            failed: statusCounts['failed'] || 0,
            deleted: statusCounts['deleted'] || 0,
            read: statusCounts['read'] || 0,
            seen: statusCounts['seen'] || 0,
            undelivered: statusCounts['undelivered'] || 0,
            pending: statusCounts['pending'] || 0,
          }));

          return [hourGroupRow, ...childRows];
        });

        return [dateGroupRow, ...hourGroups];
      });

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
                    label="Recipient"
                    value={filters.recipient}
                    onChange={changeFilter}
                    icon={cilUser}
                    type="text"
                    id="recipient"
                    name="recipient"
                    placeholder="recipient"
                    className="form-control item"
                    isRequired={false}
                    title="recipient "
                    // message="Enter Buisness Name"
                  />
                </div>

                <div className="col-md-6">
                  <CustomSelectInput
                    label="Delivery Status"
                    icon={cilFlagAlt}
                    disableOption="Select Delivery Status"
                    id="deliveryStatus"
                    options={globalutil.deliverstatus()}
                    className="form-control item form-select"
                    value={filters.deliveryStatus}
                    name="deliveryStatus"
                    title="delivery Status"
                    onChange={(e) => changeFilter(e)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mt-2">
                  <CustomDatePicker
                    icon={cilCalendar}
                    label="Date From"
                    id="createdAt"
                    name="createdAt"
                    value={filters.createdAt}
                    title="Campaign start date"
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
                    title=" Campaign end date  "
                    onChange={(e) => changeFilter(e, 'lastUpdatedAt')}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6"> </div>
                <div className="col-md-6">
                  <div className="mt-2">
                    <button
                      type="submit"
                      title="Click for searching user report data"
                      onClick={applyFilters}
                      className="btn_Default m-2 sales-btn-style alignLeft"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      title="Click For Reset Data"
                      className="btn_Default m-2 sales-btn-style alignLeft"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </AppContainer>

      <AppContainer>
        <CustomDatagrid
          rows={rows}
          columns={columns}
          pagination={true}
          loading={loading}
          summary={[
            {
              field: 'sent',
              aggregates: [{ aggregate: 'sum', caption: 'Total Sent' }],
            },
            {
              field: 'failed',
              aggregates: [{ aggregate: 'sum', caption: 'Total Failed' }],
            },
            {
              field: 'delivered',
              aggregates: [{ aggregate: 'sum', caption: 'Total Delivered' }],
            },
          ]}
        />
      </AppContainer>
    </>
  );
};
export default CampaignNotificationReport;

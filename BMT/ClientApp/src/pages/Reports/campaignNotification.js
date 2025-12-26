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
import usePageRoles from 'src/hooks/usePageRoles';
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
  },
  {
    key: 'failed', // ✅ match with mapped row key
    headerClassName: 'custom-header-data-grid',
    name: 'Failed',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
  },
  {
    key: 'delivered', // ✅ match with mapped row key
    headerClassName: 'custom-header-data-grid',
    name: 'Delivered',
    // width: 120,
    editable: false,
    filterable: true,
    flex: 1,
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
  const pageRoles = usePageRoles('Campaign Stats');

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

    if (!res || !res.status) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: res?.message,
          toastVariant: 'error',
        }),
      );
      setRows([]);
      return;
    }

    /* 1️⃣ Group by Date + Hour */
    const grouped = _.groupBy(res.data, (item) => {
      const t = dayjs(item.createdAt).utc().local();
      return `${t.format('YYYY-MM-DD')}|${t.startOf('hour').format('hh:00 A')}`;
    });

    const rows = Object.entries(grouped).flatMap(([groupKey, items]) => {
      const [groupDate, groupHour] = groupKey.split('|');

      /* 2️⃣ Compute status counts ONCE per hour (same as before) */
      const statusCounts = {};
      globalutil.deliverstatus().forEach((statusObj) => {
        const statusId = statusObj.id.toString();
        statusCounts[statusObj.name.toLowerCase()] = items.filter(
          (d) => d.deliveryStatus === statusId,
        ).length;
      });

      /* 3️⃣ Map rows and attach hour-level counts */
      return items.map((item) => {
        const localTime = dayjs(item.createdAt).utc().local();

        return {
          id: item.id,

          /* 🔑 GROUPING KEYS */
          groupDate,
          groupHour,

          /* SORT */
          sortTime: localTime.valueOf(),

          /* DISPLAY */
          campaignDate: formatDate(localTime),
          createdAt: groupHour, // same as your old hour row

          name: item.name,
          networkName: item.networkName,

          readCount: item.readCount || 0,
          commentsCount: item.commentsCount || 0,
          clicksCount: item.clicksCount || 0,
          sharesCount: item.sharesCount || 0,
          likesCount: item.likesCount || 0,

          /* ✅ HOUR-LEVEL STATUS COUNTS (EXACT MATCH) */
          sent: statusCounts.sent || 0,
          delivered: statusCounts.delivered || 0,
          failed: statusCounts.failed || 0,
          deleted: statusCounts.deleted || 0,
          read: statusCounts.read || 0,
          seen: statusCounts.seen || 0,
          undelivered: statusCounts.undelivered || 0,
          pending: statusCounts.pending || 0,
        };
      });
    });

    /* 4️⃣ Sorting (Date → Hour → Time) */
    rows.sort((a, b) => {
      if (a.groupDate !== b.groupDate) {
        return dayjs(b.groupDate).valueOf() - dayjs(a.groupDate).valueOf();
      }
      if (a.groupHour !== b.groupHour) {
        return dayjs(b.groupHour, 'hh:00 A').valueOf() - dayjs(a.groupHour, 'hh:00 A').valueOf();
      }
      return b.sortTime - a.sortTime;
    });

    setRows(rows);
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
        )}
      </AppContainer>

      <AppContainer>
        <CustomDatagrid
          rows={rows}
          columns={columns}
          loading={loading}
          enableGrouping
          defaultExpandedGroups
          groupBy={['campaignDate', 'createdAt']}
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
          headerProps={{
            title: 'Campaign Stats',
            filterDisable: true,
            canPrint: pageRoles?.canPrint === 1,
            canExport: pageRoles?.canExport === 1,
            fileName: 'CAMPAIGN_STATS',
          }}
        />
      </AppContainer>
    </>
  );
};
export default CampaignNotificationReport;

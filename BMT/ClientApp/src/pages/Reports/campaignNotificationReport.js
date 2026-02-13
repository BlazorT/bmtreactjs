/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import CIcon from '@coreui/icons-react';
import { cilCalendar, cilChevronBottom, cilFlagAlt, cilUser, cilInfo } from '@coreui/icons';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import AppContainer from 'src/components/UI/AppContainer';
import CustomDatePicker from 'src/components/UI/DatePicker';
import useApi from 'src/hooks/useApi';
import usePageRoles from 'src/hooks/usePageRoles';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from 'src/util/globalutil';

const campaignNotificationReport = () => {
  const { loading, postData: fetchNotifications } = useApi('/Report/notificationsreportdata');
  const pageRoles = usePageRoles('Campaign Stats');
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const initialFilter = {
    orgId: user.orgId,
    recipient: '',
    deliveryStatus: '',
    status: 0,
    createdAt: dayjs().subtract(1, 'year').format(),
    lastUpdatedAt: dayjs().format(),
  };

  const [filters, setFilters] = useState(initialFilter);
  const [rows, setRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const columns = [
    {
      key: 'campaignDate',
      headerClassName: 'custom-header-data-grid',
      name: 'Campaign Date',
      flex: 1,
      width: 140,
      editable: false,
      filterable: true,
      type: 'timestamp',
    },
    {
      key: 'createdAt',
      headerClassName: 'custom-header-data-grid',
      name: 'Campaign Time',
      flex: 1,
      width: 140,
      editable: false,
      filterable: true,
      type: 'timestamp',
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
      key: 'name',
      headerClassName: 'custom-header-data-grid',
      name: 'Campaign Name',
      width: 160,
      editable: false,
      filterable: true,
    },
    {
      key: 'totalRecipients',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Total',
      width: 100,
      editable: false,
      filterable: true,
      cellClassName: 'text-center fw-bold',
    },
    {
      key: 'sent',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Sent',
      editable: false,
      filterable: true,
      flex: 1,
      cellClassName: 'text-center',
    },
    {
      key: 'failed',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Failed',
      editable: false,
      filterable: true,
      flex: 1,
      cellClassName: 'text-center',
    },
    {
      key: 'delivered',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Delivered',
      editable: false,
      filterable: true,
      flex: 1,
      cellClassName: 'text-center',
    },
    {
      key: 'readCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Reads',
      editable: false,
      filterable: true,
      flex: 1,
      cellClassName: 'text-center',
    },
    {
      key: 'commentsCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Comments',
      editable: false,
      filterable: true,
      flex: 1,
      cellClassName: 'text-center',
    },
    {
      key: 'clicksCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Clicks',
      editable: false,
      filterable: true,
      flex: 1,
      cellClassName: 'text-center',
    },
    {
      key: 'sharesCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Shares',
      editable: false,
      filterable: true,
      flex: 1,
      cellClassName: 'text-center',
    },
    {
      key: 'likesCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Likes',
      editable: false,
      filterable: true,
      flex: 1,
      cellClassName: 'text-center',
    },
    {
      key: 'actions',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Details',
      width: 80,
      editable: false,
      filterable: false,
      cellClassName: 'text-center',
      renderCell: ({ row }) => (
        <button
          type="button"
          className="btn btn-sm btn-link p-0 text-primary"
          onClick={() => openDetailModal(row)}
          title="View campaign details"
        >
          <CIcon icon={cilInfo} size="lg" />
        </button>
      ),
    },
  ];

  const openDetailModal = (row) => {
    setSelectedCampaign(row);
    console.log('Selected row for modal:', row);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  //const getStatusInfo = (deliveryStatus) => {
  //  const statuses = globalutil.deliverstatus();
  //  const found = statuses.find((item) => String(item.id) === String(deliveryStatus));
  //  if (!found) return { label: 'Unknown', color: 'secondary' };

  //  const label = found.name.trim();
  //  const lower = label.toLowerCase();

  //  let color = 'secondary';
  //  if (lower.includes('sent') || lower.includes('pending')) color = 'primary';
  //  else if (lower.includes('delivered') || lower.includes('read') || lower.includes('seen')) color = 'success';
  //  else if (lower.includes('failed') || lower.includes('undelivered')) color = 'danger';
  //  else if (lower.includes('deleted')) color = 'dark';

  //  return { label, color };
  //};

  useEffect(() => {
    getNotiList();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyFilters();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filters]);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const handleReset = () => {
    setFilters(initialFilter);
    getNotiList();
  };

  const changeFilter = (e, date) => {
    if (date === 'lastUpdatedAt' || date === 'createdAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: dayjs(e).format(),
      }));
    } else {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const applyFilters = async () => {
    const filterBody = {
      recipient: filters.recipient,
      deliveryStatus: String(filters.deliveryStatus || '0'),
      createdAt: dayjs(filters.createdAt).format(),
      lastUpdatedAt: dayjs(filters.lastUpdatedAt).format(),
    };
    getNotiList(filterBody);
  };

  const getNotiList = async (filters = {}) => {
    const fetchBody = {
      Id: 0,
      Status: 1,
      OrgId: user.orgId,
      createdAt: dayjs().subtract(1, 'year').format(),
      lastUpdatedAt: dayjs().format(),
      ...filters,
    };

    const res = await fetchNotifications(fetchBody);
    console.log('res notification', res);

    if (!res || !res.status) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: res?.message || 'Something went wrong',
          toastVariant: 'error',
        })
      );
      setRows([]);
      return;
    }

    // Group by date + hour + networkName
    const grouped = _.groupBy(res.data, (item) => {
      const t = dayjs(item.createdAt).local();
      return `${t.format('YYYY-MM-DD')}|${t.startOf('hour').format('hh:00 A')}|${item.networkName}`;
    });

    const aggregatedRows = Object.entries(grouped).map(([groupKey, items]) => {
      const [groupDate, groupHour, networkName] = groupKey.split('|');

      // Compute status counts once per group
      const statusCounts = {};
      globalutil.deliverstatus().forEach((statusObj) => {
        const statusId = statusObj.id.toString();
        statusCounts[statusObj.name.toLowerCase()] = items.filter(
          (d) => d.deliveryStatus === statusId
        ).length;
      });

      // Sum engagement metrics across all items in group
      const totalRead = _.sumBy(items, 'readCount');
      const totalComments = _.sumBy(items, 'commentsCount');
      const totalClicks = _.sumBy(items, 'clicksCount');
      const totalShares = _.sumBy(items, 'sharesCount');
      const totalLikes = _.sumBy(items, 'likesCount');

      // Take first item's name / description / times (assuming same campaign)
      const representative = items[0] || {};

      const localTime = dayjs(representative.createdAt || new Date()).local();

      return {
        id: groupKey, // unique group key
        groupDate,
        groupHour,
        sortTime: localTime.valueOf(),
        campaignDate: localTime.format('DD-MMM-YYYY'),
        createdAt: groupHour,
        name: representative.name || 'Multiple Campaigns',
        networkName,
        totalRecipients: items.length, // ← this is the TOTAL count you wanted
        sent: statusCounts.sent || 0,
        delivered: statusCounts.delivered || 0,
        failed: statusCounts.failed || 0,
        readCount: totalRead || 0,
        commentsCount: totalComments || 0,
        clicksCount: totalClicks || 0,
        sharesCount: totalShares || 0,
        likesCount: totalLikes || 0,
        description: representative.description || '',
        startTime: representative.startTime,
        finishTime: representative.finishTime,
        deliveryStatus: representative.deliveryStatus || '',
        remarks: representative.remarks || '',
      };
    });

    // Sort
    aggregatedRows.sort((a, b) => {
      if (a.groupDate !== b.groupDate) {
        return dayjs(b.groupDate).valueOf() - dayjs(a.groupDate).valueOf();
      }
      if (a.groupHour !== b.groupHour) {
        return dayjs(b.groupHour, 'hh:00 A').valueOf() - dayjs(a.groupHour, 'hh:00 A').valueOf();
      }
      return b.sortTime - a.sortTime;
    });

    setRows(aggregatedRows);
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
          <div className="p-3 bg-light rounded mb-3">
            {/* ... your filter form remains the same ... */}
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
                  title="recipient"
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
                  title="Campaign end date"
                  onChange={(e) => changeFilter(e, 'lastUpdatedAt')}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6"></div>
              <div className="col-md-6">
                <button type="button" onClick={applyFilters} className="btn btn-primary me-2">
                  Search
                </button>
                <button type="button" onClick={handleReset} className="btn btn-outline-secondary">
                  Reset
                </button>
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
          maxHeight={700}
          defaultExpandedGroups
          groupBy={['campaignDate', 'createdAt']}
          summary={[
            { field: 'sent', aggregates: [{ aggregate: 'sum', caption: 'Total Sent' }] },
            { field: 'failed', aggregates: [{ aggregate: 'sum', caption: 'Total Failed' }] },
            { field: 'delivered', aggregates: [{ aggregate: 'sum', caption: 'Total Delivered' }] },
            { field: 'totalRecipients', aggregates: [{ aggregate: 'sum', caption: 'Total Recipients' }] },
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

      {/* ====================== DETAILS MODAL ====================== */}
      {modalVisible && selectedCampaign && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">
                  Campaign Details — {selectedCampaign.name}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  {/* Left Column – with legend borders */}
                  <div className="col-md-3">
                    <div className="mb-4 border-start border-3 border-primary ps-3">
                      <small className="text-muted d-block mb-1">Campaign Name</small>
                      <p className="mb-0 fw-medium">{selectedCampaign.name || '—'}</p>
                    </div>
                   

                    {/*<div className="mb-4 border-start border-3 border-info ps-3">*/}
                    {/*  <small className="text-muted d-block mb-1">Network</small>*/}
                    {/*  <p className="mb-0">{selectedCampaign.networkName || '—'}</p>*/}
                    {/*</div>*/}

                    {/*<div className="mb-4 border-start border-3 border-success ps-3">*/}
                    {/*  <small className="text-muted d-block mb-1">Created / Sent At</small>*/}
                    {/*  <p className="mb-0">*/}
                    {/*    {dayjs(`${selectedCampaign.campaignDate} ${selectedCampaign.createdAt}`, 'DD-MMM-YYYY hh:mm A')*/}
                    {/*      .format('DD-MMM-YYYY • hh:mm A')}*/}
                    {/*  </p>*/}
                    {/*</div>*/}

                   

                  </div>

                  {/* Right Column – also with legend borders */}
                  <div className="col-md-6">
                    <div className="mb-4 border-start border-3 border-warning ps-3">
                      <small className="text-muted d-block mb-1">Duration</small>
                      <p className="mb-0">
                        {dayjs(selectedCampaign.startTime).format('DD-MMM-YY hh:mm A')} —{' '}
                        {dayjs(selectedCampaign.finishTime).format('DD-MMM-YY hh:mm A')}
                      </p>
                    </div>
                 
                  

                    {/*<div className="mb-4 border-start border-3 border-success ps-3">*/}
                    {/*  <small className="text-muted d-block mb-1">Engagement</small>*/}
                    {/*  <div className="d-flex gap-4 flex-wrap">*/}
                    {/*    <div>*/}
                    {/*      <strong>{selectedCampaign.readCount}</strong>*/}
                    {/*      <small className="d-block text-muted">Reads</small>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*      <strong>{selectedCampaign.clicksCount}</strong>*/}
                    {/*      <small className="d-block text-muted">Clicks</small>*/}
                    {/*    </div>*/}
                    {/*    <div>*/}
                    {/*      <strong>{selectedCampaign.commentsCount}</strong>*/}
                    {/*      <small className="d-block text-muted">Comments</small>*/}
                    {/*    </div>*/}
                    {/*  </div>*/}
                    {/*</div>*/}

                    {/*{selectedCampaign.description && (*/}
                    {/*  <div className="mb-4 border-start border-3 border-secondary ps-3">*/}
                    {/*    <small className="text-muted d-block mb-1">Description</small>*/}
                    {/*    <p className="small mb-0">{selectedCampaign.description}</p>*/}
                    {/*  </div>*/}
                    {/*)}*/}
                  </div>
                  <div className="col-md-3">

                    <div className="mb-4 border-start border-3 border-dark ps-3">
                      <small className="text-muted d-block mb-1">Total Recipients</small>
                      <p className="mb-0 fw-bold text-primary">
                        {selectedCampaign.totalRecipients || 0}
                      </p>
                    </div>
                    {/*<div className="mb-4 border-start border-3 border-primary ps-3">*/}
                    {/*  <small className="text-muted d-block mb-1">Current Status</small>*/}
                    {/*  <span*/}
                    {/*    className={`badge bg-${getStatusInfo(selectedCampaign.deliveryStatus)?.color || 'secondary'} text-white fs-6 px-3 py-2`}*/}
                    {/*  >*/}
                    {/*    {getStatusInfo(selectedCampaign.deliveryStatus)?.label || '—'}*/}
                    {/*  </span>*/}
                    {/*</div>*/}
                 
         
                  
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default campaignNotificationReport;

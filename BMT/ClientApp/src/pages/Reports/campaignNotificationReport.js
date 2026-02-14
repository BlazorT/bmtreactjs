/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import CIcon from '@coreui/icons-react';
import { cilCalendar, cilChevronBottom, cilFlagAlt, cilUser, cilInfo, cilX } from '@coreui/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // ← this line is missing

dayjs.extend(relativeTime); // ← this line is missing or not executed
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
import Button from 'src/components/UI/Button';

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
      minWidth: 120,
      editable: false,
      filterable: true,
      type: 'timestamp',
    },
    {
      key: 'createdAt',
      headerClassName: 'custom-header-data-grid',
      name: 'Campaign Time',
      minWidth: 120,
      editable: false,
      filterable: true,
      type: 'timestamp',
    },
    {
      key: 'networkName',
      headerClassName: 'custom-header-data-grid',
      name: 'Network',
      minWidth: 160,
      editable: false,
      filterable: true,
    },
    {
      key: 'name',
      headerClassName: 'custom-header-data-grid',
      name: 'Campaign Name',
      minWidth: 130,
      editable: false,
      filterable: true,
    },
    {
      key: 'totalRecipients',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Total',
      minWidth: 100,
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
      minWidth: 120,
      cellClassName: 'text-center',
    },
    {
      key: 'failed',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Failed',
      editable: false,
      filterable: true,
      minWidth: 120,
      cellClassName: 'text-center',
    },
    {
      key: 'delivered',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Delivered',
      editable: false,
      filterable: true,
      minWidth: 120,
      cellClassName: 'text-center',
    },
    {
      key: 'readCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Reads',
      editable: false,
      filterable: true,
      minWidth: 120,
      cellClassName: 'text-center',
    },
    {
      key: 'commentsCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Comments',
      editable: false,
      filterable: true,
      minWidth: 120,
      cellClassName: 'text-center',
    },
    {
      key: 'clicksCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Clicks',
      editable: false,
      filterable: true,
      minWidth: 120,
      cellClassName: 'text-center',
    },
    {
      key: 'sharesCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Shares',
      editable: false,
      filterable: true,
      minWidth: 120,
      cellClassName: 'text-center',
    },
    {
      key: 'likesCount',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Likes',
      editable: false,
      filterable: true,
      minWidth: 120,
      cellClassName: 'text-center',
    },
    {
      key: 'actions',
      headerClassName: 'custom-header-data-grid text-center',
      name: 'Details',
      minWidth: 80,
      editable: false,
      filterable: false,
      cellClassName: 'text-center',
      renderCell: ({ row }) => (
        <Button
          className="p-0 h-auto w-auto"
          onClick={() => openDetailModal(row)}
          // title="View campaign details"
          icon={<CIcon icon={cilInfo} size="lg" />}
        />
      ),
    },
  ];

  const openDetailModal = (row) => {
    setSelectedCampaign(row);
    console.log('Selected row for modal:', row);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const getStatusInfo = (deliveryStatus) => {
    const statuses = globalutil.deliverstatus();
    const found = statuses.find((item) => String(item.id) === String(deliveryStatus));

    if (!found) {
      return {
        label: 'Unknown',
        color: 'secondary',
        icon: '❓', // Unicode question mark
      };
    }

    const label = found.name.trim();
    const lower = label.toLowerCase();

    let color = 'secondary';
    let icon = '❓'; // default fallback

    if (lower.includes('sent') || lower.includes('pending')) {
      color = 'primary';
      icon = '✓'; // Unicode check mark
    } else if (lower.includes('delivered') || lower.includes('read') || lower.includes('seen')) {
      color = 'success';
      icon = '✓'; // Unicode check mark
    } else if (lower.includes('failed') || lower.includes('undelivered')) {
      color = 'danger';
      icon = '✗'; // Unicode ballot cross (or you can use ×)
    } else if (lower.includes('deleted')) {
      color = 'dark';
      icon = '🗑'; // Unicode trash / wastebasket
    }

    return { label, color, icon };
  };
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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipients =
    selectedCampaign?.recipients?.filter(
      (r) =>
        r.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.messageRefId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.failureDetails?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];
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
        }),
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
          (d) => d.deliveryStatus === statusId,
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
        totalRecipients: items.length,
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
        // Store full recipients list for modal
        recipients: items.map((item) => ({
          recipient: item.recipient,
          nCreatedAt: item.nCreatedAt,
          nLastUpdatedAt: item.nLastUpdatedAt,
          deliveryStatus: item.deliveryStatus,
          messageRefId: item.messageRefId,
          failureDetails: item.failureDetails || '',
        })),
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
          <div className="">
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
              <div className="col-12 d-flex justify-content-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline-secondary me-2"
                >
                  Reset
                </button>

                <button type="button" onClick={applyFilters} className="btn btn-primary">
                  Search
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
            {
              field: 'totalRecipients',
              aggregates: [{ aggregate: 'sum', caption: 'Total Recipients' }],
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

      {/* ====================== DETAILS MODAL ====================== */}
      {modalVisible && selectedCampaign && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">
                  Campaign - {selectedCampaign.name || 'Multiple Campaigns'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                {/* Summary Section */}
                <div className="row g-4 mb-2">
                  {/* Left Column – Summary Info */}
                  <div className="col-md-4">
                    <div className="mb-4 border-start border-3 border-primary ps-3">
                      <small className="text-muted d-block mb-1">Campaign Name</small>
                      <p className="mb-0 fw-medium">{selectedCampaign.name || '—'}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-4 border-start border-3 border-primary ps-3">
                      <small className="text-muted d-block mb-1">Network Name</small>
                      <p className="mb-0 fw-medium">{selectedCampaign.networkName || '—'}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-4 border-start border-3 border-warning ps-3">
                      <small className="text-muted d-block mb-1">Campaign Time</small>
                      <p className="mb-0">
                        {dayjs.utc(selectedCampaign.startTime).local().format('DD-MMM-YY hh:mm A')}{' '}
                        ~{' '}
                        {dayjs.utc(selectedCampaign.finishTime).local().format('DD-MMM-YY hh:mm A')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recipients Details – Beautiful List with Legend Borders + Search */}
                <div className="mt-2">
                  {/* Header with Title, Badge, and Centered Search */}
                  {/* Center: Search (grows to fill space) */}
                  {/* Header with Title, Badge, and Perfectly Centered Search */}
                  <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-4 gap-3">
                    {/* LEFT – Title + Badge */}
                    <div className="d-flex align-items-center gap-3 flex-shrink-0">
                      <h5 className="mb-0 fw-semibold text-primary">Recipients Details</h5>
                      <span className="badge bg-primary rounded-pill fs-6 px-3 py-1">
                        {selectedCampaign.totalRecipients || 0}
                      </span>
                    </div>

                    {/* CENTER – Search */}
                    <div className="flex-grow-1 d-flex justify-content-center">
                      <div
                        className="input-group input-group-sm"
                        style={{ maxWidth: '450px', width: '100%' }}
                      >
                        <input
                          type="text"
                          className="form-control border-start-0 border-end-0"
                          placeholder="Search by recipient, ref ID or failure reason..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {searchTerm && (
                          <button
                            className="btn btn-sm btn-outline-secondary border-start-0 px-2"
                            type="button"
                            onClick={() => setSearchTerm('')}
                            title="Clear search"
                          >
                            <CIcon icon={cilX} size="sm" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* RIGHT – Search Result Count */}
                    <div className="d-flex align-items-center justify-content-md-end flex-shrink-0">
                      <span className="text-muted small">
                        Search Result -{' '}
                        <strong className="text-primary">{filteredRecipients?.length || 0}</strong>{' '}
                        {filteredRecipients?.length !== 1 ? '' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Filtered Recipients List */}
                  {selectedCampaign.recipients?.length > 0 ? (
                    <div className="row g-3 campaign-list-details">
                      {filteredRecipients.map((recipient, index) => {
                        const statusInfo = getStatusInfo(recipient.deliveryStatus);

                        // Dynamic label for nLastUpdatedAt
                        let statusTimeLabel = 'Updated At';
                        if (recipient.deliveryStatus === '6') statusTimeLabel = 'Sent At';
                        else if (recipient.deliveryStatus === '7') statusTimeLabel = 'Delivered At';
                        else if (recipient.deliveryStatus === '8') statusTimeLabel = 'Failed At';
                        else if (recipient.deliveryStatus === '9') statusTimeLabel = 'Deleted At';
                        else if (recipient.deliveryStatus === '10') statusTimeLabel = 'Read At';
                        else if (recipient.deliveryStatus === '11') statusTimeLabel = 'Seen At';

                        // Border color based on status
                        const borderColorClass =
                          recipient.deliveryStatus === '8'
                            ? 'border-danger'
                            : recipient.deliveryStatus === '7' ||
                                recipient.deliveryStatus === '10' ||
                                recipient.deliveryStatus === '11'
                              ? 'border-success'
                              : recipient.deliveryStatus === '6'
                                ? 'border-primary'
                                : 'border-warning';

                        // Relative time from nLastUpdatedAt
                        const relativeTime = recipient.nLastUpdatedAt
                          ? dayjs(recipient.nLastUpdatedAt).fromNow()
                          : '—';

                        return (
                          <div key={index} className="col-12">
                            <div
                              className={`card border-0 shadow-sm hover-shadow transition-all ${borderColorClass} border-start border-4 position-relative`}
                              style={{
                                transition: 'all 0.25s ease',
                                background: 'rgba(255,255,255,0.97)',
                                borderRadius: '0.75rem',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
                              }}
                            >
                              <div className="card-body p-4 pb-5">
                                {' '}
                                {/* extra bottom padding for relative time */}
                                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                  {/* Left – Main Info */}
                                  <div className="d-flex flex-column gap-3 flex-grow-1">
                                    <div className="d-flex align-items-center gap-3">
                                      {/*<div*/}
                                      {/*  className="rounded-circle bg-light d-flex align-items-center justify-content-center flex-shrink-0"*/}
                                      {/*  style={{ width: '50px', height: '50px' }}*/}
                                      {/*>*/}
                                      {/*  <strong className="text-muted fs-5">{index + 1}</strong>*/}
                                      {/*</div>*/}
                                      <div className="flex-grow-1">
                                        <h6 className="mb-1 fw-semibold text-white">
                                          {recipient.recipient || 'Unknown Recipient'}
                                        </h6>
                                        <small className="text-muted d-block">
                                          Ref: {recipient.messageRefId || '—'}
                                        </small>
                                      </div>
                                    </div>

                                    <div className="d-flex gap-4 flex-wrap">
                                      <div>
                                        <small className="text-muted d-block">Sent At</small>
                                        <strong className="text-white">
                                          {recipient.nCreatedAt
                                            ? dayjs
                                                .utc(recipient.nCreatedAt)
                                                .local()
                                                .format('DD-MMM-YY • hh:mm A')
                                            : '—'}
                                        </strong>
                                      </div>

                                      <div>
                                        <small className="text-muted d-block">
                                          {statusTimeLabel}
                                        </small>
                                        <strong className="text-white">
                                          {recipient.nLastUpdatedAt
                                            ? dayjs
                                                .utc(recipient.nLastUpdatedAt)
                                                .local()
                                                .format('DD-MMM-YY • hh:mm A')
                                            : '—'}
                                        </strong>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right – Status Badge with Icon */}
                                  <div className="d-flex flex-column align-items-end gap-2">
                                    <span
                                      className={`badge bg-${statusInfo.color} text-white px-3 py-2 fs-6 d-flex align-items-center gap-2`}
                                      style={{ minWidth: '120px', justifyContent: 'center' }}
                                    >
                                      <span style={{ fontSize: '1.1rem' }}>{statusInfo.icon}</span>
                                      <span>{statusInfo.label}</span>
                                    </span>
                                  </div>
                                </div>
                                {/* Failure Details */}
                                {recipient.deliveryStatus === '8' && recipient.failureDetails && (
                                  <div className="mt-4 pt-3 border-top">
                                    <small className="text-danger fw-medium d-block mb-2">
                                      Failure Reason:
                                    </small>
                                    <p className="text-danger small mb-0">
                                      {recipient.failureDetails}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Relative Update Time – Bottom Right */}
                              <div
                                className="position-absolute bottom-0 end-0 me-3 mb-2"
                                style={{ fontSize: '0.75rem' }}
                              >
                                <small className="text-muted fst-italic">{relativeTime}</small>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="alert alert-info text-center p-4 mb-0 rounded-3">
                      No individual recipient details available for this campaign group.
                    </div>
                  )}
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

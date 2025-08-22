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
import _ from 'lodash';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import CustomDatePicker from 'src/components/UI/DatePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import { CContainer } from '@coreui/react';
import Loading from 'src/components/UI/Loading';
import { getUserReportPdf } from 'src/helpers/getUserReportPdf';

const CampaignNotificationReport = ({ reportField, fetchInspection, value }) => {
  dayjs.extend(utc);
  // console.log(JSON.stringify(globalutil.userroles()));
  //const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
  //  (item) => item.name === 'Users Report',
  //);
  const generatePdf = async () => {
    const body = {
      id: rows[0].id,
    };
    const reportRows = makeGroupingRows(rows);
    const doc = getUserReportPdf(reportRows, reportField);
    doc.output('dataurlnewwindow');
    // console.log(reportRows, 'repoertdata');
  };

  useEffect(() => {
    applyFilters();
  }, []);
  const [activeTab, setActiveTab] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const initialFilter = {
    orgId: user.orgId,
    recipient: '',
    deliveryStatus: '6',
    status: 0,
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);
  const applyFilters = async () => {
    const filterBody = {
      recipient: filters.recipient,
      deliveryStatus: String(filters.deliveryStatus || ''), // ✅ Always string
      createdAt: dayjs(filters.createdAt).utc().format('YYYY-MM-DD'),
      lastUpdatedAt: dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD'),
    };

    getNotiList(filterBody);
  };

  const deliveryStatuses = [
    { id: 6, name: 'SENT', code: '2', desc: 'SENT', lvType: 2 },
    { id: 7, name: 'DELIVERED', code: '2', desc: 'DELIVERED', lvType: 2 },
    { id: 8, name: 'FAILED', code: '2', desc: 'FAILED', lvType: 2 },
    { id: 9, name: 'DELETED', code: '2', desc: 'DELETED', lvType: 2 },
    { id: 10, name: 'READ', code: '2', desc: 'READ', lvType: 2 },
    { id: 11, name: 'SEEN', code: '2', desc: 'SEEN', lvType: 2 },
    { id: 12, name: 'UNDELIVERED', code: '2', desc: 'UNDELIVERED', lvType: 2 },
    { id: 13, name: 'PENDING', code: '2', desc: 'PENDING', lvType: 2 },
  ];

  const globalutil = {
    // Other functions or properties
    deliverstatus: () => deliveryStatuses,
  };

  const {
    response: GeNotiRes,
    loading: NotiLoading,
    error: createServiceError,
    fetchData: GetNotificationReportData,
  } = useFetch();
  useEffect(() => {
    getNotiList();
  }, []);
  const getNotiList = async (filters) => {
    const fetchBody = {
      Id: 0,
      Status: 1,
      OrgId: user.orgId,
      createdAt: dayjs().utc().subtract(1, 'year').format(),
      lastUpdatedAt: dayjs().utc().format(),
      ...filters,
    };

    //alert(JSON.stringify(fetchBody));
    console.log('fetchBody', JSON.stringify(fetchBody));
    await GetNotificationReportData(
      '/Report/notificationsreportdata',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        console.log('Notification responce', res);
        if (res.status === true) {
          //alert(JSON.stringify(res));

          const groupedData = _.groupBy(
            res.data,
            (item) => `${item.name}|${item.createdAt}|${item.networkName}`,
          );

          const mappedArray = Object.entries(groupedData).flatMap(
            ([groupKey, groupItems], index) => {
              const [name, createdAt, networkName] = groupKey.split('|');

              // Top (group) row — only shows campaign name, date, network
              const groupRow = {
                id: `group-${index}`,
                name,
                createdAt: formatDate(createdAt),
                sent: 0,
                failed: 0,
                delivered: 0,
                networkName,
                isGroupRow: true, // flag for custom render
              };

              // Child rows — normal data, no name/date/network
              const childRows = groupItems.map((data, i) => {
                const statusCounts = {};
                globalutil.deliverstatus().forEach((statusObj) => {
                  const statusId = statusObj.id.toString();
                  statusCounts[statusObj.name.toLowerCase()] = groupItems.filter(
                    (d) => d.deliveryStatus === statusId,
                  ).length;
                });

                return {
                  id: `${data.id}-${i}`,
                  name: '', // empty for grouping effect
                  createdAt: '',
                  networkName: '',
                  readCount: data.readCount || 0,
                  commentsCount: data.commentsCount || 0,
                  clicksCount: data.clicksCount || 0,
                  sharesCount: data.sharesCount || 0,
                  likesCount: data.likesCount || 0,
                  // Add delivery status counts
                  sent: statusCounts['sent'] || 0,
                  delivered: statusCounts['delivered'] || 0,
                  failed: statusCounts['failed'] || 0,
                  deleted: statusCounts['deleted'] || 0,
                  read: statusCounts['read'] || 0,
                  seen: statusCounts['seen'] || 0,
                  undelivered: statusCounts['undelivered'] || 0,
                  pending: statusCounts['pending'] || 0,
                };
              });

              return [groupRow, ...childRows];
            },
          );

          setRows(mappedArray);
          console.log(mappedArray);
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
        setIsLoading(false);
      },
    );
    setIsLoading(false);
  };
  var deliveryStatus = globalutil.deliverstatus();
  console.log('deliveryStatus', deliveryStatus);
  const [rows, setRows] = useState([]);

  const [columns, setColumns] = useState([
    {
      key: 'name',
      headerClassName: 'custom-header-data-grid',
      name: 'Campaign Name',
      width: 160,
      editable: false,
      filterable: true,
    },
    {
      key: 'createdAt',
      headerClassName: 'custom-header-data-grid',
      name: 'Start Date',
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
  ]);

  const [showStock, setShowStock] = useState(false);
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

  const toggleStock = () => {
    setShowStock((prev) => !prev);
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
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <CContainer fluid className="mt-4">
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
              </div>
            ) : null}
          </div>
          <div className="bg_Div mb-2 d-flex flex-column">
            {/* <DataGridHeader exportFn={() => generatePdf()} title=" Notification" />*/}
            <div className="show-stock">
              <div className="row ">
                <div className="col-md-12 col-xl-12">
                  <CustomDatagrid
                    rows={rows}
                    columns={columns}
                    pagination={true}
                    // canExport={pageRoles.canExport}
                    // canPrint={pageRoles.canPrint}
                    summary={[
                      {
                        key: 'sent',
                        aggregates: [{ aggregate: 'sum', caption: 'Total Send' }],
                      },
                      {
                        key: 'failed',
                        aggregates: [{ aggregate: 'sum', caption: 'Total Failed' }],
                      },
                      {
                        key: 'delivered',
                        aggregates: [{ aggregate: 'sum', caption: 'Total Delivered' }],
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
                {/*<button type="button" className="btn_Default m-2 sales-btn-style">*/}
                {/*  Cancel*/}
                {/*</button>*/}
              </div>
            </div>
          </div>
        </div>
      </CContainer>
    </>
  );
};
export default CampaignNotificationReport;

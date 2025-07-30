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
import moment from 'moment';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import dayjs from 'dayjs';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import { CContainer } from '@coreui/react';
import utc from 'dayjs/plugin/utc';
import Loading from 'src/components/UI/Loading';
import { getUserReportPdf } from 'src/helpers/getUserReportPdf';

//import FleetInspectionTab from 'src/components/FleetComponents/FleetInspectionTab';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';

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
    deliveryStatus: '',
    status: 0,
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);
  const applyFilters = async () => {
    const filterBody = {
      recipient: filters.recipient,
      deliveryStatus: filters.deliveryStatus === '' ? 0 : filters.deliveryStatus,
      createdAt: moment(filters.createdAt).utc().format().toString().split('T')[0],
      lastUpdatedAt: moment(filters.lastUpdatedAt).utc().format().toString().split('T')[0],
    };

    getNotiList(filterBody);

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
      createdAt: moment().utc().subtract(1, 'year').format(),
      lastUpdatedAt: moment().utc().format(),
      ...filters,
    };

    //alert(JSON.stringify(fetchBody));
    console.log("fetchBody",JSON.stringify(fetchBody));
    await GetNotificationReportData('/Report/GetCampaignNotificationReportData',
      {
        method: 'GET',
        body: JSON.stringify(fetchBody)
      },
      (res) => {
        console.log('Notification responce', res);
        if (res.status === true) {
          //alert(JSON.stringify(res));
          const mappedArray = res.data.map((data) => ({
            id: data.id,
            roleName: data.name,
            userName: data.userName,
            status: data.status,
            contact: data.contact,
            email: data.email,
            createdAt: formatDate(data.createdAt) || '',

            readCount: data.readCount || 0,
            commentsCount: data.commentsCount || 0,
            clicksCount: data.clicksCount || 0,
            sharesCount: data.sharesCount || 0,
            likesCount: data.likesCount || 0,
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
        setIsLoading(false);
      },
    );
    setIsLoading(false);
  };
  const [rows, setRows] = useState([]);

  const [columns, setColumns] = useState([
    {
      field: 'name',
      headerClassName: 'custom-header-data-grid',
      headerName: ' Name',
      flex: 1,
      width: 150,
      editable: false,
      filterable: true,
    },
    {
      field: 'createdAt',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Start Date',
      flex: 1,
      width: 140,
      editable: false,
      filterable: true,
      type: 'timestamp',
    },
    {
      field: 'network',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Network',
      flex: 1,
      width: 130,
      editable: false,
      filterable: true,
    },
    {
      field: 'send',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Send',
      width: 100,
      editable: false,
      filterable: true,
    },
    {
      field: 'failed',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Failed',
      width: 100,
      editable: false,
      filterable: true,
    },
    {
      field: 'delivered',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Delivered',
      width: 100,
      editable: false,
      filterable: true,
    },
    {
      field: 'readCount',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Reads',
      width: 100,
      editable: false,
      filterable: true,
    },
    {
      field: 'commentsCount',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Comments',
      width: 100,
      editable: false,
      filterable: true,
    },
    {
      field: 'clicksCount',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Clicks',
      width: 100,
      editable: false,
      filterable: true,
    },
    {
      field: 'sharesCount',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Shares',
      width: 100,
      editable: false,
      filterable: true,
    },
    {
      field: 'likesCount',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Likes',
      width: 100,
      editable: false,
      filterable: true,
    }
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
    const mappedArray = data.map((field, index) => {
      let mappedObject;

      if (index == 0) {
        mappedObject = {
          userName: 'name',
          roleName: 'Role',
          contact: 'Contact',
          email: 'Email',
          status: 'status',
          createdAt: 'Date Of Joining'
        }

      }
      else {
        mappedObject = {
          userName: field.userName,
          roleName: field.roleName,
          contact: field.contact,
          email: field.email,
          status: field.status,
          createdAt: field.createdAt,
        }
      }
      return mappedObject;
    });

    const grouping = mappedArray.flatMap((item, index) => {
      const rowData = [item.userName, item.roleName, item.contact, item.email, item.status.toString(), item.createdAt];
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
        [date]: moment(e).utc().format(),
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
                         // options={globalutil.commonstatuses()}
                          className="form-control item form-select"
                          value={filters.deliveryStatus}
                          name="deliveryStatus"
                          title=" delivery Status "
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
                          value={filters.createdAt}
                        title=" Campaign start date  "
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
              <DataGridHeader exportFn={() => generatePdf()} title=" Notification" />
              <div className="show-stock">
                <div className="row ">
                  <div className="col-md-12 col-xl-12">
                    <CustomDatagrid
                      rows={rows}
                      columns={columns}
                      rowHeight={'normal'}
                      pagination={true}
                      // canExport={pageRoles.canExport}
                      // canPrint={pageRoles.canPrint}
                    summary={[
                      {
                        field: 'send',
                        aggregates: [{ aggregate: 'sum', caption: 'Total Send' }],
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

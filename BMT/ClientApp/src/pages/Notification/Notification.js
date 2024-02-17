import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import Visibility from '@mui/icons-material/Visibility';
import Reply from '@mui/icons-material/Reply';
import { cilUser, cilFlagAlt, cilChevronBottom, cilCalendarCheck } from '@coreui/icons';
import { CCard, CCardHeader } from '@coreui/react';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import globalutil from 'src/util/globalutil';
import Tooltip from '@mui/material/Tooltip';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import NotificationModal from 'src/components/Modals/NotificationModal';
import NotificationInfoModal from 'src/components/Modals/NotificationInfoModal';

const Notification = () => {
  const [showStock, setShowStock] = useState(false);
  const [showLicence, setShowLicence] = useState(true);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [replyNotiModalOpen, setreplyNotiModalOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);

  const [rows, setRows] = useState([
    {
      id: 1,
      sender: 'John Doe, 4DSPS Admin',
      title: 'your delivery performance is question mark.',
      status: 'Responded',
      dateandtime: '06 Nov 2023 4:15:00',
      edit: 'Edit',
      imageUrl: 'Delete',
      new: 1,
      read: 3,
      responded: 5,
    },
    {
      id: 2,
      sender: 'John Doe ',
      title: 'After duty must meet.',
      status: 'Responded',
      dateandtime: '06 Nov 2023 4:15:00',
      edit: 'Edit',
      imageUrl: 'Delete',
      new: 1,
      read: 3,
      responded: 5,
    },
    {
      id: 3,
      sender: 'John Doe ',
      title: 'traffic violation.',
      status: 'Responded',
      dateandtime: '06 Nov 2023 4:15:00',
      edit: 'Edit',
      imageUrl: 'Delete',
      new: 1,
      read: 3,
      responded: 5,
    },
  ]);
  const [columns, setColumns] = useState([
    {
      field: 'new',
      headerName: 'New',
      hideable: false,
      filterable: false,
    },
    {
      field: 'read',
      headerName: 'Read',
      hideable: false,
      filterable: false,
    },
    {
      field: 'responded',
      headerName: 'Responded',
      hideable: false,
      filterable: false,
    },
    {
      field: 'sender',
      headerName: 'Sender',
      flex: 1,
      minWidth: 120,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerClassName: 'custom-header-data-grid',
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 120,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerClassName: 'custom-header-data-grid',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerClassName: 'custom-header-data-grid',
    },
    {
      field: 'dateandtime',
      headerName: 'Date & Time',
      flex: 1,
      minWidth: 120,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerClassName: 'custom-header-data-grid',
    },

    {
      field: 'imageUrl',
      headerName: 'Action',
      flex: 1,
      minWidth: 80,
      editable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      headerClassName: 'custom-header-data-grid',
      renderCell: (params) => (
        <div className="d-flex justify-content-evenly align-items-center  w-50 ">
          <Tooltip title="notification detail"><Visibility onClick={AddPartnerClick} /></Tooltip>
          <Tooltip title="notification reply"> <Reply onClick={toggleReplyMdl} /></Tooltip>
        </div>
      ),
    },
  ]);
  const AddPartnerClick = () => {
    toggleInfoMdl(true);
  };

  const toggleReplyMdl = () => {
    setreplyNotiModalOpen((prev) => !prev);
  };

  const toggleInfoMdl = () => {
    setInfoModalOpen((prev) => !prev);
  };

  const toggleNoticeMdl = () => {
    setNoticeModalOpen((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const toggleStock = () => {
    setShowStock((prev) => !prev);
  };

  const toggleLicence = () => {
    setShowLicence((prev) => !prev);
  };

  return (
    <div className="job-application-form">
      <form onSubmit={handleSubmit}>
        <div>
          <CCard style={{ background: '#0A3153' }} className="mt-2">
            <CCardHeader className="dashboard-stock-header dashboard-drop">
              <div className="pointer" onClick={toggleStock}>
                Advance Search
              </div>
              <CIcon className="stock-toggle-icon" onClick={toggleStock} icon={cilChevronBottom} />
            </CCardHeader>
            {showStock == true ? (
              <div className="show-stock">
                <div className="mb-0  dashboard-table padLeftRight">
                  <div className="row">
                    <div className="col-md-6">
                      <CustomInput
                        label="Keyword"
                        
                       
                        icon={cilUser}
                        type="text"
                        id="keyword"
                        name="keyword"
                        placeholder="sender name, title, status "
                        className="form-control item"
                        isRequired={false}
                        title='Search using by sender name, title, status '
                      // message="Enter Buisness Name"
                      />
                    </div>
                    <div className="col-md-6">
                      <CustomSelectInput
                        label="Notification Status"
                        icon={cilFlagAlt}
                        id="status"
                        options={globalutil.commonstatuses()}
                        className="form-control item form-select"
                        disableOption='Select Status'
                        name="status"
                        title='Search notification status '
                       
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="text-end mt-2">
                        <button title="Click for searching notification data" type="button" className="btn_Default m-2 sales-btn-style">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </CCard>
          <div className="bg_Div mt-2 d-flex flex-column">
            <DataGridHeader
              title="Notifications"
              otherControls={[
                { icon: cilCalendarCheck, fn: toggleNoticeMdl },
                { icon: cilChevronBottom, fn: toggleLicence },
              ]}
            />
            {showLicence == true ? (
              <div className="show-stock">
                <div className="row pt-2">
                  <div className="col-md-12 col-xl-12">
                    <CustomDatagrid
                      rows={rows}
                      columns={columns}
                      rowHeight={50}
                      pagination={false}
                      summary={[
                        {
                          field: 'new',
                          aggregates: [{ aggregate: 'sum', caption: 'New' }],
                        },
                        {
                          field: 'read',
                          aggregates: [{ aggregate: 'sum', caption: 'Read' }],
                        },
                        {
                          field: 'responded',
                          aggregates: [{ aggregate: 'sum', caption: 'Responded' }],
                        },
                      ]}
                      hiddenCols={{
                        columnVisibilityModel: {
                          new: false,
                          read: false,
                          responded: false,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <NotificationInfoModal isOpen={replyNotiModalOpen} toggle={toggleReplyMdl} isShare={true} />
        <NotificationInfoModal isOpen={infoModalOpen} toggle={toggleInfoMdl} isShare={false} />
        <NotificationModal isOpen={noticeModalOpen} toggle={toggleNoticeMdl} />
      </form>
    </div>
  );
};

export default Notification;

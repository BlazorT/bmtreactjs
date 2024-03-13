import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import Visibility from '@mui/icons-material/Visibility';
import Reply from '@mui/icons-material/Reply';
import { cilUser, cilFlagAlt, cilChevronBottom, cilCalendarCheck } from '@coreui/icons';
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import globalutil from 'src/util/globalutil';
import Tooltip from '@mui/material/Tooltip';
import { CFormCheck } from '@coreui/react';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import NotificationModal from 'src/components/Modals/NotificationModal';
import NotificationInfoModal from 'src/components/Modals/NotificationInfoModal';
import AppContainer from '../../components/UI/AppContainer';

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
        <AppContainer>
          <CRow>
            <CCol md="4">
              <ul className="inlinedisplay">
                <li className="divCircle">
                  <CIcon className="BlazorIcon pdngleft" icon={cilFlagAlt} />
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexNotificationChecked"
                    label="Whatsapp"
                    defaultChecked
                  />
                </li>
              </ul>
            </CCol>
          </CRow>

        </AppContainer>
      </form>
    </div>
  );
};

export default Notification;

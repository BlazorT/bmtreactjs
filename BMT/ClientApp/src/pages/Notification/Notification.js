import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import Visibility from '@mui/icons-material/Visibility';
import Sms from '@mui/icons-material/Sms';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Email from '@mui/icons-material/Email';
import Facebook from '@mui/icons-material/Facebook';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Twitter from '@mui/icons-material/Twitter';
import Instagram from '@mui/icons-material/Instagram';
import { cilUser, cilFlagAlt, cilChevronBottom, cilCalendarCheck } from '@coreui/icons';
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import globalutil from 'src/util/globalutil';
import Tooltip from '@mui/material/Tooltip';
import { CFormCheck } from '@coreui/react';
import Button from 'src/components/InputsComponent/Button';
import { updateToast } from 'src/redux/toast/toastSlice';
import useFetch from 'src/hooks/useFetch';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import NotificationModal from 'src/components/Modals/NotificationModal';
import NotificationInfoModal from 'src/components/Modals/NotificationInfoModal';
import AppContainer from '../../components/UI/AppContainer';
import { formValidator } from 'src/helpers/formValidator';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useLocation, useNavigate } from 'react-router-dom';

const Notification = (toggle) => {
  const [isLoading, setIsLoading] = useState(true);
  const showConfirmation = useShowConfirmation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notificationData, setNotificationData] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const {
    response: createServiceRes,
    loading: createServiceLoading,
    error: createServiceError,
    fetchData: createService,
  } = useFetch();
  const onSave = async () => {
    const form = document.querySelector('.notification-setting');
   // formValidator();
   // if (form.checkValidity()) {
      const notification = {
        id: notificationData.id,
        networkId: notificationData.networkId,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
      };

      setIsLoading(createServiceLoading.current);
      await createService('/Admin/updatenetworsbulk', {
        method: 'POST',
        body: JSON.stringify(notification),
      });

      if (createServiceRes.current?.status === true) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createServiceRes.current.message,
            toastVariant: 'success',
          }),
        );
        navigate('/Notification');
       // getServices();
        //setNotificationData(initialData);
        toggle();
      } else {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createServiceRes.current?.message,
            toastVariant: 'error',
            //  `${JSON.stringify(createUserRes.current.message)}`,
          }),
        );

        setIsLoading(createServiceLoading.current);
     // }
    }
  };

  const onCancel = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel?',
      isOpen: true,
      onYes: () => onYesConfirm(),
      onNo: () => onNoConfirm(),
    });
  };

  const onYesConfirm = () => {
    toggle();
    onNoConfirm();
     
  };

  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  return (
    <div className="notification-setting">
      <form onSubmit={handleSubmit}>
        {/*<AppContainer>*/}
        <AppContainer>
          <DataGridHeader
            title="Networks"
            filterDisable={false}
          />
        </AppContainer>
          <CRow>
            <CCol md="4">
              <ul className="inlinedisplay">
              <li className="divCircle">
                <Sms className="BlazorIcon pdngleft" fontSize="large" color="success" />
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexNotificationChecked"
                    label="SMS"
                    defaultChecked
                  />
                </li>
              </ul>
            </CCol>
            <CCol md="4">
              <ul className="inlinedisplay">
              <li className="divCircle">
                <WhatsApp className="BlazorIcon pdngleft" fontSize="large" color="success" />
                 
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexwhtsNotificationChecked"
                    label="WHATSAPP"
                    defaultChecked
                  />
                </li>
              </ul>
            </CCol>
            <CCol md="4">
              <ul className="inlinedisplay">
                <li className="divCircle">
                <Email className="BlazorIcon pdngleft" fontSize="large" color="success" />
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexEmailNotificationChecked"
                  label="EMAIL"
                    defaultChecked
                  />
                </li>
              </ul>
            </CCol>
            <CCol md="4">
              <ul className="inlinedisplay">
              <li className="divCircle">
                <Twitter className="BlazorIcon pdngleft" fontSize="large" color="success" />
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexTwiNotificationChecked"
                    label="TWITTER"
                    defaultChecked
                  />
                </li>
              </ul>
            </CCol>
            <CCol md="4">
              <ul className="inlinedisplay">
                <li className="divCircle">
                <Facebook className="BlazorIcon pdngleft" fontSize="large" color="success" />
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexFbNotificationChecked"
                  label="FACEBOOK"
                    defaultChecked
                  />
                </li>
              </ul>
            </CCol>
            <CCol md="4">
              <ul className="inlinedisplay">
                <li className="divCircle">
                <Instagram className="BlazorIcon pdngleft" fontSize="large" color="success" />
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexInsNotificationChecked"
                  label="INSTAGRAM"
                    defaultChecked
                  />
                </li>
              </ul>
            </CCol>
            <CCol md="4">
              <ul className="inlinedisplay">
                <li className="divCircle">
                <LinkedIn className="BlazorIcon pdngleft" fontSize="large" color="success" />
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexLinNotificationChecked"
                    label="LINKEDIN"
                    defaultChecked
                  />
                </li>
              </ul>
            </CCol>
            <CCol md="4">
              <ul className="inlinedisplay">
                <li className="divCircle">
                  <CIcon className="BlazorIcon pdngleft" icon={cilFlagAlt} />
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexTikNotificationChecked"
                  label="TIKTOCK"
                    defaultChecked
                  />
                </li>

              </ul>
            </CCol>
            <CCol md="4">
              <ul className="inlinedisplay">
                <li className="divCircle">
                  <CIcon className="BlazorIcon pdngleft" icon={cilFlagAlt} />
                </li>
                <li className='network-checkbox-animate'>
                  <CFormCheck
                    className=""
                    id="flexSnapNotificationChecked"
                    label="SNAPCHAT"
                    defaultChecked
                  />
                </li>

              </ul>
            </CCol>
        
          </CRow>
        <React.Fragment>
          <div className="CenterAlign pt-2">
            <button
              onClick={() => onCancel()}
              type="button"
              className="btn btn_Default m-2 sales-btn-style"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave()}
              type="submit"
              className="btn btn_Default sales-btn-style m-2"
            >
            Save
            </button>
          </div>
        {/*  <Button title="Cancel" className="" onClick={() => onCancel()} />*/}
        {/*  <Button title="Save" onClick={() => onSave()} />*/}
        </React.Fragment>
        {/*</AppContainer>*/}
      </form>
    </div>
  );
};

export default Notification;

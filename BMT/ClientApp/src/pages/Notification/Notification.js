import React, { useState, useEffect } from 'react';
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
//import CustomInput from 'src/components/InputsComponent/CustomInput';
//import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
//import globalutil from 'src/util/globalutil';
//import Tooltip from '@mui/material/Tooltip';
import { CFormCheck } from '@coreui/react';
//import Button from 'src/components/InputsComponent/Button';
import { updateToast } from 'src/redux/toast/toastSlice';
import useFetch from 'src/hooks/useFetch';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

//import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
//import NotificationModal from 'src/components/Modals/NotificationModal';
//import NotificationInfoModal from 'src/components/Modals/NotificationInfoModal';
import AppContainer from '../../components/UI/AppContainer';
//import { formValidator } from 'src/helpers/formValidator';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useLocation, useNavigate } from 'react-router-dom';

const Notification = (toggle) => {
  const user = useSelector((state)=>state.user)
  const [isLoading, setIsLoading] = useState(true);
  const showConfirmation = useShowConfirmation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [networks, setNetworks] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const {
    response: GetNetworkRes,
    loading: NetworkLoading,
    error: createNetworkError,
    fetchData: GetNetworks,
  } = useFetch();
  useEffect(() => {
    getNetworksList()
  }, [])
  const getNetworksList = async () => {

    await GetNetworks(
      '/Admin/networks',
      {
        method: 'POST',
        // body: JSON.stringify(fetchBody),
      },
      (res) => {
       // console.log(res, 'networks');
        if (res.status === true) {
        
          setNetworks(res.data)
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          /*   setRows([]);*/
        }
        setIsLoading(NetworkLoading.current);
      },
    );
  };
  const {
    response: createNotificationRes,
    loading: createNotificationLoading,
    error: createNotificationError,
    fetchData: createNotification,
  } = useFetch();


  //alert(JSON.stringify(networkBody));
  const onSave = async () => {
    const body = networks.map((n) => ({id:n.id,status:n.status,createdBy:n.createdBy }))
   // alert(JSON.stringify(networkBody));
    setIsLoading(createNotificationLoading.current);
    await createNotification('/Admin/updatenetworsbulk', {
        method: 'POST',
      body: JSON.stringify(body),
      });
    console.log(body, createNotificationRes);
    if (createNotificationRes.current?.status === true) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createNotificationRes.current.message,
            toastVariant: 'success',
          }),
      );
      getNetworksList()
       // getServices();
        //setNotificationData(initialData);
       // toggle();
      } else {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createNotificationRes.current?.message,
            toastVariant: 'error',
            //  `${JSON.stringify(createUserRes.current.message)}`,
          }),
        );
         setIsLoading(createNotificationLoading.current);
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
  const handleNotificationSetting = (e,network) => {
    const { name, value, type, checked } = e.target
    setNetworks(prevObjects => {
      return prevObjects.map(obj => {
        if (obj.id === network.id) {
          return { ...obj, status: checked?1: 0};
        } else {
          return obj;
        }
      });
    });
  }

  const icons = {
    Tiktock: Email,
    Snapchat: Email,
    Facebook: Facebook,
    Sms: Sms,
    Linkedin: LinkedIn,
    Twitter: Twitter,
    Instagram:Instagram,
    Whatsapp: WhatsApp, // Assuming WhatsApp is your component for WhatsApp icon
    Email: Email // Assuming Email is your component for Email icon
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
          {networks.length > 0 && networks.map((network, index) => {
            const IconName = network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase();
            const IconComponent = icons[IconName];
           return (
              <CCol md={4} key={index}>
                <ul className="inlinedisplay">
                  <li className="divCircle">
                   <IconComponent className="BlazorIcon pdngleft" fontSize="large" color="success" />
                  </li>
                  <li className='network-checkbox-animate'>
                    <CFormCheck
                     className=""
                     id={IconName}
                     name={IconName}
                     label={network.name}
                     tag={network.id}
                     checked={network.status==1?true:false}
                     onChange={(e)=>handleNotificationSetting(e,network)}
                    />
                  </li>
                </ul>
              </CCol>
            )
          }) }
            
        
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

import React, { useState } from 'react';
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react';
import AppContainer from 'src/components/UI/AppContainer';
import { CFormCheck } from '@coreui/react';
import { cilChevronBottom, cilFlagAlt, cilCalendar } from '@coreui/icons';
import CustomDatePicker from 'src/components/UI/DatePicker';
import Sms from '@mui/icons-material/Sms';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Email from '@mui/icons-material/Email';
import Facebook from '@mui/icons-material/Facebook';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Twitter from '@mui/icons-material/Twitter';
import Instagram from '@mui/icons-material/Instagram';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { cilTask, cilCode, cilExcerpt, cilGraph, cilInfo } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import { updateToast } from 'src/redux/toast/toastSlice';
import useFetch from 'src/hooks/useFetch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import globalutil from 'src/util/globalutil';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';

import CustomTimePicker from 'src/components/UI/TimePicker';
import dayjs from 'dayjs';
import moment from 'moment';
import { formValidator } from 'src/helpers/formValidator';

const AddScheduleModel = (prop) => {

  const { header, isOpen, toggle, shiftData, getShifts } = prop;
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const {
    response: createscheduleRes,
    loading: createscheduleLoading,
    error: createScheduleError,
    fetchData: createSchedule,
  } = useFetch();

  const initialData = {
    id: shiftData ? shiftData.id : 0,
    
    lastUpdatedBy: user.userId,
    createdAt: moment().utc().format(),
    lastUpdatedAt: moment().utc().format(),
  };


  const [campaignRegData, setCampaignRegData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleServiceIntegration = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setCampaignRegData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const onSave = async () => {
    const form = document.querySelector('.shift-add-form');
    formValidator();
    if (form.checkValidity()) {
      const schedule = {
        id: campaignRegData.id,
        createdBy: user.userId,
        lastUpdatedBy: user.userId,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
      };

      setIsLoading(createscheduleLoading.current);
      await createSchedule('/Common/submitshift', {
        method: 'POST',
        body: JSON.stringify(schedule),
      });
      console.log({ createscheduleRes });
      if (createscheduleRes.current?.status === true) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createscheduleRes.current.message,
            toastVariant: 'success',
          }),
        );
        navigate('/waves');
        //getShifts();
        setCampaignRegData(initialData);
        toggle();
      } else {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createscheduleRes.current?.message,
            toastVariant: 'error',
            //  `${JSON.stringify(createUserRes.current.message)}`,
          }),
        );

        setIsLoading(createscheduleLoading.current);
      }
    }
  };
  //const [shifts, setShifts] = useState({
  //  name: '',
  //  startTime: dayjs(),
  //  hours: 1,
  //  endTime: dayjs().add(1, 'hour'),
  //});

  const handleCampaignAddForm = (e, label, date) => {
    var colName = date;
    if (label === 'startTime' || label === 'finishTime') {
     // console.log(e.$d);
      setCampaignRegData((prev) => ({
        ...prev,
        [label]: e,
      }));
    }
    else if (label === 'startDate' || label === 'endDate') {
      // console.log(e.$d);
      setCampaignRegData((prev) => ({
        ...prev,
        [colName]: e,
      }));
    }
    else {
      const { name, value } = e.target;
      console.log({ name, value });
      setCampaignRegData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const onCancel = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: 'Are you sure you want to cancel?',
        isOpen: true,
        onYes: () => onYesConfirm(),
        onNo: () => onNoConfirm(),
      }),
    );
  };

  const onYesConfirm = () => {
    toggle();
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    setCampaignRegData(initialData);
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };
  const icons = {
    Tiktock: Email,
    Snapchat: Email,
    Facebook: Facebook,
    Sms: Sms,
    Linkedin: LinkedIn,
    Twitter: Twitter,
    Instagram: Instagram,
    Whatsapp: WhatsApp, // Assuming WhatsApp is your component for WhatsApp icon
    Email: Email // Assuming Email is your component for Email icon
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader>{header}</ModalHeader>
      <ModalBody className="paddingAllSide">
        <form className="needs-validation shift-add-form" onSubmit={handleSubmit} noValidate>
          <AppContainer>
            <React.Fragment>
              <AppContainer>
                <DataGridHeader
                  title="Networks"
                  filterDisable={false}
                />
              </AppContainer>
              <CRow>
                {globalutil.networks().map((network, index) => {
                  const IconName = network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase();
                  // Assuming WhatsApp and Email are your icon components
                  const IconComponent = icons[IconName];
                  //console.log({ IconName })
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
                            defaultChecked
                          // checked={notificationData[IconName]}
                          // onChange={(e) => handleNotificationSetting(e, network)}
                          />
                        </li>
                      </ul>
                    </CCol>
                  )
                })}


              </CRow>
            
            </React.Fragment>
            <CRow>
              <CCol md="6">
                <CustomSelectInput
                  label="Interval Types"
                  icon={cilFlagAlt}
                  disableOption="Select Interval Types"
                  id="intervalTypes"
                  options={globalutil.intervals()}
                  className="form-control item form-select"
                  value={campaignRegData.intervalTypeId}
                  name="intervalTypes"
                  title=" Select Interval Types "
                  onChange={(e) => handleCampaignAddForm(e)}
                />
              </CCol>
              <CCol md="6" className='mt-3'>
                <CFormCheck
                  label="Is Fixed Time"
                  name='isFixedTime'
                  //checked={campaignRegData.isTermsAccepted}
                  //onChange={handleCampaignAddForm}
                  className='mt-4 d-flex flex-row justify-content-center'
                />
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <h5>Schedule Days</h5>
              <fieldset className="fieldset">
                <legend className="legend"></legend>
                <CRow className="mt-2 pb-2">
                  <CCol md="3">
                    <CFormCheck
                      label="Sunday"
                      name='sunday'
                      //checked={campaignRegData.isTermsAccepted}
                      //onChange={handleCampaignAddForm}
                      className='mt-3 d-flex flex-row justify-content-center'
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormCheck
                      label="Monday"
                      name='Monday'
                      //checked={campaignRegData.isTermsAccepted}
                      //onChange={handleCampaignAddForm}
                      className='mt-3 d-flex flex-row justify-content-center'
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormCheck
                      label="Tuesday"
                      name='Tuesday'
                      //checked={campaignRegData.isTermsAccepted}
                      //onChange={handleCampaignAddForm}
                      className='mt-3 d-flex flex-row justify-content-center'
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormCheck
                      label="Wednesday"
                      name='Wednesday'
                      //checked={campaignRegData.isTermsAccepted}
                      //onChange={handleCampaignAddForm}
                      className='mt-3 d-flex flex-row justify-content-center'
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormCheck
                      label="Thursday"
                      name='Thursday'
                      //checked={campaignRegData.isTermsAccepted}
                      //onChange={handleCampaignAddForm}
                      className='mt-3 d-flex flex-row justify-content-center'
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormCheck
                      label="Friday"
                      name='Friday'
                      //checked={campaignRegData.isTermsAccepted}
                      //onChange={handleCampaignAddForm}
                      className='mt-3 d-flex flex-row justify-content-center'
                    />
                  </CCol>
                  <CCol md="3">
                    <CFormCheck
                      label="Saturday"
                      name='Saturday'
                      //checked={campaignRegData.isTermsAccepted}
                      //onChange={handleCampaignAddForm}
                      className='mt-3 d-flex flex-row justify-content-center'
                    />
                  </CCol>
                </CRow>
              </fieldset>
            </CRow>
            <CRow >
              <CustomInput
                label="Interval Size"
                value={campaignRegData.interval}
                onChange={handleCampaignAddForm}
                icon={cilFlagAlt}
                type="number"
                id="interval"
                name="interval"
                placeholder="interval size"
                className="form-control item"
                isRequired={false}
              // message="Enter Buisness Name"
              />
            </CRow>
            <CRow>
              <CCol md="6">
                <CustomDatePicker
                  icon={cilCalendar}
                  label="Date From "
                  id="startDate"
                  name="startDate"
                  value={campaignRegData.startDate}
                  title="start date"
                  onChange={(e) => handleCampaignAddForm(e, 'startDate')}
                />
              </CCol>
              <CCol md="6">
                <CustomDatePicker
                  icon={cilCalendar}
                  label="Date To "
                  id="endDate"
                  name="endDate"
                  title="end date"
                  value={campaignRegData.endDate}
                  onChange={(e) => handleCampaignAddForm(e, 'endDate')}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md="6">
                <CustomTimePicker
                  icon={cilCalendar}
                  label="Start Time"
                  id="startTime"
                  name="startTime"
                  title="Start Time"
                  value={campaignRegData.startTime}
                  onChange={(e) => handleCampaignAddForm(e, 'startTime')}
                //  maxTime={shiftAddData.endTime}
                />
              </CCol>
              <CCol md="6">
                <CustomTimePicker
                  icon={cilCalendar}
                  label="End Time"
                  id="finishTime"
                  name="finishTime"
                  value={campaignRegData.finishTime}
                  onChange={(e) => handleCampaignAddForm(e, 'finishTime')}
                  title=" End Time"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={4}>
                <label htmlFor="" className="profile-user-labels mt-2 labelName">
                  Schedule Messages
                </label>
                <input className="form-control item user-profile-input labelName" value="0" disabled />
              </CCol>
              <CCol md={4}>
                <label htmlFor="" className="labelName profile-user-labels mt-2">
                  Schedule Budget($)
                </label>
                <input className="form-control item user-profile-input" value="0" disabled />
              </CCol>
              <CCol md={4}>
                <label htmlFor="" className="profile-user-labels mt-2 labelName">
                  Campaign Budget($)
                </label>
                <input className="form-control item user-profile-input" value="0" disabled />
              </CCol>
            </CRow>

          </AppContainer>
          <React.Fragment>
            <div className="CenterAlign pt-2">
              <button
                onClick={() => onCancel()}
                type="button"
                className="btn btn_Default m-2 sales-btn-style"
              >
                Back
              </button>
              <button
                onClick={() => onSave()}
                type="button"
                className="btn btn_Default sales-btn-style m-2 min-width"
              >
                Add Schedule
              </button>
              <button
               // onClick={() => submitCompaign()}
                type="submit"
                className="btn btn_Default sales-btn-style m-2 min-width"
              >
                Submit Campaign
              </button>
            </div>
          </React.Fragment>
        </form>
      </ModalBody>
    </Modal>
  );
};
export default AddScheduleModel;

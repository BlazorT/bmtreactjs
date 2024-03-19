import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sms from '@mui/icons-material/Sms';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Email from '@mui/icons-material/Email';
import Facebook from '@mui/icons-material/Facebook';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Twitter from '@mui/icons-material/Twitter';
import Instagram from '@mui/icons-material/Instagram';
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react';
import { Fieldset } from 'primereact/fieldset';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomDatePicker from 'src/components/UI/DatePicker';

import moment from 'moment';
import { cilChevronBottom, cilFlagAlt, cilCalendar } from '@coreui/icons';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import { formValidator } from 'src/helpers/formValidator';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import {
  getCampaignAddConfig,
  getInitialCampaignData,
} from 'src/configs/InputConfig/campaignAddConfig';
import { CContainer } from '@coreui/react';
import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';
import globalutil from 'src/util/globalutil';
import CustomTimePicker from 'src/components/UI/TimePicker';

import Inputs from 'src/components/Filters/Inputs';
import AppContainer from 'src/components/UI/AppContainer';
import { CFormCheck } from '@coreui/react';
import Form from 'src/components/UI/Form';
import { useFetchPartners } from 'src/hooks/api/useFetchPartners';
import { useCreateCampaignData } from 'src/hooks/api/useCreateCampaignData';
import useEmailVerification from 'src/hooks/useEmailVerification';
import validateEmail from 'src/helpers/validateEmail';
import { useShowToast } from 'src/hooks/useShowToast';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
import Loading from 'src/components/UI/Loading';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';

const campaignadd = () => {
  // let state;
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const uploadRef = useRef(null);
  const { uploadAvatar } = useUploadAvatar();
  const { fetchPartners } = useFetchPartners();
  const { createUpdateCampaign } = useCreateCampaignData();
  const { data, loading, error, checkEmailValidation } = useEmailVerification();
  const showToast = useShowToast();

  useEffect(() => {
   
 
  }, []);

  const [campaignRegData, setcampaignRegData] = useState(getInitialCampaignData(user));
  const [rows, setRows] = useState([]);
  const [showForm, setshowForm] = useState(true);
  const [addPartnerModalOpen, setModalOpen] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const showConfirmation = useShowConfirmation();
  const [showPartners, setshowPartners] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Campaign', 'Networks', 'Schedule'];
  const [scheduleTab, setScheduleTab] = useState(0);
  const Scheduletabs = ['Add Schedules', 'Schedules'];
  

  const registerCampaign = async () => {
    const form = document.querySelector('.dsp-reg-form');
    formValidator();
    if (form.checkValidity()) {
      // Upload & Submit
      const fUpload = document.getElementById('fileAvatar');
      if (fUpload.files !== null && fUpload.files.length > 0) {
        var avatar = fUpload.files[0];
        const formData = new FormData();
        formData.append('file', avatar);
        formData.append('id', '0');
        formData.append('name', avatar.name);
        formData.append('fileName', avatar.name);
        formData.append('createdBy', user.userId);
        formData.append('createdAt', moment().utc().format());

        // alert("Upload version before upload");
        const uploadAvatarRes = await uploadAvatar(formData);
        if (uploadAvatarRes.status === true) {
          const avatarPath =
            'productimages/' + uploadAvatarRes.keyValue.toString().split('\\').pop();
          const res = await createUpdateCampaign({ ...campaignRegData, logoPath: avatarPath });
          console.log(res);
          if (res.status) {
            navigate('/DspsList');
          }
        }
      } else {
        const res = await createUpdateCampaign(campaignRegData);
        console.log({ res });
        if (res.status === true) {
            navigate('/DspsList');
        }
      }
    }
  };

 

  const handleCampaignAddForm = (e, label) => {
    if (label == 'startTime' || label == 'finishTime') {
      // alert(label);
      setcampaignRegData((prev) => ({
        ...prev,
        [label]: e,
      }));
    } 
    else if (label === 'logoPath') {
      setcampaignRegData((prevData) => ({ ...prevData, [label]: e }));
    } else {
      const { name, value, type, checked } = e.target;
      const updatedValue = type === 'checkbox' ? checked : value;
      setcampaignRegData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
      }));
    }
  };
  const toggleStock = () => {
    setshowForm((prev) => !prev);
  };
  const TermsModal = () => {
    setTermsmodalOpen(!termsmodalOpen);
  };
  const confirmationModal = () => {
    setConfirmationModalOpen(!confirmationModalOpen);
  };
  const goToAnotherPage = () => {
    navigate('/DspsList');
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
   // toggle();
    onNoConfirm();

  };

  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };
  const campaignAddInputs = getCampaignAddConfig(
    campaignRegData,
    handleCampaignAddForm,
    TermsModal,
  );
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
  
  const [schedulerows, setschedulerows] = useState([
    {
      id: 1,
      interval: '12',
      budget: '250',
      message: '12',
      days: '2',
      startTime: '--',
      finishTime: '--',
    },
  ]);
    const [schedulecolumns, setSchedulecolumns] = useState([
    {
      field: 'interval',
      headerClassName: 'custom-header-data-grid',
      width: 100,
      //   flex: 1,
      headerName: 'Interval',
      filterable: false,
      sortable: false,
     
    },
    {
      /* flex: 1,*/
      minWidth: 130,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: 'Budget',
      type: 'text',
      align: 'left',
      headerAlign: 'left',
      field: 'budget',
      editable: false,
     
    },

    {
      field: 'message',
      headerClassName: 'custom-header-data-grid',
      minWidth: 250,
      flex: 1,
      headerName: 'Message',
      editable: false,
      filterable: true,
    },

    {
      /*flex: 1,*/
      minWidth: 200,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: 'Days',
      align: 'left',
      headerAlign: 'left',
      field: 'days',
      editable: false,
    },
    {
      /* flex: 1,*/
      minWidth: 150,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: ' Start Time',
      align: 'left',
      headerAlign: 'left',
      field: 'startTime',
      editable: false,
      type: 'timestamp',
    },

    {
      field: 'finishTime',
      headerClassName: 'custom-header-data-grid',
      minWidth: 130,
      /* flex: 1,*/
      headerName: 'End Time',
      sortable: false,
      filterable: false,
      type: 'timestamp',
      //renderCell: (params) => !params.row.date && formatTime(params.row.lastUpdated),
    },
  ]);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Form name="dsp-reg-form">
      <FleetDashboardTabs
        title="camaign"
        fleetTabs={tabs}
        activeTab={activeTab}
        handleActiveTab={setActiveTab}
      />
      <CContainer fluid className="mt-4">
        {tabs[activeTab] === 'Campaign' && (
          <React.Fragment>
            <AppContainer>
              <DataGridHeader
                title="Campaign Basic Information"
                otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
                filterDisable={true}
              />

              {showForm && (
                <React.Fragment>
                  <Inputs
                    inputFields={campaignAddInputs}
                    yesFn={goToAnotherPage}
                  
                  >
                  </Inputs>
                </React.Fragment>
              )}
            </AppContainer>
          </React.Fragment>
        )}
        {tabs[activeTab] === 'Networks' && (
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
                 // onClick={() => onSave()}
                  type="submit"
                  className="btn btn_Default sales-btn-style m-2"
                >
                  Save
                </button>
              </div>
              {/*  <Button title="Cancel" className="" onClick={() => onCancel()} />*/}
              {/*  <Button title="Save" onClick={() => onSave()} />*/}
            </React.Fragment>
          </React.Fragment>
        )}
        {tabs[activeTab] === 'Schedule' && (
          <React.Fragment>
            <AppContainer>
              <FleetDashboardTabs
                title="Schedule"
                fleetTabs={Scheduletabs}
                activeTab={scheduleTab}
                handleActiveTab={setScheduleTab}
              />
             
            </AppContainer>
            {Scheduletabs[scheduleTab] === 'Add Schedules' && (
              <React.Fragment>
                <AppContainer>
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
                    <Fieldset legend="Schedule Days:">
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
                    </Fieldset>
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
                        id="startTime"
                        name="startTime"
                        value={campaignRegData.startTime}
                        title=" start date  "
                        onChange={(e) => handleCampaignAddForm(e, 'startTime')}
                      />
                    </CCol>
                    <CCol md="6">
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="finishTime"
                        name="finishTime"
                        title=" end date "
                        value={campaignRegData.finishTime}
                        onChange={(e) => handleCampaignAddForm(e, 'finishTime')}
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md="6">
                      <CustomTimePicker
                        icon={cilCalendar}
                        label=" Start Time"
                        id="startTime"
                        name="startTime"
                        title=" Start Time"
                        value={campaignRegData.startTime}
                        onChange={(e) => handleCampaignAddForm(e, 'startTime')}
                      //  maxTime={shiftAddData.endTime}
                      />
                    </CCol>
                    <CCol md="6">
                      <CustomTimePicker
                        icon={cilCalendar}
                        label=" End Time"
                        id="finishTime"
                        name="finishTime"
                        value={campaignRegData.finishTime}
                        onChange={(e) => handleCampaignAddForm(e, 'finishTime')}
                        title=" End Time"
                      />
                    </CCol>
                  </CRow>
                </AppContainer>
              </React.Fragment>
            )}
            {Scheduletabs[scheduleTab] === 'Schedules' && (
              <React.Fragment>
                <AppContainer>
                    <React.Fragment>
                      <DataGridHeader  title="Schedules" />
                      <div className="show-stock">
                        <div className="row ">
                          <div className="col-md-12 col-xl-12">
                            <CustomDatagrid
                              rows={schedulerows}
                              columns={schedulecolumns}
                              rowHeight={55}
                              pagination={true}
                             // canExport={pageRoles.canExport}
                             // canPrint={pageRoles.canPrint}
                            />
                          </div>
                        </div>
                      </div>
                     
                    </React.Fragment>
                
                </AppContainer>
              </React.Fragment>
            )}
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
                  // onClick={() => onSave()}
                  type="button"
                  className="btn btn_Default sales-btn-style m-2"
                >
                  Save
                </button>
                <button
                  // onClick={() => onSave()}
                  type="submit"
                  className="btn btn_Default sales-btn-style m-2"
                >
                  Submit
                </button>
              </div>
            </React.Fragment>
          </React.Fragment>
        )}
      </CContainer>


    
      <ConfirmationModal
        header="Confirmation!"
        body="Are you sure you want to cancel?"
        isOpen={confirmationModalOpen}
        onYes={goToAnotherPage}
        onNo={confirmationModal}
      />

     

      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </Form>
  );
};

export default campaignadd;

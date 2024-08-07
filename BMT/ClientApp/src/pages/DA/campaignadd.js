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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Table, ListGroup } from 'react-bootstrap';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react';
//import { Fieldset } from 'primereact/fieldset';
//import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomInput from 'src/components/InputsComponent/CustomInput';
//import CustomDatePicker from 'src/components/UI/DatePicker';

import moment from 'moment';
import { cilChevronBottom, cilFlagAlt, cilCalendar, cilGlobeAlt } from '@coreui/icons';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
//import { formValidator } from 'src/helpers/formValidator';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import {
  getCampaignAddConfig,
  getInitialCampaignData,
} from 'src/configs/InputConfig/campaignAddConfig';
import { CContainer } from '@coreui/react';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';
import globalutil from 'src/util/globalutil';
//import CustomTimePicker from 'src/components/UI/TimePicker';

import Inputs from 'src/components/Filters/Inputs';
import AppContainer from 'src/components/UI/AppContainer';
import { CFormCheck } from '@coreui/react';
import Form from 'src/components/UI/Form';
import { useCreateCampaignData } from 'src/hooks/api/useCreateCampaignData';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
import Loading from 'src/components/UI/Loading';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import AreaSelectModel from 'src/components/Modals/AreaSelectModel';
import GoogleMapModel from 'src/components/Modals/GoogleMapModel';
import AddScheduleModel from 'src/components/Modals/AddScheduleModel';
import Button from '../../components/InputsComponent/Button';
import CIcon from '@coreui/icons-react';

const campaignadd = () => {
  // let state;
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { uploadAvatar } = useUploadAvatar();
  const { createUpdateCampaign } = useCreateCampaignData();

 

  const [campaignRegData, setcampaignRegData] = useState(getInitialCampaignData(user));
  const [showForm, setshowForm] = useState(true);
  const [targetAudience, setTargetAudience] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const showConfirmation = useShowConfirmation();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [cityData, setCityData] = useState([]);

  const [areaSelectModal, setAreaSelectModal] = useState(false);
  const [googleMapModel, setGoogleMapModel] = useState(false);
  const [addScheduleModel, setAddScheduleModel] = useState(false);

  const tabs = [{ id: 0, name: 'Campaign' }, { id: 1, name: 'Networks' }, { id: 2, name: 'Schedule' }];
 
  const handleCampaignAddForm = (e, label) => {
   // alert(label);
    if (label !== null && (label == 'startTime' || label == 'finishTime')) {
      // alert(label);
      setcampaignRegData((prev) => ({
        ...prev,
        [label]: e,
      }));
    }
    else if (label !== null && (label == 'Campaign Start Date' || label == 'Campaign End Date')) {
      // alert(label);
      setcampaignRegData((prev) => ({
        ...prev,
        [label]: e,
      }));
    } 
    else if (label === 'logoPath') {
      setcampaignRegData((prevData) => ({ ...prevData, [label]: e }));
    } else if (e.target !== null && e.target !== 'undefined') {
      const { name, value, type, checked } = e.target;
     // alert(name + " - " + value + " - " + checked)
      const isChecked = type === 'checkbox' ? checked : value;
      setcampaignRegData((prevData) => ({
        ...prevData,
        [name]: isChecked,
      }));
    }
  };
  const toggleStock = () => {
    setshowForm((prev) => !prev);
  };
  const toggleTargetAud = () => {
    setTargetAudience((prev) => !prev);
  };
  const toggleAreaSelectMdl = () => {
    setAreaSelectModal((prev) => !prev);
  };
  const toggleAddScheduleMdl = () => {
    setAddScheduleModel((prev) => !prev);
  };
  const toggleGoogleMapMdl = () => {
    setGoogleMapModel((prev) => !prev);
  };

  const AddGoogleMapClick = () => {
    toggleGoogleMapMdl(true);
  };
  const AddAreaClick = () => {
    toggleAreaSelectMdl(true);
  };
  const AddScheduleClick = () => {
    toggleAddScheduleMdl(true);
  };
  const TermsModal = () => {
    setTermsmodalOpen(!termsmodalOpen);
  };
  const confirmationModal = () => {
    setConfirmationModalOpen(!confirmationModalOpen);
  };
  const goToAnotherPage = () => {
    navigate('/campaignslisting');
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
  const handleDelete = (index) => {
    setCityData(cityData.filter((item, i) => i !== index));
  };
  const [targetUser, setTargetUser] = useState('');
  const [targetUserData, setTargetUserData] = useState([]);
  const handleAdd = () => {
    if (targetUser !== '') {
      setTargetUserData([...targetUserData, targetUser]);
      setTargetUser('');
    }
  };
  const handleDeleteuser = (index) => {
    const newCountries = [...targetUserData];
    newCountries.splice(index, 1);
    setTargetUserData(newCountries);
  };
  return (
    <Form name="dsp-reg-form">
      <BlazorTabs
        title="campaign"
        tabs={tabs}
        activeTab={activeTab}
        handleActiveTab={setActiveTab}
      />
      <CContainer fluid className="mt-4">
        {tabs[activeTab] && tabs[activeTab].name === 'Campaign' && (
          <React.Fragment>
            <AppContainer>
              <DataGridHeader
                title="Basic Information"
                onClick={toggleStock}
                otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
                filterDisable={true}
              />
              {showForm && (
                <React.Fragment>
                  <Inputs
                    inputFields={ campaignAddInputs }
                    yesFn={goToAnotherPage}
                    submitBtnTitle="Next"
                    submitFn={() => setActiveTab(1)}
                  >
                    <div className="row">
                      <div className="col-md-6 mt-4">
                        <CFormCheck
                          className=""
                          id="flexNotificationChecked"
                          label="Generate Auto Leads"
                          defaultChecked
                        />
                      </div>
                      <div className="col-md-6 mt-2">
                        <FormControl>
                          <FormLabel className="labelName" id="demo-row-radio-buttons-group-label">Status</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                          >
                            <FormControlLabel value="Active" control={<Radio />} label="Active" />
                            <FormControlLabel value="Paused" control={<Radio />} label="Paused" />
                            <FormControlLabel value="Cancel" control={<Radio />} label="Cancel" />
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </div>
                    <AppContainer>
                      <DataGridHeader
                        title="Target Audience"
                        onClick={toggleTargetAud}
                        otherControls={[{ icon: cilChevronBottom, fn: toggleTargetAud }]}
                        filterDisable={true}
                      />
                    </AppContainer>
                    {targetAudience && (
                      <React.Fragment>
                        <CRow>
                          <CCol md="12">
                            <CustomInput
                              label="File"
                              icon={cilFlagAlt}
                              type="file"
                              id="custom"
                              className="form-control item"
                              value={campaignRegData.custom}
                              name="custom"
                              onChange={handleCampaignAddForm}
                            />
                          </CCol>
                          <CCol md="4" className="mt-4">
                            <button
                              onClick={AddAreaClick}
                              type="button"
                              className="btn btn_Default sales-btn-style m-2 btn-Width"
                            >
                              Area Select
                            </button>
                          </CCol>
                          <CCol md="2" className="mt-4">
                            <CIcon className="mt-3" onClick={AddGoogleMapClick} icon={cilGlobeAlt} size="xxl" />
                          </CCol>
                          <CCol md="6">
                            <CustomInput
                              label="Area"
                              icon={cilFlagAlt}
                              type="text"
                              id="custom"
                              placeholder="Area Select"
                              className="form-control item"
                              value={campaignRegData.area}
                              name="area"
                              onChange={handleCampaignAddForm}
                            />
                          </CCol>
                          <CRow className="mg-lft mt-2">
                            <CCol md="12">
                              <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <th className="txt-color">Country</th>
                                    <th className="txt-color">City</th>
                                    <th className="txt-color">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cityData.map((item, index) => (
                                    <tr key={index}>
                                      <td className="txt-color">{item.states}</td>
                                      <td className="txt-color">{item.city}</td>
                                      <td className="txt-color">
                                        <Button title="Delete" value="Delete" variant="danger" onClick={() => handleDelete(index)}>
                                          Delete
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </CCol>
                          </CRow>
                          <CCol md="12 mt-2">
                            <textarea
                              label="Area"
                              icon={cilFlagAlt}
                              type="text"
                              id="description"
                              placeholder="text area for description"
                              className="form-control item"
                              value={campaignRegData.description}
                              name="description"
                              onChange={handleCampaignAddForm}
                            />
                          </CCol>
                          <CCol md="8" className="mt-2">
                            <CustomInput
                              label="Target User"
                              icon={cilFlagAlt}
                              type="text"
                              id="targetUser"
                              placeholder="add target user"
                              className="form-control item"
                              value={targetUser}
                              name="targetUser"
                              onChange={(e) => setTargetUser(e.target.value)}
                            />
                          </CCol>
                          <CCol md="4" className="mt-3">
                            <div className="mt-3">
                              <button
                                type="submit"
                                className="btn btn_Default sales-btn-style m-2"
                                onClick={handleAdd}
                              >
                                Save
                              </button>
                            </div>
                          </CCol>
                          <CCol md="12" className="mt-2">
                            <h4>Target Users</h4>
                            <ul>
                              {targetUserData.map((c, index) => (
                                <ListGroup.Item key={index} className="fontset">
                                  {c}
                                  <Button value="Delete" variant="danger" title="Delete" className="float-right margin-left" onClick={() => handleDeleteuser(index)}>
                                    Delete
                                  </Button>
                                </ListGroup.Item>
                              ))}
                            </ul>
                          </CCol>
                        </CRow>
                      </React.Fragment>
                    )}
                  </Inputs>
                </React.Fragment>
              )}
            </AppContainer>
          </React.Fragment>
        )}
        {tabs[activeTab] && tabs[activeTab].name === 'Networks' && (
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
                          defaultChecked
                        />
                      </li>
                    </ul>
                  </CCol>
                );
              })}
            </CRow>
            <React.Fragment>
              <div className="CenterAlign pt-2">
                <button
                  onClick={() => setActiveTab(0)}
                  type="button"
                  className="btn btn_Default m-2 sales-btn-style"
                >
                  Back
                </button>
                <button
                  onClick={() => setActiveTab(2)}
                  type="button"
                  className="btn btn_Default sales-btn-style m-2"
                >
                  Next
                </button>
              </div>
            </React.Fragment>
          </React.Fragment>
        )}
        {tabs[activeTab] && tabs[activeTab].name === 'Schedule' && (
          <React.Fragment>
            <AppContainer>
              <React.Fragment>
                <AppContainer>
                  <React.Fragment>
                    <DataGridHeader
                      addButton="Schedule"
                      addBtnClick={AddScheduleClick}
                      title="Schedules"
                    />
                    <div className="show-stock">
                      <div className="row">
                        <div className="col-md-12 col-xl-12">
                          <CustomDatagrid
                            rows={schedulerows}
                            columns={schedulecolumns}
                            rowHeight={55}
                            pagination={true}
                          />
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                </AppContainer>
              </React.Fragment>
            </AppContainer>
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
      <AreaSelectModel
        isOpen={areaSelectModal}
        toggle={toggleAreaSelectMdl}
        header="Area Select"
        setData={setCityData}
        data={cityData }
      />
      <GoogleMapModel
        isOpen={googleMapModel}
        toggle={toggleGoogleMapMdl}
        header="Area Select"
      />
      <AddScheduleModel
        isOpen={addScheduleModel}
        toggle={toggleAddScheduleMdl}
        header="Add Schedule "
      />
      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </Form>
  );
};

export default campaignadd;

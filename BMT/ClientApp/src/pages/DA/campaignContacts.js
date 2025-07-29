import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import DeleteIcon from '@mui/icons-material/Delete'; // if using MUI
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react';
//import { Fieldset } from 'primereact/fieldset';
//import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomInput from 'src/components/InputsComponent/CustomInput';
//import CustomDatePicker from 'src/components/UI/DatePicker';
import { updateToast } from 'src/redux/toast/toastSlice';
import useFetch from 'src/hooks/useFetch';

import moment from 'moment';
import { cilChevronBottom, cilFlagAlt, cilCalendar, cilGlobeAlt } from '@coreui/icons';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
//import { formValidator } from 'src/helpers/formValidator';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import {getCampaignAddConfig,getInitialCampaignData,} from 'src/configs/InputConfig/campaignAddConfig';
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
import { useDispatch, useSelector } from 'react-redux';
import { useShowToast } from 'src/hooks/useShowToast';

const campaignContacts = () => {
  // let state;
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { uploadAvatar } = useUploadAvatar();
  const { createUpdateCampaign } = useCreateCampaignData();

  const [campaignRegData, setCampaignRegData] = useState(getInitialCampaignData(user));
  const [showForm, setshowForm] = useState(true);
  const [targetAudience, setTargetAudience] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const showConfirmation = useShowConfirmation();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
 
  const [scheduleData, setScheduleData] = useState([]);

  const [areaSelectModal, setAreaSelectModal] = useState(false);
  const [googleMapModel, setGoogleMapModel] = useState(false);
  const [addScheduleModel, setAddScheduleModel] = useState(false);
 
  const [schedulerows, setScheduleRows] = useState([]);
  const allNetworkNames = globalutil.networks().map(n => n.name);

  const [selectedNetworks, setSelectedNetworks] = useState(allNetworkNames??[]);

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [cityData, setCityData] = useState([]); // Your table data
  const showToast = useShowToast();
  const {
    response: GetCityRes,
    loading: CityLoading,
    error: createCityError,
    fetchData: GetCity,
  } = useFetch();
  const dispatch = useDispatch();
  useEffect(() => {
    // Get states from util
    const states = globalutil.states();
    console.log('State name:', globalutil.states()); // <-- Correct logging
    setStateList(states);

    // Get cities from API
    getCityList();
  }, []);

  const getCityList = async () => {
    await GetCity('/Common/cities', { method: 'POST' }, (res) => {
      if (res.status === true) {
        setCityList(res.data); // cities: [{id, name, stateId}]
        console.log('City name:', res.data); // <-- Correct logging
      } else {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: res.message,
            toastVariant: 'error',
          })
        );
      }
    });
  };
  const getStateName = (id) => {
    const state = stateList.find((s) => s.id == id); // Use `==` or convert types
    return state ? state.name : id;
  };

  const getCityName = (id) => {
    const city = cityList.find((c) => c.id == id);
    return city ? city.name : id;
  };



  const handleCampaignAddForm = (e, label) => {
    if (label === 'video' || label === 'image' || label === 'pdf') {
      const file = e.target.files[0];
      if (!file) return;

      const type = file.type;
      const isVideo = label === 'video' && type.startsWith('video/');
      const isImage = label === 'image' && type.startsWith('image/');
      const isPDF = label === 'pdf' && type === 'application/pdf';

      if (!(isVideo || isImage || isPDF)) {
        e.target.value = null;
        showToast(`Invalid file type. Please select a valid ${label} file.`, 'error');
        return;
      }

      setCampaignRegData((prev) => ({
        ...prev,
        attachments: file,
      }));
    }

    else if (label === 'startTime' || label === 'finishTime') {
      setCampaignRegData((prev) => ({
        ...prev,
        [label]: e,
      }));
    }

    else if (label === 'Campaign Start Date') {
      setCampaignRegData((prev) => ({
        ...prev,
        startDate: e ? moment(e).format('YYYY-MM-DD HH:mm:ss') : null,
      }));
    }

    else if (label === 'Campaign End Date') {
      setCampaignRegData((prev) => ({
        ...prev,
        endDate: e ? moment(e).format('YYYY-MM-DD HH:mm:ss') : null,
      }));
    }

    else if (label === 'logoPath') {
      setCampaignRegData((prevData) => ({
        ...prevData,
        logoPath: e,
      }));
    }

    else if (e?.target) {
      const { name, value, type, checked, files } = e.target;
      const inputValue =
        type === 'checkbox' ? checked :
          type === 'file' ? files[0] :
            name === 'status' ? parseInt(value) : value;

      setCampaignRegData((prevData) => ({
        ...prevData,
        [name]: inputValue,
      }));
    }

    else {
      console.warn("Unhandled input in handleCampaignAddForm:", { e, label });
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
    setConfirmationModalOpen(false); // close the modal
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
  const campaignAddInputs = getCampaignAddConfig(campaignRegData,handleCampaignAddForm,TermsModal);
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
  
//  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [recipients, setRecipients] = useState({});

  const handleCheckboxChange = (network) => {
    if (selectedNetworks.includes(network)) {
      setSelectedNetworks(selectedNetworks.filter(n => n !== network));
    } else {
      setSelectedNetworks([...selectedNetworks, network]);
    }
  };

  const handleRecipientChange = (network, value) => {
    setRecipients(prev => ({ ...prev, [network]: value }));
  };

  return (
    <Form name="dsp-reg-form">
    
      <CContainer fluid className="mt-4">
     
          <React.Fragment>
            <AppContainer>
              <DataGridHeader
                title="Networks"
                filterDisable={false}
              />
            </AppContainer>
          <CRow>
            {globalutil.networks().map((network, index) => {
              const networkKey = network.name;
              const IconName = networkKey.charAt(0).toUpperCase() + networkKey.slice(1).toLowerCase();
              const IconComponent = icons[IconName];
              const isChecked = selectedNetworks.includes(networkKey);

              return (
                <CCol md={12} key={index}>
                  <ul className="inlinedisplay">
                    <li className="divCircle">
                      <IconComponent className="BlazorIcon pdngleft" fontSize="large" color="success" />
                    </li>
                    <li className='network-checkbox-animate'>
                      <CFormCheck
                        id={IconName}
                        name={IconName}
                        label={networkKey}
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(networkKey)}
                      />
                    </li>
                    <li>
                      <CButton color="secondary" disabled={!isChecked}>Add Recipient</CButton>
                    </li>
                    <li>
                      <CFormInput
                        disabled={!isChecked}
                        value={recipients[networkKey] || ''}
                        placeholder="Enter recipient and press Enter"
                        onChange={(e) => handleRecipientChange(networkKey, e.target.value)}
                      />
                    </li>
                    <li>
                      <CFormInput
                        type="file"
                        disabled={!isChecked}
                      />
                    </li>
                    <li>
                      <CButton color="primary" disabled={!isChecked}>Import</CButton>
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
        selectedNetworks={selectedNetworks}
        setSelected={setSelectedNetworks}
        campaignRegData={campaignRegData}
        setData={setScheduleData}
        data={scheduleData}
        header="Add Schedule "

      />
      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </Form>
  );
};

export default campaignContacts;

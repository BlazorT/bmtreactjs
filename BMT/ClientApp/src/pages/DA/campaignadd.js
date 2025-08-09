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
import DeleteIcon from '@mui/icons-material/Delete'; // if using MUI
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import Range from 'src/views/forms/range/Range';
import { updateToast } from 'src/redux/toast/toastSlice';
import useFetch from 'src/hooks/useFetch';
import dayjs from 'dayjs';

import moment from 'moment';
import { cilChevronBottom, cilFlagAlt, cilCalendar, cilGlobeAlt } from '@coreui/icons';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import {getCampaignAddConfig,getInitialCampaignData,} from 'src/configs/InputConfig/campaignAddConfig';
import { CContainer } from '@coreui/react';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';
import globalutil from 'src/util/globalutil';
import LocationSelector from "src/components/Component/LocationMarker"; 
import Inputs from 'src/components/Filters/Inputs';
import AppContainer from 'src/components/UI/AppContainer';
import { CFormCheck } from '@coreui/react';
import Form from 'src/components/UI/Form';
import Loading from 'src/components/UI/Loading';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import AddScheduleModel from 'src/components/Modals/AddScheduleModel';
import { useDispatch, useSelector } from 'react-redux';
import { useShowToast } from 'src/hooks/useShowToast';

const campaignadd = () => {
  // let state;
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [campaignRegData, setCampaignRegData] = useState(getInitialCampaignData(user));
  const [showForm, setshowForm] = useState(true);
  const [targetAudience, setTargetAudience] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const showConfirmation = useShowConfirmation();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
 
  const [interestSearch, setInterestSearch] = useState("");

  const [scheduleData, setScheduleData] = useState([]);

  const [addScheduleModel, setAddScheduleModel] = useState(false);
 
  const [schedulerows, setScheduleRows] = useState([]);
  const allNetworkNames = globalutil.networks().map(n => n.name);

  const [selectedNetworks, setSelectedNetworks] = useState(allNetworkNames??[]);
  const [selectedPostTypes, setSelectedPostTypes] = useState({}); // { networkName: [postTypeId, ...] }

  const tabs = [{ id: 0, name: 'Campaign' }, { id: 1, name: 'Networks' }, { id: 2, name: 'Schedule' }];
  const showToast = useShowToast();
  const availableInterests = [
    // Existing
    "Technology",
    "Sports",
    "Music",
    "Travel",
    "Cooking",
    "Fitness",
    "Gaming",
    "Movies",

    // New additions
    "Photography",
    "Art & Design",
    "Entrepreneurship",
    "Fashion",
    "Reading",
    "Education",
    "History",
    "Science",
    "Health & Wellness",
    "Politics",
    "Nature",
    "Gardening",
    "Volunteering",
    "Business & Finance",
    "Self-Improvement",
    "Spirituality",
    "Food & Drinks",
    "Automobiles",
    "Home Decor",
  ];
  //useEffect(() => {
  //  const state = location.state;

  //  if (state !== null) {
  //    const campaignData = state.user[0];
  //    console.log({ campaignData });
  //    setCampaignRegData({
  //      ...campaignData,
  //     // name: campaignData.name,
  //    //  hashTags: campaignData.hashTags
  //    });
  //  }
  //}, [location.state]);
  const handleCampaignAddForm = (e, label) => {
    const now = moment();

    // ✅ FILE HANDLING
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

  // Save the file into the correct field based on the label
  const fieldName =
    label === 'video' ? 'videoAttachment' :
    label === 'image' ? 'imageAttachment' :
    label === 'pdf' ? 'pdfAttachment' : null;

  setCampaignRegData((prev) => ({
    ...prev,
    [fieldName]: file,
  }));
  return;
}

    // ✅ DATE HANDLING
    const fieldKey = (label === 'Campaign Start Date') ? 'startTime' :
      (label === 'Campaign End Date') ? 'finishTime' : null;

    if (['startTime', 'finishTime'].includes(fieldKey)) {
      const selectedDate = moment(e);

      if (selectedDate.isBefore(now, 'minute')) {
        showToast(`${label} cannot be in the past.`, 'error');
        return;
      }

      setCampaignRegData((prev) => ({
        ...prev,
        [fieldKey]: selectedDate.format('YYYY-MM-DD HH:mm:ss'),
        ...(fieldKey === 'startTime' && { startDate:selectedDate.format('YYYY-MM-DD') }),
        ...(fieldKey === 'finishTime' && { endDate: selectedDate.format('YYYY-MM-DD') }),
      }));

      return;
    }

    // ✅ LOGO HANDLING
    if (label === 'logoPath') {
      setCampaignRegData((prevData) => ({
        ...prevData,
        logoPath: e,
      }));
      return;
    }

    // ✅ GENERIC INPUT HANDLING
    if (e?.target) {
      const { name, value, type, checked, files } = e.target;
      const inputValue =
        type === 'checkbox' ? checked :
          type === 'file' ? files[0] :
            name === 'status' ? parseInt(value) : value;

      setCampaignRegData((prevData) => ({
        ...prevData,
        [name]: inputValue,
      }));
      return;
    }

    // ❌ UNHANDLED CASE
    console.warn("Unhandled input in handleCampaignAddForm:", { e, label });
  };
  console.log("campaignRegDataInitial", campaignRegData);
  const toggleStock = () => {
    setshowForm((prev) => !prev);
  };
  const toggleTargetAud = () => {
    setTargetAudience((prev) => !prev);
  };
 
  const toggleAddScheduleMdl = () => {
    setAddScheduleModel((prev) => !prev);
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
  console.log(campaignRegData,'test')
  useEffect(() => {
    const dayNames = ['Sun', 'Mon', 'Tues', 'Wedn', 'Thur', 'Fri', 'Sat'];

    const formatted = scheduleData.map((item, index) => {
      let parsedDays = [];

      if (Array.isArray(item.days)) {
        parsedDays = item.days;
      } else if (typeof item.days === 'string') {
        try {
          const parsed = JSON.parse(item.days);
          parsedDays = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error("❌ Failed to parse days:", item.days);
        }
      }

      return {
        id: index + 1,
        interval: item.Intervalval ?? '',
        budget: item.Budget ?? '',
        NetworkId: item.NetworkId ?? '',
        days: parsedDays.length > 0
          ? parsedDays.map(d => dayNames[d]).join(', ')
          : '',
        startTime: moment(item.StartTime).isValid()
          ? moment(item.StartTime).format("YYYY-MM-DD HH:mm:ss")
          : '',
        finishTime: moment(item.FinishTime).isValid()
          ? moment(item.FinishTime).format("YYYY-MM-DD HH:mm:ss")
          : ''
      };
    });

    setScheduleRows(formatted);
    console.log("✅ Formatted scheduleData:", formatted);
  }, [scheduleData]); // <--- Depend on scheduleData only



  const handleDeleteRow = (idToDelete) => {
    const updatedRows = schedulerows.filter(row => row.id !== idToDelete);
    setScheduleRows(updatedRows);
  };
  const schedulecolumns = [
    { field: 'interval',flex:1, headerName: 'Interval', width: 100 },
    { field: 'budget', flex: 1, headerName: 'Budget', minWidth: 130 },
    { field: 'NetworkId', flex: 1, headerName: 'Network', minWidth: 150,  },
    { field: 'days', flex: 1, headerName: 'Days', minWidth: 250 },
    { field: 'startTime', flex: 1, headerName: 'Start Time', minWidth: 150 },
    { field: 'finishTime', flex: 1, headerName: 'End Time', minWidth: 130 },

    {
      field: 'action',
      headerName: 'Action',
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteRow(params.row.id)} color="error">
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  if (isLoading) {
    return <Loading />;
  }
 
  const handleCheckboxChange = (networkName) => {
    setSelectedNetworks((prevSelected) => {
      const isSelected = prevSelected.includes(networkName);
      const updatedNetworks = isSelected
        ? prevSelected.filter((n) => n !== networkName)
        : [...prevSelected, networkName];

      // If network is unchecked, also remove its postTypes
      if (isSelected) {
        setSelectedPostTypes((prevPostTypes) => {
          const updatedPostTypes = { ...prevPostTypes };
          delete updatedPostTypes[networkName];
          return updatedPostTypes;
        });
      }

      return updatedNetworks;
    });
  };

  const handlePostTypeToggle = (networkName, postTypeId) => {
    if (!selectedNetworks.includes(networkName)) {
      showToast(`Please select the ${networkName} network first.`, 'warning');
      return;
    }

    setSelectedPostTypes((prev) => {
      const prevPostTypes = prev[networkName] || [];

      const updated = prevPostTypes.includes(postTypeId)
        ? prevPostTypes.filter((id) => id !== postTypeId)
        : [...prevPostTypes, postTypeId];

      return {
        ...prev,
        [networkName]: updated
      };
    });
  };
  const filteredInterests = availableInterests.filter((interest) =>
    interest.toLowerCase().includes(interestSearch.toLowerCase())
  );

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
                    submitFn={() => {
                      const trimmedName = campaignRegData.name?.trim() || '';
                      if (trimmedName === '') {
                        showToast('Please Enter Title', 'warning');
                        return;
                      }

                      campaignRegData.name = trimmedName; // Update value if needed
                      setActiveTab(1);
                    }}

                  >
                    <div className="row">
                    
                      <div className="col-md-6 mt-2">
                        <FormControl>
                          <FormLabel className="labelName" id="demo-row-radio-buttons-group-label">Status</FormLabel>
                          <RadioGroup
                            row
                            name="status"
                            value={campaignRegData.status} // 👈 number value
                            onChange={handleCampaignAddForm}
                          >
                            <FormControlLabel value={1} control={<Radio />} label="Active" />
                            <FormControlLabel value={2} control={<Radio />} label="Paused" />
                            <FormControlLabel value={3} control={<Radio />} label="Cancel" />
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
                        {/* Gender Selection */}
                        <CRow>
                          <CCol md="6" className="mt-3">
                            <div className="btn-group">
                              <FormControl>
                                <FormLabel className="labelName" id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                                <RadioGroup
                                  row
                                  name="genderId"
                                  value={campaignRegData.genderId} // 👈 number value
                                  onChange={handleCampaignAddForm}
                                >
                                  <FormControlLabel value={1} control={<Radio />} label="All" />
                                  <FormControlLabel value={2} control={<Radio />} label="Men" />
                                  <FormControlLabel value={3} control={<Radio />} label="Women" />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </CCol>
                          <CCol md="6">
                            <Range
                              minAge={campaignRegData.minAge || 18}
                              maxAge={campaignRegData.maxAge || 65}
                              onMinAgeChange={(val) =>
                                setCampaignRegData({ ...campaignRegData, minAge: val })
                              }
                              onMaxAgeChange={(val) =>
                                setCampaignRegData({ ...campaignRegData, maxAge: val })
                              }
                            />

                          </CCol>
                        </CRow>


                        {/* Locations + Detailed Targeting */}
                        <CRow className="mt-2">
                            <LocationSelector
                              campaignRegData={campaignRegData}
                              setCampaignRegData={setCampaignRegData}
                            />
                          
                          <CCol md="6">
                            <h5>Interests</h5>
                            <input
                              type="text"
                              placeholder="Type to search interests"
                              className="form-control"
                              value={interestSearch}
                              onChange={(e) => setInterestSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && interestSearch.trim()) {
                                  setCampaignRegData({
                                    ...campaignRegData,
                                    interests: [...(campaignRegData.interests || []), interestSearch.trim()],
                                  });
                                  setInterestSearch("");
                                }
                              }}
                            />

                            {/* Suggestions dropdown */}
                            {interestSearch && filteredInterests.length > 0 && (
                              <div className="border mt-1 p-2">
                                {filteredInterests.map((interest, index) => (
                                  <div
                                    key={index}
                                    style={{ cursor: "pointer", padding: "4px 0" }}
                                    onClick={() => {
                                      setCampaignRegData({
                                        ...campaignRegData,
                                        interests: [...(campaignRegData.interests || []), interest],
                                      });
                                      setInterestSearch("");
                                    }}
                                  >
                                    {interest}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="mt-2">
                              {(campaignRegData.interests || []).map((interest, index) => (
                                <span
                                  key={index}
                                  className="badge bg-primary me-2"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setCampaignRegData({
                                      ...campaignRegData,
                                      interests: campaignRegData.interests.filter((_, i) => i !== index),
                                    });
                                  }}
                                >
                                  {interest} ✕
                                </span>
                              ))}
                            </div>
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
                const displayLabel = network.name;
                const IconName = network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase(); // icon key lookup
                const IconComponent = icons[IconName];

                let postTypeIds = [];
                try {
                  postTypeIds = JSON.parse(network.desc || "[]");
                } catch (err) {
                  console.warn("Invalid desc format in network:", network.desc);
                }

                const postTypeList = globalutil
                  .postTypes()
                  .filter((pt) => postTypeIds.includes(pt.id));

                const isSelected = selectedNetworks.includes(network.name);

                // Auto-select/deselect single post type
                if (postTypeList.length === 1) {
                  const singleTypeId = postTypeList[0].id;

                  if (isSelected && !selectedPostTypes[network.name]?.includes(singleTypeId)) {
                    handlePostTypeToggle(network.name, singleTypeId); // select
                  } else if (!isSelected && selectedPostTypes[network.name]?.includes(singleTypeId)) {
                    handlePostTypeToggle(network.name, singleTypeId); // unselect
                  }
                }

                return (
                  <CCol md={4} key={index} className="mb-4">
                    <ul className="inlinedisplay">
                      <li className="divCircle">
                        <IconComponent className="BlazorIcon pdngleft" fontSize="large" color="success" />
                      </li>
                      <li className="network-checkbox-animate">
                        <CFormCheck
                          id={IconName}
                          name={IconName}
                          label={displayLabel}
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(network.name)}
                        />
                      </li>
                    </ul>

                    <div className="mt-2 displayFlex">
                      {postTypeList.length > 1 &&
                        postTypeList.map((pt) => (
                          <CFormCheck
                            key={`${IconName}-${pt.id}`}
                            id={`${IconName}-${pt.id}`}
                            name={`${IconName}-${pt.id}`}
                            label={pt.name.charAt(0).toUpperCase() + pt.name.slice(1).toLowerCase()}
                            checked={selectedPostTypes[network.name]?.includes(pt.id) || false}
                            onChange={() => handlePostTypeToggle(network.name, pt.id)}
                            className="mb-1 form-checksub"
                          />
                        ))}
                    </div>
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
                  onClick={() => {
                    setActiveTab(2);               // Go to tab 2
                    toggleAddScheduleMdl();        // Open modal
                  }}
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
      <AddScheduleModel
        isOpen={addScheduleModel}
        toggle={toggleAddScheduleMdl}
        selectedNetworks={selectedNetworks}
        selectedPostTypes={selectedPostTypes}
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

export default campaignadd;

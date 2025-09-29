import { cilChevronBottom, cilTrash } from '@coreui/icons';
import { CCol, CContainer, CForm, CFormCheck, CFormLabel, CRow } from '@coreui/react';

import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import useFetch from 'src/hooks/useFetch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import LocationSelector from 'src/components/Component/LocationMarker';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Inputs from 'src/components/Filters/Inputs';
import AddScheduleModel from 'src/components/Modals/AddScheduleModel';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import AppContainer from 'src/components/UI/AppContainer';
import Form from 'src/components/UI/Form';
import Loading from 'src/components/UI/Loading';
import {
  getCampaignAddConfig,
  getInitialCampaignData,
} from 'src/configs/InputConfig/campaignAddConfig';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import globalutil from 'src/util/globalutil';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import Range from 'src/components/UI/Range';
import {
  cibFacebook,
  cibGmail,
  cibInstagram,
  cibLinkedin,
  cibSnapchat,
  cibTiktok,
  cibTwitter,
  cibWhatsapp,
  cilShortText,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import useApi from 'src/hooks/useApi';
import Button from 'src/components/UI/Button';
import CampignNetworkSettings from 'src/components/Component/CampignNetworkSettings';

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
  const dispatch = useDispatch();

  const [interestSearch, setInterestSearch] = useState('');
  const [networksList, setNetworksList] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  const [addScheduleModel, setAddScheduleModel] = useState(false);

  const [schedulerows, setScheduleRows] = useState([]);

  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedPostTypes, setSelectedPostTypes] = useState({}); // { networkName: [postTypeId, ...] }
  const [selectedTemplates, setSelectedTemplates] = useState({}); // { networkName: [postTypeId, ...] }

  const tabs = [
    { id: 0, name: 'Campaign' },
    { id: 1, name: 'Networks' },
    { id: 2, name: 'Schedule' },
  ];
  const showToast = useShowToast();
  const availableInterests = [
    // Existing
    'Technology',
    'Sports',
    'Music',
    'Travel',
    'Cooking',
    'Fitness',
    'Gaming',
    'Movies',

    // New additions
    'Photography',
    'Art & Design',
    'Entrepreneurship',
    'Fashion',
    'Reading',
    'Education',
    'History',
    'Science',
    'Health & Wellness',
    'Politics',
    'Nature',
    'Gardening',
    'Volunteering',
    'Business & Finance',
    'Self-Improvement',
    'Spirituality',
    'Food & Drinks',
    'Automobiles',
    'Home Decor',
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
  const {
    response: GetNetworkRes,
    loading: NetworkLoading,
    error: createNetworkError,
    fetchData: GetNetworks,
  } = useFetch();

  useEffect(() => {
    getNetworksList();
  }, []);

  const fetchBody = {
    orgId: String(user.orgId), // ✅ convert to string
    userId: String(user.userId), // ✅ convert to string
    roleId: String(user.roleId), // ✅ convert to string    datefrom: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // same as C#: DateTime.Now.AddDays(-1)
    dateto: new Date().toISOString(), // same as C#: DateTime.Now
  };
  const getNetworksList = async () => {
    await GetNetworks(
      '/Admin/custombundlingdetails',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        console.log({ fetchBody });
        console.log({ res });
        if (res.status === true) {
          // ✅ save filtered networks in state
          const filtered = (res.data || []).filter((n) => n.purchasedQouta > 0);
          // const filtered = res.data || [];

          setNetworksList(filtered);
          setSelectedNetworks(filtered.map((n) => n.name));
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          setNetworksList([]); // empty if error
        }
        // setIsLoading(NetworkLoading.current);
      },
    );
  };

  const handleCampaignAddForm = (e, label) => {
    const now = dayjs();

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

      // Save the file into the correct key based on the label
      const fieldName =
        label === 'video'
          ? 'videoAttachment'
          : label === 'image'
            ? 'imageAttachment'
            : label === 'pdf'
              ? 'pdfAttachment'
              : null;

      setCampaignRegData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      return;
    }

    // ✅ DATE HANDLING
    const fieldKey =
      label === 'Campaign Start Date'
        ? 'startTime'
        : label === 'Campaign End Date'
          ? 'finishTime'
          : null;

    if (['startTime', 'finishTime'].includes(fieldKey)) {
      const selectedDate = dayjs(e);
      if (selectedDate.isBefore(now, 'minute')) {
        showToast(`${label} cannot be in the past.`, 'error');
        return;
      }
      // console.log({ selectedDate, fieldKey, save: selectedDate.format('YYYY-MM-DD') });
      setCampaignRegData((prev) => ({
        ...prev,
        [fieldKey]: selectedDate.format('YYYY-MM-DD HH:mm:ss'),
        ...(fieldKey === 'startTime' && { startDate: selectedDate.format('YYYY-MM-DD') }),
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

      let inputValue;

      if (type === 'checkbox') {
        inputValue = checked;
      } else if (type === 'file') {
        inputValue = files[0];
      } else if (name === 'status') {
        inputValue = parseInt(value);
      } else if (name === 'genderId') {
        inputValue = Number(value); // ✅ Fix for radios
      } else {
        inputValue = value;
      }

      setCampaignRegData((prevData) => ({
        ...prevData,
        [name]: inputValue,
      }));
      return;
    }

    // ❌ UNHANDLED CASE
    console.warn('Unhandled input in handleCampaignAddForm:', { e, label });
  };
  console.log('campaignRegDataInitial', campaignRegData);
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
  const campaignAddInputs = getCampaignAddConfig(
    campaignRegData,
    handleCampaignAddForm,
    TermsModal,
  );
  const icons = {
    Tiktock: cibTiktok,
    Snapchat: cibSnapchat,
    Facebook: cibFacebook,
    Sms: cilShortText,
    Linkedin: cibLinkedin,
    Twitter: cibTwitter,
    Instagram: cibInstagram,
    Whatsapp: cibWhatsapp, // Assuming WhatsApp is your component for WhatsApp icon
    Email: cibGmail, // Assuming Email is your component for Email icon
  };
  console.log(campaignRegData, 'test');
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
          console.error('❌ Failed to parse days:', item.days);
        }
      }

      return {
        id: index + 1,
        interval: item.Intervalval ?? '',
        budget: item.Budget ?? '',
        NetworkId: item.NetworkId ?? '',
        days: parsedDays.length > 0 ? parsedDays.map((d) => dayNames[d]).join(', ') : '',
        startTime: dayjs(item.StartTime).isValid()
          ? dayjs(item.StartTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
        finishTime: dayjs(item.FinishTime).isValid()
          ? dayjs(item.FinishTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
      };
    });

    setScheduleRows(formatted);
    console.log('✅ Formatted scheduleData:', formatted);
  }, [scheduleData]); // <--- Depend on scheduleData only

  const handleDeleteRow = (idToDelete) => {
    const updatedRows = schedulerows.filter((row) => row.id !== idToDelete);
    setScheduleRows(updatedRows);
  };
  const schedulecolumns = [
    { key: 'interval', flex: 1, name: 'Interval', width: 100 },
    { key: 'budget', flex: 1, name: 'Budget', minWidth: 130 },
    { key: 'NetworkId', flex: 1, name: 'Network', minWidth: 150 },
    { key: 'days', flex: 1, name: 'Days', minWidth: 250 },
    { key: 'startTime', flex: 1, name: 'Start Time', minWidth: 150 },
    { key: 'finishTime', flex: 1, name: 'End Time', minWidth: 130 },

    {
      key: 'action',
      name: 'Action',
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <CIcon icon={cilTrash} onClick={() => handleDeleteRow(params.row.id)} />
      ),
    },
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
  // console.log({ selectedNetworks });
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
        [networkName]: updated,
      };
    });
  };

  const handleTemplateToggle = (networkName, template) => {
    if (!selectedNetworks.includes(networkName)) {
      showToast(`Please select the ${networkName} network first.`, 'warning');
      return;
    }

    setSelectedTemplates((prev) => {
      const currentTemplate = prev[networkName];

      return {
        ...prev,
        [networkName]: currentTemplate?.id === template.id ? null : template, // toggle off if same
      };
    });
  };

  const filteredInterests = availableInterests.filter((interest) =>
    interest.toLowerCase().includes(interestSearch.toLowerCase()),
  );

  // console.log({ gn: globalutil.networks(), networksList });
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
                    inputFields={campaignAddInputs}
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
                        <CForm>
                          <CFormLabel className="labelName" htmlFor="status-radio-group">
                            Status
                          </CFormLabel>
                          <div className="d-flex">
                            <CFormCheck
                              type="radio"
                              id="status-active"
                              name="status"
                              value={1}
                              inline
                              label="Active"
                              checked={campaignRegData.status === 1}
                              onChange={handleCampaignAddForm}
                              className="me-3 d-flex"
                            />
                            <CFormCheck
                              type="radio"
                              id="status-paused"
                              name="status"
                              value={2}
                              inline
                              label="Paused"
                              checked={campaignRegData.status === 2}
                              onChange={handleCampaignAddForm}
                              className="me-3 d-flex"
                            />
                            <CFormCheck
                              type="radio"
                              inline
                              id="status-cancel"
                              name="status"
                              value={3}
                              label="Cancel"
                              checked={campaignRegData.status === 3}
                              onChange={handleCampaignAddForm}
                              className="d-flex"
                            />
                          </div>
                        </CForm>
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
                              <CForm>
                                <CFormLabel className="labelName" htmlFor="gender-radio-group">
                                  Gender
                                </CFormLabel>
                                <div className="d-flex">
                                  <CFormCheck
                                    type="radio"
                                    id="gender-all"
                                    name="genderId"
                                    inline
                                    value={1}
                                    label="All"
                                    checked={campaignRegData.genderId === 1}
                                    onChange={handleCampaignAddForm}
                                    className="me-3 d-flex"
                                  />
                                  <CFormCheck
                                    type="radio"
                                    id="gender-men"
                                    name="genderId"
                                    value={2}
                                    inline
                                    label="Men"
                                    checked={campaignRegData.genderId === 2}
                                    onChange={handleCampaignAddForm}
                                    className="me-3 d-flex"
                                  />
                                  <CFormCheck
                                    type="radio"
                                    id="gender-women"
                                    name="genderId"
                                    inline
                                    value={3}
                                    label="Women"
                                    checked={campaignRegData.genderId === 3}
                                    onChange={handleCampaignAddForm}
                                    className="d-flex"
                                  />
                                </div>
                              </CForm>
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
                                if (e.key === 'Enter' && interestSearch.trim()) {
                                  setCampaignRegData({
                                    ...campaignRegData,
                                    interests: [
                                      ...(campaignRegData.interests || []),
                                      interestSearch.trim(),
                                    ],
                                  });
                                  setInterestSearch('');
                                }
                              }}
                            />

                            {/* Suggestions dropdown */}
                            {interestSearch && filteredInterests.length > 0 && (
                              <div className="border mt-1 p-2">
                                {filteredInterests.map((interest, index) => (
                                  <div
                                    key={index}
                                    style={{ cursor: 'pointer', padding: '4px 0' }}
                                    onClick={() => {
                                      setCampaignRegData({
                                        ...campaignRegData,
                                        interests: [...(campaignRegData.interests || []), interest],
                                      });
                                      setInterestSearch('');
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
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setCampaignRegData({
                                      ...campaignRegData,
                                      interests: campaignRegData.interests.filter(
                                        (_, i) => i !== index,
                                      ),
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
          <CampignNetworkSettings
            handleCheckboxChange={handleCheckboxChange}
            handlePostTypeToggle={handlePostTypeToggle}
            icons={icons}
            networksList={networksList}
            selectedNetworks={selectedNetworks}
            selectedPostTypes={selectedPostTypes}
            setActiveTab={setActiveTab}
            toggleAddScheduleMdl={toggleAddScheduleMdl}
            selectedTemplates={selectedTemplates}
            handleTemplateToggle={handleTemplateToggle}
            setSelectedTemplates={setSelectedTemplates}
          />
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
                      filterDisable
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
        selectedTemplates={selectedTemplates}
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

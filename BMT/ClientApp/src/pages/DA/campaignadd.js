import { cilChevronBottom, cilTrash } from '@coreui/icons';
import { CCol, CForm, CFormCheck, CFormLabel, CRow } from '@coreui/react';

import CIcon from '@coreui/icons-react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import CampignNetworkSettings from 'src/components/Component/CampignNetworkSettings';
import LocationSelector from 'src/components/Component/LocationMarker';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Inputs from 'src/components/Filters/Inputs';
import AddScheduleModel from 'src/components/Modals/AddScheduleModel';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import AppContainer from 'src/components/UI/AppContainer';
import Form from 'src/components/UI/Form';
import Loading from 'src/components/UI/Loading';
import Range from 'src/components/UI/Range';
import {
  getCampaignAddConfig,
  getInitialCampaignData,
} from 'src/configs/InputConfig/campaignAddConfig';
import { useFetchOrgs } from 'src/hooks/api/useFetchOrgs';
import useFetch from 'src/hooks/useFetch';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import { updateToast } from 'src/redux/toast/toastSlice';
import BlazorTabs from '../../components/CustomComponents/BlazorTabs';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { availableInterests, icons } from 'src/constants/constants';
import { useFetchPricing } from 'src/hooks/api/useFetchPricing';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';
import globalutil from 'src/util/globalutil';

const campaignadd = () => {
  // let state;
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [campaignRegData, setCampaignRegData] = useState(getInitialCampaignData(user));
  const [showForm, setshowForm] = useState(true);
  const [targetAudience, setTargetAudience] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const showConfirmation = useShowConfirmation();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { getOrgs } = useFetchOrgs();
  const { data, loading, fetchRecipients: getRecipientList } = useFetchRecipients();

  const [interestSearch, setInterestSearch] = useState('');
  const [networksList, setNetworksList] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  const [paymentRef, setPaymentRef] = useState('');
  const [makeOrder, setMakeOrder] = useState(false);
  const [addScheduleModel, setAddScheduleModel] = useState(false);

  const [schedulerows, setScheduleRows] = useState([]);
  const [currencyName, setCurrencyName] = useState('');

  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedPostTypes, setSelectedPostTypes] = useState({}); // { networkName: [postTypeId, ...] }
  const [selectedTemplates, setSelectedTemplates] = useState({}); // { networkName: [postTypeId, ...] }
  const [orgsList, setOrgsList] = useState([]);

  const { data: pricingRes, fetchPricing, loading: pricingLoading } = useFetchPricing();

  const pricingData = useMemo(() => pricingRes?.data || [], [pricingRes]);
  const recipients = useMemo(() => data?.data || [], [data]);

  const tabs = [
    { id: 0, name: 'Campaign' },
    { id: 1, name: 'Networks' },
    { id: 2, name: 'Schedule' },
  ];

  const showToast = useShowToast();

  const {
    response: GetNetworkRes,
    loading: NetworkLoading,
    error: createNetworkError,
    fetchData: GetNetworks,
  } = useFetch();

  useEffect(() => {
    getNetworksList();
    fetchOrgs();
    fetchPricing();
    fetchRecipientList();
  }, []);

  useEffect(() => {
    if (user && orgsList?.length > 0) {
      // console.log({ user, orgsList });
      const findOrg = orgsList?.find((ol) => ol?.id === user?.orgId);
      if (findOrg) {
        setCurrencyName(findOrg?.currencyName);
      }
    }
  }, [orgsList, user]);

  const fetchRecipientList = async () => {
    const body = {
      id: 0,
      orgId: user?.orgId,
      rowVer: 1,
      networkId: 0,
      contentId: '',
      status: 1,
      createdAt: dayjs().utc().subtract(10, 'year').format('YYYY-MM-DD'),
      lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
    };
    await getRecipientList(body);
  };

  const fetchOrgs = async () => {
    const orgData = await getOrgs();
    if (orgData && Array.isArray(orgData)) setOrgsList(orgData?.filter((o) => o?.name !== ''));
  };

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
        // console.log({ fetchBody });
        // console.log({ res });
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
      const isPDF =
        label === 'pdf' && (type === 'application/pdf' || type.startsWith('application/'));

      if (!(isVideo || isImage || isPDF)) {
        e.target.value = null;
        showToast(`Invalid file type. Please select a valid ${label} file.`, 'error');
        return;
      }

      // ✅ SIZE VALIDATION (bytes)
      const maxSizes = {
        video: 16 * 1024 * 1024, // 16MB
        image: 5 * 1024 * 1024, // 5MB
        pdf: 100 * 1024 * 1024, // 100MB
      };
      console.log(file.size);
      if (file.size > maxSizes[label]) {
        e.target.value = null;
        showToast(
          `${label.toUpperCase()} file size exceeds the limit of ${
            label === 'video' ? '16MB' : label === 'image' ? '5MB' : '100MB'
          }.`,
          'error',
        );
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

  const campaignAddInputs = getCampaignAddConfig(
    campaignRegData,
    handleCampaignAddForm,
    TermsModal,
  );

  // console.log({campaignRegData});
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
        interval: item?.Intervalval ?? '',
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
    // console.log('✅ Formatted scheduleData:', formatted);
  }, [scheduleData]); // <--- Depend on scheduleData only

  const handleDeleteRow = (idToDelete) => {
    const updatedRows = schedulerows.filter((row) => row.id !== idToDelete);
    const findRow = schedulerows?.find((r) => r?.id === idToDelete);
    const updatedData = scheduleData.filter(
      (row) => row.NetworkId !== findRow?.NetworkId || row.Budget !== findRow?.budget,
    );

    setScheduleRows(updatedRows);
    setScheduleData(updatedData);
  };
  const schedulecolumns = [
    { key: 'interval', flex: 1, name: 'Interval', width: 100 },
    { key: 'budget', flex: 1, name: 'Budget', minWidth: 130 },
    {
      key: 'NetworkId',
      flex: 1,
      name: 'Network',
      minWidth: 150,
      renderCell: (params) => (
        <p>{globalutil.networks()?.find((n) => n?.id == params.row?.NetworkId)?.name || '-'}</p>
      ),
    },
    { key: 'days', flex: 1, name: 'Days', minWidth: 250 },
    { key: 'startTime', flex: 1, name: 'Start Time', minWidth: 150 },
    { key: 'finishTime', flex: 1, name: 'End Time', minWidth: 130 },
    {
      key: 'action',
      name: 'Action',
      minWidth: 100,
      renderCell: (params) => (
        <CIcon icon={cilTrash} onClick={() => handleDeleteRow(params.row.id)} />
      ),
    },
  ];

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
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  useEffect(() => {
    const amount = searchParams.get('amount');
    const orderRefNumber = searchParams.get('orderRefNumber');
    const message = searchParams.get('message');
    const transactionRefNumber = searchParams.get('transactionRefNumber');

    const pp_TxnType = searchParams.get('pp_TxnType') || '';
    const pp_Amount = searchParams.get('pp_Amount') || '';
    const pp_BillReference = searchParams.get('pp_BillReference') || '';
    const pp_ResponseCode = searchParams.get('pp_ResponseCode') || '';
    const pp_RetreivalReferenceNo = searchParams.get('pp_RetreivalReferenceNo') || '';
    const pp_SubMerchantID = searchParams.get('pp_SubMerchantID') || '';
    const pp_TxnCurrency = searchParams.get('pp_TxnCurrency') || '';
    const pp_TxnDateTime = searchParams.get('pp_TxnDateTime') || '';
    const pp_TxnRefNo = searchParams.get('pp_TxnRefNo') || '';
    const pp_MobileNumber = searchParams.get('pp_MobileNumber') || '';
    const pp_CNIC = searchParams.get('pp_CNIC') || '';
    const pp_SecureHash = searchParams.get('pp_SecureHash') || '';
    const pp_ResponseMessage = searchParams.get('pp_ResponseMessage') || '';

    const filteredResponse = {
      pp_TxnType,
      pp_Amount,
      pp_BillReference,
      pp_ResponseCode,
      pp_RetreivalReferenceNo,
      pp_SubMerchantID,
      pp_TxnCurrency,
      pp_TxnDateTime,
      pp_TxnRefNo,
      pp_MobileNumber,
      pp_CNIC,
      pp_SecureHash,
    };

    // console.log({ pp_ResponseMessage });
    setTimeout(() => {
      if (amount || orderRefNumber || message) {
        console.log({ amount, orderRefNumber, message });
        if (window.opener) {
          if (pp_ResponseCode) {
            console.log({ filteredResponse });

            window.opener.postMessage(
              {
                status: pp_ResponseCode === '000' ? 'failed' : 'success',
                txnRef: orderRefNumber,
                message: pp_ResponseMessage ?? 'Payment failed. Please try again.',
                data: btoa(JSON.stringify(filteredResponse)),
              },
              '*',
            );
            window.close();
          } else {
            const data = {
              orderRefNumber,
              message,
              amount,
              transactionRefNumber,
            };
            console.log({ data });

            window.opener.postMessage(
              {
                status: message ? 'failed' : 'success',
                txnRef: orderRefNumber,
                message: message ?? '',
                data: btoa(JSON.stringify(data)),
              },
              '*',
            );
            window.close();
          }
          // Optional: Close popup after a delay
        }

        // Remove query params from URL
      }
    }, 1000);
  }, [searchParams, pathname]);

  useEffect(() => {
    const handleMessage = (event) => {
      // Optional: check event.origin for security
      // console.log("Received message from popup:", event.data);
      // console.log({ event });
      // Validate the structure
      if (event.data?.status) {
        const { message, data, status } = event.data;
        console.log('status:', status);
        console.log('Message:', message);
        console.log('Raw Data:', data);
        console.log('Parsed data', JSON.parse(atob(data)));
        if (status === 'failed') {
          showToast(message, 'error');
        } else {
          setPaymentRef(data);
          setMakeOrder(true);
        }

        // TODO: handle this data in your app (e.g., update state, redirect, etc.)
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // console.log({ campaignRegData });

  if (pricingLoading) {
    return <Loading />;
  }

  // ✅ Helper to get hashtags as string (for backend submission)
  const getHashTagsString = () => {
    return campaignRegData.hashTags.map((tag) => `#${tag}`).join(' ');
  };
  // console.log({ gn: globalutil.networks(), networksList });
  return (
    <Form name="dsp-reg-form">
      <BlazorTabs
        title="campaign"
        tabs={tabs}
        activeTab={activeTab}
        handleActiveTab={setActiveTab}
      />
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
                  <AppContainer>
                    <DataGridHeader
                      title="Target Audience"
                      onClick={toggleTargetAud}
                      otherControls={[{ icon: cilChevronBottom, fn: toggleTargetAud }]}
                      filterDisable={true}
                    />
                    {targetAudience && (
                      <React.Fragment>
                        {/* Gender Selection */}
                        <CRow>
                          <CCol md="6" className="mt-3">
                            <div className="btn-group align-items-center gap-2">
                              <CFormLabel className="labelName mb-0" htmlFor="gender-radio-group">
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
                  </AppContainer>
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
                    summary={[
                      {
                        field: 'budget',
                        aggregates: [{ aggregate: 'sum', caption: 'Total Budget' }],
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </AppContainer>
        </React.Fragment>
      )}
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
        currencyName={currencyName}
        makeOrder={makeOrder}
        paymentRef={paymentRef}
        pricingData={pricingData}
        recipients={recipients}
        fetchRecipientList={fetchRecipientList}
      />
      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </Form>
  );
};

export default campaignadd;

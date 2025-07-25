import React, { useEffect, useRef, useState } from 'react';
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
import { useShowToast } from 'src/hooks/useShowToast';
import CustomTimePicker from 'src/components/UI/TimePicker';
import dayjs from 'dayjs';
import moment from 'moment';
import { formValidator } from 'src/helpers/formValidator';
import { createSchedule } from 'src/hooks/api/createSchedule';
const AddScheduleModel = (prop) => {

  const { header, isOpen, toggle, initialData, selectedNetworks, selectedDays, campaignRegData : submitData } = prop;
  const [budgetData, setBudgetData] = useState({
    TotalSchBudget: 0,
    TotalSchMessages: 0,
    TotalCampBudget: 0,
  });
  const { createCampaign } = createSchedule();
  const user = useSelector((state) => state.user);
  const calculateBudget = (networks, selectedDays) => {
    const networkCount = networks.length;
    const dayCount = selectedDays.length;

    const scheduleCount = networkCount * (dayCount || 1); // Avoid multiplying by 0
    const gTotal = scheduleCount * 10;
    const gTotalMess = scheduleCount * 100;

    setBudgetData({
      TotalCampBudget: gTotal,
      TotalSchBudget: gTotal,
      TotalSchMessages: gTotalMess,
    });
  };

  const daysList = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' }
  ];
  const [campaignRegData, setCampaignRegData] = useState({
    interval: '',
    intervalTypeId: '',
    isFixedTime: false,
    startDate: moment().toDate(),     // Default to current date
    endDate: moment().add(1, 'days').toDate(),  // Default to tomorrow
    startTime: moment().startOf('day'),   // 00:00:00
    finishTime: moment().startOf('day'),  // 00:00:00
    selectedDays: []
  });
  const showToast = useShowToast();
  const [scheduleJson, setScheduleJson] = useState([]);
 
  // Effect: select/unselect days based on intervalTypeId
  useEffect(() => {
    if (campaignRegData.intervalTypeId === 2) {
      // Select all days
      setCampaignRegData((prev) => ({
        ...prev,
        selectedDays: daysList.map(day => day.id)
      }));
    } else {
      // Unselect all days
      setCampaignRegData((prev) => ({
        ...prev,
        selectedDays: []
      }));
    }
  }, [campaignRegData.intervalTypeId]);

  const handleDayChange = (dayId) => {
    if (campaignRegData.intervalTypeId === 2) return; // don't allow changes if auto-selected

    const isSelected = campaignRegData.selectedDays.includes(dayId);
    const updatedDays = isSelected
      ? campaignRegData.selectedDays.filter((d) => d !== dayId)
      : [...campaignRegData.selectedDays, dayId];

    setCampaignRegData((prev) => ({
      ...prev,
      selectedDays: updatedDays,
    }));
  };

  const handleIntervalTypeChange = (e) => {
    const newTypeId = parseInt(e.target.value);

    setCampaignRegData((prev) => ({
      ...prev,
      intervalTypeId: newTypeId,
      selectedDays: newTypeId === 2 ? [0, 1, 2, 3, 4, 5, 6] : [], // auto-select or clear
    }));
  };


  const dispatch = useDispatch();
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  //const onSave = async () => {
  //  const form = document.querySelector('.shift-add-form');
  //  formValidator();
  //  if (form.checkValidity()) {
  //    const schedule = {
  //      id: campaignRegData.id,
  //      createdBy: user.userId,
  //      lastUpdatedBy: user.userId,
  //      createdAt: moment().utc().format(),
  //      lastUpdatedAt: moment().utc().format(),
  //    };

  //    setIsLoading(createscheduleLoading.current);
  //    await createSchedule('/Compaigns/submitcompaign', {
  //      method: 'POST',
  //      body: JSON.stringify(schedule),
  //    });
  //    console.log({ createscheduleRes });
  //    if (createscheduleRes.current?.status === true) {
  //      dispatch(
  //        updateToast({
  //          isToastOpen: true,
  //          toastMessage: createscheduleRes.current.message,
  //          toastVariant: 'success',
  //        }),
  //      );
  //      navigate('/waves');
  //      //getShifts();
  //      setCampaignRegData(initialData);
  //      toggle();
  //    } else {
  //      dispatch(
  //        updateToast({
  //          isToastOpen: true,
  //          toastMessage: createscheduleRes.current?.message,
  //          toastVariant: 'error',
  //          //  `${JSON.stringify(createUserRes.current.message)}`,
  //        }),
  //      );

  //      setIsLoading(createscheduleLoading.current);
  //    }
  //  }
  //};
  

  const handleCampaignAddForm = (e, label, date) => {
    var colName = date;
    if (label === 'startTime' || label === 'finishTime') {
      setCampaignRegData((prev) => ({
        ...prev,
        [label]: e ? e.toISOString() : null, // or e.format('HH:mm')
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

  const [selected, setSelected] = useState(selectedNetworks); // Initial load

  useEffect(() => {
setSelected(selectedNetworks); // Update if prop changes
  }, [selectedNetworks]);
  const handleNetworkChange = (networkName) => {
    setSelected((prevSelected) =>
      prevSelected.includes(networkName)
        ? prevSelected.filter((n) => n !== networkName)
        : [...prevSelected, networkName]
    );
  };
  useEffect(() => {
    calculateBudget(selectedNetworks, campaignRegData.selectedDays);
  }, [
    campaignRegData.startDate,
    campaignRegData.endDate,
    campaignRegData.startTime,
    campaignRegData.finishTime
  ]);
  const onSave = () => {
    console.log("Step 1: Validating input");
    console.log("campaignRegData:", campaignRegData);
    console.log("selectedNetworks:", selectedNetworks);

    if (
      !campaignRegData.startDate ||
      !campaignRegData.endDate ||
      !campaignRegData.startTime?.isValid?.() ||
      !campaignRegData.finishTime?.isValid?.() ||
      !campaignRegData.intervalTypeId ||
      selectedNetworks.length === 0
    ) {
      console.error("Validation failed", campaignRegData);
      showToast('All required fields must be filled.', 'error');
      return;
    }

    console.log("Step 2: Creating start and end times");
    const start = moment(campaignRegData.startDate).set({
      hour: campaignRegData.startTime.hour(),
      minute: campaignRegData.startTime.minute(),
      second: 0,
    });

    const end = moment(campaignRegData.endDate).set({
      hour: campaignRegData.finishTime.hour(),
      minute: campaignRegData.finishTime.minute(),
      second: 0,
    });
    const selectedNetworkObjects = globalutil.networks()
      .filter(n => selectedNetworks.includes(n.name))
      .map((n) => ({
        id: 0,
        CompaignId: 0,
        NetworkId: n.id,
        name: n.name,
        RowVer: 1,
        Status: 1,
        LastUpdatedBy: 0,
        LastUpdatedAt: new Date(),
        CreatedAt: new Date(),
        CreatedBy: 0
      }));
    console.log("Selected network objects:", selectedNetworkObjects);

    const schedulePayload = [];

    console.log("Step 4: Building schedule payload");
    for (let ntwk of selectedNetworkObjects) {
      const payloadItem = {
        id: 0,
        NetworkId: ntwk.NetworkId,
        CompaignDetailId: 0,
        StartTime: start.format("YYYY-MM-DD HH:mm:ss"),
        FinishTime: end.format("YYYY-MM-DD HH:mm:ss"),
        Interval: parseFloat(campaignRegData.interval),
        IntervalTypeId: parseInt(campaignRegData.intervalTypeId),
        RowVer: 1,
        Status: 1,
        MessageCount: 0,
        CreatedAt: new Date(),
        CreatedBy: 0,
        Days: JSON.stringify(campaignRegData.selectedDays),
        Budget: 0,
        Qty: 0
      };
      schedulePayload.push(payloadItem);
    }

    console.log("Schedule Payload:", schedulePayload);


    console.log("Step 5: Updating state and localStorage");
    setScheduleJson([...scheduleJson, ...schedulePayload]);
    localStorage.setItem("scheduleData", JSON.stringify([...scheduleJson, ...schedulePayload]));
  
    console.log("Step 6: Updating budget data");
  
    console.log("Saved successfully");
  };

  const submitCompaign = async () => {
    const {
      name,
      tag,
      description,
      startDate,
      endDate,
      startTime,
      finishTime,
      status
    } = submitData;

    // ✅ Format start and end datetime safely using moment
    const startDateTime = moment(`${moment(startDate).format("YYYY-MM-DD")} ${moment(startTime).format("HH:mm")}`).toISOString();
    const endDateTime = moment(`${moment(endDate).format("YYYY-MM-DD")} ${moment(finishTime).format("HH:mm")}`).toISOString();
    const rawSchedule = localStorage.getItem("scheduleData");
    const parsedSchedule = rawSchedule ? JSON.parse(rawSchedule) : [];
    const campaignBody = {
      Id: 0,
      StoreId: 1,
      Name: name,
      Title: name,
      Description: description,
      HashTags: tag,
      StartTime: startDateTime,
      FinishTime: endDateTime,
      Status: status ? 1 : 0,
      CreatedAt: moment().toISOString(),
      RowVer: 1,
      CreatedBy: user.userId,
      CompaignNetworks: selectedNetworks,
      CompaignExecutionSchedules: parsedSchedule
    };

    console.log("body", campaignBody);

    try {
      const response = await fetch('/Compaigns/submitcompaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignBody)
      });

      const result = await response.json();
      console.log({ result });

      if (response.ok || result.status === true) {
        showToast('Campaign submitted successfully!', 'success');
      } else {
        showToast('Submission failed.', 'error');
      }
    } catch (error) {
      console.error("Error submitting campaign:", error);
      showToast('An error occurred.', 'error');
    }
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
                  const IconComponent = icons[IconName];
                  return (
                    <CCol md={4} key={index}>
                      <ul className="inlinedisplay">
                        <li className="divCircle">
                          {IconComponent && <IconComponent className="BlazorIcon pdngleft" fontSize="large" color="success" />}
                        </li>
                        <li className='network-checkbox-animate'>
                          <CFormCheck
                            id={IconName}
                            name={IconName}
                            label={network.name}
                            checked={selected.includes(network.name)}
                            onChange={() => handleNetworkChange(network.name)}
                          />
                        </li>
                      </ul>
                    </CCol>
                  );
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
                  className="form-control item form-select scheduleClass"
                  value={campaignRegData.intervalTypeId}
                  name="intervalTypes"
                  title=" Select Interval Types "
                  onChange={handleIntervalTypeChange}
                  
                />
              </CCol>
              <CCol md="6" className='mt-3'>
                <CFormCheck
                  label="Is Fixed Time"
                  name="isFixedTime"
                  checked={campaignRegData.isFixedTime} // ✅ bind to your state
                  onChange={(e) =>
                    setCampaignRegData({ ...campaignRegData, isFixedTime: e.target.checked })
                  } // ✅ update state on change
                  className="mt-4 d-flex flex-row justify-content-center scheduleClass"
                />


              </CCol>
            </CRow>
            <CRow className="mt-2">
             
              <fieldset className="fieldset">
                <legend className="legend">Select Days</legend>
                <CRow className="mt-3">
                  {daysList.map((day) => (
                    <CCol md="3" key={day.id}>
                      <CFormCheck
                        type="checkbox"
                        label={day.name}
                        id={`day-${day.id}`}
                        checked={campaignRegData.selectedDays.includes(day.id)}
                        onChange={() => handleDayChange(day.id)}
                        disabled={campaignRegData.intervalTypeId === 2} // disable if all are auto-selected
                      />
                    </CCol>
                  ))}
                </CRow>
              </fieldset>

            </CRow>
            <CRow >
              <CustomInput
                label="Interval Size (in seconds)"
                value={campaignRegData.interval}
                onChange={handleCampaignAddForm}
                icon={cilFlagAlt}
                type="number"
                id="interval"
                name="interval"
                placeholder="interval size"
                className="form-control item"
                isRequired={false}
              />
            </CRow>
            <CRow>
              <CCol md="6">
                <CustomDatePicker
                  icon={cilCalendar}
                  label="Date From"
                  id="startDate"
                  name="startDate"
                  value={campaignRegData.startDate ? dayjs(campaignRegData.startDate) : null}
                  title="start date"
                  className="scheduleClass"
                  onChange={(e) => handleCampaignAddForm(e, 'startDate')}
                />
              </CCol>
              <CCol md="6">
                <CustomDatePicker
                  icon={cilCalendar}
                  label="Date To"
                  id="endDate"
                  name="endDate"
                  title="end date"
                  className="scheduleClass"
                  value={campaignRegData.endDate ? dayjs(campaignRegData.endDate) : null}
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
                  className="scheduleClass"
                  value={campaignRegData.startTime}
                  onChange={(e) => handleCampaignAddForm(e, 'startTime')}
                />
              </CCol>
              <CCol md="6">
                <CustomTimePicker
                  icon={cilCalendar}
                  label="End Time"
                  id="finishTime"
                  name="finishTime"
                  className="scheduleClass"
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
                <input
                  id="TotalSchMessages"
                  className="form-control item user-profile-input labelName"
                  value={budgetData.TotalSchMessages}
                  disabled
                />
              </CCol>
              <CCol md={4}>
                <label htmlFor="" className="labelName profile-user-labels mt-2">
                  Schedule Budget($)
                </label>
                <input
                  id="TotalSchBudget"
                  className="form-control item user-profile-input"
                  value={budgetData.TotalSchBudget}
                  disabled
                />
              </CCol>
              <CCol md={4}>
                <label htmlFor="" className="profile-user-labels mt-2 labelName">
                  Campaign Budget($)
                </label>
                <input
                  id="TotalCampBudget"
                  className="form-control item user-profile-input"
                  value={budgetData.TotalCampBudget}
                  disabled
                />
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
                onClick={() => submitCompaign()}
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

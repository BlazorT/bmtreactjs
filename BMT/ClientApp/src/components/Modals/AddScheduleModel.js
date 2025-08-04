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

  const { header, isOpen, toggle, initialData, selectedNetworks, selectedPostTypes, selectedDays, setData, data, selected, setSelected, campaignRegData : submitData } = prop;
  const [budgetData, setBudgetData] = useState({
    TotalSchBudget: 0,
    TotalSchMessages: 0,
    TotalCampBudget: 0,
  });
  //console.log("selectedNetwork", selectedNetworks);
  const { createCampaign } = createSchedule();
  const user = useSelector((state) => state.user);
  //const calculateBudget = (networks, scheduleJson, jsonRates) => {
  //  if (!Array.isArray(networks) || !Array.isArray(scheduleJson) || !Array.isArray(jsonRates)) {
  //    console.warn("Invalid input to calculateBudget");
  //    return;
  //  }

  //  let TotalCampBudget = 0;
  //  let TotalSchMessages = 0;

  //  const networkBudgets = [];

  //  for (const ntwk of networks) {
  //    const rates = jsonRates.filter(r => r.id === ntwk.NetworkId);

  //    if (rates.length === 0) {
  //      console.warn(`No rate found for NetworkId: ${ntwk.NetworkId}`);
  //      continue;
  //    }

  //    const UnitRate = parseFloat(rates[0].desc);
  //    if (isNaN(UnitRate)) {
  //      console.error(`Invalid rate for NetworkId: ${ntwk.NetworkId}`);
  //      continue;
  //    }

  //    let sMessageCount = 0;
  //    let nBudget = 0;

  //    for (const schdl of scheduleJson.filter(s => s.NetworkId === ntwk.NetworkId)) {
  //      const sDate = new Date(schdl.StartTime);
  //      const fDate = new Date(schdl.FinishTime);

  //      if (isNaN(sDate) || isNaN(fDate)) {
  //        console.warn(`Invalid dates in schedule for NetworkId: ${ntwk.NetworkId}`);
  //        continue;
  //      }

  //      const diffTime = Math.abs(fDate - sDate);
  //      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //      const parsedDays = JSON.parse(schdl.Days || '[]');
  //      const daysSelected = parsedDays.length || 1;

  //      switch (schdl.IntervalTypeId) {
  //        case 1:
  //          sMessageCount += diffDays;
  //          nBudget += diffDays * UnitRate;
  //          break;
  //        case 2:
  //        case 3:
  //        case 5:
  //        default:
  //          sMessageCount += daysSelected * diffDays;
  //          nBudget += daysSelected * diffDays * UnitRate;
  //          break;
  //        case 4:
  //          // no messages added
  //          nBudget += daysSelected * diffDays * UnitRate;
  //          break;
  //      }
  //    }

  //    TotalCampBudget += nBudget;
  //    TotalSchMessages += sMessageCount;
  //    networkBudgets.push({ NetworkId: ntwk.NetworkId, Budget: nBudget, Messages: sMessageCount });
  //  }

  //  setBudgetData({
  //    TotalCampBudget,
  //    TotalSchBudget: TotalCampBudget,
  //    TotalSchMessages,
  //  });

  //  return networkBudgets;
  //};

  const calculateBudget = (networks, selectedDays) => {
    console.log(networks)
    
    const networkCount = networks?.length??0;
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
    { id: 1, name: 'Sunday' },
    { id: 2, name: 'Monday' },
    { id: 3, name: 'Tuesday' },
    { id: 4, name: 'Wednesday' },
    { id: 5, name: 'Thursday' },
    { id: 6, name: 'Friday' },
    { id: 7, name: 'Saturday' }
  ];
  const [campaignRegData, setCampaignRegData] = useState({
    Intervalval: '',
    intervalTypeId: 0,
    isFixedTime: false,
    startDate: dayjs(submitData.startTime),                 
    endDate: dayjs(submitData.finishTime),   
    startTime: dayjs().startOf('day').add(1, 'hour'),            // 00:00:00 (dayjs object)
    finishTime: dayjs().startOf('day').add(10, 'hour'), // today 01:00:00
    selectedDays: []
  });

  const showToast = useShowToast();
  const [scheduleJson, setScheduleJson] = useState([]);
  const [jsonRates, setJsonRates] = useState([]);
  const [initialVisibleNetworks, setInitialVisibleNetworks] = useState([]);

  useEffect(() => {
    if (initialVisibleNetworks.length === 0 && selectedNetworks.length > 0) {
      setInitialVisibleNetworks([...selectedNetworks]);
    }
  }, [selectedNetworks]);

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
      selectedDays: newTypeId === 2 ? [1, 2, 3, 4, 5, 6,7] : [], // auto-select or clear
    }));
  };


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };
 

  const handleCampaignAddForm = (e, label, date) => {
    console.log("datee", e, label, date);

    if (label === 'startTime' || label === 'finishTime') {
      const newTime = e ? e.format('HH:mm') : null;

      // Convert both times to dayjs objects for comparison
      const currentStart = dayjs(campaignRegData.startTime, 'HH:mm');
      const currentFinish = dayjs(campaignRegData.finishTime, 'HH:mm');
      const newTimeDayjs = dayjs(newTime, 'HH:mm');

      if (label === 'finishTime' && newTimeDayjs.isBefore(currentStart)) {
        showToast('End time cannot be earlier than start time.', 'error');
        return;
      }

      if (label === 'startTime' && currentFinish && newTimeDayjs.isAfter(currentFinish)) {
        showToast('Start time cannot be later than end time.', 'error');
        return;
      }

      setCampaignRegData((prev) => ({
        ...prev,
        [label]: newTime,
      }));
    } else if (label === 'startDate' || label === 'endDate') {
      setCampaignRegData((prev) => ({
        ...prev,
        [label]: e,
      }));
    }
  else {
      const { name, value } = e.target;
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
  //  setCampaignRegData(initialData);
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

//  const [selected, setSelected] = useState(selectedNetworks); // Initial load
  const [selectedNetworkJson, setSelectedNetworkJson] = useState(); // Initial load

  const handleNetworkChange = (networkName) => {
    setSelected((prevSelected) =>
      prevSelected.includes(networkName)
        ? prevSelected.filter((n) => n !== networkName) // remove if unchecked
        : [...prevSelected, networkName] // add if checked
    );
  };

  useEffect(() => {
    calculateBudget(selectedNetworks, campaignRegData.selectedDays);
  }, [
    selectedNetworks,
    campaignRegData.selectedDays,
    campaignRegData.startDate,
    campaignRegData.endDate,
    campaignRegData.startTime,
    campaignRegData.finishTime
  ]);

  const onSave = () => {
    if (!campaignRegData.intervalTypeId || selectedNetworks.length === 0) {
      console.error("Validation failed", campaignRegData);
      showToast('All required fields must be filled.', 'error');
      return;
    }

    const selectedNetworkObjects = globalutil.networks()
      .filter(n => selectedNetworks.includes(n.name))
      .map((n) => {
        const networkName = n.name.toUpperCase(); // to match keys like WHATSAPP, INSTAGRAM
        const postTypeIds = selectedPostTypes[networkName];
        console.log("postTypeIds", postTypeIds);
        return {
          id: 0,
          CompaignId: 0,
          NetworkId: n.id,
          posttypejson: JSON.stringify(postTypeIds),
          RowVer: 1,
          Status: 1,
          LastUpdatedBy: user.userId,
          LastUpdatedAt: new Date(),
          CreatedAt: new Date(),
          CreatedBy: user.userId
        };
      });

    console.log("Selected network objects:", JSON.stringify(selectedNetworkObjects));

    setSelectedNetworkJson(selectedNetworkObjects);

    // Log the campaign start/end date and time
    const startDate = campaignRegData.startDate; // dayjs object
    const endDate = campaignRegData.endDate;     // dayjs object
    const startTime = dayjs(campaignRegData.startTime);
    const endTime = dayjs(campaignRegData.finishTime);


    // Combine start date + time
    const combinedStart = dayjs(startDate)
      .hour(startTime.hour())
      .minute(startTime.minute())
      .second(0)
      .millisecond(0);

    // Combine end date + time
    const combinedEnd = dayjs(endDate)
      .hour(endTime.hour())
      .minute(endTime.minute())
      .second(0)
      .millisecond(0);

    console.log("✔️ Correct StartTime:", combinedStart.format());
    console.log("✔️ Correct FinishTime:", combinedEnd.format());


    const schedulePayload = [];
    for (let ntwk of selectedNetworkObjects) {
      const payloadItem = {
        id: 0,
        NetworkId: ntwk.NetworkId,
        CompaignDetailId: 0,
        StartTime: combinedStart.toISOString(),
        FinishTime: combinedEnd.toISOString(),
        Intervalval: parseFloat(campaignRegData.intervalval),
        IntervalTypeId: parseInt(campaignRegData.intervalTypeId),
        RowVer: 1,
        Status: 1,
        MessageCount: budgetData.TotalSchMessages,
        CreatedAt: new Date(),
        CreatedBy: user.userId,
        days: JSON.stringify(campaignRegData.selectedDays),
        Budget: budgetData.TotalSchBudget,
      };
      schedulePayload.push(payloadItem);
    }

    console.log("Final schedulePayload:", JSON.stringify(schedulePayload, null, 2));

    const updatedSchedule = [...scheduleJson, ...schedulePayload];
    setScheduleJson(updatedSchedule);
    setData(updatedSchedule);

    showToast('Schedule saved successfully!', 'success');
  };
  const submitCompaign = async () => {
    if (!Array.isArray(scheduleJson) || scheduleJson.length === 0) {
      showToast('Please add at least one schedule before submitting.', 'warning');
      return;
    }

    const {
      name,
      tag,
      autoGenerateLeads,
      startTime,
      finishTime,
      status
    } = submitData;

    if (!name || name.trim() === '') {
      showToast('Please add a campaign name || Title before submit.', 'warning');
      return;
    }

    // 🔹 STEP 1: Find the max time from scheduleJson.FinishTime
    let maxFinishTime = null;
    if (Array.isArray(scheduleJson) && scheduleJson.length > 0) {
      maxFinishTime = scheduleJson
        .map(s => moment(s.FinishTime))
        .reduce((latest, current) => current.isAfter(latest) ? current : latest);
    }

    // 🔹 STEP 2: Combine original finish date with max finish time
    const finishTimeWithMaxTime = maxFinishTime
      ? moment(finishTime).set({
        hour: maxFinishTime.hour(),
        minute: maxFinishTime.minute(),
        second: maxFinishTime.second(),
        millisecond: 0
      })
      : moment(finishTime); // fallback to original

    const campaignBody = {
      Id: 0,
      orgId: user.orgId,
      Name: name,
      description: name,
      Title: name,
      HashTags: tag,
      AutoGenerateLeads: autoGenerateLeads ? 1 : 0,
      StartTime: moment(startTime).toISOString(),
     // FinishTime: finishTimeWithMaxTime.toISOString(),
      FinishTime: moment(finishTime).toISOString(),
      Status: status ? 1 : 0,
      CreatedAt: moment().toISOString(),
      RowVer: 1,
      Discount: 0,
      CreatedBy: user.userId,
      TotalBudget: budgetData.TotalCampBudget,
      CompaignNetworks: selectedNetworkJson,
      CompaignExecutionSchedules: scheduleJson
    };

    console.log("body Data Submitted", JSON.stringify(campaignBody));

    try {
      const response = await fetch('/Compaigns/submitmycompaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignBody)
      });

      const result = await response.json();
      console.log({ result });

      if (result.status === true) {
        showToast(`Campaign "${name}" submitted successfully!`, 'success');
        const campaignId = parseInt(result.data, 10);
       // alert(campaignId);

        await uploadAttachmentsAfterCampaign(campaignId);
       navigate('/campaignslisting');
      } else {
        showToast(result.message || 'Submission failed.', 'error');
      }
    } catch (error) {
      console.error("Error submitting campaign:", error);
      showToast('An error occurred.', 'error');
    }
  };
  console.log("submitData", submitData);
  const uploadAttachmentsAfterCampaign = async (campaignId) => {
    console.log("campaignId",campaignId);
    const files = {
      image: submitData.imageAttachment,
      pdf: submitData.pdfAttachment,
      video: submitData.videoAttachment,
    };
    const userId = user.userId;

    for (const type of ['video', 'image', 'pdf']) {
      const file = files?.[type];
      if (!file) continue;

      const formData = new FormData();
      formData.append("id", campaignId);
      formData.append("CreatedBy", userId);
      formData.append("files", file); // backend should use Request.Form.Files

      try {
        const res = await fetch('/BlazorApi/uploadattachments', {
          method: 'POST',
          body: formData // don't set headers here
        });

        const uploadResult = await res.json();
        console.log(`Upload ${type} result:`, uploadResult);

        if (uploadResult.status !== true) {
          showToast(`Failed to upload ${type} attachment.`, 'warning');
        }
      } catch (err) {
        console.error(`Error uploading ${type}:`, err);
        showToast(`Error uploading ${type} attachment.`, 'error');
      }
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
                {globalutil.networks()
                  .filter((network) => initialVisibleNetworks.includes(network.name))
                  .map((network, index) => {
                    const IconName = network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase();
                    const IconComponent = icons[IconName];
                    return (
                      <CCol md={4} key={index}>
                        <ul className="inlinedisplay">
                          <li className="divCircle">
                            {IconComponent && (
                              <IconComponent
                                className="BlazorIcon pdngleft"
                                fontSize="large"
                                color="success"
                              />
                            )}
                          </li>
                          <li className="network-checkbox-animate">
                            <CFormCheck
                              id={IconName}
                              name={IconName}
                              label={network.name}
                              checked={selectedNetworks.includes(network.name)}
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
                  isRequired="true"
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
                value={campaignRegData.intervalval}
                onChange={handleCampaignAddForm}
                icon={cilFlagAlt}
                type="number"
                id="intervalval"
                name="intervalval"
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
                  value={campaignRegData.startDate}
                  minDate={dayjs(submitData.startTime)}
                  maxDate={dayjs(submitData.finishTime)}
                  title="start date"
                  className="scheduleClass"
                  disablePast= "true"
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
                  value={campaignRegData.endDate}
                  disablePast="true"
                  minDate={dayjs(submitData.startTime)}
                  maxDate={dayjs(submitData.finishTime)}
                 // min={submitData?.startTime}
                 // max={submitData?.finishTime}
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
                  value={campaignRegData.startTime ? dayjs(campaignRegData.startTime) : null}
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
                  value={campaignRegData.finishTime ? dayjs(campaignRegData.finishTime) : null}
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

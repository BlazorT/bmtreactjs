import {
  cibFacebook,
  cibGmail,
  cibInstagram,
  cibLinkedin,
  cibSnapchat,
  cibTiktok,
  cibTwitter,
  cibWhatsapp,
  cilCalendar,
  cilFlagAlt,
  cilShortText,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CFormCheck, CRow } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import AppContainer from 'src/components/UI/AppContainer';
import CustomDatePicker from 'src/components/UI/DatePicker';
import CustomTimePicker from 'src/components/UI/TimePicker';
import { useShowToast } from 'src/hooks/useShowToast';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import globalutil from 'src/util/globalutil';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import Button from '../UI/Button';
import PaymentModel from './PaymentModel';
const AddScheduleModel = (prop) => {
  dayjs.extend(utc);
  const {
    header,
    isOpen,
    toggle,
    initialData,
    selectedNetworks,
    selectedPostTypes,
    selectedDays,
    setData,
    data,
    selected,
    setSelected,
    selectedTemplates,
    currencyName,
    makeOrder,
    paymentRef,
    campaignRegData: submitData,
  } = prop;
  const [budgetData, setBudgetData] = useState({
    TotalSchBudget: 0,
    TotalSchMessages: 0,
    TotalCampBudget: 0,
  });
  const user = useSelector((state) => state.user);
  // console.log({ user });
  const calculateBudget = (networks, selectedDays, startDate, endDate, startTime, finishTime) => {
    // console.log('Networksss:', networks);
    // console.log('SelectedDaysss:', selectedDays);
    // console.log('Startss:', startDate?.toString());
    // console.log('Endss:', endDate?.toString());
    // console.log('StartTimes:', startTime?.toString());
    // console.log('FinishTimes:', finishTime?.toString());

    const networkCount = networks?.length ?? 0;
    const dayCount = selectedDays?.length ?? 0;

    // ✅ calculate number of days between startDate and endDate
    const dateDiff =
      startDate && endDate
        ? Math.max(1, Math.ceil((endDate.valueOf() - startDate.valueOf()) / (1000 * 60 * 60 * 24)))
        : 1;

    // ✅ calculate number of hours between startTime and finishTime
    const hoursDiff =
      startTime && finishTime
        ? Math.max(1, Math.ceil((finishTime.valueOf() - startTime.valueOf()) / (1000 * 60 * 60)))
        : 1;

    // ✅ combine all factors
    const scheduleCount = networkCount * (dayCount || 1) * dateDiff * hoursDiff;
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
    { id: 7, name: 'Saturday' },
  ];
  const [campaignRegData, setCampaignRegData] = useState({
    Intervalval: '',
    intervalTypeId: 0,
    isFixedTime: false,
    startDate: dayjs(submitData.startTime),
    endDate: dayjs(submitData.finishTime),
    startTime: dayjs().local().subtract(2, 'hours'), // 00:00:00 (dayjs object)
    finishTime: dayjs().local().add(6, 'hours'), // today 01:00:00
    selectedDays: [],
  });

  const showToast = useShowToast();
  const [scheduleJson, setScheduleJson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [initialVisibleNetworks, setInitialVisibleNetworks] = useState([]);

  const togglePaymentMdl = () => setIsPaymentOpen((prev) => !prev);
  // console.log({ g: budgetData.TotalCampBudget });
  useEffect(() => {
    if (isOpen && makeOrder && paymentRef) {
      submitCompaign(paymentRef);
    }
  }, [makeOrder, isOpen, paymentRef]);

  useEffect(() => {
    if (initialVisibleNetworks.length === 0 && selectedNetworks.length > 0) {
      setInitialVisibleNetworks([...selectedNetworks]);
    }
  }, [selectedNetworks]);

  useEffect(() => {
    if (campaignRegData.intervalTypeId === 2) {
      // Select all days
      setCampaignRegData((prev) => ({
        ...prev,
        selectedDays: daysList.map((day) => day.id),
      }));
    } else {
      // Unselect all days
      setCampaignRegData((prev) => ({
        ...prev,
        selectedDays: [],
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
      selectedDays: newTypeId === 2 ? [1, 2, 3, 4, 5, 6, 7] : [], // auto-select or clear
    }));
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCampaignAddForm = (e, label, date) => {
    // console.log('datee', e, label, date);

    if (label === 'startTime' || label === 'finishTime') {
      const newTime = e ? e : null;

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
      // console.log({ newTime });
      setCampaignRegData((prev) => ({
        ...prev,
        [label]: newTime,
      }));
    } else if (label === 'startDate' || label === 'endDate') {
      setCampaignRegData((prev) => ({
        ...prev,
        [label]: e,
      }));
    } else {
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

  //  const [selected, setSelected] = useState(selectedNetworks); // Initial load
  const [selectedNetworkJson, setSelectedNetworkJson] = useState(); // Initial load

  const handleNetworkChange = (networkName) => {
    setSelected(
      (prevSelected) =>
        prevSelected.includes(networkName)
          ? prevSelected.filter((n) => n !== networkName) // remove if unchecked
          : [...prevSelected, networkName], // add if checked
    );
  };
  useEffect(() => {
    // console.log('🔥 useEffect triggered');

    calculateBudget(
      selectedNetworks,
      campaignRegData.selectedDays,
      campaignRegData.startDate,
      campaignRegData.endDate,
      campaignRegData.startTime,
      campaignRegData.finishTime,
    );
  }, [
    selectedNetworks.join('|'), // ✅ detect network changes
    (campaignRegData.selectedDays || []).join('|'), // ✅ detect days changes
    campaignRegData.startDate ? +new Date(campaignRegData.startDate) : 0, // ✅ convert to timestamp
    campaignRegData.endDate ? +new Date(campaignRegData.endDate) : 0,
    campaignRegData.startTime ? +new Date(campaignRegData.startTime) : 0,
    campaignRegData.finishTime ? +new Date(campaignRegData.finishTime) : 0,
  ]);

  const onSave = () => {
    if (!campaignRegData.intervalTypeId || selectedNetworks.length === 0) {
      // console.error('Validation failed', campaignRegData);
      showToast('All required fields must be filled.', 'error');
      return;
    }

    const selectedNetworkObjects = globalutil
      .networks()
      .filter((n) => selectedNetworks.includes(n.name))
      .map((n) => {
        const networkName = n.name.toUpperCase(); // to match keys like WHATSAPP, INSTAGRAM
        const postTypeIds = selectedPostTypes[networkName];
        const templateJson = selectedTemplates[networkName]
          ? JSON.stringify({
              template: selectedTemplates[networkName]?.template || '',
              subject: selectedTemplates[networkName]?.subject || '',
              title: selectedTemplates[networkName]?.title || '',
            })
          : '';
        // console.log('postTypeIds', postTypeIds);
        return {
          id: 0,
          CompaignId: 0,
          NetworkId: n.id,
          posttypejson: JSON.stringify(postTypeIds),
          RowVer: 1,
          Status: 1,
          Template: templateJson,
          LastUpdatedBy: user.userId,
          LastUpdatedAt: new Date(),
          CreatedAt: new Date(),
          CreatedBy: user.userId,
        };
      });

    // console.log('Selected network objects:', JSON.stringify(selectedNetworkObjects));

    setSelectedNetworkJson(selectedNetworkObjects);

    // Log the campaign start/end date and time
    const startDate = campaignRegData.startDate; // dayjs object
    const endDate = campaignRegData.endDate; // dayjs object
    const startTime = dayjs(campaignRegData.startTime).local();
    const endTime = dayjs(campaignRegData.finishTime).local();
    // console.log({ startTime, endTime });
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

    // console.log('✔️ Correct StartTime:', combinedStart.format('YYYY-MM-DDTHH:mm:ss'));
    // console.log('✔️ Correct FinishTime:', combinedEnd.format('YYYY-MM-DDTHH:mm:ss'));

    const schedulePayload = [];
    for (let ntwk of selectedNetworkObjects) {
      const payloadItem = {
        id: 0,
        NetworkId: ntwk.NetworkId,
        CompaignDetailId: 0,
        StartTime: combinedStart.format('YYYY-MM-DDTHH:mm:ss'),
        FinishTime: combinedEnd.format('YYYY-MM-DDTHH:mm:ss'),
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

    // console.log('Final schedulePayload:', JSON.stringify(schedulePayload, null, 2));

    const updatedSchedule = [...scheduleJson, ...schedulePayload];
    setScheduleJson(updatedSchedule);
    setData(updatedSchedule);

    showToast('Schedule saved successfully!', 'success');
  };
  const submitCompaign = async (ref = '') => {
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
      status,
      interests,
      genderId,
      locations,
    } = submitData;

    if (!name || name.trim() === '') {
      showToast('Please add a campaign name || Title before submit.', 'warning');
      return;
    }

    // 🔹 STEP 1: Find the max time from scheduleJson.FinishTime
    let maxFinishTime = null;
    if (Array.isArray(scheduleJson) && scheduleJson.length > 0) {
      maxFinishTime = scheduleJson
        .map((s) => dayjs(s.FinishTime))
        .reduce((latest, current) => (current.isAfter(latest) ? current : latest));
    }

    // 🔹 STEP 2: Combine original finish date with max finish time
    const finishTimeWithMaxTime = maxFinishTime
      ? dayjs(finishTime)
          .set('hour', maxFinishTime.hour())
          .set('minute', maxFinishTime.minute())
          .set('second', maxFinishTime.second())
          .set('millisecond', 0)
      : dayjs(finishTime); // fallback to original

    const campaignBody = {
      Id: 0,
      orgId: user.orgId,
      Name: name,
      description: name,
      Title: name,
      HashTags: tag,
      targetaudiance: JSON.stringify({
        interests: interests || [],
        genderId: genderId || null,
        locations: locations || [],
      }),
      AutoGenerateLeads: autoGenerateLeads ? 1 : 0,
      StartTime: dayjs(startTime).toISOString(),
      // FinishTime: finishTimeWithMaxTime.toISOString(),
      FinishTime: dayjs(finishTime).toISOString(),
      Status: status ? 1 : 0,
      CreatedAt: dayjs().toISOString(),
      RowVer: 1,
      Discount: 0,
      CreatedBy: user.userId,
      TotalBudget: budgetData.TotalCampBudget,
      paymentRef: ref || '',
      PaymentStatus: ref ? 1 : 2,
      CompaignNetworks: selectedNetworkJson,
      CompaignExecutionSchedules: scheduleJson,
    };

    // console.log('body Data Submitted', JSON.stringify(campaignBody));
    console.log({ campaignBody });
    try {
      setLoading(true);
      const response = await fetch('/Compaigns/submitmycompaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignBody),
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
      console.error('Error submitting campaign:', error);
      showToast('An error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };
  // // console.log('submitData', submitData);
  const uploadAttachmentsAfterCampaign = async (campaignId) => {
    // console.log('campaignId', campaignId);
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
      formData.append('compaignId', campaignId);
      formData.append('CreatedBy', userId);
      formData.append('files', file); // backend should use Request.Form.Files

      try {
        setLoading(true);

        const res = await fetch('/BlazorApi/uploadattachments', {
          method: 'POST',
          body: formData, // don't set headers here
        });
        console.log({ res });
        const uploadResult = await res.json();
        // console.log(`Upload ${type} result:`, uploadResult);

        if (uploadResult.status !== true) {
          showToast(`Failed to upload ${type} attachment.`, 'warning');
        }
      } catch (err) {
        console.error(`Error uploading ${type}:`, err);
        showToast(`Error uploading ${type} attachment.`, 'error');
      } finally {
        setLoading(false);
      }
    }
  };
  // console.log({ startTime: campaignRegData.startTime });
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
        <ModalHeader>{header}</ModalHeader>
        <ModalBody className="paddingAllSide">
          <form className="needs-validation shift-add-form" onSubmit={handleSubmit} noValidate>
            <AppContainer>
              <React.Fragment>
                <AppContainer>
                  <DataGridHeader title="Networks" filterDisable={false} />
                </AppContainer>
                <CRow>
                  {globalutil
                    .networks()
                    .filter((network) => initialVisibleNetworks.includes(network.name))
                    .map((network, index) => {
                      const IconName =
                        network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase();
                      return (
                        <CCol md={4} key={index}>
                          <ul className="inlinedisplay">
                            <li className="divCircle">
                              <CIcon className="BlazorIcon" icon={icons[IconName]} size="xl" />
                            </li>
                            <li className="network-checkbox-animate">
                              <CFormCheck
                                id={IconName}
                                name={IconName}
                                disabled={loading}
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
                    disabled={loading}
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
                <CCol md="6" className="mt-3">
                  <CFormCheck
                    disabled={loading}
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
                          disabled={campaignRegData.intervalTypeId === 2 || loading} // disable if all are auto-selected
                        />
                      </CCol>
                    ))}
                  </CRow>
                </fieldset>
              </CRow>
              <CRow>
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
                  disabled={loading}
                />
              </CRow>
              <CRow>
                <CCol md="6">
                  <CustomDatePicker
                    icon={cilCalendar}
                    disabled={loading}
                    label="Date From"
                    id="startDate"
                    name="startDate"
                    value={campaignRegData.startDate}
                    minDate={dayjs(submitData.startTime)}
                    maxDate={dayjs(submitData.finishTime)}
                    title="start date"
                    className="scheduleClass"
                    disablePast="true"
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    Schedule Budget({currencyName || ''})
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
                    Campaign Budget({currencyName || ''})
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
              <div className="CenterAlign pt-2 gap-2">
                <Button
                  disabled={loading}
                  onClick={() => onCancel()}
                  type="button"
                  className="w-auto px-4"
                  // className="btn btn_Default m-2 sales-btn-style"
                >
                  Back
                </Button>
                <Button
                  disabled={loading}
                  onClick={() => onSave()}
                  type="button"
                  className="w-auto px-4"
                >
                  Add Schedule
                </Button>
                <Button
                  content={
                    scheduleJson?.length === 0
                      ? 'Please add at least one schedule before submitting.'
                      : ''
                  }
                  disabled={loading || scheduleJson?.length === 0}
                  loading={loading}
                  onClick={() =>
                    // submitCompaign()
                    togglePaymentMdl()
                  }
                  type="submit"
                  className="w-auto px-4"
                  // className="btn btn_Default sales-btn-style m-2 min-width w-auto px-3"
                >
                  Submit Campaign
                </Button>
              </div>
            </React.Fragment>
          </form>
        </ModalBody>
      </Modal>
      <PaymentModel
        isOpen={isPaymentOpen}
        toggle={togglePaymentMdl}
        amount={budgetData.TotalCampBudget}
        onSubmit={submitCompaign}
      />
    </>
  );
};
export default AddScheduleModel;

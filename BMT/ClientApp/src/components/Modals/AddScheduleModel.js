import { cilCalendar, cilFlagAlt } from '@coreui/icons';
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
import CustomDatePicker from 'src/components/UI/DatePicker';
import CustomTimePicker from 'src/components/UI/TimePicker';
import { daysList, icons } from 'src/constants/constants';
import { calculateValidDays } from 'src/helpers/campaignHelper';
import { useShowToast } from 'src/hooks/useShowToast';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import globalutil from 'src/util/globalutil';
import AlbumListSelector from '../CustomComponents/AlbumListSelector';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import Button from '../UI/Button';
import { AlbumListModel } from './AlbumListModel';
import PaymentModel from './PaymentModel';

dayjs.extend(utc);

const AddScheduleModel = (prop) => {
  const {
    header,
    isOpen,
    toggle,
    selectedNetworks,
    selectedPostTypes,
    setData,
    setSelected,
    selectedTemplates,
    currencyName,
    makeOrder,
    paymentRef,
    data,
    pricingData,
    recipients,
    campaignRegData: submitData,
  } = prop;

  const [budgetData, setBudgetData] = useState({
    TotalSchBudget: 0,
    TotalSchMessages: 0,
    TotalCampBudget: 0,
    TotalSchNetworkBudget: [],
  });

  const [selectedNetworkJson, setSelectedNetworkJson] = useState(); // Initial load

  const user = useSelector((state) => state.user);

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
  const [selectedAlbumList, setSelectedAlbumList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShowAlbumList, setIsShowAlbumList] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [initialVisibleNetworks, setInitialVisibleNetworks] = useState([]);
  const togglePaymentMdl = () => setIsPaymentOpen((prev) => !prev);
  // console.log({ g: budgetData.TotalCampBudget });
  const getNetworkRecipients = (nId) => {
    if (![1, 2, 3].includes(nId)) return 1;
    const findAlbumId = selectedAlbumList?.find((al) => al?.networkid === nId);
    if (!findAlbumId) return 1;
    const rec =
      recipients?.filter((r) => r?.networkId === nId && r?.albumid === findAlbumId?.id)?.length ||
      1;
    return rec;
  };

  const toggleIsShowAlbumList = () => setIsShowAlbumList((prev) => !prev);

  const calculateBudget = (
    networks,
    selectedDays,
    startDate,
    endDate,
    startTime,
    finishTime,
    intervalTypeId,
    interval,
  ) => {
    const validDays = calculateValidDays({
      startTime: startDate,
      finishTime: endDate,
      days: selectedDays,
      intervalTypeId,
      interval,
    });
    console.log(getNetworkRecipients(2));
    // ✅ sum total of selected networks' prices from pricingData
    const totalNetworkPrice = networks?.reduce((sum, network) => {
      const networkId = globalutil
        .networks()
        .find((n) => n?.name?.toLowerCase() === network?.toLowerCase())?.id;
      const matchedPricing = pricingData?.find((price) => networkId === price.networkId);
      return sum + matchedPricing?.unitPrice * getNetworkRecipients(networkId);
    }, 0);

    // ✅ calculate total schedule budget using the summed prices
    const totalScheduleBudget = totalNetworkPrice * validDays;
    // ✅ optionally calculate total messages (example multiplier)
    const totalScheduleMessages = networks?.reduce((sum, network) => {
      const networkId = globalutil
        .networks()
        .find((n) => n?.name?.toLowerCase() === network?.toLowerCase())?.id;
      return sum + validDays * getNetworkRecipients(networkId);
    }, 0);

    // ✅ if you have multiple schedule budgets to sum
    const totalCampBudget = scheduleJson?.reduce((acc, curr) => acc + (curr.Budget || 0), 0) || 0;

    setBudgetData({
      TotalCampBudget: parseFloat(totalCampBudget?.toFixed(2)),
      TotalSchBudget: parseFloat(totalScheduleBudget?.toFixed(2)),
      TotalSchMessages: totalScheduleMessages,
      TotalSchNetworkBudget: networks?.map((network) => {
        const networkId = globalutil
          .networks()
          .find((n) => n?.name?.toLowerCase() === network?.toLowerCase())?.id;
        const matchedPricing = pricingData?.find((price) => networkId === price.networkId);
        const totalNetworkPrice =
          (matchedPricing?.unitPrice || 0) *
          (getNetworkRecipients(networkId) || 0) *
          (validDays || 1);

        return {
          networkId,
          totalNetworkPrice: parseFloat((totalNetworkPrice || '0')?.toFixed(2)),
          totalNetworkMessageCount: validDays * getNetworkRecipients(networkId),
        };
      }),
    });
  };

  useEffect(() => {
    setScheduleJson(data);
  }, [data]);

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

  const handleNetworkChange = (networkName) => {
    const findNetworkId = globalutil.networks().find((n) => n.name === networkName)?.id;
    if (!findNetworkId) return;

    setSelected((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(networkName);
      const updatedSelected = isAlreadySelected
        ? prevSelected.filter((n) => n !== networkName)
        : [...prevSelected, networkName];

      // Filter selectedAlbumList based on updated selected networks
      setSelectedAlbumList((prevAlbumList) =>
        prevAlbumList.filter((album) =>
          updatedSelected.some(
            (network) =>
              globalutil.networks().find((n) => n.name === network)?.id === album.networkid,
          ),
        ),
      );

      return updatedSelected;
    });
  };

  const onSave = () => {
    if (selectedAlbumList?.length !== selectedNetworks?.length) {
      showToast('Select contact list for selected networks', 'error');
      return;
    }
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
        Intervalval: parseFloat(campaignRegData.Intervalval || 0),
        IntervalTypeId: parseInt(campaignRegData.intervalTypeId),
        RowVer: 1,
        Status: 1,
        MessageCount:
          budgetData?.TotalSchNetworkBudget?.find((bd) => bd?.networkId === ntwk.NetworkId)
            ?.totalNetworkMessageCount || 0,
        CreatedAt: new Date(),
        CreatedBy: user.userId,
        days: JSON.stringify(campaignRegData.selectedDays),
        Budget:
          budgetData?.TotalSchNetworkBudget?.find((bd) => bd?.networkId === ntwk.NetworkId)
            ?.totalNetworkPrice || 0,
        ContactsAlbums: JSON.stringify(
          selectedAlbumList?.filter((a) => a.networkid === ntwk?.NetworkId)?.map((a) => a.id),
        ),
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

  useEffect(() => {
    // console.log('🔥 useEffect triggered');

    calculateBudget(
      selectedNetworks,
      campaignRegData.selectedDays,
      campaignRegData.startDate,
      campaignRegData.endDate,
      campaignRegData.startTime,
      campaignRegData.startTime,
      campaignRegData.intervalTypeId,
      campaignRegData.Intervalval,
    );
  }, [
    selectedNetworks.join('|'), // ✅ detect network changes
    selectedAlbumList,
    (campaignRegData.selectedDays || []).join('|'), // ✅ detect days changes
    campaignRegData.startDate ? +new Date(campaignRegData.startDate) : 0, // ✅ convert to timestamp
    campaignRegData.endDate ? +new Date(campaignRegData.endDate) : 0,
    campaignRegData.startTime ? +new Date(campaignRegData.startTime) : 0,
    campaignRegData.finishTime ? +new Date(campaignRegData.finishTime) : 0,
    campaignRegData.intervalTypeId ? campaignRegData.intervalTypeId : 0,
    campaignRegData.Intervalval ? campaignRegData.Intervalval : 0,
    scheduleJson,
  ]);
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} size="xl" className="" centered>
        <ModalHeader className="border-0 pb-0" toggle={toggle}>
          <h5 className="mb-0 fw-semibold">{header}</h5>
        </ModalHeader>
        <ModalBody>
          <form className="needs-validation shift-add-form" onSubmit={handleSubmit} noValidate>
            <div className="d-flex flex-column gap-2">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-2 p-md-3">
                  <DataGridHeader title="Networks" filterDisable={true} />
                  <CRow className="mt-2 px-3 row-gap-3 column-gap-3 flex-wrap mb-2">
                    {globalutil
                      .networks()
                      .filter((network) => initialVisibleNetworks.includes(network.name))
                      .map((network, index) => {
                        const IconName =
                          network.name.charAt(0).toUpperCase() +
                          network.name.slice(1).toLowerCase();
                        return (
                          <div
                            key={index}
                            className="d-flex align-items-center w-auto gap-2 rounded-3 border p-2 h-100 shadow-sm-sm"
                          >
                            <span className="divCircle">
                              <CIcon className="BlazorIcon" icon={icons[IconName]} size="xl" />
                            </span>
                            <CFormCheck
                              id={IconName}
                              name={IconName}
                              disabled={loading}
                              label={network.name}
                              checked={selectedNetworks.includes(network.name)}
                              onChange={() => handleNetworkChange(network.name)}
                              className="d-flex align-items-center m-0 fw-semibold text-capitalize"
                            />
                          </div>
                        );
                      })}
                  </CRow>
                  <AlbumListSelector
                    selectedNetworks={selectedNetworks}
                    selectedAlbumList={selectedAlbumList}
                    toggleIsShowAlbumList={toggleIsShowAlbumList}
                  />
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-2 p-md-3">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-0">
                    <h6 className="mb-0 fw-semibold">Schedule Details</h6>
                    <span className="badge text-bg-dark px-3 py-2">
                      Configure timing, interval and recurrence
                    </span>
                  </div>
                  <CRow className="gy-3">
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
                    <CCol md="6">
                      <CFormCheck
                        disabled={loading}
                        label="Is Fixed Time"
                        name="isFixedTime"
                        checked={campaignRegData.isFixedTime}
                        onChange={(e) =>
                          setCampaignRegData({
                            ...campaignRegData,
                            isFixedTime: e.target.checked,
                          })
                        }
                        className="d-flex mt-4 pt-2 align-items-center"
                      />
                    </CCol>
                  </CRow>

                  <div className="mt-0">
                    <fieldset className="mb-0">
                      <legend className="legend mb-0">Select Days</legend>
                      <CRow className="mt-2 gy-2 px-3 column-gap-3 row-gap-3 flex-wrap">
                        {daysList.map((day) => (
                          <div className="border rounded-3 px-3 py-1 h-100 w-auto" key={day.id}>
                            <CFormCheck
                              type="checkbox"
                              label={day.name}
                              id={`day-${day.id}`}
                              checked={campaignRegData.selectedDays.includes(day.id)}
                              onChange={() => handleDayChange(day.id)}
                              disabled={campaignRegData.intervalTypeId === 2 || loading}
                              className="fw-semibold d-flex align-items-center"
                            />
                          </div>
                        ))}
                      </CRow>
                    </fieldset>
                  </div>

                  <CRow className="mt-1 gy-3">
                    <CustomInput
                      label="Interval Size (in seconds)"
                      value={campaignRegData.Intervalval}
                      onChange={handleCampaignAddForm}
                      icon={cilFlagAlt}
                      type="number"
                      id="Intervalval"
                      name="Intervalval"
                      placeholder="interval size"
                      className="form-control item"
                      isRequired={false}
                      disabled={loading}
                    />
                  </CRow>

                  <CRow className="gy-3">
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
                        onChange={(e) => handleCampaignAddForm(e, 'endDate')}
                      />
                    </CCol>
                  </CRow>

                  <CRow className="gy-3">
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
                        value={
                          campaignRegData.finishTime ? dayjs(campaignRegData.finishTime) : null
                        }
                        onChange={(e) => handleCampaignAddForm(e, 'finishTime')}
                        disabled={loading}
                        title=" End Time"
                      />
                    </CCol>
                  </CRow>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-2 p-md-3">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                    <h6 className="mb-0 fw-semibold">Budget Overview</h6>
                    <span className="text-muted small">
                      Auto-calculated based on selected networks and contacts
                    </span>
                  </div>
                  <CRow className="gy-3">
                    <CCol md={4} sm={6}>
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
                    <CCol md={4} sm={6}>
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
                    <CCol md={4} sm={12}>
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
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-0">
                <div className="card-body p-3 p-md-3">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <div>
                      <p className="text-muted mb-1 small">Actions</p>
                      <h6 className="mb-0 fw-semibold">Save schedule or submit campaign</h6>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        disabled={loading}
                        onClick={onCancel}
                        type="button"
                        className="w-auto px-4 btn-light"
                      >
                        Back
                      </Button>
                      <Button
                        disabled={loading}
                        onClick={onSave}
                        type="button"
                        className="w-auto px-4 btn-outline-primary"
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
                        onClick={togglePaymentMdl}
                        type="submit"
                        className="w-auto px-4"
                      >
                        Submit Campaign
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <AlbumListModel
        isOpen={isShowAlbumList}
        toggle={toggleIsShowAlbumList}
        networkIds={selectedNetworks}
        selectedAlbumList={selectedAlbumList}
        setSelectedAlbumList={setSelectedAlbumList}
      />
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

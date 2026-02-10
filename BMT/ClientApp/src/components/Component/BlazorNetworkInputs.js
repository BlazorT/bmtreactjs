import { cilChevronBottom, cilUser } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import AppContainer from 'src/components/UI/AppContainer';
import {
  getInitialNetworkData,
  getNetworkInputFields,
} from 'src/configs/InputConfig/networkFromConfig';
import { formValidator } from 'src/helpers/formValidator';
import useApi from 'src/hooks/useApi';
import { useShowToast } from 'src/hooks/useShowToast';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import Inputs from '../Filters/Inputs';
import PaymentModel from '../Modals/PaymentModel';
import SendTestEmailModel from '../Modals/SendTestEmailModel';
import TemplateListModel from '../Modals/TemplateListModel';
import Button from '../UI/Button';
import Form from '../UI/Form';
import SocialMediaTextEditor from '../UI/SocialMediaTextFormatter';
import Spinner from '../UI/Spinner';
import EmailTextEditor from '../UI/email-editor';
import WhatsAppTemplateEditor from '../UI/WhatsAppTemplateEditor';
import { generateInitialParameters, safeParseJSON } from 'src/helpers/campaignHelper';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';

dayjs.extend(utc);

const BlazorNetworkInputs = (prop) => {
  const { networkId, setNetworkList, networkList, organizationId, pricingData } = prop;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const user = useSelector((state) => state.user);

  const [networkState, setNetworkState] = useState(
    getInitialNetworkData(organizationId, user, networkId),
  );
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const [showIntegration, setShowIntegration] = useState(false);
  const [showFilters, setshowFilters] = useState(false);
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [showTestEmailModel, setShowTestEmailModel] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [whatsappTemplateType, setWhatsappTemplateType] = useState(1); // 1 = Template, 2 = Text

  const togglePaymentMdl = () => setIsPaymentOpen((prev) => !prev);
  const toggleSendEmailModel = () => setShowTestEmailModel((prev) => !prev);
  const toggleShowTemplateList = () => setShowTemplateList((prev) => !prev);

  const networkSettingBody = useMemo(
    () => ({
      id: networkId?.toString(),
      orgId: (organizationId || user?.orgId)?.toString(),
    }),
    [networkId, organizationId, user],
  );

  const { postData, loading } = useApi('/Organization/addupdatenetworksettings');
  const {
    postData: refetchNetworkSettings,
    data: networkSettingsData,
    loading: networkSettingsLoading,
  } = useApi('/Organization/orgpackagedetails', 'POST', networkSettingBody);

  // console.log(globalutil.campaignunits());

  useEffect(() => {
    if (networkSettingsData?.data && networkSettingsData.data.length > 0) {
      const data = networkSettingsData.data[0];

      // ✅ Safely parse custom1
      let templateData = {};
      if (data?.custom1) {
        try {
          templateData = JSON.parse(data.custom1);
        } catch (err) {
          console.error('Invalid JSON in custom1:', err);
          templateData = {};
        }
      }

      // --- Compute packageId based on time range ---
      const start = dayjs(data?.startTime).utc();
      const finish = dayjs(data?.finishTime).utc();

      let packageId = 9; // default = No Of Messages (if no valid range)
      if (data?.finishTime && start.isValid() && finish.isValid()) {
        const diffDays = finish.diff(start, 'day');
        const diffWeeks = finish.diff(start, 'week');
        const diffMonths = finish.diff(start, 'month');
        const diffYears = finish.diff(start, 'year');

        if (diffDays === 1)
          packageId = 1; // Day
        else if (diffWeeks === 1)
          packageId = 2; // Week
        else if (diffMonths === 1)
          packageId = 3; // Month
        else if (diffMonths === 3)
          packageId = 4; // 3 Month
        else if (diffMonths === 6)
          packageId = 5; // 6 Month
        else if (diffYears === 1)
          packageId = 6; // Year
        else if (diffYears === 2)
          packageId = 7; // 2 Year
        else if (diffYears === 3) packageId = 8; // 3 Year
      }
      const initialWhatsAppTemplateType =
        data?.networkId === 2 && templateData?.templateType === 2 ? 2 : 1;

      if (data?.networkId === 2) {
        setWhatsappTemplateType(initialWhatsAppTemplateType);
      }

      setNetworkState({
        id: data?.id,
        orgId: data?.orgId,
        unitId: data?.unitId || 1,
        packageId,
        name: data?.name || '',
        attachment: '',
        excelAttachment: '',
        businessId: data?.businessId || '',
        url: data?.url || '',
        apiuri: data?.apiuri || '',
        sender: data?.sender || '',
        port: data?.port || 0,
        apikey: data?.apikey || '',
        apiKeySecret: data?.apikeySecret || '',
        password: data?.password || '',
        autoReplyAllowed: data?.autoReplyAllowed,
        autoReplyContent: data?.autoReplyContent,
        replyAttachment: data?.replyMediaContentId || '',
        virtualAccount: data?.virtualAccount,
        purchasedQouta: data?.purchasedQouta || '',
        posttypejson: [],
        networkId: data?.networkId,
        rowVer: 1,
        status: data?.status || 1,
        Custom1: templateData?.template || '',
        Custom2: data?.custom2 || '',
        m2mIntervalSeconds: data?.m2mIntervalSeconds || 60,
        startTime: data?.startTime || dayjs().utc().format(),
        finishTime: data?.finishTime || dayjs().utc().format(),
        accountAuthData: data?.accountAuthData || '',
        lastUpdatedBy: user.userId,
        createdBy: data?.createdBy || user.userId,
        lastUpdatedAt: dayjs().utc().format(),
        createdAt: data?.createdAt || dayjs().utc().startOf('month').format(),
        smtpcreduser: data?.smtpcreduser || '',
        smtpcredpwd: data?.smtpcredpwd || '',
        smtpsslenabled: data?.smtpsslenabled || '',
        smtpsecretkey: data?.smtpsecretkey || '',
        smtpserver: data?.smtpserver || '',
        smtpport: data?.smtpport || '',
        templateSubject: templateData?.subject || '',
        templateTitle: templateData?.title || '',
        whatsappTemplateType: initialWhatsAppTemplateType,
      });
    } else {
      setNetworkState(getInitialNetworkData(organizationId, user, networkId));
      if (networkId === 2) {
        setWhatsappTemplateType(1);
      }
    }
  }, [networkSettingsData]);

  const findNetworkPrice = pricingData?.find(
    (pd) => pd?.networkId === networkId && networkState?.unitId == pd?.unitId,
  );

  useEffect(() => {
    // valid purchasedQouta number
    // console.log({ findNetworkPrice });
    setTimeout(() => {
      setNetworkState((prev) => ({
        ...prev,
        price: (
          parseFloat(networkState?.purchasedQouta || '0') *
          ((findNetworkPrice?.unitPrice || 1) - (findNetworkPrice?.discount || 0))
        )?.toFixed(2),
      }));
    }, 1000);
  }, [networkState?.purchasedQouta, findNetworkPrice]);

  dayjs.extend(utc);

  useEffect(() => {
    if (!networkState?.packageId) return;

    const start = dayjs().utc().startOf('day'); // start from today UTC
    let finish;

    switch (parseInt(networkState.packageId)) {
      case 1: // Day
        console.log('hi');
        finish = start.add(1, 'day');
        break;
      case 2: // Week
        finish = start.add(1, 'week');
        break;
      case 3: // Month
        finish = start.add(1, 'month');
        break;
      case 4: // 3 Month
        finish = start.add(3, 'month');
        break;
      case 5: // 6 Month
        finish = start.add(6, 'month');
        break;
      case 6: // Year
        finish = start.add(1, 'year');
        break;
      case 7: // 2 Year
        finish = start.add(2, 'year');
        break;
      case 8: // 3 Year
        finish = start.add(3, 'year');
        break;
      case 9: // No Of Messages — no time restriction
        break;
      default:
        finish = start;
    }
    setNetworkState((prev) => ({
      ...prev,
      startTime: start.format(), // e.g. "2025-10-16T00:00:00Z"
      finishTime: finish ? finish.format() : dayjs().utc().format(), // e.g. "2025-10-23T00:00:00Z"
    }));
  }, [networkState?.packageId]);

  const foundSavedId = networkList?.find((n) => n?.networkId === networkId);

  useEffect(() => {
    if (!foundSavedId) return;
    setNetworkState(foundSavedId);
    if (foundSavedId.networkId === 2) {
      setWhatsappTemplateType(foundSavedId.whatsappTemplateType || 1);
    }
  }, [foundSavedId]);

  const handleNetworkSetting = (e, label) => {
    if (label === 'startTime' || label === 'finishTime') {
      setNetworkState((prev) => ({
        ...prev,
        [label]: e,
      }));
      return;
    }

    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const file = files?.[0] || null;

      if (name === 'excelAttachment' && file) {
        // Allowed Excel MIME types
        const allowedTypes = [
          'application/vnd.ms-excel', // .xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        ];
        const isExcel =
          allowedTypes.includes(file.type) ||
          file.name.endsWith('.xls') ||
          file.name.endsWith('.xlsx');

        if (!isExcel) {
          // ❌ Show toast and reject the file
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: 'Only Excel files (.xls, .xlsx) are allowed!',
              toastVariant: 'error',
            }),
          );

          // Reset file input so wrong file doesn’t stay selected
          e.target.value = null;
          return;
        }
      }

      setNetworkState((prev) => ({
        ...prev,
        [name]: file
          ? {
              file, // raw File object
              name: file.name, // display name
              src: URL.createObjectURL(file), // preview
            }
          : null,
      }));
    } else if (name === 'posttypejson') {
      const postTypeId = parseInt(value);
      setNetworkState((prev) => {
        const selected = Array.isArray(prev.posttypejson) ? prev.posttypejson : [];
        const updated = checked
          ? [...selected, postTypeId]
          : selected.filter((id) => id !== postTypeId);
        return { ...prev, posttypejson: updated };
      });
    } else if (type === 'checkbox') {
      setNetworkState((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number' && value !== '') {
      setNetworkState((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setNetworkState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const toggleStock = () => {
    setshowFilters((prev) => !prev);
  };

  const showPackageDetail = () => {
    setShowPackageDetails((prev) => !prev);
  };

  const showIntegrationfn = () => {
    setShowIntegration((prev) => !prev);
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
    /* toggle();*/
    navigate('/Dashboard');

    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    setNetworkState([]);
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const onSave = () => {
    formValidator();
    const form = document.querySelector('.network-settings-form');

    if (!form?.checkValidity()) {
      setshowFilters(true);
      return;
    }
    if (networkState?.networkId === 2) {
      // WhatsApp validation
      if (!networkState?.templateTitle || !networkState?.templateSubject) {
        setshowFilters(true);
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: 'Template name and language are required for WhatsApp.',
            toastVariant: 'error',
          }),
        );
        return;
      }
      if (
        (whatsappTemplateType === 1 && !networkState?.Custom2) ||
        (whatsappTemplateType === 2 && !networkState?.Custom1)
      ) {
        setshowFilters(true);
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: 'Template content is required for WhatsApp.',
            toastVariant: 'error',
          }),
        );
        return;
      }
    }
    if (networkState?.name === '') {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'Template name is required.',
          toastVariant: 'error',
        }),
      );
      return;
    }

    if (
      (networkState?.templateSubject === '' && networkId === 3) ||
      networkState?.templateTitle === ''
    ) {
      setshowFilters(true);
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'Template subject or title  is required.',
          toastVariant: 'error',
        }),
      );
      return;
    }

    if (parseInt(networkState?.price) > 0 && !networkState?.unitId) {
      showToast('Select unit first to purchase quota', 'error');
      return;
    }

    const updatedState = { ...networkState };

    if (updatedState.networkId === 2) {
      updatedState.whatsappTemplateType = whatsappTemplateType;
    }

    // Append networkId to file names (if files exist)
    if (updatedState.attachment?.name) {
      const ext = updatedState.attachment.name.split('.').pop();
      const base = updatedState.attachment.name.replace(/\.[^/.]+$/, '');
      updatedState.attachment = {
        ...updatedState.attachment,
        name: `${base}_${updatedState.networkId}.${ext}`,
      };
    }

    if (updatedState.excelAttachment?.name) {
      const ext = updatedState.excelAttachment.name.split('.').pop();
      const base = updatedState.excelAttachment.name.replace(/\.[^/.]+$/, '');
      updatedState.excelAttachment = {
        ...updatedState.excelAttachment,
        name: `${base}_${updatedState.networkId}.${ext}`,
      };
    }

    // Save with update OR insert
    setNetworkList((prev) => {
      const index = prev.findIndex((n) => n.networkId === updatedState.networkId);

      if (index !== -1) {
        // Replace existing
        const newList = [...prev];
        newList[index] = updatedState;
        return newList;
      }

      // Otherwise add new
      return [...prev, updatedState];
    });
    showToast('Note : To complete network changes, you need to submit finally', 'warning');

    console.log('Updated Network State', updatedState);
  };
  const onSubmit = async () => {
    try {
      if (networkList.length === 0) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: 'Save atleast one netrwork settings to submit.',
            toastVariant: 'error',
          }),
        );
        return;
      }

      const body = networkList?.map((nl) => ({
        ...nl,
        autoReplyAllowed: nl?.autoReplyAllowed ? 1 : 0,
        status: nl?.status ? 1 : 0,
        smtpsslenabled: nl?.smtpsslenabled ? 1 : 0,
        virtualAccount: nl?.virtualAccount ? 1 : 0,
        unitId: nl?.unitId ? parseInt(nl?.unitId) : 0,
        purchasedQouta: nl?.purchasedQouta ? parseInt(nl?.purchasedQouta) : 0,
        Custom1:
          nl?.networkId === 2
            ? nl?.whatsappTemplateType === 2
              ? JSON.stringify({
                  templateType: 2,
                  template: nl?.Custom1,
                  subject: nl?.templateSubject,
                  title: nl?.templateTitle,
                })
              : JSON.stringify({
                  templateType: 1,
                  template: nl?.templateTitle,
                  subject: nl?.templateSubject,
                  title: nl?.templateTitle,
                  templateData: nl?.Custom2 ? JSON.parse(nl.Custom2) : null,
                })
            : JSON.stringify({
                template: nl?.Custom1,
                subject: nl?.templateSubject,
                title: nl?.templateTitle,
              }),
      }));
      console.log({ body });
      const res = await postData(body);
      console.log({ res });
      if (res?.status === true && res?.data) {
        await refetchNetworkSettings(networkSettingBody);
        // setNetworkState((prev) => ({ ...prev, id: res?.id }));

        setNetworkList([]);
        showToast(res?.message, 'success');
        const GlobalPreferenceId = res?.data;
        const userId = user.userId;
        console.log('Backend returned GlobalPreferenceId:', GlobalPreferenceId, ' userId:', userId);

        // Upload attachments for each network
        for (const net of networkList) {
          const formData = new FormData();
          formData.append('CompaignId', GlobalPreferenceId);
          formData.append('CreatedBy', userId);

          const filesToUpload = [];
          if (net.attachment?.file) filesToUpload.push(net.attachment.file);
          if (net.excelAttachment?.file) filesToUpload.push(net.excelAttachment.file);

          console.log(
            `networkId=${net.networkId}, filesToUpload count=${filesToUpload.length}`,
            filesToUpload,
          );

          if (filesToUpload.length === 0) {
            console.log('⚠️ No files to upload for this network, skipping fetch.');
            continue;
          }

          filesToUpload.forEach((f) => {
            const extension = f.name.includes('.') ? f.name.substring(f.name.lastIndexOf('.')) : '';
            const baseName = f.name.replace(extension, '');
            const renamed = `${baseName}_${net.networkId}${extension}`;
            console.log(`📎 Renaming ${f.name} → ${renamed}`);

            formData.append('files', f, renamed);
          });

          try {
            console.log('⬆️ Uploading files for', net.name);
            const res = await fetch('/BlazorApi/uploadattachments', {
              method: 'POST',
              body: formData,
            });
            const result = await res.json();
            console.log('✅ Upload result:', result);
          } catch (err) {
            console.error('❌ File upload failed for network:', net.networkId, err);
          }
        }

        console.log('All uploads attempted. Success toast dispatched.');
      } else {
        showToast(res?.message || res?.title, 'error');
      }
    } catch (outerErr) {
      console.error('onSubmit unexpected error:', outerErr);
      showToast(
        outerErr?.message || 'An unexpected error occurred while submitting networks.',
        'error',
      );
    }
  };

  const networkInputFields = getNetworkInputFields(
    networkState,
    handleNetworkSetting,
    networkId,
    organizationId,
  );

  const onSelectTemplate = (t) => {
    if (networkId === 2) {
      // WhatsApp Logic
      console.log({ t });
      if (t?.whatsappTemplate) {
        // 1. Get raw template data

        const rawTemplate = t.whatsappTemplate;
        console.log({ rawTemplate });
        // 2. Generate the defaults immediately
        const initialParams = generateInitialParameters(rawTemplate.components);
        // 3. Create the ONE TRUTH object
        const fullWhatsAppState = {
          templateType: 1, // 1 = Template
          templateName: rawTemplate.name,
          templateLanguage: rawTemplate.language,
          category: rawTemplate.category,
          templateId: rawTemplate.id,
          // Save the structure so the Editor can render the preview without needing 'selectedTemplate'
          components: rawTemplate.components,
          // Save the editable parameters
          parameters: initialParams,
        };

        setWhatsappTemplateType(1);

        setNetworkState((prev) => ({
          ...prev,
          Custom1: '', // Not used for template type
          Custom2: JSON.stringify(fullWhatsAppState), // Save EVERYTHING here
          templateSubject: rawTemplate.language,
          templateTitle: rawTemplate.name,
          whatsappTemplateType: 1,
        }));
        setWhatsappTemplateType(1);
      } else {
        setNetworkState((prev) => ({
          ...prev,
          Custom1: t?.template,
          Custom2: t?.templateJson || '',
          templateSubject: t?.subject || '',
          templateTitle: t?.title || '',
          whatsappTemplateType: 2,
        }));
        setWhatsappTemplateType(2);
      }
    } else {
      // Other Networks Logic (Unchanged)
      setNetworkState((prev) => ({
        ...prev,
        Custom1: t?.template,
        Custom2: t?.templateJson || '',
        templateSubject: t?.subject || '',
        templateTitle: t?.title || '',
      }));
    }

    setshowFilters(true);
  };

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
          onSubmit();
        }

        // TODO: handle this data in your app (e.g., update state, redirect, etc.)
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  const totalPrice = networkList?.reduce((total, item) => total + (item.price || 0), 0);

  return (
    <React.Fragment>
      <PaymentModel
        isOpen={isPaymentOpen}
        toggle={togglePaymentMdl}
        amount={parseFloat(totalPrice)}
        onSubmit={onSubmit}
      />
      {networkSettingsLoading ? (
        <Spinner />
      ) : (
        <Form name={'network-settings-form'}>
          <CRow>
            <CCol className="" md={6}>
              <CustomInput
                label="Name"
                icon={cilUser}
                value={networkState.name}
                onChange={handleNetworkSetting}
                placeholder="Input Campaign Name"
                type="text"
                id="name"
                name="name"
                className="form-control item"
                isRequired={true}
                title="Input Campaign Name"
                message="Enter Campaign Name"
              />
            </CCol>
            <CCol className="" md={6}>
              <CustomInput
                label=" File Upload"
                icon={cilUser}
                // value={networkState.attachment}
                onChange={handleNetworkSetting}
                type="file"
                id="attachment"
                name="attachment"
                placeholder="File Upload"
                className="form-control item"
                isRequired={false}
                src={networkState?.attachment?.src}
                helperText={networkState?.attachment?.name}
                title="File Upload"
              />
            </CCol>
          </CRow>

          <AppContainer>
            <DataGridHeader
              title="Message Template"
              onClick={toggleStock}
              otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
              addButton="Load Template"
              addBtnClick={() => toggleShowTemplateList()}
              filterDisable={true}
            />
            <TemplateListModel
              isOpen={showTemplateList}
              toggle={() => toggleShowTemplateList()}
              onSelect={onSelectTemplate}
              networkId={networkId}
              WABA={networkState?.businessId}
              WAT={networkState?.apiKeySecret}
            />
            {showFilters && (
              <CRow>
                <CCol md={networkState?.networkId === 2 ? 3 : 6}>
                  <CustomInput
                    label="Template Title"
                    icon={cilUser}
                    value={networkState.templateTitle}
                    onChange={handleNetworkSetting}
                    placeholder="Input Template Title"
                    type="text"
                    id="templateTitle"
                    name="templateTitle"
                    className="form-control item"
                    isRequired={true}
                    title="Input Template Title"
                    message="Enter Template Title"
                  />
                </CCol>
                <CCol md={networkState?.networkId === 2 ? 3 : 6}>
                  <CustomInput
                    label={
                      networkId === 2 && whatsappTemplateType == 1
                        ? 'Template Language'
                        : 'Template Subject'
                    }
                    icon={cilUser}
                    value={networkState.templateSubject}
                    onChange={handleNetworkSetting}
                    placeholder={networkId === 2 ? 'e.g., en, en_US' : 'Input Template Subject'}
                    type="text"
                    id="templateSubject"
                    name="templateSubject"
                    className="form-control item"
                    isRequired={networkId === 3 || networkId === 2}
                    title={networkId === 2 ? 'Template Language Code' : 'Input Template Subject'}
                    message={networkId === 2 ? 'Enter Language Code' : 'Enter Template Subject'}
                  />
                </CCol>
                {networkState?.networkId === 2 && (
                  <CCol md={3}>
                    <CustomSelectInput
                      label="Template Type"
                      id="whatsappTemplateType"
                      name="whatsappTemplateType"
                      isRequired={true}
                      options={[
                        { id: 1, name: 'Template' },
                        { id: 2, name: 'Text' },
                      ]}
                      value={whatsappTemplateType}
                      icon={cilUser}
                      onChange={(e) => setWhatsappTemplateType(parseInt(e.target.value, 10) || 1)}
                      className="form-control"
                      message="Select template type"
                      showDisableOption={false}
                    />
                  </CCol>
                )}
                <CCol md={12}>
                  {networkState?.networkId === 2 ? (
                    <>
                      {whatsappTemplateType === 1 ? (
                        <WhatsAppTemplateEditor
                          value={networkState.Custom2 ? JSON.parse(networkState.Custom2) : null}
                          onChange={(updatedFullObject) => {
                            // The Editor gives us the full updated object, we just stringify and save
                            setNetworkState((prev) => ({
                              ...prev,
                              Custom2: JSON.stringify({
                                templateType: 1,
                                ...updatedFullObject,
                              }),
                            }));
                          }}
                        />
                      ) : (
                        <SocialMediaTextEditor
                          networkId={2}
                          value={networkState.Custom1}
                          onChange={(e) => {
                            setNetworkState((prev) => ({ ...prev, Custom1: e }));
                          }}
                          placeholder="WhatsApp text message..."
                        />
                      )}
                    </>
                  ) : networkState?.networkId !== 3 ? (
                    <SocialMediaTextEditor
                      networkId={networkState?.networkId}
                      value={networkState.Custom1}
                      onChange={(e) => {
                        setNetworkState((prev) => ({ ...prev, Custom1: e }));
                      }}
                      placeholder="Message Template..."
                    />
                  ) : (
                    <EmailTextEditor
                      value={networkState.Custom2 ? JSON.parse(networkState.Custom2) : ''}
                      open={showFilters}
                      toggle={toggleStock}
                      onSave={(html, design) => {
                        setNetworkState((prev) => ({
                          ...prev,
                          Custom1: html,
                          Custom2: JSON.stringify(design),
                        }));
                      }}
                      isModal={false}
                    />
                  )}
                </CCol>
              </CRow>
            )}
          </AppContainer>
          {user?.roleId === 1 && ( //!!nneed to make it 1
            <AppContainer>
              <DataGridHeader
                title="Integration Setting"
                onClick={showIntegrationfn}
                otherControls={[{ icon: cilChevronBottom, fn: showIntegrationfn }]}
                filterDisable={true}
              />
              {showIntegration && (
                <>
                  <Inputs
                    inputFields={networkInputFields?.filter(
                      (f) =>
                        f?.label !== 'Unit' &&
                        f?.label !== 'Quota' &&
                        f?.label !== 'Date From' &&
                        f?.label !== 'Price' &&
                        f?.label !== 'Discount' &&
                        f?.label !== 'Package' &&
                        f?.label !== 'Date To',
                    )}
                    isBtn={false}
                  ></Inputs>
                </>
              )}
            </AppContainer>
          )}

          <AppContainer>
            <DataGridHeader
              title="Package Detail"
              onClick={showPackageDetail}
              otherControls={[{ icon: cilChevronBottom, fn: showPackageDetail }]}
              filterDisable={true}
            />
            {showPackageDetails && (
              <Inputs
                inputFields={networkInputFields?.filter(
                  (f) =>
                    f?.label === 'Unit' ||
                    f?.label === 'Quota' ||
                    f?.label === 'Price' ||
                    f?.label === 'Discount' ||
                    f?.label === 'Package' ||
                    f?.label === 'Date From' ||
                    f?.label === 'Date To',
                )}
                isBtn={false}
              ></Inputs>
            )}
          </AppContainer>
          <div className="CenterAlign pt-2 gap-4">
            <Button title="Cancel" onClick={onCancel} disabled={loading} />
            {networkId === 3 &&
              networkState?.smtpserver &&
              networkState?.smtpcredpwd &&
              networkState?.smtpcreduser &&
              networkState?.sender &&
              networkState?.smtpport && (
                <Button title="Test Email" onClick={toggleSendEmailModel} disabled={loading} />
              )}
            <Button title="Save" onClick={onSave} disabled={loading} type="submit" />
            <Button
              title="Submit"
              onClick={() => {
                onSubmit();
                // if (parseInt(networkState?.purchasedQouta || '0') > 0) {
                //   if (networkList.length === 0) {
                //     dispatch(
                //       updateToast({
                //         isToastOpen: true,
                //         toastMessage: 'Save atleast one netrwork settings to submit.',
                //         toastVariant: 'error',
                //       }),
                //     );
                //     return;
                //   }
                //   togglePaymentMdl();
                // } else {
                //   onSubmit();
                // }
              }}
              loading={loading}
              loadingTitle="Submitting..."
            />
            <SendTestEmailModel
              isOpen={showTestEmailModel}
              toggle={toggleSendEmailModel}
              subject="Test Subject"
              title="Send Test Email"
              body="Hi, this is a test email"
              smtpport={networkState?.smtpport}
              smtppswd={networkState?.smtpcredpwd}
              smtpserver={networkState?.smtpserver}
              smtpuser={networkState?.smtpcreduser}
              ssl={!!networkState?.smtpsslenabled}
              sender={networkState?.sender}
            />
          </div>
        </Form>
      )}
    </React.Fragment>
  );
};

export default BlazorNetworkInputs;

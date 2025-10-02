import { cilChevronBottom, cilUser } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import Button from '../UI/Button';
import Form from '../UI/Form';
import SocialMediaTextEditor from '../UI/SocialMediaTextFormatter';
import Spinner from '../UI/Spinner';
import EmailTextEditor from '../UI/email-editor';
import TemplateListModel from '../Modals/TemplateListModel';

dayjs.extend(utc);

const BlazorNetworkInputs = (prop) => {
  const { networkId, setNetworkList, networkList, organizationId } = prop;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const user = useSelector((state) => state.user);

  const [networkState, setNetworkState] = useState(
    getInitialNetworkData(organizationId, user, networkId),
  );
  const [showIntegration, setShowIntegration] = useState(false);
  const [showFilters, setshowFilters] = useState(false);
  const [showTemplateList, setShowTemplateList] = useState(false);

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

      setNetworkState({
        id: data?.id,
        orgId: data?.orgId,
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
        templateSubject: templateData?.subject || '',
        templateTitle: templateData?.title || '',
      });
    } else {
      setNetworkState(getInitialNetworkData(organizationId, user, networkId));
    }
  }, [networkSettingsData]);

  const foundSavedId = networkList?.find((n) => n?.networkId === networkId);

  useEffect(() => {
    if (!foundSavedId) return;
    setNetworkState(foundSavedId);
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

    const updatedState = { ...networkState };

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
        virtualAccount: nl?.virtualAccount ? 1 : 0,
        Custom1: JSON.stringify({
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

        setNetworkList((prev) => {
          const updatedState = { ...networkState, id: res?.data };
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
    setNetworkState((prev) => ({
      ...prev,
      Custom1: t?.template,
      Custom2: t?.templateJson || '',
      templateSubject: t?.subject || '',
      templateTitle: t?.title || '',
    }));

    setshowFilters(true);
  };
  return (
    <React.Fragment>
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
              addBtnClick={toggleShowTemplateList}
              filterDisable={true}
            />
            <TemplateListModel
              isOpen={showTemplateList}
              toggle={toggleShowTemplateList}
              onSelect={onSelectTemplate}
              networkId={networkId}
            />
            {showFilters && (
              <CRow>
                <CCol md={6}>
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
                <CCol md={6}>
                  <CustomInput
                    label="Template Subject"
                    icon={cilUser}
                    value={networkState.templateSubject}
                    onChange={handleNetworkSetting}
                    placeholder="Input Template Subject"
                    type="text"
                    id="templateSubject"
                    name="templateSubject"
                    className="form-control item"
                    isRequired={networkId === 3}
                    title="Input Template Subject"
                    message="Enter Template Subject"
                  />
                </CCol>
                <CCol className="mt-2" md={12}>
                  {networkState?.networkId !== 3 ? (
                    <SocialMediaTextEditor
                      value={networkState.Custom1} // Ensure value is a string
                      onChange={(e) => {
                        setNetworkState((prev) => ({ ...prev, Custom1: e }));
                      }}
                      placeholder="Message Template..."
                    />
                  ) : (
                    <EmailTextEditor
                      value={networkState.Custom2 ? JSON.parse(networkState.Custom2) : ''} // Ensure value is a string
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
          <AppContainer>
            <DataGridHeader
              title="Integration Setting"
              onClick={showIntegrationfn}
              otherControls={[{ icon: cilChevronBottom, fn: showIntegrationfn }]}
              filterDisable={true}
            />
            {showIntegration && (
              <>
                <Inputs inputFields={networkInputFields} isBtn={false}></Inputs>
                {/* <CRow>
                  <CCol md={6}>
                    <label className="form-label fw-bold">Post Types</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {globalutil.postTypes().map((pt) => (
                        <div key={pt.id} style={{ minWidth: '110px' }}>
                          <CFormCheck
                            type="checkbox"
                            id={`postType_${pt.id}`}
                            label={pt.name.charAt(0).toUpperCase() + pt.name.slice(1).toLowerCase()}
                            name="posttypejson"
                            value={pt.id}
                            checked={networkState.posttypejson?.includes(pt.id) || false}
                            onChange={handleNetworkSetting}
                          />
                        </div>
                      ))}
                    </div>
                  </CCol>
                </CRow> */}
              </>
            )}
          </AppContainer>
          <div className="CenterAlign pt-2 gap-4">
            <Button title="Cancel" onClick={onCancel} disabled={loading} />
            <Button title="Save" onClick={onSave} disabled={loading} type="submit" />
            <Button
              title="Submit"
              onClick={onSubmit}
              loading={loading}
              loadingTitle="Submitting..."
            />
          </div>
        </Form>
      )}
    </React.Fragment>
  );
};

export default BlazorNetworkInputs;

import React, { useEffect, useState } from 'react';
import { cilCalendar, cilChevronBottom, cilFace, cilUser } from '@coreui/icons';
import { CCol, CFormCheck, CRow } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { formValidator } from 'src/helpers/formValidator';
import useFetch from 'src/hooks/useFetch';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppContainer from 'src/components/UI/AppContainer';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from '../../util/globalutil';
import RichTextEditor from '../UI/rich-text-editor';
import Button from '../UI/Button';
import SocialMediaTextEditor from '../UI/SocialMediaTextFormatter';

const BlazorNetworkInputs = (prop) => {
  dayjs.extend(utc);
  const { header, networkId, setNetworkList, networkList } = prop;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  // console.log({ networkList });
  const [networkState, setNetworkState] = useState({
    id: 0,
    orgId: user.orgId,
    name: '',
    attachment: '',
    excelAttachment: '',
    buisnessId: '',
    url: '',
    apiuri: '',
    sender: '',
    port: 0,
    apikey: '',
    password: '',
    autoReplyAllowed: 1,
    autoReplyContent: '',
    replyAttachment: '',
    virtualAccount: 0,
    posttypejson: [],
    networkId: networkId,
    rowVer: 0,
    status: 1,
    Custom1: '',
    createdBy: user.userId,
    lastUpdatedBy: user.userId,
    startTime: dayjs().utc().format(),
    finishTime: dayjs().utc().format(),
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().format(),
  });
  const [showIntegration, setShowIntegration] = useState(false);
  const [showFilters, setshowFilters] = useState(false);

  const navigate = useNavigate();
  const {
    response: createNetworkSettingRes,
    loading: createNetworkSettingLoading,
    error: createNetworkSettingError,
    fetchData: createNetworkSetting,
  } = useFetch();
  const loading = createNetworkSettingLoading?.current;
  const foundSavedId = networkList?.find((n) => n?.networkId === networkId);

  useEffect(() => {
    {
      if (!foundSavedId) return;

      setNetworkState(foundSavedId);
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
    // console.log({ name, value, type, checked, files });

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

  //const onSave = () => {
  //  //alert('onsave');
  //  const form = document.querySelector('.service-integration-form');
  //  formValidator();
  //  if (form.checkValidity()) {
  //    setNetworkList((prev) => [...prev, networkState]);
  //    dispatch(
  //      updateToast({
  //        isToastOpen: true,
  //        toastMessage: 'Note : To complete network changes, you need to submit finally',
  //        toastVariant: 'success',
  //      }),
  //    );
  //  }

  //  console.log('networkState', networkState);
  //  // console.log('test');
  //  // setIsLoading(createNetworkSettingLoading.current);
  //};

  const onSave = () => {
    formValidator();
    const form = document.querySelector('.service-integration-form');

    if (form.checkValidity()) {
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

      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'Note : To complete network changes, you need to submit finally',
          toastVariant: 'success',
        }),
      );

      console.log('Updated Network State', updatedState);
    }
  };

  const onSubmit = async () => {
    try {
      console.group('onSubmit - start');
      console.log('networkList (to be POSTed):', networkList);
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
      if (networkList.length > 0) {
        console.log('Posting networkList JSON to /Organization/addupdatenetworksettings ...');
        console.log({ createNetworkSettingLoading });

        await createNetworkSetting('/Organization/addupdatenetworksettings', {
          method: 'POST',
          body: JSON.stringify(networkList),
        });
        console.log('createNetworkSetting called (awaited).');
      } else {
        console.log('No networks to submit (networkList.length === 0).');
      }
      console.log({ createNetworkSettingLoading });

      console.log('createNetworkSettingRes.current:', createNetworkSettingRes.current);

      if (createNetworkSettingRes.current?.status === true) {
        const GlobalPreferenceId = createNetworkSettingRes.current.data;
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

        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createNetworkSettingRes.current.message,
            toastVariant: 'success',
          }),
        );
        console.log('All uploads attempted. Success toast dispatched.');
      } else {
        console.warn(
          'createNetworkSetting returned status !== true:',
          createNetworkSettingRes.current,
        );
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createNetworkSettingRes.current?.message,
            toastVariant: 'error',
          }),
        );
      }
    } catch (outerErr) {
      console.error('onSubmit unexpected error:', outerErr);
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'An unexpected error occurred while submitting networks.',
          toastVariant: 'error',
        }),
      );
    } finally {
      console.groupEnd();
      console.log('onSubmit - end');
    }
  };

  return (
    <React.Fragment>
      {/*<div className="networkTitle mt-2">*/}
      {/*  <h3>{ header}</h3>*/}
      {/*</div>*/}
      <CRow>
        <CCol className="" md={6}>
          <CustomInput
            label="Recipients"
            icon={cilUser}
            value={networkState.name}
            onChange={handleNetworkSetting}
            placeholder="Input Recipients Name"
            type="text"
            id="name"
            name="name"
            className="form-control item"
            isRequired={true}
            title="Input Recipients Name"
            message="Enter Recipients Name"
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
      <CRow>
        {/*<CCol className="" md={2}>*/}
        {/*  <div className="input-group-append mt-4">*/}
        {/*    <input className="importFilebtn" id="upload" type="file" accept="image/*"  />*/}
        {/*  </div>*/}
        {/*</CCol>*/}
      </CRow>

      <AppContainer>
        <DataGridHeader
          title="Message Template"
          onClick={toggleStock}
          otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
          filterDisable={true}
        />
        {showFilters && (
          <CRow>
            <CCol className="" md={12}>
              {networkState?.networkId !== 3 ? (
                <SocialMediaTextEditor
                  value={networkState.Custom1} // Ensure value is a string
                  onChange={(e) => {
                    setNetworkState((prev) => ({ ...prev, Custom1: e }));
                  }}
                  placeholder="Message Template..."
                />
              ) : (
                <RichTextEditor
                  value={networkState.Custom1} // Ensure value is a string
                  onChange={(e) => {
                    // console.log({ e });
                    setNetworkState((prev) => ({ ...prev, Custom1: e }));
                  }}
                  placeholder="Email Template..."
                />
              )}

              {/* <CustomInput
                label=" Excel Upload"
                // value={networkState.excelAttachment.name}
                icon={cilUser}
                onChange={handleNetworkSetting}
                type="file"
                id="excelAttachment"
                name="excelAttachment"
                placeholder="Email Excel  Upload"
                className="form-control item"
                src={networkState?.excelAttachment?.src}
                helperText={networkState?.excelAttachment?.name}
                isRequired={false}
                title=" Excel Bulk Upload"
              /> */}
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
          <CRow>
            <CCol className="" md={6}>
              <CustomInput
                label="Business Id"
                icon={cilUser}
                value={networkState.buisnessId}
                onChange={handleNetworkSetting}
                type="text"
                id="buisnessId"
                name="buisnessId"
                placeholder="Business Id e.g(19288)"
                className="form-control item"
                isRequired={false}
                title="Business Id e.g(19288)"
                // message="Enter Buisness Name"
              />
            </CCol>
            <CCol className="" md={6}>
              <CustomInput
                label="Key"
                icon={cilUser}
                value={networkState.apiKeySecret}
                onChange={handleNetworkSetting}
                type="text"
                id="apiKeySecret"
                name="apiKeySecret"
                placeholder="API Key Secret e.g(uk08l00**)"
                className="form-control item"
                isRequired={false}
                title="API Key Secret e.g(uk08l00**)"
                message="Enter API Key Secret"
              />
            </CCol>
            <CCol className="" md={6}>
              <CustomInput
                label="API Url"
                icon={cilUser}
                value={networkState.apiuri}
                onChange={handleNetworkSetting}
                type="text"
                id="apiuri"
                name="apiuri"
                placeholder="API Url e.g(https:/api.example.com)"
                className="form-control item"
                isRequired={false}
                title="API Url e.g(https:/api.example.com)"
                message="Enter API Url"
              />
            </CCol>
            <CCol className="" md={6}>
              <CustomInput
                label="Url"
                icon={cilUser}
                value={networkState.url}
                onChange={handleNetworkSetting}
                type="text"
                id="url"
                name="url"
                placeholder="Url e.g (https:/api.example.com)"
                className="form-control item"
                isRequired={false}
                title="Url e.g (https:/api.example.com) "
                message="Enter Url"
              />
            </CCol>

            <CCol className="" md={6}>
              <CustomInput
                label="Unit"
                icon={cilUser}
                value={networkState.unitId}
                onChange={handleNetworkSetting}
                type="number"
                id="unitId"
                name="unitId"
                placeholder="Enter Unit e.g (40)"
                className="form-control item"
                isRequired={false}
                title="Enter Unit e.g (40)"
                message="Enter Unit "
              />
            </CCol>

            <CCol className="" md={6}>
              <CustomInput
                label="Quota"
                icon={cilUser}
                value={networkState.purchasedQouta}
                onChange={handleNetworkSetting}
                type="number"
                id="purchasedQouta"
                name="purchasedQouta"
                placeholder="Purchased Qouta e.g (1000)"
                className="form-control item"
                isRequired={false}
                title="Purchased Qouta e.g (1000 Quantity Purchased)"
                message="Enter Purchased Qouta"
              />
            </CCol>
            {networkId == 3 && (
              <>
                <CCol className="" md={6}>
                  <CustomInput
                    label="SMTP Server"
                    icon={cilUser}
                    value={networkState.buisnessId}
                    onChange={handleNetworkSetting}
                    type="text"
                    id="buisnessId"
                    name="buisnessId"
                    placeholder="SMTP Server"
                    className="form-control item"
                    isRequired={false}
                    title="SMTP Server "
                    // message="Enter Buisness Name"
                  />
                </CCol>
                <CCol className="" md={6}>
                  <CustomInput
                    label="POP Server"
                    icon={cilUser}
                    value={networkState.popServer}
                    onChange={handleNetworkSetting}
                    type="text"
                    id="popServer"
                    name="popServer"
                    placeholder="POP Server"
                    className="form-control item"
                    isRequired={false}
                    title="POP Server"
                    // message="Enter Buisness Name"
                  />
                </CCol>

                <CCol className="" md={6}>
                  <CustomInput
                    label="Port"
                    icon={cilUser}
                    value={networkState.port}
                    onChange={handleNetworkSetting}
                    type="number"
                    id="port"
                    name="port"
                    placeholder="Port"
                    className="form-control item"
                    isRequired={false}
                    title="Port ex. 9003 "
                    // message="Enter Buisness Name"
                  />
                </CCol>
                <CCol className="" md={6}>
                  <CustomInput
                    label="Sender"
                    icon={cilUser}
                    value={networkState.sender}
                    onChange={handleNetworkSetting}
                    type="text"
                    id="sender"
                    name="sender"
                    placeholder="Sender Email Account"
                    className="form-control item"
                    isRequired={false}
                    title="Sender Email Account "
                    // message="Enter Buisness Name"
                  />
                </CCol>
                <CCol className="" md={6}>
                  <CustomInput
                    label="Mail Server Email Account"
                    icon={cilUser}
                    value={networkState.serverEmail}
                    onChange={handleNetworkSetting}
                    type="text"
                    id="serverEmail"
                    name="serverEmail"
                    placeholder="Mail Server Email Account"
                    className="form-control item"
                    isRequired={false}
                    title="Mail Server Email Account "
                    // message="Enter Buisness Name"
                  />
                </CCol>
                <CCol className="" md={6}>
                  <CustomInput
                    label=" Password"
                    icon={cilUser}
                    value={networkState.password}
                    onChange={handleNetworkSetting}
                    type="text"
                    id="password"
                    name="password"
                    placeholder="Account Password"
                    className="form-control item"
                    isRequired={false}
                    title="Account Password "
                    // message="Enter Buisness Name"
                  />
                </CCol>
              </>
            )}
            <CCol className="" md={6}>
              <CustomDatePicker
                icon={cilCalendar}
                label="Date From "
                id="startTime"
                name="startTime"
                value={networkState.startTime}
                title="Date From "
                onChange={(e) => handleNetworkSetting(e, 'startTime')}
              />
            </CCol>
            <CCol className="" md={6}>
              <CustomDatePicker
                icon={cilCalendar}
                label="Date To "
                id="finishTime"
                name="finishTime"
                value={networkState.finishTime}
                title="Date To "
                onChange={(e) => handleNetworkSetting(e, 'finishTime')}
              />
            </CCol>
            <CCol className="mg-topset" md={3}>
              <CFormCheck
                className=""
                id="autoReplyAllowed"
                label="Auto Reply Message"
                defaultChecked
                value={networkState.autoReplyAllowed}
                name="autoReplyAllowed"
              />
            </CCol>
            <CCol className="" md={3}>
              <CustomInput
                label="Auto Reply Message"
                icon={cilUser}
                value={networkState.autoReplyContent}
                onChange={handleNetworkSetting}
                type="text"
                id="autoReplyContent"
                name="autoReplyContent"
                placeholder="Auto Reply Message"
                className="form-control item"
                isRequired={false}
                title="Auto Reply Message"
                // message="Enter Buisness Name"
              />
            </CCol>
            <CCol className="" md={6}>
              <CustomSelectInput
                label="Auto Reply Attachment"
                icon={cilUser}
                value={networkState.replyAttachment}
                onChange={handleNetworkSetting}
                type="text"
                id="replyAttachment"
                name="replyAttachment"
                placeholder="Auto Reply Attachment"
                disableOption="Select Auto Reply Attachment"
                className="form-control item"
                isRequired={false}
                title="Auto Reply Attachment "
                // message="Enter Buisness Name"
              />
            </CCol>
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

            <CCol className="mg-topset" md={3}>
              <CFormCheck
                className=""
                value={networkState.virtualAccount}
                // onChange={handleNetworkSetting}
                id="virtualAccount"
                name="virtualAccount"
                label="Virtual Account"
                defaultChecked
              />
            </CCol>
            <CCol className="mg-topset" md={3}>
              <CFormCheck
                className=""
                id="status"
                label="Status"
                defaultChecked
                value={networkState.status}
                name="status"
              />
            </CCol>
          </CRow>
        )}
      </AppContainer>
      <div className="CenterAlign pt-2 gap-4">
        <Button title="Cancel" onClick={onCancel} disabled={loading} />
        <Button title="Save" onClick={onSave} disabled={loading} />
        <Button
          type="submit"
          title="Submit"
          onClick={onSubmit}
          loading={loading}
          loadingTitle="Submitting..."
        />

        {/* <button
          onClick={() => onCancel()}
          type="button"
          className="btn btn_Default m-2 sales-btn-style"
        >
        </button>

        <button onClick={onSave} type="submit" className="btn btn_Default m-2 sales-btn-style">
          Save
        </button>
        <button type="submit" className="btn btn_Default sales-btn-style m-2" onClick={onSubmit}>
          Submit
        </button> */}
      </div>
    </React.Fragment>
  );
};

export default BlazorNetworkInputs;

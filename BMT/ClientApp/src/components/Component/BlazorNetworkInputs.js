import React, { useEffect, useState } from 'react';
//import { CFormSwitch } from '@coreui/react';
import { CCol, CContainer, CRow } from '@coreui/react';
import useFetch from 'src/hooks/useFetch';
import { formValidator } from 'src/helpers/formValidator';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { useSelector } from 'react-redux';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { CFormCheck } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  cilUser,
  cilCloudDownload,
  cilCalendar,
  cilChevronBottom,
  cilFlagAlt,
} from '@coreui/icons';
//import { useShowToast } from 'src/hooks/useShowToast';
//import { getDaInventoryCols } from 'src/configs/ColumnsConfig/daInventoryCols';
//import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
//import CustomSearch from 'src/components/InputsComponent/CustomSearch';
//import Loading from 'src/components/UI/Loading';
//import DaNewAssignment from 'src/components/Component/DaNewAssignment';
//import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import Button from 'src/components/InputsComponent/Button';
//import LoadingBtn from 'src/components/UI/LoadingBtn';
import AppContainer from 'src/components/UI/AppContainer';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from '../../util/globalutil';
const BlazorNetworkInputs = (prop) => {
  dayjs.extend(utc);
  const { header, networkId, setNetworkList, networkList } = prop
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [networkState, SetNetworkState] = useState({
    id:0,
    orgId: user.orgId,
    name: '',
   // attachment: '',
   // excelAttachment: '',
    buisnessId: '',
    url: "",
    apiuri: "",
    sender: "",
    port:0,
    apikey: "",
    password: "",
    autoReplyAllowed: 1,
    autoReplyContent: "",
    replyAttachment: "",
    virtualAccount: 0,
    posttypejson: [],
    networkId: networkId,
    rowVer: 0,
    status: 1,
    createBy: user.Id,
    lastUpdatedBy: user.Id,
    startTime: dayjs().utc().format(),
    finishTime: dayjs().utc().format(),
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().format()
  })
  const [showIntegration, setShowIntegration] = useState(false);
  const [showFilters, setshowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    response: createNetworkSettingRes,
    loading: createNetworkSettingLoading,
    error: createNetworkSettingError,
    fetchData: createNetworkSetting,
  } = useFetch();
  const handleNetworkSetting = (e, label) => {
    const { name, value, type, checked } = e.target;

    if (label === 'startTime' || label === 'finishTime') {
      SetNetworkState((prev) => ({
        ...prev,
        [label]: e,
      }));
    } else if (name === 'posttypejson') {
      const postTypeId = parseInt(value);
      SetNetworkState((prev) => {
        const selected = Array.isArray(prev.posttypejson) ? prev.posttypejson : [];
        const updated = checked
          ? [...selected, postTypeId]  // Add
          : selected.filter((id) => id !== postTypeId); // Remove
        return { ...prev, posttypejson: updated };
      });
    } else if (type === 'checkbox') {
      SetNetworkState((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === 'number' && value !== '') {
      SetNetworkState((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      SetNetworkState((prev) => ({
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
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    SetNetworkState([]);
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const onSave = () => {
    //alert('onsave');
    const form = document.querySelector('.service-integration-form');
    formValidator();
    if (form.checkValidity()) {
      setNetworkList((prev) => [...prev, networkState])
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage:"Note : To complete network changes, you need to submit finally",
          toastVariant: 'success',
        }),
      );
    }

    console.log("networkState", networkState);
   // console.log('test');
   // setIsLoading(createNetworkSettingLoading.current);
  }
  const onSubmit = async () => {
   // alert(JSON.stringify(networkList));
    if (networkList.length > 0) {
     //alert(JSON.stringify(networkList));
      await createNetworkSetting('/Organization/addupdatenetworksettings', {
        method: 'POST',
        body: JSON.stringify(networkList),
      });

    }
    //console.log(createNetworkSettingRes);
    if (createNetworkSettingRes.current?.status === true) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: createNetworkSettingRes.current.message,
          toastVariant: 'success',
        }),
      );
      //navigate('/ServiceIntegrated');
      //getServices();
      //setSetNetworkState();
      // toggle();
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: createNetworkSettingRes.current?.message,
          toastVariant: 'error',
          //  `${JSON.stringify(createUserRes.current.message)}`,
        }),
      );

      setIsLoading(createNetworkSettingLoading.current);
    }
  }
   
     
  //};


  return <React.Fragment>
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
          label="Email Excel Bulk Upload"
          icon={cilUser}
          value={networkState.attachment}
          onChange={handleNetworkSetting}
          type="file"
          id="attachment"
          name="attachment"
          placeholder="Email Excel Bulk Upload"
          className="form-control item"
          isRequired={false}
          title="Email Excel Bulk Upload"
        // message="Enter Buisness Name"
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
          <CustomInput
            label="Attachment"
            icon={cilUser}
            value={networkState.excelAttachment }
            type="file"
            id="excelAttachment"
            name="excelAttachment"
            className="form-control item"
            isRequired={false}
            title="Choose Image For Attachment "
          // message="Enter Buisness Name"
          />
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
              id="apikeySecret"
              name="apikeySecret" 
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
            id="EmaildtpFrom"
            name="startTime"
            value={networkState.startTime}
            title="Date From "
            onChange={(e) => handleNetworkSetting(e,'startTime')}
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
            disableOption='Select Auto Reply Attachment'
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
                    label={
                      pt.name.charAt(0).toUpperCase() + pt.name.slice(1).toLowerCase()
                    }
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
    <div className="CenterAlign pt-2">
      <button
        onClick={() => onCancel()}
        type="button"
        className="btn btn_Default m-2 sales-btn-style"
      >
        Cancel
      </button>

      <button
        onClick={onSave}
        type="submit"
        className="btn btn_Default m-2 sales-btn-style"
      >
        Save
      </button>
      <button
        type="submit"
        className="btn btn_Default sales-btn-style m-2"
        onClick={onSubmit}
      >
        Submit
      </button>
    </div>

  </React.Fragment>
}

export default BlazorNetworkInputs

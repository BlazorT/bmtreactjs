import React, { useEffect, useState } from 'react';
import { CFormSwitch } from '@coreui/react';
import { CCol, CContainer, CRow } from '@coreui/react';
import useFetch from 'src/hooks/useFetch';
import { formValidator } from 'src/helpers/formValidator';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';

import { useSelector } from 'react-redux';
import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { CFormCheck } from '@coreui/react';
import NetworkInput from 'src/components/Component/NetworkInputs'
import moment from 'moment';
import {
  cilUser,
  cilCloudDownload,
  cilCalendar,
  cilChevronBottom,
  cilFlagAlt,
} from '@coreui/icons';
import { useShowToast } from 'src/hooks/useShowToast';
import { getDaInventoryCols } from 'src/configs/ColumnsConfig/daInventoryCols';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import CustomSearch from 'src/components/InputsComponent/CustomSearch';
import Loading from 'src/components/UI/Loading';
import DaNewAssignment from 'src/components/Component/DaNewAssignment';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import Button from 'src/components/InputsComponent/Button';
import LoadingBtn from 'src/components/UI/LoadingBtn';
import AppContainer from 'src/components/UI/AppContainer';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from '../../util/globalutil';
const NetworkInputs = (prop) => {
  const { header, networkId, setNetworkList, networkList } = prop
  const dispatch = useDispatch();

  const [networkState, setSetNetworkState] = useState({
    id:0,
    orgId:0,
    name: '',
   // attachment: '',
   // excelAttachment: '',
    buisnessId: '',
    url: "",
    aPIURI: "",
    sender: "",
    //serverEmail: "",
    password: "",
    autoReplyAllowed: 1,
    autoReplyContent: "",
    replyAttachment: "",
    postTypeId: 1,
    virtualAccount: 0,
    networkId: networkId,
    rowVer: 0,
    status: 0,
    startTime: moment().utc().format(),
    finishTime: moment().utc().format(),
    createdAt: moment().utc().startOf('month').format(),
    lastUpdatedAt: moment().utc().format(),
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
    if (label == 'startTime' || label == 'finishTime') {
      setSetNetworkState((prev) => ({
        ...prev,
        [label]: e,
      }));
    } else {

      const { name, value, type,checked } = e.target
    setSetNetworkState((prev) => ({
      ...prev,
      [name]:type=='checkbox'?checked: value,
    }));
    }
  }
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
    setSetNetworkState([]);
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const onSave =  () => {
    const form = document.querySelector('.service-integration-form');
    formValidator();
    if (form.checkValidity()) {
      setNetworkList((prev) => [...prev, networkState])
    }
    console.log('test');
   // setIsLoading(createNetworkSettingLoading.current);
  }
  const onSubmit = async () => {
    console.log({networkList});
    if (networkList.length > 0) {
      await createNetworkSetting('/Organiaztion/addupdatenetworksettings', {
        method: 'POST',
        body: JSON.stringify(networkList),
      });

    }
    console.log(createNetworkSettingRes);
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
    <div className="networkTitle mt-2">
      <h3>{ header}</h3>
    </div>
    <CRow>
      <CCol className="" md={12}>
        <CustomInput
          label="Recipients"
          icon={cilUser}
          value={networkState.name}
          onChange={handleNetworkSetting}
          placeholder="input recipients name"
          type="text"
          id="name"
          name="name"
          className="form-control item"
          isRequired={false}
          title="recipients name "
        // message="Enter Buisness Name"
        />
      </CCol>

    </CRow>
    <CRow>
      <CCol className="" md={8}>
        <CustomInput
          label="Email Excel Bulk Upload"
          icon={cilUser}
          value={networkState.attachment}
          onChange={handleNetworkSetting}
          type="file"
          id="attachment"
          name="attachment"
          placeholder="Email excel bulk upload"
          className="form-control item"
          isRequired={false}
          title="Email excel Bulk Upload "
        // message="Enter Buisness Name"
        />
      </CCol>
      <CCol className="" md={4}>
        <div className="input-group-append mt-4">
          <button className="btn btn-primary btn-Regular btn-round btn-outline-secondary" type="button" id="EmailbtnImport">Import</button>
        </div>
      </CCol>
    </CRow>

    <DataGridHeader
      title="Message Template"
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
            title="choose image for attachment "
          // message="Enter Buisness Name"
          />
        </CCol>

      </CRow>
    )}
    <DataGridHeader
      title="Integration Setting"
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
            placeholder="SMTP Server"
            className="form-control item"
            isRequired={false}
            title="SMTP Server "
          // message="Enter Buisness Name"
          />
 
        </CCol>
        <CCol className="" md={6}>
          <CustomInput
            label="Key"
            icon={cilUser}
            value={networkState.aPIKeySecret}
            onChange={handleNetworkSetting}
            type="text"
            id="aPIKeySecret"
            name="aPIKeySecret"
            placeholder="API Key Secret"
            className="form-control item"
            isRequired={false}
            title="API Key Secret "
            message="Enter API Key Secret"
          />
        </CCol>
        <CCol className="" md={6}>
          <CustomInput
            label="API Url"
            icon={cilUser}
            value={networkState.aPIURI}
            onChange={handleNetworkSetting}
            type="text"
            id="aPIURI"
            name="aPIURI"
            placeholder="API url"
            className="form-control item"
            isRequired={false}
            title="API url "
            message="Enter API url"
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
            placeholder="url"
            className="form-control item"
            isRequired={false}
            title="url "
            message="Enter url"
          />
        </CCol>
       
        <CCol className="" md={6}>
          <CustomInput
            label="Unit"
            icon={cilUser}
            value={networkState.unitId}
            onChange={handleNetworkSetting}
            type="text"
            id="unitId"
            name="unitId"
            placeholder="unit id"
            className="form-control item"
            isRequired={false}
            title="unit Id "
            message="Enter unit Id"
          />
        </CCol>
        <CCol className="mt-3" md={6}>
          <label className="login_label labelName">Status</label>
          <CFormSwitch />
        </CCol>
        <CCol className="" md={6}>
          <CustomInput
            label="Quota"
            icon={cilUser}
            value={networkState.purchasedQouta}
            onChange={handleNetworkSetting}
            type="text"
            id="purchasedQouta"
            name="purchasedQouta"
            placeholder="purchased qouta"
            className="form-control item"
            isRequired={false}
            title="purchased Qouta"
            message="Enter purchased Qouta"
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
            placeholder="POP server"
            className="form-control item"
            isRequired={false}
            title="POP server"
          // message="Enter Buisness Name"
          />
        </CCol>

        <CCol className="" md={6}>
          <CustomInput
            label="Port URI"
            icon={cilUser}
            value={networkState.portUri}
            onChange={handleNetworkSetting}
            type="text"
            id="portUri"
            name="portUri"
            placeholder="Port URI"
            className="form-control item"
            isRequired={false}
            title="Port URI "
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
        <CCol className="mt-4" md={3}>
          <CFormCheck
            className=""
            id="autoReplyAllowed"
            label="Auto reply message"
            defaultChecked
            value={networkState.autoReplyAllowed}
            name="autoReplyAllowed"
          />

        </CCol>
        <CCol className="" md={3}>
          <CustomInput
            label="Auto reply message"
            icon={cilUser}
            value={networkState.autoReplyContent}
            onChange={handleNetworkSetting}
            type="text"
            id="autoReplyContent"
            name="autoReplyContent"
            placeholder="auto reply message"
            className="form-control item"
            isRequired={false}
            title="auto reply message "
          // message="Enter Buisness Name"
          />
        </CCol>
        <CCol className="" md={6}>
          <CustomSelectInput
            label="Auto reply Attachment"
            icon={cilUser}
            value={networkState.replyAttachment}
            onChange={handleNetworkSetting}
            type="text"
            id="replyAttachment"
            name="replyAttachment"
            placeholder="auto reply attachment"
            className="form-control item"
            isRequired={false}
            title="auto reply attachment "
          // message="Enter Buisness Name"
          />
        </CCol>
        
        <CCol className="" md={6}>
          <CustomSelectInput
            label="Post Type"
            icon={cilUser}
            value={networkState.postTypeId}
            onChange={handleNetworkSetting}
          
            type="text"
            id="postTypeId"
            name="postTypeId"
            placeholder="post type"
            className="form-control item"
            isRequired={false}
            title="post type "
          // message="Enter Buisness Name"
          />
        </CCol>
          
        <CCol className="mt-4" md={6}>
          <CFormCheck
            className=""
            value={networkState.virtualAccount}
            onChange={handleNetworkSetting}
            id="virtualAccount"
            name="virtualAccount"
            label="Virtual Account"
            defaultChecked
          />
        </CCol>
      </CRow>
    )}
    <div className="CenterAlign pt-2">
      <button
        onClick={() => onCancel()}
        type="button"
        className="btn btn_Default m-2 sales-btn-style"
      >
        Cancel
      </button>

      <button
        onClick={ onSave}
        type="submit"
        className="btn btn_Default m-2 sales-btn-style"
      >
        save
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

export default NetworkInputs
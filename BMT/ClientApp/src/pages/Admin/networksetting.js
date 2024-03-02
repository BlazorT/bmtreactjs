/* eslint-disable react/prop-types */
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

const SingleDispatchment = () => {
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(0);
  const [networkSelect, setNetworkSelect] = useState(0);
  const [dataList, setdataList] = useState([]);
  const tabs = ['Email', 'SMS','Whatsapp','Twitter','Facebook','Instagram','LinkedIn','TikTok','SnapChat'];
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFilters, setshowFilters] = useState(false);
  const [showIntegration, setShowIntegration] = useState(false);
  const {
    response: createNetworkSettingRes,
    loading: createNetworkSettingLoading,
    error: createNetworkSettingError,
    fetchData: createNetworkSetting,
  } = useFetch();

  const initialData = {
    id: 0,
    orgId: 0,
    networkId:1,
    rowVer: 0,
    status: 0,
    createdAt: moment().utc().startOf('month').format(),
    lastUpdatedAt: moment().utc().format(),
    startTime: moment().utc().format(),
    finishTime: moment().utc().format(),
  };

  const [networkSettingData, setNetworkSettingData] = useState(initialData);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const onSave = async () => {
    const form = document.querySelector('.service-integration-form');
    formValidator();
    if (form.checkValidity()) {
      alert('valid');
      //const networkSetting = {
      //  id: networkSettingData.id,
      //  name: networkSettingData.emailrecipients,
      //  serviceUri: networkSettingData.EmailexcelBulkUpload,
      //  businessId: networkSettingData.EmailBusinessId,
      //  url: networkSettingData.EmailUrl,
      //  sender: networkSettingData.Emailsender,
      //  password: networkSettingData.AccountPaswrd,
      //  startTime: networkSettingData.EmaildtpFrom,
      //  finishTime: networkSettingData.EmaildtpTo,
      //  autoReplyAllowed: networkSettingData.EmailAutoReplycheck16,
      //  autoReplyContent: networkSettingData.emailautoreply,
      //  postTypeId: networkSettingData.EmailPostType,
      //  status: networkSettingData.status === '' ? 5 : networkSettingData.status,
      //  rowVer: networkSettingData.rowVer,
      //  createdAt: moment().utc().format(),
      //  lastUpdatedAt: moment().utc().format(),
      //};
      console.log((networkSelect +" , " + (globalutil.networks().filter((network) => network.name == 'EMAIL')[0].id)), 'networks');
      if (networkSelect == (globalutil.networks().filter((network) => network.name == 'EMAIL')[0].id)) {
        setdataList([
          ...dataList,
          {
            id: networkSettingData.id,
            networkId: networkSelect,
            name: networkSettingData.emailrecipients,
            serviceUri: networkSettingData.EmailexcelBulkUpload,
            businessId: networkSettingData.EmailBusinessId,
            url: networkSettingData.EmailUrl,
            sender: networkSettingData.Emailsender,
            password: networkSettingData.AccountPaswrd,
            startTime: networkSettingData.EmaildtpFrom,
            finishTime: networkSettingData.EmaildtpTo,
            autoReplyAllowed: networkSettingData.EmailAutoReplycheck16,
            autoReplyContent: networkSettingData.emailautoreply,
            postTypeId: networkSettingData.EmailPostType,
            status: networkSettingData.status === '' ? 5 : networkSettingData.status,
            rowVer: networkSettingData.rowVer,
            createdAt: moment().utc().format(),
            lastUpdatedAt: moment().utc().format(),

          }
        ]);
        alert('after save');

      }

    }
      setIsLoading(createNetworkSettingLoading.current);
      await createNetworkSetting('/Organiaztion/addupdatenetworksettings', {
        method: 'POST',
       // body: JSON.stringify(networkSetting),
      });
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
        setNetworkSettingData(initialData);
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
   // }
  };
  const toggleStock = () => {
    setshowFilters((prev) => !prev);
  };
  const showIntegrationfn = () => {
    setShowIntegration((prev) => !prev);
  };
  const handleNetworkSetting = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setNetworkSettingData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };
  const handleTabSelectionChange = (event) => {
   // alert((event));
    setNetworkSelect(event);
    //setActiveTab();
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
    setNetworkSettingData(initialData);
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  return (
    <AppContainer>
      <form
        className="needs-validation service-integration-form"
        onSubmit={handleSubmit}
        noValidate
      >
      <CRow>
        <CCol className="" md={12}>
          <CustomInput
            label="Organization"
            icon={cilUser}
            type="text"
            id="keyword"
            placeholder="organization"
            name="keyword"
            className="form-control item"
            isRequired={false}
            title="choose image for attachment "
          // message="Enter Buisness Name"
          />
        </CCol>

      </CRow>

      <FleetDashboardTabs
        title="Networks"
        fleetTabs={tabs}
        activeTab={activeTab}
          handleActiveTab={setActiveTab}
      />
      
      {isLoading ? (
        <Loading />
      ) : (
        <CContainer fluid className="m-0 p-0 mt-1">
            {tabs[activeTab] === 'Email' && (
              <React.Fragment>
                <div className="networkTitle mt-2">
                  <h3>Email</h3>
                </div>
                <CRow>
                  <CCol className="" md={12}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.emailrecipients}
                      onChange={handleNetworkSetting}
                      placeholder="input recipients"
                      type="text"
                      id="recipients"
                      name="recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
                    // message="Enter Buisness Name"
                    />
                  </CCol>

                </CRow>
                <CRow>
                  <CCol className="" md={8}>
                    <CustomInput
                      label="Email Excel Bulk Upload"
                      icon={cilUser}
                      value={networkSettingData.EmailexcelBulkUpload}
                      onChange={handleNetworkSetting}
                      type="file"
                      id="recipients"
                      name="EmailexcelBulkUpload"
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
                          type="file"
                          id="keyword"
                          name="keyword"
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
                        label="SMTP Server"
                        icon={cilUser}
                        value={networkSettingData.EmailBusinessId}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="emailbusinessId"
                        name="EmailBusinessId"
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
                        value={networkSettingData.EmailPopServer}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="key"
                        name="EmailPopServer"
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
                        value={networkSettingData.EmailUrl}
                          onChange={handleNetworkSetting}
                          type="text"
                          id="apiuri"
                        name="EmailUrl"
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
                          value={networkSettingData.EmailSender}
                          onChange={handleNetworkSetting}
                          type="text"
                          id="sender"
                          name="EmailSender"
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
                        value={networkSettingData.MailServerAccount}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="MailServerAccount"
                        name="MailServerAccount"
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
                        value={networkSettingData.AccountPaswrd}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="AccountPaswrd"
                        name="AccountPaswrd"
                        placeholder="Account Password"
                        className="form-control item"
                        isRequired={false}
                        title="Account Password "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date From "
                        id="EmaildtpFrom"
                        name="EmaildtpFrom"
                        value={networkSettingData.EmaildtpFrom}
                        title="Date From "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="EmaildtpTo"
                        name="EmaildtpTo"
                        value={networkSettingData.EmaildtpTo}
                        title="Date To "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="mt-4" md={3}>
                      <CFormCheck
                        className=""
                        id="flexNotificationChecked"
                        label="Auto reply message"
                        defaultChecked
                        value={networkSettingData.EmailAutoReplycheck16}
                        name="EmailAutoReplycheck16"
                      />
                     
                    </CCol>
                    <CCol className="" md={3}>
                      <CustomInput
                        label="Auto reply message"
                        icon={cilUser}
                        value={networkSettingData.emailautoreply}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="emailautoreply"
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
                        value={networkSettingData.emailautoreplyattachment}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="emailautoreplyattachment"
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
                        value={networkSettingData.EmailPostType}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="postType"
                        name="EmailPostType"
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
                        value={networkSettingData.EmailvirtualAccount}
                        onChange={handleNetworkSetting}
                        id="flexNotificationChecked"
                        name="EmailvirtualAccount"
                        label="Virtual Account"
                        defaultChecked
                      />
                    </CCol>
                  </CRow>
                



                )}

              </React.Fragment>

            )}
            {tabs[activeTab] === 'SMS' && (
              <React.Fragment>
                <div className="networkTitle mt-2">
                <h3>SMS</h3>
                </div>
                <CRow>
                  <CCol className="" md={12}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      placeholder="input recipients"
                      type="text"
                      id="SMSName"
                      name="recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
                    // message="Enter Buisness Name"
                    />
                  </CCol>

                </CRow>
                <CRow>
                  <CCol className="" md={8}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      type="file"
                      id="recipients"
                      name="recipients"
                      placeholder="input recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients"
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
                        type="file"
                        id="keyword"
                        name="keyword"
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
                        value={networkSettingData.businessId}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="smsbusinessId"
                        name="businessId"
                        placeholder="input recipients"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Key"
                        icon={cilUser}
                        value={networkSettingData.key}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="key"
                        name="key"
                        placeholder="key"
                        className="form-control item"
                        isRequired={false}
                        title="key "
                      // message="Enter Buisness Name"
                      />
                    </CCol>

                    <CCol className="" md={6}>
                      <CustomInput
                        label="Api URI"
                        icon={cilUser}
                        value={networkSettingData.apiuri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="apiuri"
                        name="apiuri"
                        placeholder="api uri"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="URI"
                        icon={cilUser}
                        value={networkSettingData.uri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="uri"
                        name="uri"
                        placeholder="uri"
                        className="form-control item"
                        isRequired={false}
                        title="uri "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Unit"
                        icon={cilUser}
                        value={networkSettingData.unit}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="unit"
                        className="form-control item"
                        isRequired={false}
                        title="unit "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Quota"
                        icon={cilUser}
                        value={networkSettingData.quota}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="quota"
                        name="quota"
                        placeholder="quota"
                        className="form-control item"
                        isRequired={false}
                        title="quota "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date From "
                        id="createdAt"
                        name="createdAt"
                        value={networkSettingData.datefrom}
                        title="Date From "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="dateTo"
                        name="dateTo"
                        value={networkSettingData.dateTo}
                        title="Date To "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="mt-4" md={3}>
                      <CFormCheck
                        className=""
                        id="flexNotificationChecked"
                        label="Auto reply message"
                        defaultChecked

                      />

                    </CCol>
                    <CCol className="" md={3}>
                      <CustomInput
                        label="Auto reply message"
                        icon={cilUser}
                        value={networkSettingData.autoreply}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreply"
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
                        value={networkSettingData.autoreplyattachment}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreplyattachment"
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
                        value={networkSettingData.postType}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="postType"
                        name="postType"
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
                        id="flexNotificationChecked"
                        label="Virtual Account"
                        defaultChecked

                      />

                    </CCol>
                  </CRow>
                )}

              </React.Fragment>
            )}
            {tabs[activeTab] === 'Whatsapp' && (
              <React.Fragment>
                <div className="networkTitle mt-2">
                  <h3>Whatsapp</h3>
                </div>
                <CRow>
                  <CCol className="" md={12}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      placeholder="input recipients"
                      type="text"
                      id="recipients"
                      name="recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
                    // message="Enter Buisness Name"
                    />
                  </CCol>

                </CRow>
                <CRow>
                  <CCol className="" md={8}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      type="file"
                      id="recipients"
                      name="recipients"
                      placeholder="input recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
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
                        type="file"
                        id="keyword"
                        name="keyword"
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
                        value={networkSettingData.businessId}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="smsbusinessId"
                        name="businessId"
                        placeholder="input recipients"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Key"
                        icon={cilUser}
                        value={networkSettingData.key}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="key"
                        name="key"
                        placeholder="key"
                        className="form-control item"
                        isRequired={false}
                        title="key "
                      // message="Enter Buisness Name"
                      />
                    </CCol>

                    <CCol className="" md={6}>
                      <CustomInput
                        label="Api URI"
                        icon={cilUser}
                        value={networkSettingData.apiuri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="apiuri"
                        name="apiuri"
                        placeholder="api uri"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="URI"
                        icon={cilUser}
                        value={networkSettingData.uri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="uri"
                        name="uri"
                        placeholder="uri"
                        className="form-control item"
                        isRequired={false}
                        title="uri "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Unit"
                        icon={cilUser}
                        value={networkSettingData.unit}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="unit"
                        className="form-control item"
                        isRequired={false}
                        title="unit "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Quota"
                        icon={cilUser}
                        value={networkSettingData.quota}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="quota"
                        name="quota"
                        placeholder="quota"
                        className="form-control item"
                        isRequired={false}
                        title="quota "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date From "
                        id="createdAt"
                        name="createdAt"
                        value={networkSettingData.datefrom}
                        title="Date From "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="dateTo"
                        name="dateTo"
                        value={networkSettingData.dateTo}
                        title="Date To "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="mt-4" md={3}>
                      <CFormCheck
                        className=""
                        id="flexNotificationChecked"
                        label="Auto reply message"
                        defaultChecked

                      />

                    </CCol>
                    <CCol className="" md={3}>
                      <CustomInput
                        label="Auto reply message"
                        icon={cilUser}
                        value={networkSettingData.autoreply}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreply"
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
                        value={networkSettingData.autoreplyattachment}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreplyattachment"
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
                        value={networkSettingData.postType}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="postType"
                        name="postType"
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
                        id="flexNotificationChecked"
                        label="Virtual Account"
                        defaultChecked

                      />

                    </CCol>
                  </CRow>
                )}

              </React.Fragment>
            )}
                        {tabs[activeTab] === 'Twitter' && (
              <React.Fragment>
                <div className="networkTitle mt-2">
                  <h3>Twitter</h3>
                </div>
                <CRow>
                  <CCol className="" md={12}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      placeholder="input recipients"
                      type="text"
                      id="recipients"
                      name="recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
                    // message="Enter Buisness Name"
                    />
                  </CCol>

                </CRow>
                <CRow>
                  <CCol className="" md={8}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      type="file"
                      id="recipients"
                      name="recipients"
                      placeholder="input recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
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
                        type="file"
                        id="keyword"
                        name="keyword"
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
                        value={networkSettingData.businessId}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="smsbusinessId"
                        name="businessId"
                        placeholder="input recipients"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Key"
                        icon={cilUser}
                        value={networkSettingData.key}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="key"
                        name="key"
                        placeholder="key"
                        className="form-control item"
                        isRequired={false}
                        title="key "
                      // message="Enter Buisness Name"
                      />
                    </CCol>

                    <CCol className="" md={6}>
                      <CustomInput
                        label="Api URI"
                        icon={cilUser}
                        value={networkSettingData.apiuri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="apiuri"
                        name="apiuri"
                        placeholder="api uri"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="URI"
                        icon={cilUser}
                        value={networkSettingData.uri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="uri"
                        name="uri"
                        placeholder="uri"
                        className="form-control item"
                        isRequired={false}
                        title="uri "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Unit"
                        icon={cilUser}
                        value={networkSettingData.unit}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="unit"
                        className="form-control item"
                        isRequired={false}
                        title="unit "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Quota"
                        icon={cilUser}
                        value={networkSettingData.quota}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="quota"
                        name="quota"
                        placeholder="quota"
                        className="form-control item"
                        isRequired={false}
                        title="quota "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date From "
                        id="createdAt"
                        name="createdAt"
                        value={networkSettingData.datefrom}
                        title="Date From "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="dateTo"
                        name="dateTo"
                        value={networkSettingData.dateTo}
                        title="Date To "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="mt-4" md={3}>
                      <CFormCheck
                        className=""
                        id="flexNotificationChecked"
                        label="Auto reply message"
                        defaultChecked

                      />

                    </CCol>
                    <CCol className="" md={3}>
                      <CustomInput
                        label="Auto reply message"
                        icon={cilUser}
                        value={networkSettingData.autoreply}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreply"
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
                        value={networkSettingData.autoreplyattachment}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreplyattachment"
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
                        value={networkSettingData.postType}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="postType"
                        name="postType"
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
                        id="flexNotificationChecked"
                        label="Virtual Account"
                        defaultChecked

                      />

                    </CCol>
                  </CRow>
                )}

              </React.Fragment>
            )}
            {tabs[activeTab] === 'Facebook' && (
              <React.Fragment>
                <div className="networkTitle mt-2">
                  <h3>Facebook</h3>
                </div>
                <CRow>
                  <CCol className="" md={12}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      placeholder="input recipients"
                      type="text"
                      id="recipients"
                      name="recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
                    // message="Enter Buisness Name"
                    />
                  </CCol>

                </CRow>
                <CRow>
                  <CCol className="" md={8}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      type="file"
                      id="recipients"
                      name="recipients"
                      placeholder="input recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
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
                        type="file"
                        id="keyword"
                        name="keyword"
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
                        value={networkSettingData.businessId}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="smsbusinessId"
                        name="businessId"
                        placeholder="input recipients"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Key"
                        icon={cilUser}
                        value={networkSettingData.key}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="key"
                        name="key"
                        placeholder="key"
                        className="form-control item"
                        isRequired={false}
                        title="key "
                      // message="Enter Buisness Name"
                      />
                    </CCol>

                    <CCol className="" md={6}>
                      <CustomInput
                        label="Api URI"
                        icon={cilUser}
                        value={networkSettingData.apiuri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="apiuri"
                        name="apiuri"
                        placeholder="api uri"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="URI"
                        icon={cilUser}
                        value={networkSettingData.uri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="uri"
                        name="uri"
                        placeholder="uri"
                        className="form-control item"
                        isRequired={false}
                        title="uri "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Unit"
                        icon={cilUser}
                        value={networkSettingData.unit}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="unit"
                        className="form-control item"
                        isRequired={false}
                        title="unit "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Quota"
                        icon={cilUser}
                        value={networkSettingData.quota}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="quota"
                        name="quota"
                        placeholder="quota"
                        className="form-control item"
                        isRequired={false}
                        title="quota "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date From "
                        id="createdAt"
                        name="createdAt"
                        value={networkSettingData.datefrom}
                        title="Date From "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="dateTo"
                        name="dateTo"
                        value={networkSettingData.dateTo}
                        title="Date To "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="mt-4" md={3}>
                      <CFormCheck
                        className=""
                        id="flexNotificationChecked"
                        label="Auto reply message"
                        defaultChecked

                      />

                    </CCol>
                    <CCol className="" md={3}>
                      <CustomInput
                        label="Auto reply message"
                        icon={cilUser}
                        value={networkSettingData.autoreply}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreply"
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
                        value={networkSettingData.autoreplyattachment}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreplyattachment"
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
                        value={networkSettingData.postType}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="postType"
                        name="postType"
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
                        id="flexNotificationChecked"
                        label="Virtual Account"
                        defaultChecked

                      />

                    </CCol>
                  </CRow>
                )}

              </React.Fragment>
            )}
                        {tabs[activeTab] === 'SnapChat' && (
              <React.Fragment>
                <div className="networkTitle mt-2">
                  <h3>SnapChat</h3>
                </div>
                <CRow>
                  <CCol className="" md={12}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      placeholder="input recipients"
                      type="text"
                      id="recipients"
                      name="recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
                    // message="Enter Buisness Name"
                    />
                  </CCol>

                </CRow>
                <CRow>
                  <CCol className="" md={8}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      type="file"
                      id="recipients"
                      name="recipients"
                      placeholder="input recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
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
                        type="file"
                        id="keyword"
                        name="keyword"
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
                        value={networkSettingData.businessId}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="smsbusinessId"
                        name="businessId"
                        placeholder="input recipients"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Key"
                        icon={cilUser}
                        value={networkSettingData.key}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="key"
                        name="key"
                        placeholder="key"
                        className="form-control item"
                        isRequired={false}
                        title="key "
                      // message="Enter Buisness Name"
                      />
                    </CCol>

                    <CCol className="" md={6}>
                      <CustomInput
                        label="Api URI"
                        icon={cilUser}
                        value={networkSettingData.apiuri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="apiuri"
                        name="apiuri"
                        placeholder="api uri"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="URI"
                        icon={cilUser}
                        value={networkSettingData.uri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="uri"
                        name="uri"
                        placeholder="uri"
                        className="form-control item"
                        isRequired={false}
                        title="uri "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Unit"
                        icon={cilUser}
                        value={networkSettingData.unit}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="unit"
                        className="form-control item"
                        isRequired={false}
                        title="unit "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Quota"
                        icon={cilUser}
                        value={networkSettingData.quota}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="quota"
                        name="quota"
                        placeholder="quota"
                        className="form-control item"
                        isRequired={false}
                        title="quota "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date From "
                        id="createdAt"
                        name="createdAt"
                        value={networkSettingData.datefrom}
                        title="Date From "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="dateTo"
                        name="dateTo"
                        value={networkSettingData.dateTo}
                        title="Date To "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="mt-4" md={3}>
                      <CFormCheck
                        className=""
                        id="flexNotificationChecked"
                        label="Auto reply message"
                        defaultChecked

                      />

                    </CCol>
                    <CCol className="" md={3}>
                      <CustomInput
                        label="Auto reply message"
                        icon={cilUser}
                        value={networkSettingData.autoreply}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreply"
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
                        value={networkSettingData.autoreplyattachment}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreplyattachment"
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
                        value={networkSettingData.postType}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="postType"
                        name="postType"
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
                        id="flexNotificationChecked"
                        label="Virtual Account"
                        defaultChecked

                      />

                    </CCol>
                  </CRow>
                )}

              </React.Fragment>
            )}

            {tabs[activeTab] === 'Instagram' && (
              <React.Fragment>
                <div className="networkTitle mt-2">
                  <h3>Instagram</h3>
                </div>
                <CRow>
                  <CCol className="" md={12}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      placeholder="input recipients"
                      type="text"
                      id="recipients"
                      name="recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
                    // message="Enter Buisness Name"
                    />
                  </CCol>

                </CRow>
                <CRow>
                  <CCol className="" md={8}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      type="file"
                      id="recipients"
                      name="recipients"
                      placeholder="input recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
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
                        type="file"
                        id="keyword"
                        name="keyword"
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
                        value={networkSettingData.businessId}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="smsbusinessId"
                        name="businessId"
                        placeholder="input recipients"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Key"
                        icon={cilUser}
                        value={networkSettingData.key}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="key"
                        name="key"
                        placeholder="key"
                        className="form-control item"
                        isRequired={false}
                        title="key "
                      // message="Enter Buisness Name"
                      />
                    </CCol>

                    <CCol className="" md={6}>
                      <CustomInput
                        label="Api URI"
                        icon={cilUser}
                        value={networkSettingData.apiuri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="apiuri"
                        name="apiuri"
                        placeholder="api uri"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="mt-3" md={6}>
                      <label className="login_label labelName">Status</label>
                      <CFormSwitch/>
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Unit"
                        icon={cilUser}
                        value={networkSettingData.unit}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="unit"
                        className="form-control item"
                        isRequired={false}
                        title="unit "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Quota"
                        icon={cilUser}
                        value={networkSettingData.quota}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="quota"
                        name="quota"
                        placeholder="quota"
                        className="form-control item"
                        isRequired={false}
                        title="quota "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date From "
                        id="createdAt"
                        name="createdAt"
                        value={networkSettingData.datefrom}
                        title="Date From "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="dateTo"
                        name="dateTo"
                        value={networkSettingData.dateTo}
                        title="Date To "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="mt-4" md={3}>
                      <CFormCheck
                        className=""
                        id="flexNotificationChecked"
                        label="Auto reply message"
                        defaultChecked

                      />

                    </CCol>
                    <CCol className="" md={3}>
                      <CustomInput
                        label="Auto reply message"
                        icon={cilUser}
                        value={networkSettingData.autoreply}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreply"
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
                        value={networkSettingData.autoreplyattachment}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreplyattachment"
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
                        value={networkSettingData.postType}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="postType"
                        name="postType"
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
                        id="flexNotificationChecked"
                        label="Virtual Account"
                        defaultChecked

                      />

                    </CCol>
                  </CRow>
                )}

              </React.Fragment>
            )}

            {tabs[activeTab] === 'LinkedIn' && (
              <React.Fragment>
                <div className="networkTitle mt-2">
                  <h3>LinkedIn</h3>
                </div>
                <CRow>
                  <CCol className="" md={12}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      placeholder="input recipients"
                      type="text"
                      id="recipients"
                      name="recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
                    // message="Enter Buisness Name"
                    />
                  </CCol>

                </CRow>
                <CRow>
                  <CCol className="" md={8}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      type="file"
                      id="recipients"
                      name="recipients"
                      placeholder="input recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
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
                        type="file"
                        id="keyword"
                        name="keyword"
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
                        value={networkSettingData.businessId}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="linkedinbusinessId"
                        name="businessId"
                        placeholder="input recipients"
                        className="form-control item"
                        isRequired={false}
                        title="recipients"
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Key"
                        icon={cilUser}
                        value={networkSettingData.key}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="key"
                        name="key"
                        placeholder="key"
                        className="form-control item"
                        isRequired={false}
                        title="key "
                      // message="Enter Buisness Name"
                      />
                    </CCol>

                    <CCol className="" md={6}>
                      <CustomInput
                        label="Api URI"
                        icon={cilUser}
                        value={networkSettingData.apiuri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="apiuri"
                        name="apiuri"
                        placeholder="api uri"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="mt-3" md={6}>
                      <label className="login_label labelName">Status</label>
                      <CFormSwitch />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Unit"
                        icon={cilUser}
                        value={networkSettingData.unit}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="unit"
                        className="form-control item"
                        isRequired={false}
                        title="unit "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Quota"
                        icon={cilUser}
                        value={networkSettingData.quota}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="quota"
                        name="quota"
                        placeholder="quota"
                        className="form-control item"
                        isRequired={false}
                        title="quota "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date From "
                        id="createdAt"
                        name="createdAt"
                        value={networkSettingData.datefrom}
                        title="Date From "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="dateTo"
                        name="dateTo"
                        value={networkSettingData.dateTo}
                        title="Date To "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="mt-4" md={3}>
                      <CFormCheck
                        className=""
                        id="flexNotificationChecked"
                        label="Auto reply message"
                        defaultChecked
                      />
                    </CCol>
                    <CCol className="" md={3}>
                      <CustomInput
                        label="Auto reply message"
                        icon={cilUser}
                        value={networkSettingData.autoreply}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreply"
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
                        value={networkSettingData.autoreplyattachment}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreplyattachment"
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
                        value={networkSettingData.postType}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="postType"
                        name="postType"
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
                        id="flexNotificationChecked"
                        label="Virtual Account"
                        defaultChecked

                      />

                    </CCol>
                  </CRow>
                )}

              </React.Fragment>
            )}

            {tabs[activeTab] === 'TikTok' && (
              <React.Fragment>
                <div className="networkTitle mt-2">
                  <h3>TikTok</h3>
                </div>
                <CRow>
                  <CCol className="" md={12}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      placeholder="input recipients"
                      type="text"
                      id="recipients"
                      name="recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
                    // message="Enter Buisness Name"
                    />
                  </CCol>

                </CRow>
                <CRow>
                  <CCol className="" md={8}>
                    <CustomInput
                      label="Recipients"
                      icon={cilUser}
                      value={networkSettingData.recipients}
                      onChange={handleNetworkSetting}
                      type="file"
                      id="recipients"
                      name="recipients"
                      placeholder="input recipients"
                      className="form-control item"
                      isRequired={false}
                      title="recipients "
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
                        type="file"
                        id="keyword"
                        name="keyword"
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
                        value={networkSettingData.businessId}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="tiktokbusinessId"
                        name="businessId"
                        placeholder="input recipients"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Key"
                        icon={cilUser}
                        value={networkSettingData.key}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="key"
                        name="key"
                        placeholder="key"
                        className="form-control item"
                        isRequired={false}
                        title="key "
                      // message="Enter Buisness Name"
                      />
                    </CCol>

                    <CCol className="" md={6}>
                      <CustomInput
                        label="Api URI"
                        icon={cilUser}
                        value={networkSettingData.apiuri}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="apiuri"
                        name="apiuri"
                        placeholder="api uri"
                        className="form-control item"
                        isRequired={false}
                        title="recipients "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="mt-3" md={6}>
                      <label className="login_label labelName">Status</label>
                      <CFormSwitch />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Unit"
                        icon={cilUser}
                        value={networkSettingData.unit}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="unit"
                        name="unit"
                        placeholder="unit"
                        className="form-control item"
                        isRequired={false}
                        title="unit "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomInput
                        label="Quota"
                        icon={cilUser}
                        value={networkSettingData.quota}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="quota"
                        name="quota"
                        placeholder="quota"
                        className="form-control item"
                        isRequired={false}
                        title="quota "
                      // message="Enter Buisness Name"
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date From "
                        id="createdAt"
                        name="createdAt"
                        value={networkSettingData.datefrom}
                        title="Date From "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="" md={6}>
                      <CustomDatePicker
                        icon={cilCalendar}
                        label="Date To "
                        id="dateTo"
                        name="dateTo"
                        value={networkSettingData.dateTo}
                        title="Date To "
                        onChange={handleNetworkSetting}
                      />
                    </CCol>
                    <CCol className="mt-4" md={3}>
                      <CFormCheck
                        className=""
                        id="flexNotificationChecked"
                        label="Auto reply message"
                        defaultChecked

                      />

                    </CCol>
                    <CCol className="" md={3}>
                      <CustomInput
                        label="Auto reply message"
                        icon={cilUser}
                        value={networkSettingData.autoreply}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreply"
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
                        value={networkSettingData.autoreplyattachment}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="autoreply"
                        name="autoreplyattachment"
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
                        value={networkSettingData.postType}
                        onChange={handleNetworkSetting}
                        type="text"
                        id="postType"
                        name="postType"
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
                        id="flexNotificationChecked"
                        label="Virtual Account"
                        defaultChecked

                      />

                    </CCol>
                  </CRow>
                )}

              </React.Fragment>
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
                  onClick={() => onSave()}
                  type="submit"
                  className="btn btn_Default m-2 sales-btn-style"
                >
                  save
                </button>
                <button
                  type="submit"
                  className="btn btn_Default sales-btn-style m-2"
                 
                >
                  Submit
                </button>
              </div>
        </CContainer>
        )}

      </form>
    </AppContainer>
  );
};

export default SingleDispatchment;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { formValidator } from 'src/helpers/formValidator';
import { useDispatch, useSelector } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import moment from 'moment';

import CIcon from '@coreui/icons-react';
import { CFormCheck } from '@coreui/react';
import { cilUser, cilRouter, cilHttps, cilInputHdmi, cilChevronBottom } from '@coreui/icons';
import { CCard, CCardHeader } from '@coreui/react';
import useFetch from 'src/hooks/useFetch';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import Loading from 'src/components/UI/Loading';
import Form from 'src/components/UI/Form';

const GlobalPrefrences = () => {
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Prefrences',
  );

  const user = useSelector((state) => state.user);

  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [showLicence, setShowLicence] = useState(true);
  const [showStock, setShowStock] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Fetching...');
  const [canUpdate, setCanUpdate] = useState(pageRoles.canUpdate === 1);

  const initialPrefrenceData = {
    smtpServer: '',
    smtpport: '',
    enableEmailNotification: '',
    enableAppNotification: '',
    getSmsnotificationsQuery: '',
    InsertSMSHistoryQuery: '',
    UpdateSMSNotificationsQuery: '',
    dsp_api_auth_key: '',
    proxy_server: '',
    proxy_user_name: '',
    proxy_user_pwd: '',
    enableSMS: '',
    smtpSenderEmail: '',
    status: 1,
    smtpUser: '',
    Sender: '',
    smtp_user: '',
    smtp_pwd: '',
    smtpUserPwd: '',
    sslenabled: '',
    //createdAt: moment().startOf('month').utc().format(),
    //lastUpdatedAt: moment().utc().format(),
  };
  const initialPrefrenceTempleteData = {
    dspId: user.dspId,
    dajObApplyProcessUpdated: '',
    offboardedEmailBody: '',
    onBoardedEmaillBody: '',
    backgroundCheckEmaillBody: '',
    dAReplyNotification: '',
    dAPerformanceNotification: '',
    dspPerformanceNotification: '',
    drugCheckEmaillBody: '',
    smsMessageBody: '',
    smS_MESSAGE_TEMPLATE: '',
    status: 1,
    name: '',
    description: '',
    key: '',
    value: '',
  
  }
 // console.log({ initialPrefrenceTempleteData });
  const [prefrenceData, setPrefrenceData] = useState(initialPrefrenceData);
  const [prefrenceTempleteData, setPrefrenceTempleteData] = useState(initialPrefrenceTempleteData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    response: getPrefrencesRes,
    loading: getPrefrencesLoading,
    error: getPreefrencwError,
    fetchData: getPrefrence,
  } = useFetch();
  const {
    response: getPrefrencesTempleteRes,
    loading: getPrefrencesTempleteLoading,
    error: getPreefrencTempError,
    fetchData: getPrefrenceTemplete,
  } = useFetch();
  const {
    response: createPrefrencesTempleteRes,
    loading: createPrefrencesTempleteLoading,
    error: createPreefrencTempError,
    fetchData: createPrefrenceTemplete,
  } = useFetch();
  const {
    response: createPrefrencesRes,
    loading: createPrefrencesLoading,
    error: createPreefrencwError,
    fetchData: createPrefrence,
  } = useFetch();

  useEffect(() => {
    getprefrenceList();
    getprefrenceTempleteList();
    formValidator();
  }, []);
  const getprefrenceTempleteList = async () => {
    const fetchBody = {
      id:'',
      roleId: '',
      userId: '',
      dspId: user.dspId.toString(),
      dajObApplyProcessUpdated: prefrenceTempleteData.dajObApplyProcessUpdated,
      name: prefrenceTempleteData.name,
      description: '',
      key: '',
      value: '',
      status: '',
      email: '',
      remarks: '',
      offboardedEmailBody: prefrenceTempleteData.offboardedEmailBody,
      onBoardedEmaillBody: '',
      daReplyNotification: '',
      backgroundCheckEmaillBody: '',
      drugCheckEmaillBody: '',
      daPerformanceNotification: '',
      dspPerformanceNotification: '',
      smsMessageBody: '',
      smS_MESSAGE_TEMPLATE: '',
      createdAt: moment().utc().subtract(1, 'year').format(),
      createdBy: moment().utc().format(),
      datefrom: moment().utc().format(),
      dateto: moment().utc().format(),
      lastUpdatedAt: moment().utc().format(),
      lastUpdatedBy: moment().utc().format(),
    };
    await getPrefrenceTemplete(
      '/Common/configurations',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        console.log({ res });
        if (res.status === true && res.errorCode !== '407') {
          setPrefrenceTempleteData({
            dspid: user.dspid,
            id: res.data.id,
            dajObApplyProcessUpdated: res.data.dajObApplyProcessUpdated,
            offboardedEmailBody: res.data.offboardedEmailBody,
            onBoardedEmaillBody: res.data.onBoardedEmaillBody,
            daReplyNotification: res.data.daReplyNotification,
            daPerformanceNotification: res.data.daPerformanceNotification,
            dspPerformanceNotification: res.data.dspPerformanceNotification,
            smsMessageBody: res.data.smsMessageBody,
            backgroundCheckEmaillBody: res.data.backgroundCheckEmaillBody,
            drugCheckEmaillBody: res.data.drugCheckEmaillBody,
            smS_MESSAGE_TEMPLATE: res.data.smS_MESSAGE_TEMPLATE,
        
          });
         // console.log(res.data.dajObApplyProcessUpdated, '11')
          // getServiceList();
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
        }
      },
    );
    setIsLoading(getPrefrencesLoading.current);
  };
  const updatePreferenceTempleteData = async () => {
   // formValidator();
//    const form = document.querySelector('.da-Prefrence-form');
   // alert(JSON.stringify(form));
   // if (form.checkValidity()) {

      const data = {
        dspId: user.dspId,
        id: prefrenceTempleteData.id,
        dajObApplyProcessUpdated: prefrenceTempleteData.dajObApplyProcessUpdated,
        offboardedEmailBody: prefrenceTempleteData.offboardedEmailBody,
        onBoardedEmaillBody: prefrenceTempleteData.onBoardedEmaillBody,
        daReplyNotification: prefrenceTempleteData.daReplyNotification,
        daPerformanceNotification: prefrenceTempleteData.daPerformanceNotification,
        dspPerformanceNotification: prefrenceTempleteData.dspPerformanceNotification,
        backgroundCheckEmaillBody: prefrenceTempleteData.backgroundCheckEmaillBody,
        drugCheckEmaillBody: prefrenceTempleteData.drugCheckEmaillBody,
        smsMessageBody: prefrenceTempleteData.smsMessageBody,
        smS_MESSAGE_TEMPLATE: prefrenceTempleteData.smS_MESSAGE_TEMPLATE,
        lastUpdatedBy: user.userId,
        lastUpdatedAt: moment().utc().format(),
      };
      //

      setIsLoading(true);
      await createPrefrenceTemplete(
        // '/Common/basicconfigurations',
        '/Common/submitconfigurations',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        (res) => {
          console.log({ res },'templete data')
          if (res.status) {
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: 'Prefrence update successfully',
                toastVariant: 'success',
              }),
             
            );
            getprefrenceTempleteList();
            // navigate('/GlobalPrefrences');
          } else {
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: res.message,
                toastVariant: 'error',
                //  `${JSON.stringify(createUserRes.current.message)}`,
              }),
            );
          }
        },
      );
    //}
    setIsLoading(false);
  };


  const getprefrenceList = async () => {
    await getPrefrence(
      '/Common/basicconfigurations',
      {
        method: 'POST',
      },
      (res) => {
      //  console.log({ res }, 'ree');
        if (res.status === true && res.errorCode !== '407') {
          setPrefrenceData({
            id: res.data[0].id,
            smtpServer: res.data[0].smtpServer,
            smtpport: res.data[0].smtpport,
            smtpSenderEmail: res.data[0].smtpSenderEmail,
            enableEmailNotification: '',
            enableAppNotification: '',
            getSmsnotificationsQuery: res.data[0].getSmsnotificationsQuery,
            InsertSMSHistoryQuery: '',
            UpdateSMSNotificationsQuery: '',
            dsp_api_auth_key: '',
            apiAuthKey: '',
            fcmSenderId: '',
            proxy_server: '',
            proxy_user_name: '',
            proxy_user_pwd: '',
            enableSMS: '',
            status: 1,
            smtpUser: res.data[0].smtpUser,
            smtp_user: res.data[0].smtpUser,
            smtp_pwd: res.data[0].smtpUserPwd,
            smtpUserPwd: res.data[0].smtpUserPwd,
            sslenabled: res.data[0].sslenabled === 1 ? true : false,
          });

          // getServiceList();
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
        }
      },
    );
    setIsLoading(getPrefrencesLoading.current);
  };

  const updatePreferenceData = async () => {
    formValidator();
    const form = document.querySelector('.da-Prefrence-form');
    if (form.checkValidity()) {
      const data = {
        id: 1,
        smtpServer: prefrenceData.smtpServer,
        smtpport: parseInt(prefrenceData.smtpport),
        smtpUser: prefrenceData.smtpUser,
        smtpSenderEmail: prefrenceData.smtpSenderEmail,
        smtpUserPwd: prefrenceData.smtpUserPwd,
        sslenabled: prefrenceData.sslenabled ? 1 : 0,
        smsPassword: '',
        smsServiceUrl: '',
        smsQouta: 0,
        SmsServiceUser: '',
        lastUpdatedBy: user.userId,
        lastUpdatedAt: moment().utc().format(),
      };
      //
      setIsLoading(true);
      await createPrefrence(
        '/Common/submitbasicconfigurations',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        (res) => {
          if (res.status) {
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: 'Prefrence update successfully',
                toastVariant: 'success',
              }),
            );
            updatePreferenceTempleteData();
            getprefrenceList();
            // navigate('/GlobalPrefrences');
          } else {
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: res.message,
                toastVariant: 'error',
                //  `${JSON.stringify(createUserRes.current.message)}`,
              }),
            );
          }
        },
      );
    }
    setIsLoading(false);
  };
  const smtpTestRun = async () => {
    setLoadingText('Testing Connecion...');
    formValidator();
    const form = document.querySelector('.da-Prefrence-form');

    if (form.checkValidity()) {
      const data = {
        id: 1,
        smtpServer: prefrenceData.smtpServer,
        smtpport: parseInt(prefrenceData.smtpport),
        smtpUser: prefrenceData.smtpUser,
        smtpSenderEmail: prefrenceData.smtpSenderEmail,
        smtpUserPwd: prefrenceData.smtpUserPwd,
        sslenabled: prefrenceData.sslenabled ? 1 : 0,
        smsPassword: '',
        smsServiceUrl: '',
        smsQouta: 0,
        smsServiceUser: '',
        fcmServerKey: '',
        apiAuthKey: '',
        insertSmshistoryQuery: '',
        updateSmsnotificationsQuery: '',
        getSmsnotificationsQuery: '',
        lastUpdatedBy: user.userId,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
      };
      //
      setIsLoading(true);
      await createPrefrence(
        '/Common/smtptestrun',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
        (res) => {
          if (res.status) {
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: res.message,
                toastVariant: 'success',
              }),
            );
            // getprefrenceList();
          } else {
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: res.message,
                toastVariant: 'error',
              }),
            );
          }
        },
      );
    }
    setIsLoading(false);
  };
  const handlePrefrenceInput = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setPrefrenceData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };
  const handlePrefrenceTempleteInput = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setPrefrenceTempleteData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = () => {
    setLoadingText('Submiting...');
    updatePreferenceData();
    updatePreferenceTempleteData();
  };

  const toggleStock = () => {
    setShowStock((prev) => !prev);
  };

  const toggleLicence = () => {
    setShowLicence((prev) => !prev);
  };

  const confirmationModal = () => {
    setConfirmationModalOpen(!confirmationModalOpen);
  };
  const goToAnotherPage = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return <Loading title={loadingText} />;
  }

  return (
    <Form name="da-Prefrence-form" onSubmit={handleSubmit}>
      <div>
        <div className="mt-2 bg_Div">
          <div className="dashboard-stock-header dashboard-drop">
            <div className="pointer" onClick={toggleStock}>
              Email Preference
            </div>
            <CIcon className="stock-toggle-icon" onClick={toggleStock} icon={cilChevronBottom} />
          </div>
          {showStock === true ? (
            <div className="show-stock">
              <div className="CenterAlign pt-2 pb-2">
                <h3>4DSPS Settings</h3>
              </div>

              <div className="mb-0 dashboard-table padLeftRight">
                <div className="row">
                  <div className="col-md-4">
                    <CFormCheck
                      className=""
                      id="flexNotificationChecked"
                      label="Notification"
                      defaultChecked
                      disabled={!canUpdate}
                    />
                  </div>
                  <div className="col-md-4">
                    <CFormCheck
                      className=""
                      id="flexEmailChecked"
                      label="Email"
                      defaultChecked
                      disabled={!canUpdate}
                    />
                  </div>
                  <div className="col-md-4">
                    <CFormCheck
                      className=""
                      id="flexSmsChecked"
                      label="SMS"
                      defaultChecked
                      disabled={!canUpdate}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <CustomInput
                      label="SMTP Server"
                      icon={cilRouter}
                      value={prefrenceData.smtpServer}
                      onChange={handlePrefrenceInput}
                      type="text"
                      id="smtpServer"
                      name="smtpServer"
                      placeholder=" SMTP Server"
                      className="form-control item"
                      isRequired={true}
                      message="Enter SMTP Server"
                      disabled={!canUpdate}
                    />
                  </div>
                  <div className="col-md-6">
                    <CustomInput
                      label="Port"
                      icon={cilInputHdmi}
                      value={prefrenceData.smtpport}
                      onChange={handlePrefrenceInput}
                      type="number"
                      className="form-control item "
                      id="smtpport"
                      name="smtpport"
                      placeholder="Port"
                      isRequired={true}
                      message="Enter SMTP Port"
                      disabled={!canUpdate}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <CustomInput
                      label="Sender"
                      icon={cilUser}
                      type="text"
                      className="form-control item "
                      value={prefrenceData.smtpSenderEmail}
                      id="smtpSenderEmail"
                      name="smtpSenderEmail"
                      placeholder="sender"
                      onChange={handlePrefrenceInput}
                      isRequired={true}
                      disabled={!canUpdate}
                    />
                  </div>
                  <div className="col-md-6">
                    <CFormCheck
                      className="mt-5"
                      id="sslenabled"
                      label="SSL"
                      name="sslenabled"
                      checked={prefrenceData.sslenabled}
                      onChange={handlePrefrenceInput}
                      disabled={!canUpdate}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <CustomInput
                      label="Credentials-User Name"
                      icon={cilUser}
                      value={prefrenceData.smtpUser}
                      onChange={handlePrefrenceInput}
                      type="text"
                      className="form-control item "
                      id="smtpUser"
                      name="smtpUser"
                      placeholder="Credentials-user name"
                      isRequired={true}
                      message="Enter User Name"
                      disabled={!canUpdate}
                    />
                  </div>
                  <div className="col-md-6">
                    <CustomInput
                      label="Password"
                      icon={cilHttps}
                      className="form-control item "
                      value={prefrenceData.smtpUserPwd}
                      onChange={handlePrefrenceInput}
                      id="smtpUserPwd"
                      name="smtpUserPwd"
                      placeholder="Password"
                      type="password"
                      isRequired={true}
                      message="Enter Password"
                      disabled={!canUpdate}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className=" mt-2">
                      <button
                        type="button"
                        onClick={() => smtpTestRun()}
                        className="btn_Default m-2 sales-btn-style FloatRight btnTestConnection"
                      >
                        Test Connection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <CCard style={{ background: '#0A3153' }} className="mt-2">
          <CCardHeader className="dashboard-stock-header dashboard-drop">
            <div className="pointer" onClick={toggleLicence}>
              Email & Notification Templates
            </div>
            <CIcon className="stock-toggle-icon" onClick={toggleLicence} icon={cilChevronBottom} />
          </CCardHeader>
          {showLicence == false ? (
            <div className="show-stock">
              <div className="mb-0 dashboard-table padLeftRight">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                        DA Job Apply 
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="dajObApplyProcessUpdated"
                        name="dajObApplyProcessUpdated"
                        type="text"
                        value={prefrenceTempleteData.dajObApplyProcessUpdated}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="Application submitted, acknowledgement"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                        DA Job Apply-Process Updated
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="dajObApplyProcessUpdated"
                        name="dajObApplyProcessUpdated"
                        value={prefrenceTempleteData.dajObApplyProcessUpdated}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="Application status change description"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                        On Boarded Email
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="onBoardedEmaillBody"
                        name="onBoardedEmaillBody"
                        value={prefrenceTempleteData.onBoardedEmaillBody}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="On boarded sample text"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                        Off Boarding Email 
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="offboardedEmailBody"
                        name="offboardedEmailBody"
                        value={prefrenceTempleteData.offboardedEmailBody}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="On boarding sample text"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                        Background Check Emaill 
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="backgroundCheckEmaillBody"
                        name="backgroundCheckEmaillBody"
                        value={prefrenceTempleteData.backgroundCheckEmaillBody}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="Background Check sample text"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                        Drug Check Emaill 
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="drugCheckEmaillBody"
                        name="drugCheckEmaillBody"
                        value={prefrenceTempleteData.drugCheckEmaillBody}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="Drug check sample text"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                        DSP Performance Notification
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="daPerformanceNotification"
                        name="daPerformanceNotification"
                        value={prefrenceTempleteData.daPerformanceNotification}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="DSP performance notification text"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                        DA Notification Reply
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="daReplyNotification"
                        name="daReplyNotification"
                        value={prefrenceTempleteData.daReplyNotification}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="DA mitigation reply text"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                       DSP Performance Notification
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="dspPerformanceNotification"
                        name="dspPerformanceNotification"
                        value={prefrenceTempleteData.dspPerformanceNotification}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="Performance warning email text"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-outline text-start">
                      <label htmlFor="" className="login_label labelName mb-2">
                        SMS Message 
                      </label>
                      <textarea
                        className="FullWidth"
                        rows="3"
                        id="smS_MESSAGE_TEMPLATE"
                        name="smS_MESSAGE_TEMPLATE"
                        value={prefrenceTempleteData.smS_MESSAGE_TEMPLATE}
                        onChange={handlePrefrenceTempleteInput}
                        placeholder="SMS message text"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </CCard>
        <div>
          <div className="CenterAlign">
            <button
              type="button"
              onClick={confirmationModal}
              className="btn_Default m-2 sales-btn-style"
            >
              Cancel
            </button>
            {pageRoles.canUpdate === 1 && (
              <button
                type="submit"
                className="btn_Default sales-btn-style m-2"
                onClick={updatePreferenceData}
              >
                Save
              </button>
            )}
          </div>
        </div>
        <ConfirmationModal
          header="Confirmation!"
          body="Are you sure you want to cancel?"
          isOpen={confirmationModalOpen}
          onYes={goToAnotherPage}
          onNo={confirmationModal}
        />
      </div>
    </Form>
  );
};

export default GlobalPrefrences;

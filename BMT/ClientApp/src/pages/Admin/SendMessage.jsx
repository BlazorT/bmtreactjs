/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { cilCheckCircle, cilChevronBottom, cilSend, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CAlert, CCard, CCardBody, CCardHeader, CCol, CFormCheck, CRow } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AttachmentManager from 'src/components/Component/AttachmentManager';
import JobStatusTracker from 'src/components/Component/JobStatusTracker';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import PasswordModal from 'src/components/ImportContacts/PasswordModal';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import RecipientSelectionModal from 'src/components/Modals/RecipientSelectionModal';
import TemplateListModel from 'src/components/Modals/TemplateListModel';
import AppContainer from 'src/components/UI/AppContainer';
import Button from 'src/components/UI/Button';
import EmailTextEditor from 'src/components/UI/email-editor';
import SocialMediaTextEditor from 'src/components/UI/SocialMediaTextFormatter';
import WhatsAppTemplateEditor from 'src/components/UI/WhatsAppTemplateEditor';
import { generateInitialParameters } from 'src/helpers/campaignHelper';
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
import useApi from 'src/hooks/useApi';
import { useShowToast } from 'src/hooks/useShowToast';
import { setUserData } from 'src/redux/user/userSlice';
import { NETWORKS } from 'src/util/constants';
import globalutil from 'src/util/globalutil';

dayjs.extend(utc);

const SendMessage = () => {
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const user = useSelector((state) => state.user);
  const networks = globalutil.networks();

  // State management
  const [networkId, setNetworkId] = useState(0);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [messageData, setMessageData] = useState({
    title: '',
    subject: '',
    message: '',
    messageJson: '',
  });
  const [whatsappTemplateType, setWhatsappTemplateType] = useState(1);
  const [notificationPriority, setNotificationPriority] = useState('standard');
  const [attachments, setAttachments] = useState([
    { id: 1, type: 'image', url: '', file: null },
    { id: 2, type: 'video', url: '', file: null },
    { id: 3, type: 'pdf', url: '', file: null },
  ]);

  // Modal states
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [showAttachmentDetail, setShowAttachmentDetail] = useState(false);

  // Albums and recipients
  const [albums, setAlbums] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const { fetchAlbums, loading: albumsLoading } = useFetchAlbums();
  const { fetchRecipients, loading: recipientsLoading } = useFetchRecipients();

  const toggleShowMessageDetail = () => setShowMessageDetail((prev) => !prev);
  const toggleShowAttachmentDetail = () => setShowAttachmentDetail((prev) => !prev);

  const networkSettingBody = useMemo(
    () => ({
      id: networkId?.toString(),
      orgId: user?.orgId?.toString(),
    }),
    [networkId, user],
  );

  const {
    postData: fetchNetworkSettings,
    data: networkSettingsRes,
    loading: networkSettingsLoading,
  } = useApi('/Organization/orgpackagedetails', 'POST', networkSettingBody);

  const networkSettingData = networkSettingsRes?.data?.[0] || null;
  // Job tracking
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);

  // API hooks
  const { postData: sendMessage, loading: sendingMessage } = useApi(
    // eslint-disable-next-line no-undef
    process.env.REACT_APP_BMT_SERVIVE + '/send/message',
    'POST',
    null,
    {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.socialApiKey || ''}`,
    },
  );

  const { postData: getSocialApiKey, loading: passwordLoading } = useApi(
    // eslint-disable-next-line no-undef
    process.env.REACT_APP_BMT_SERVIVE + '/auth/login',
  );

  const { uploadAvatar } = useUploadAvatar();

  // Fetch albums and recipients when network changes
  useEffect(() => {
    if (networkId > 0) {
      fetchAlbumsAndRecipients();
    }
  }, [networkId]);

  const fetchAlbumsAndRecipients = async () => {
    const albumsBody = {
      id: 0,
      orgId: user.orgId,
      networkId: networkId,
      name: '',
      code: '',
      desc: '',
      createdBy: 0,
      lastUpdatedBy: 0,
      createdAt: dayjs().subtract(5, 'year').format(),
      lastUpdatedAt: dayjs().utc().format(),
      rowVer: 0,
      status: 1,
    };

    const recipientsBody = {
      id: 0,
      orgId: user.orgId,
      contentId: '',
      rowVer: 0,
      networkId: networkId,
      albumid: 0,
      status: 0,
      createdAt: dayjs().subtract(5, 'year').startOf('year').format(),
      lastUpdatedAt: dayjs().utc().endOf('day').format(),
    };

    try {
      const [albumsData, recipientsData] = await Promise.all([
        fetchAlbums(albumsBody),
        fetchRecipients(recipientsBody),
        fetchNetworkSettings(networkSettingBody),
      ]);
      setAlbums(albumsData || []);
      setRecipients(recipientsData || []);
    } catch {
      showToast('Failed to fetch albums and recipients', 'error');
    }
  };

  const handleNetworkChange = (e) => {
    const newNetworkId = parseInt(e.target.value);
    setNetworkId(newNetworkId);
    setSelectedRecipients([]);
    setMessageData({
      title: '',
      subject: '',
      message: '',
      messageJson: '',
    });
    setWhatsappTemplateType(1);
    setJobId(null);
    setJobStatus(null);
  };

  const handleTemplateSelect = (template) => {
    if (networkId === NETWORKS.WHATSAPP) {
      if (template?.whatsappTemplate) {
        const rawTemplate = template.whatsappTemplate;
        const initialParams = generateInitialParameters(rawTemplate.components);
        const fullWhatsAppState = {
          templateType: 1,
          templateName: rawTemplate.name,
          templateLanguage: rawTemplate.language,
          category: rawTemplate.category,
          templateId: rawTemplate.id,
          components: rawTemplate.components,
          parameters: initialParams,
        };

        setWhatsappTemplateType(1);
        setMessageData({
          title: rawTemplate.name,
          subject: rawTemplate.language,
          message: '',
          messageJson: JSON.stringify(fullWhatsAppState),
        });
      } else {
        setWhatsappTemplateType(2);
        setMessageData({
          title: template?.title || '',
          subject: template?.subject || '',
          message: template?.template || '',
          messageJson: template?.templateJson || '',
        });
      }
    } else {
      setMessageData({
        title: template?.title || '',
        subject: template?.subject || '',
        message: template?.template || '',
        messageJson: template?.templateJson || '',
      });
    }
    setShowTemplateList(false);
  };

  const handleMessageChange = (field, value) => {
    setMessageData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWhatsAppEditorChange = (updatedFullObject) => {
    setMessageData((prev) => ({
      ...prev,
      messageJson: JSON.stringify({
        templateType: 1,
        ...updatedFullObject,
      }),
    }));
  };

  const handlePasswordSubmit = async (password) => {
    if (!password) {
      showToast('Password is required', 'error');
      return;
    }

    try {
      const { response: data, status } = await getSocialApiKey(
        {
          email: user?.userInfo?.email,
          password,
        },
        true,
      );

      if (status !== 200) {
        showToast(data?.error?.code + ': ' + data?.error?.message, 'error');
        return;
      }

      if (data?.token) {
        showToast('Access key generated', 'success');
        dispatch(
          setUserData({
            socialApiKey: data?.token,
          }),
        );
        setShowPasswordModal(false);
      } else {
        showToast('Authentication failed. Please try again.', 'error');
      }
    } catch {
      showToast('Authentication failed. Please try again.', 'error');
    }
  };

  const validateForm = () => {
    if (!networkId) {
      showToast('Please select a network', 'error');
      return false;
    }

    if (selectedRecipients.length === 0) {
      showToast('Please select at least one recipient', 'error');
      return false;
    }

    if (networkId === NETWORKS.WHATSAPP) {
      if (!messageData.title || !messageData.subject) {
        showToast('Template name and language are required for WhatsApp', 'error');
        return false;
      }
      if (
        (whatsappTemplateType === 1 && !messageData.messageJson) ||
        (whatsappTemplateType === 2 && !messageData.message)
      ) {
        showToast('Template content is required for WhatsApp', 'error');
        return false;
      }
    } else if (networkId === NETWORKS.EMAIL) {
      if (!messageData.subject || !messageData.title) {
        showToast('Subject and title are required for Email', 'error');
        return false;
      }
      if (!messageData.messageJson && !messageData.message) {
        showToast('Message content is required', 'error');
        return false;
      }
    } else {
      if (!messageData.title) {
        showToast('Title is required', 'error');
        return false;
      }
      if (!messageData.message) {
        showToast('Message content is required', 'error');
        return false;
      }
    }

    return true;
  };

  const prepareAttachments = () => {
    return attachments
      .filter((att) => att.url || att.file)
      .map((att, index) => ({
        id: index + 1,
        image: att.url || att.file,
      }));
  };

  const handleSendMessage = async () => {
    if (!validateForm()) {
      return;
    }

    const preparedAttachments = prepareAttachments();

    let messageContent = messageData.message;
    if (networkId === NETWORKS.EMAIL && messageData.messageJson) {
      messageContent = messageData.message; // HTML content
    } else if (networkId === NETWORKS.WHATSAPP && whatsappTemplateType === 1) {
      messageContent = messageData.messageJson;
    }

    const payload = {
      networkId: networkId,
      recipients: selectedRecipients,
      message: messageContent,
      subject: messageData.subject,
      title: messageData.title,
      attachments: notificationPriority === 'standard' ? preparedAttachments : [],
      notificationPriority: notificationPriority,
    };

    try {
      const { response, status } = await sendMessage(payload, true, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.socialApiKey || ''}`,
      });

      if (status === 401) {
        showToast(response?.error?.code + ': ' + response?.error?.message, 'error');
        setShowPasswordModal(true);
        return;
      }
      if (response?.success) {
        if (notificationPriority === 'immediate') {
          // Show immediate results
          showToast(
            `Message sent successfully to ${response.messagesSent || selectedRecipients.length} recipients`,
            'success',
          );

          setJobId(response?.jobId ? Number(response?.jobId) : null);
        } else {
          // Standard priority - save job ID for tracking
          setJobId(response.jobId);
          showToast('Message queued for delivery', 'success');
        }
      } else if (
        response?.success === false &&
        notificationPriority === 'immediate' &&
        response?.jobId
      ) {
        setJobId(response?.jobId ? Number(response?.jobId) : null);
      } else {
        showToast(response?.error?.message || 'Failed to send message', 'error');
      }
    } catch (error) {
      showToast('Failed to send message', 'error');
      console.error('Send message error:', error);
    }
  };

  const handleReset = () => {
    setNetworkId(0);
    setSelectedRecipients([]);
    setMessageData({
      title: '',
      subject: '',
      message: '',
      messageJson: '',
    });
    setWhatsappTemplateType(1);
    setNotificationPriority('standard');
    setAttachments([
      { id: 1, type: 'image', url: '', file: null },
      { id: 2, type: 'video', url: '', file: null },
      { id: 3, type: 'pdf', url: '', file: null },
    ]);
    setJobId(null);
    setJobStatus(null);
  };

  const renderMessageEditor = () => {
    if (networkId === NETWORKS.EMAIL) {
      return (
        <EmailTextEditor
          value={messageData.messageJson ? JSON.parse(messageData.messageJson) : ''}
          open={true}
          onSave={(html, design) => {
            setMessageData((prev) => ({
              ...prev,
              message: html,
              messageJson: JSON.stringify(design),
            }));
          }}
          isModal={false}
        />
      );
    } else if (networkId === NETWORKS.WHATSAPP) {
      if (whatsappTemplateType === 1) {
        return (
          <WhatsAppTemplateEditor
            value={messageData.messageJson ? JSON.parse(messageData.messageJson) : null}
            onChange={handleWhatsAppEditorChange}
          />
        );
      } else {
        return (
          <SocialMediaTextEditor
            networkId={NETWORKS.WHATSAPP}
            value={messageData.message}
            onChange={(value) => handleMessageChange('message', value)}
            placeholder="WhatsApp text message..."
          />
        );
      }
    } else if (networkId === NETWORKS.SMS) {
      return (
        <SocialMediaTextEditor
          networkId={NETWORKS.SMS}
          value={messageData.message}
          onChange={(value) => handleMessageChange('message', value)}
          placeholder="SMS message..."
        />
      );
    }
    return null;
  };
  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <CIcon icon={cilSend} size="xl" />
            <h4 className="mb-0">Send Message</h4>
          </div>
          <div className="d-flex gap-2">
            <Button title="Reset" onClick={handleReset} className="btn-sm" />
          </div>
        </CCardHeader>

        <CCardBody className="px-2 py-2">
          {/* Network Selection */}
          <CRow className="mb-1">
            <CCol md={6}>
              <CustomSelectInput
                label="Select Network"
                id="networkId"
                name="networkId"
                value={networkId}
                onChange={handleNetworkChange}
                options={networks}
                icon={cilUser}
                isRequired={true}
                disableOption="Select a network"
                className="form-control"
                message="Please select a network"
              />
            </CCol>
            <CCol md={6}>
              <div className="d-flex align-items-end h-100 pb-2">
                <Button
                  title="Select Recipients"
                  onClick={() => setShowRecipientModal(true)}
                  disabled={!networkId}
                  className="w-100"
                />
              </div>
            </CCol>
          </CRow>

          {/* Selected Recipients Badge */}
          {selectedRecipients.length > 0 && (
            <CRow className="mb-0">
              <CCol>
                <CAlert color="info" className="d-flex p-2 align-items-center gap-2 mb-0">
                  <CIcon icon={cilCheckCircle} size="lg" />
                  <strong>{selectedRecipients.length} recipients selected</strong>
                </CAlert>
              </CCol>
            </CRow>
          )}
          {networkId > 0 && (
            <>
              <AppContainer>
                <DataGridHeader
                  title="Message Template"
                  onClick={toggleShowMessageDetail}
                  otherControls={[{ icon: cilChevronBottom, fn: toggleShowMessageDetail }]}
                  addButton="Load Template"
                  addBtnClick={() => setShowTemplateList(true)}
                  filterDisable={true}
                />
                {showMessageDetail && (
                  <>
                    {/* Message Fields */}
                    <CRow className="mb-1">
                      <CCol md={networkId === NETWORKS.WHATSAPP ? 4 : 6}>
                        <CustomInput
                          label="Title"
                          icon={cilUser}
                          value={messageData.title}
                          onChange={(e) => handleMessageChange('title', e.target.value)}
                          placeholder="Enter title"
                          type="text"
                          id="title"
                          name="title"
                          className="form-control"
                          isRequired={true}
                          title="Message Title"
                          message="Enter message title"
                        />
                      </CCol>

                      {(networkId === NETWORKS.EMAIL || networkId === NETWORKS.WHATSAPP) && (
                        <CCol md={networkId === NETWORKS.WHATSAPP ? 4 : 6}>
                          <CustomInput
                            label={
                              networkId === NETWORKS.WHATSAPP && whatsappTemplateType === 1
                                ? 'Template Language'
                                : 'Subject'
                            }
                            icon={cilUser}
                            value={messageData.subject}
                            onChange={(e) => handleMessageChange('subject', e.target.value)}
                            placeholder={
                              networkId === NETWORKS.WHATSAPP ? 'e.g., en, en_US' : 'Enter subject'
                            }
                            type="text"
                            id="subject"
                            name="subject"
                            className="form-control"
                            isRequired={true}
                            title={
                              networkId === NETWORKS.WHATSAPP
                                ? 'Template Language'
                                : 'Message Subject'
                            }
                            message={
                              networkId === NETWORKS.WHATSAPP
                                ? 'Enter language code'
                                : 'Enter subject'
                            }
                          />
                        </CCol>
                      )}

                      {networkId === NETWORKS.WHATSAPP && (
                        <CCol md={4}>
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
                            onChange={(e) =>
                              setWhatsappTemplateType(parseInt(e.target.value, 10) || 1)
                            }
                            className="form-control"
                            message="Select template type"
                            showDisableOption={false}
                          />
                        </CCol>
                      )}
                    </CRow>
                    {/* Message Editor */}
                    <CRow className="mb-0">
                      <CCol>{renderMessageEditor()}</CCol>
                    </CRow>
                  </>
                )}
              </AppContainer>

              {notificationPriority === 'standard' && (
                <AppContainer>
                  <DataGridHeader
                    title="Message Attachment"
                    otherControls={[{ icon: cilChevronBottom, fn: toggleShowAttachmentDetail }]}
                    filterDisable={true}
                  />
                  {/* Attachments */}
                  {showAttachmentDetail && (
                    <CRow className="mb-0">
                      <CCol>
                        <AttachmentManager
                          attachments={attachments}
                          setAttachments={setAttachments}
                          uploadAvatar={uploadAvatar}
                          userId={user?.userId}
                          showToast={showToast}
                        />
                      </CCol>
                    </CRow>
                  )}
                </AppContainer>
              )}

              <AppContainer>
                <DataGridHeader title="Message Priority" filterDisable={true} />

                <CRow className="mb-3">
                  <CCol>
                    <div className="d-flex gap-4">
                      <CFormCheck
                        type="radio"
                        name="notificationPriority"
                        id="priority-standard"
                        label="Standard (Queued)"
                        value="standard"
                        checked={notificationPriority === 'standard'}
                        onChange={(e) => setNotificationPriority(e.target.value)}
                      />
                      <CFormCheck
                        type="radio"
                        name="notificationPriority"
                        id="priority-immediate"
                        label="Immediate (Send Now)"
                        value="immediate"
                        checked={notificationPriority === 'immediate'}
                        onChange={(e) => setNotificationPriority(e.target.value)}
                      />
                    </div>
                    <small className="text-muted">
                      {notificationPriority === 'immediate'
                        ? 'Messages will be sent immediately and you will see results on this page.'
                        : 'Messages will be queued for delivery. Track progress using the Job ID below.'}
                    </small>
                  </CCol>
                </CRow>
              </AppContainer>
              {/* Priority Selection */}

              {/* Send Button */}
              <CRow className="mb-3 mt-3">
                <CCol className="d-flex justify-content-end gap-2">
                  <Button
                    title="Send Message"
                    onClick={handleSendMessage}
                    loading={sendingMessage}
                    loadingTitle="Sending..."
                    icon={<CIcon icon={cilSend} className="me-2" />}
                    disabled={selectedRecipients.length === 0}
                    className="w-auto px-4"
                  />
                </CCol>
              </CRow>

              {/* Job Status Tracker */}
              {(jobId || jobStatus) && !sendingMessage && (
                <CRow>
                  <CCol>
                    <JobStatusTracker
                      jobId={jobId}
                      jobStatus={jobStatus}
                      notificationPriority={notificationPriority}
                    />
                  </CCol>
                </CRow>
              )}
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Modals */}
      <RecipientSelectionModal
        visible={showRecipientModal}
        onClose={() => setShowRecipientModal(false)}
        albums={albums}
        recipients={recipients}
        selectedRecipients={selectedRecipients}
        onSave={setSelectedRecipients}
        loading={albumsLoading || recipientsLoading || networkSettingsLoading}
        networkId={networkId}
      />

      <TemplateListModel
        isOpen={showTemplateList}
        toggle={() => setShowTemplateList(false)}
        onSelect={handleTemplateSelect}
        networkId={networkId}
        WABA={networkSettingData?.businessId}
        WAT={networkSettingData?.apikeySecret}
      />

      <PasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        loading={passwordLoading}
      />
    </>
  );
};

export default SendMessage;

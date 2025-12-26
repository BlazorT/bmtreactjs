import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { getTemplateInputFields } from 'src/configs/InputConfig/templateFormConfig';
import { formValidator } from 'src/helpers/formValidator';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import Inputs from '../Filters/Inputs';
import Button from '../UI/Button';
import Form from '../UI/Form';
import SocialMediaTextEditor from '../UI/SocialMediaTextFormatter';
import EmailTextEditor from '../UI/email-editor';
import { useShowToast } from 'src/hooks/useShowToast';
import useApi from 'src/hooks/useApi';
import dayjs, { utc } from 'dayjs';
import { useSelector } from 'react-redux';
import SendTestEmailModel from './SendTestEmailModel';
import WhatsAppTemplateEditor from '../UI/WhatsAppTemplateEditor';
import WhatsappTemplate from '../UI/WhatsappTemplate';
import { generateInitialParameters } from 'src/helpers/campaignHelper';

const defaultTemplateData = {
  id: 0,
  name: '',
  title: '',
  subject: '',
  template: '',
  templateJson: '',
  networkId: 1,
  status: 1,
  rowVer: 1,
};

dayjs.extend(utc);

// Define the component with props
const AddTemplateModal = ({
  isOpen,
  toggle,
  template,
  fetchTemplates,
  onEdit,
  whatsappNetworkSettings,
  networkId,
}) => {
  const user = useSelector((state) => state.user);
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();
  const { postData, loading } = useApi('Template/submitcampaigntemplate');

  const [templateData, setTemplateData] = React.useState(defaultTemplateData);
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [showTestEmailModel, setShowTestEmailModel] = useState(false);

  useEffect(() => {
    if (!template || !isOpen) return;
    setTemplateData({
      id: template.id,
      name: template?.name || '',
      networkId: template?.networkId,
      subject: template?.subject || '',
      template: template?.template,
      title: template?.title,
      status: template?.status || 1,
      templateJson:
        (template?.networkId === 3 || template?.networkId === 2) && template?.templateJson
          ? template?.templateJson
          : null,
      rowVer: 1,
    });
  }, [template, isOpen]);

  useEffect(() => {
    if (!isOpen || !networkId || template) return;

    setTemplateData((prev) => ({ ...prev, networkId: networkId }));
  }, [template, isOpen, networkId]);

  const toggleEmailEditor = () => setShowEmailEditor((prev) => !prev);
  const toggleSendEmailModel = () => setShowTestEmailModel((prev) => !prev);

  // Handle user input changes
  const handleTemplateData = async (e, label) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setTemplateData((prevData) => ({ ...prevData, [name]: fieldValue }));
  };

  const onSubmit = async () => {
    formValidator();
    const form = document.querySelector('.template-form');
    if (!form.checkValidity()) {
      return;
    }
    if (templateData?.templateJson === '' && templateData?.networkId == 2) {
      showToast('Select template first.', 'warning');
      return;
    }

    if (templateData?.template === '' && templateData?.networkId != 2) {
      showToast('Save template first.', 'warning');
      return;
    }

    if (onEdit) {
      onEdit({
        ...templateData,
        createdAt: template ? template?.createdAt : dayjs().utc().format(),
        lastUpdatedAt: dayjs().utc().format(),
        createdBy: template ? template?.createdBy : user?.userId,
        lastUpdatedBy: user?.userId,
      });
      showToast(`${templateData?.name} has been edited successfully`, 'success');

      return;
    }

    const res = await postData({
      ...templateData,
      createdAt: template ? template?.createdAt : dayjs().utc().format(),
      lastUpdatedAt: dayjs().utc().format(),
      createdBy: template ? template?.createdBy : user?.userId,
      lastUpdatedBy: user?.userId,
    });

    if (res?.status === true) {
      showToast(res?.message, 'success');
      toggle();
      fetchTemplates();
      setTemplateData(defaultTemplateData);
    } else {
      showToast(res?.message, 'error');
    }
  };

  const onYes = () => {
    showConfirmation({ isOpen: false });
    setTemplateData(defaultTemplateData);
    toggle();
  };

  const confirmationModal = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel?',
      isOpen: true,
      onYes: () => onYes(),
      onNo: () =>
        showConfirmation({
          isOpen: false,
        }),
    });
  };

  const onSelectWhatsapp = (t) => {
    // WhatsApp Logic

    // 1. Get raw template data
    const rawTemplate = t.whatsappTemplate;
    // 2. Generate the defaults immediately
    const initialParams = generateInitialParameters(rawTemplate.components);
    // 3. Create the ONE TRUTH object
    const fullWhatsAppState = {
      templateName: rawTemplate.name,
      templateLanguage: rawTemplate.language,
      category: rawTemplate.category,
      templateId: rawTemplate.id,
      // Save the structure so the Editor can render the preview without needing 'selectedTemplate'
      components: rawTemplate.components,
      // Save the editable parameters
      parameters: initialParams,
    };

    setTemplateData((prev) => ({
      ...prev,
      templateJson: JSON.stringify(fullWhatsAppState), // Save EVERYTHING here
      name: rawTemplate.name,
      title: rawTemplate.language,
    }));
  };

  const templateInputFields = getTemplateInputFields(
    templateData,
    handleTemplateData,
    loading,
    onEdit,
    networkId,
  );
  return (
    <CModal
      visible={isOpen}
      alignment="center"
      size="lg"
      // aria-labelledby="template-modal"
      // aria-describedby="template-in-full-view"
      backdrop="static" // ⬅️ prevents closing on backdrop press
    >
      <CModalHeader closeButton={false}>
        <CModalTitle>{template ? 'Update ' + template?.name : 'Add'} Template</CModalTitle>
      </CModalHeader>
      <Form name="template-form">
        <CModalBody>
          {/* Render the template prop if provided, otherwise show a default message */}

          <Inputs inputFields={templateInputFields} isBtn={false}>
            {templateData?.networkId == 2 ? (
              <>
                {!templateData?.templateJson ? (
                  <WhatsappTemplate
                    WABA={whatsappNetworkSettings?.businessId || ''}
                    WAT={whatsappNetworkSettings?.apikeySecret || ''}
                    onSelect={onSelectWhatsapp}
                  />
                ) : (
                  <WhatsAppTemplateEditor
                    value={templateData.templateJson ? JSON.parse(templateData.templateJson) : null}
                    onChange={(updatedFullObject) => {
                      // The Editor gives us the full updated object, we just stringify and save
                      setTemplateData((prev) => ({
                        ...prev,
                        templateJson: JSON.stringify(updatedFullObject),
                      }));
                    }}
                    onClear={() =>
                      setTemplateData((prev) => ({
                        ...prev,
                        templateJson: '',
                      }))
                    }
                  />
                )}
              </>
            ) : templateData?.networkId != '3' ? (
              <SocialMediaTextEditor
                networkId={parseInt(templateData?.networkId)}
                value={templateData.template} // Ensure value is a string
                onChange={(e) => {
                  setTemplateData((prev) => ({
                    ...prev,
                    template: e,
                  }));
                }}
                placeholder="Message Template..."
              />
            ) : (
              <>
                <EmailTextEditor
                  isModal={false}
                  value={templateData?.templateJson ? JSON.parse(templateData?.templateJson) : null}
                  open={showEmailEditor}
                  toggle={toggleEmailEditor}
                  onSave={(html, design) => {
                    setTemplateData((prev) => ({
                      ...prev,
                      template: html,
                      templateJson: JSON.stringify(design),
                    }));
                    showToast('Email template saved', 'success');
                  }}
                />
              </>
            )}
          </Inputs>
        </CModalBody>
        <CModalFooter>
          <Button title="Close" onClick={confirmationModal} disabled={loading} />
          {templateData?.networkId === 3 && (
            <Button
              title="Send Test Email"
              onClick={toggleSendEmailModel}
              disabled={
                !(
                  templateData?.networkId === 3 &&
                  templateData?.title &&
                  templateData?.subject &&
                  templateData?.template
                )
              }
              className="w-auto px-4"
            />
          )}
          <Button title="Submit" onClick={onSubmit} type="submit" loading={loading} />
          <SendTestEmailModel
            isOpen={showTestEmailModel}
            toggle={toggleSendEmailModel}
            subject={templateData?.subject}
            title={templateData?.title}
            body={templateData?.template}
          />
        </CModalFooter>
      </Form>
    </CModal>
  );
};

// PropTypes for type checking
AddTemplateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  template: PropTypes.node, // Accepts any renderable content (JSX, string, etc.)
  fetchTemplates: PropTypes.func,
  onEdit: PropTypes.func,
  whatsappNetworkSettings: PropTypes.object,
  networkId: PropTypes.number,
};

// Default props
AddTemplateModal.defaultProps = {
  template: null,
};

export default AddTemplateModal;

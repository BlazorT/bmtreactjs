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

const defaultTemplateData = {
  id: 0,
  name: '',
  title: '',
  subject: '',
  template: '',
  networkId: 1,
  status: 1,
  rowVer: 1,
};

dayjs.extend(utc);

// Define the component with props
const AddTemplateModal = ({ isOpen, toggle, template, fetchTemplates }) => {
  const user = useSelector((state) => state.user);
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();
  const { postData, loading } = useApi('Template/submitcampaigntemplate');

  const [templateData, setTemplateData] = React.useState(defaultTemplateData);
  const [design, setDesign] = useState(null);
  const [showEmailEditor, setShowEmailEditor] = useState(false);

  const htmlToJSON = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const parseNode = (node) => {
      const jsonNode = { tagName: node.tagName.toLowerCase(), attributes: {}, children: [] };
      Array.from(node.attributes).forEach(({ name, value }) => {
        jsonNode.attributes[name] = value;
      });
      node.childNodes.forEach((childNode) => {
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          jsonNode.children.push(parseNode(childNode));
        } else if (childNode.nodeType === Node.TEXT_NODE) {
          jsonNode.children.push(childNode.nodeValue.trim());
        }
      });
      return jsonNode;
    };
    return parseNode(doc.body);
  };

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
      rowVer: 1,
    });
    if (template?.networkId === 3) {
      //   console.log(htmlToJSON(template?.template));
      setDesign(template?.template);
    }
  }, [template, isOpen]);

  const toggleEmailEditor = () => setShowEmailEditor((prev) => !prev);

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
    if (templateData?.template === '') {
      showToast('Save template first.');
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

  const templateInputFields = getTemplateInputFields(templateData, handleTemplateData, loading);
  return (
    <CModal
      visible={isOpen}
      alignment="center"
      size="sm"
      aria-labelledby="template-modal"
      aria-describedby="template-in-full-view"
      backdrop="static" // ⬅️ prevents closing on backdrop press
    >
      <CModalHeader closeButton={false}>
        <CModalTitle>{template ? 'Update ' + template?.name : 'Add'} Template</CModalTitle>
      </CModalHeader>
      <Form name="template-form">
        <CModalBody>
          {/* Render the template prop if provided, otherwise show a default message */}

          <Inputs inputFields={templateInputFields} isBtn={false}>
            {templateData?.networkId != '3' ? (
              <SocialMediaTextEditor
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
                  value={design}
                  open={showEmailEditor}
                  toggle={toggleEmailEditor}
                  onSave={(html, design) => {
                    console.log({ design, html });
                    setTemplateData((prev) => ({
                      ...prev,
                      template: html,
                    }));
                    setDesign(design);
                    showToast('Email template saved', 'success');
                  }}
                />
              </>
            )}
          </Inputs>
        </CModalBody>
        <CModalFooter>
          <Button title="Close" onClick={confirmationModal} disabled={loading} />
          <Button title="Submit" onClick={onSubmit} type="submit" loading={loading} />
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
};

// Default props
AddTemplateModal.defaultProps = {
  template: null,
};

export default AddTemplateModal;

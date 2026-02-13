import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import dayjs, { utc } from 'dayjs';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getVariableFormConfig } from 'src/configs/InputConfig/variableFormConfig';
import { formValidator } from 'src/helpers/formValidator';
import useApi from 'src/hooks/useApi';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Inputs from '../Filters/Inputs';
import Button from '../UI/Button';
import Form from '../UI/Form';
import SendTestEmailModel from './SendTestEmailModel';

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
const AddVariableModal = ({ isOpen, toggle, template, fetchTemplates, onEdit }) => {
  const user = useSelector((state) => state.user);
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();
  const { postData, loading } = useApi('Template/submitcampaigntemplate');

  const [templateData, setTemplateData] = React.useState(defaultTemplateData);
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
        template?.networkId === 3 && template?.templateJson ? template?.templateJson : null,
      rowVer: 1,
    });
  }, [template, isOpen]);

  const toggleSendEmailModel = () => setShowTestEmailModel((prev) => !prev);

  // Handle user input changes
  const handleTemplateData = async (e) => {
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

    if (onEdit) {
      onEdit({
        ...templateData,
        createdAt: template ? template?.createdAt : dayjs().utc().format(),
        lastUpdatedAt: dayjs().utc().format(),
        createdBy: template ? template?.createdBy : user?.userId,
        lastUpdatedBy: user?.userId,
      });
      showToast(`${template?.name} has been edited successfully`, 'success');

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

  const variableInputFields = getVariableFormConfig(
    templateData,
    handleTemplateData,
    loading,
    onEdit,
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
        <CModalTitle>{template ? 'Update ' + template?.name : 'Add'} Variable</CModalTitle>
      </CModalHeader>
      <Form name="template-form">
        <CModalBody>
          {/* Render the template prop if provided, otherwise show a default message */}

          <Inputs inputFields={variableInputFields} isBtn={false}></Inputs>
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
AddVariableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  template: PropTypes.node, // Accepts any renderable content (JSX, string, etc.)
  fetchTemplates: PropTypes.func,
  onEdit: PropTypes.func,
};

// Default props
AddVariableModal.defaultProps = {
  template: null,
};

export default AddVariableModal;

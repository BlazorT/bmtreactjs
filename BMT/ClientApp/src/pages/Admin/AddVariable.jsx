import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useNavigate, useLocation } from 'react-router-dom';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import { getVariableFormConfig } from 'src/configs/InputConfig/variableFormConfig';
import { formValidator } from 'src/helpers/formValidator';
import { useShowToast } from 'src/hooks/useShowToast';
import useApi from 'src/hooks/useApi';
import Form from 'src/components/UI/Form';
import Inputs from 'src/components/Filters/Inputs';
import AppContainer from 'src/components/UI/AppContainer';

/* ===============================
   DEFAULT DATA
================================ */
const defaultTemplateData = {
  id: 0,
  name: '',
  expression: '',
  isMandatory: 2,
  length: 0,
  dataTypeId: 1,
  fieldTypeId: 1,
  Networkid: 1,
  status: 1,
  rowVer: 1,
};

/* ===============================
   COMPONENT
================================ */
const AddVariable = ({ fetchTemplates }) => {
  const { state } = useLocation();
  const template = state?.template || null;

  const user = useSelector((state) => state.user);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const { postData, loading } = useApi('Template/submitvariable');

  const [templateData, setTemplateData] = useState(
    template || defaultTemplateData,
  );

  const isEditMode = !!template;

  const handleTemplateData = (e) => {
    const { name, value, type, checked } = e.target;

    // 🚫 Block space for Variable Name
    if (name === 'name' && value.includes(' ')) {
      showToast('Space not allowed', 'error');
      return; // stop update
    }

    setTemplateData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  console.log("user?.orgid", user?.orgId);
  const onSubmit = async () => {
    formValidator();

    const form = document.querySelector('.apply-da-form');
    if (!form || !form.checkValidity()) return;
    
    const payload = {
      ...templateData,
      createdAt: template?.createdAt || dayjs().utc().format(),
      lastUpdatedAt: dayjs().utc().format(),
      createdBy: template?.createdBy || user?.userId,
      orgId: user?.orgId,
      DefaultValue:""
    };

    const res = await postData(payload);

    if (res?.status) {
      showToast(
        isEditMode ? 'Variable updated successfully' : res?.message,
        'success',
      );
      setTemplateData(defaultTemplateData);
      fetchTemplates?.();
      navigate('/VariablesGridView');
    } else {
      showToast(res?.message, 'error');
    }
  };

  const variableInputFields = getVariableFormConfig(
    templateData,
    handleTemplateData,
    loading,
    isEditMode,
  );

  const goToAnotherPage = () => {
    navigate(user?.userId ? '/VariablesGridView' : '/');
  };

  return (
    <AppContainer>
      <DataGridHeader
        title="Variable"
        filterDisable={true}
      />
      {/* 🔴 className ADDED (IMPORTANT) */}
      <Form name="apply-da-form" className="apply-da-form">
        <Inputs
          inputFields={variableInputFields}
          isBtn
          submitFn={onSubmit}
          yesFn={goToAnotherPage}
        />
      </Form>
    </AppContainer>
  );
};

/* ===============================
   PROPS
================================ */
AddVariable.propTypes = {
  fetchTemplates: PropTypes.func,
};

export default AddVariable;

/* eslint-disable react/react-in-jsx-scope */
// userFormConfig.js

import { cilFlagAlt, cilUser } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import globalutil from 'src/util/globalutil';

/* ===============================
   DATA TYPE JSON (TOP)
================================ */
export const DATA_TYPES = [
  { id: 1, name: 'Int', value: 'int' },
  { id: 2, name: 'Text', value: 'text' },
  { id: 3, name: 'Date Time', value: 'datetime' },
  { id: 4, name: 'Image', value: 'image' },
];
export const Required = [
  { id: 1, name: 'Mandatory', value: 'mandatory' },
  { id: 2, name: 'Optional', value: 'optional' },
];
export const FIELD_TYPES = [
  { id: 1, name: 'TextBox', value: 'textbox' },
  { id: 2, name: 'DropDown', value: 'dropdown' },
  { id: 3, name: 'RadioButton', value: 'radiobutton' },
  { id: 4, name: 'CheckBox', value: 'checkbox' },
];

/* ===============================
   FORM CONFIG
================================ */
export const getVariableFormConfig = (
  templateData,
  handleTemplateData,
  loading,
  onEdit,
) => [
    /* -------- Network -------- */
    {
      component: CustomSelectInput,
      label: 'Network',
      icon: cilFlagAlt,
    id: 'networkid',
      options: globalutil?.networks(),
      className: 'form-control item form-select',
       value: templateData.networkid,
    name: 'networkid',
      onChange: (e) => handleTemplateData(e),
      isRequired: true,
      disableOption: 'Select Network',
      message: 'Select Network',
      //disabled: onEdit || loading || templateData?.id !== 0,
    },

    /* -------- Variable Name -------- */
    {
      component: CustomInput,
      label: 'Variable Name',
      value: templateData.name,
      onChange: handleTemplateData,
      icon: cilUser,
      type: 'text',
      id: 'name',
      name: 'name',
      placeholder: 'Variable Name',
      className: 'form-control item',
      isRequired: true,
      maxLength: 50,
      autoFocus: true,
      message: 'Enter Variable Name',
      disabled: loading,
    },
    /* -------- Length -------- */
    {
      component: CustomInput,
      label: 'Length',
      value: templateData.length,
      onChange: handleTemplateData,
      icon: cilUser,
      type: 'int',
      id: 'length',
      name: 'length',
      placeholder: 'length',
      className: 'form-control item',
      isRequired: true,
      maxLength: 50,
      autoFocus: true,
      message: 'Enter length',
      disabled: loading,
    },
    /* -------- Expression -------- */
    {
      component: CustomInput,
      label: 'Expression',
      value: templateData.expression,
      onChange: handleTemplateData,
      icon: cilUser,
      type: 'text',
      id: 'expression',
      name: 'expression',
      placeholder: 'expression',
      className: 'form-control item',
      isRequired: true,
      maxLength: 50,
      autoFocus: true,
      message: 'Enter expression',
      disabled: loading,
    },

    /* -------- Data Type -------- */
    {
      component: CustomSelectInput,
      label: 'Data Type',
      icon: cilFlagAlt,
      id: 'dataTypeId',
      options: DATA_TYPES,
      className: 'form-control item form-select',
      value: templateData.dataTypeId, // stores id (1,2,3,4)
      name: 'dataTypeId',
      onChange: (e) => handleTemplateData(e),
      isRequired: true,
      disableOption: 'Select Data Type',
      message: 'Select Data Type',
      //disabled: onEdit || loading || templateData?.id !== 0,
    },
    /* -------- Field Type -------- */
    {
      component: CustomSelectInput,
      label: 'Field Type',
      icon: cilFlagAlt,
      id: 'fieldTypeId',
      options: FIELD_TYPES,
      className: 'form-control item form-select',
      value: templateData.fieldTypeId, // stores id (1,2,3,4)
      name: 'fieldTypeId',
      onChange: (e) => handleTemplateData(e),
      isRequired: true,
      disableOption: 'Select Data Type',
      message: 'Select Data Type',
      //disabled: onEdit || loading || templateData?.id !== 0,
    },
    /* -------- requirement Type -------- */
    {
      component: CustomSelectInput,
      label: 'Is Mendatory?',
      icon: cilFlagAlt,
      id: 'isMandatory',
      options: Required,
      className: 'form-control item form-select',
      value: templateData.isMandatory, // stores id (1,2,3,4)
      name: 'isMandatory',
      onChange: (e) => handleTemplateData(e),
      isRequired: true,
      disableOption: 'Select Is Mendatory?',
      message: 'Select Is Mendatory?',
      //disabled: onEdit || loading || templateData?.id !== 0,
    },

    /* -------- Status -------- */
    {
      component: CustomSelectInput,
      label: 'Status',
      icon: cilFlagAlt,
      id: 'status',
      options: globalutil?.statuses()?.filter((s) => s.id === 1 || s.id === 2),
      className: 'form-control item form-select',
      value: templateData.status,
      name: 'status',
      onChange: (e) => handleTemplateData(e),
      isRequired: true,
      disableOption: 'Select Status',
      message: 'Select Status',
      disabled: loading,
    },
  ];

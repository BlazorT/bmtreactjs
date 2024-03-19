/* eslint-disable react/react-in-jsx-scope */
// userFormConfig.js

import {
  cilUser,
  cilEnvelopeClosed,
  cilScreenSmartphone,
  cilFlagAlt,
  cilInfo,
  cilCalendar
} from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import moment from 'moment';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import ImagePicker from 'src/components/UI/ImagePicker';
import globalutil from 'src/util/globalutil';

export const getCampaignAddConfig = (
  campaignRegData,
  handleCampaignAddForm,
  TermsModal,
) => [
 
  {
    component: CustomInput,
    label: 'Title',
    value: campaignRegData.name,
    onChange: handleCampaignAddForm,
    icon: cilUser,
    type: 'text',
    id: 'name',
    name: 'name',
    placeholder: 'Title / short description',
    className: 'form-control item',
    isRequired: true,
    maxLength: 20,
    // pattern: '.*[A-Z].*',
    message: 'Enter Title',
    autoFocus: true,
  },
  {
    component: CustomInput,
    label: '# Tag',
    value: campaignRegData.hashTags,
    onChange: handleCampaignAddForm,
    icon: cilUser,
    type: 'text',
    id: 'tag',
    name: 'tag',
    placeholder: '#tag',
    className: 'form-control item',
    isRequired: false,
    // maxLength: 10,
    // pattern: '.*[A-Z].*',
    message: 'Enter #Tag',
  },
  {
    component: CustomInput,
    label: 'Video Attachment',
    value: campaignRegData.attachments,
    onChange: handleCampaignAddForm,
    icon: cilEnvelopeClosed,
    type: 'file',
    id: 'attachments',
    name: 'attachments',
    className: 'form-control item',
    isRequired: false,
  },
    {
      component: CustomSelectInput,
      label: 'Status',
      icon: cilInfo,
      id: 'status',
      options: globalutil.statuses(),
      className: 'form-control item form-select',
      value: campaignRegData.status,
      name: 'status',
      onChange: (e) => handleCampaignAddForm(e),
      isRequired: false,
      disableOption: 'Select Status',
      message: 'Please select user status',
    },
 
    {
      component: CustomInput,
      label: 'Image Attachment',
      value: campaignRegData.attachments,
      onChange: handleCampaignAddForm,
      icon: cilEnvelopeClosed,
      type: 'file',
      id: 'attachments',
      name: 'attachments',
      className: 'form-control item',
      isRequired: false,
    },
    {
      component: CustomInput,
      label: 'Pdf Attachment',
      value: campaignRegData.attachments,
      onChange: handleCampaignAddForm,
      icon: cilEnvelopeClosed,
      type: 'file',
      id: 'attachments',
      name: 'attachments',
      className: 'form-control item',
      isRequired: false,
    },
    {
      component: CustomDatePicker,
      label: 'Campaign Start Date',
      value: campaignRegData.startDate,
      onChange: handleCampaignAddForm,
      icon: cilCalendar,
      id: 'startDate',
      name: 'startDate',
      className: 'form-control item',
      isRequired: false,
    },
    {
      component: CustomDatePicker,
      label: 'Campaign End Date',
      value: campaignRegData.endDate,
      onChange: handleCampaignAddForm,
      icon: cilCalendar,
      id: 'endDate',
      name: 'endDate',
      className: 'form-control item',
      isRequired: false,
    },
    {
      component: CFormCheck,
      label: 'Generate Auto Leads',
      value: campaignRegData.autoGenerateLeads,
      onChange: handleCampaignAddForm,
      icon: cilCalendar,
      id: 'autoGenerateLeads',
      name: 'autoGenerateLeads',
      className: 'mt-2',
      isRequired: false,
    },
 
];
export const getInitialCampaignData = (user) => ({
  id: 0,
  logoPath: '',
  name: '',
  status: 1,
  rowVer: 1,
  compaignDetailId: 0,
  isTermsAccepted: false,
  createdBy: user.userId,
  lastUpdatedBy: user.userId,
  createdAt: moment().utc().format(),
});

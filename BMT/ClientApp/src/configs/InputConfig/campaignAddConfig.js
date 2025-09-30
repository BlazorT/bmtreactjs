/* eslint-disable react/react-in-jsx-scope */
// userFormConfig.js
import dayjs from 'dayjs';

import {
  cilUser,
  cilEnvelopeClosed,
  cilScreenSmartphone,
  cilFlagAlt,
  cilInfo,
  cilCalendar,
} from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import ImagePicker from 'src/components/UI/ImagePicker';
import globalutil from 'src/util/globalutil';

export const getCampaignAddConfig = (campaignRegData, handleCampaignAddForm, TermsModal) => [
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
    id: 'hashTags',
    name: 'hashTags',
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
    onChange: (e) => handleCampaignAddForm(e, 'video'),
    icon: cilEnvelopeClosed,
    type: 'file',
    id: 'videoAttachment',
    name: 'videoAttachment',
    src: campaignRegData?.videoAttachment
      ? URL.createObjectURL(campaignRegData.videoAttachment)
      : null,
    helperText: campaignRegData?.videoAttachment?.name,
    className: 'form-control item',
    isRequired: false,
    accept: 'video/*',
  },

  {
    component: CustomInput,
    label: 'Image Attachment',
    onChange: (e) => handleCampaignAddForm(e, 'image'),
    icon: cilEnvelopeClosed,
    type: 'file',
    id: 'imageAttachment',
    name: 'imageAttachment',
    src: campaignRegData?.imageAttachment
      ? URL.createObjectURL(campaignRegData.imageAttachment)
      : null,
    helperText: campaignRegData?.imageAttachment?.name,
    className: 'form-control item',
    isRequired: false,
    accept: 'image/*',
  },

  {
    component: CustomInput,
    label: 'Pdf Attachment',
    onChange: (e) => handleCampaignAddForm(e, 'pdf'),
    icon: cilEnvelopeClosed,
    type: 'file',
    id: 'pdfAttachment',
    name: 'pdfAttachment',
    // src: 'pdf',
    helperText: campaignRegData?.pdfAttachment?.name,
    className: 'form-control item',
    isRequired: false,
    accept: 'application/pdf',
  },

  {
    component: CustomDatePicker,
    label: 'Campaign Start Date',
    value: campaignRegData.startTime,
    onChange: handleCampaignAddForm,
    icon: cilCalendar,
    id: 'startTime',
    name: 'startTime',
    className: 'form-control item',
    isRequired: false,
    minDate: dayjs(),
    maxDate: dayjs(campaignRegData.finishTime),
    disablePast: true, // 👈 allow past dates here
  },
  {
    component: CFormCheck,
    label: 'Generate Auto Leads',
    checked: campaignRegData.autoGenerateLeads,
    onChange: handleCampaignAddForm,
    id: 'autoGenerateLeads',
    name: 'autoGenerateLeads',
    className: 'item mt-4',
  },
  {
    component: CustomDatePicker,
    label: 'Campaign End Date',
    value: campaignRegData.finishTime,
    onChange: handleCampaignAddForm,
    icon: cilCalendar,
    id: 'finishTime',
    name: 'finishTime',
    className: 'form-control item',
    isRequired: false,
    minDate: dayjs(campaignRegData.startTime),
    disablePast: true, // 👈 allow past dates here
  },
];
export const getInitialCampaignData = (user) => {
  const now = dayjs();
  return {
    id: 0,
    logoPath: '',
    name: '',
    genderId: user?.genderId ?? 2, // ✅ if undefined, default to Men
    status: 1,
    rowVer: 1,
    compaignDetailId: 0,
    isTermsAccepted: false,
    createdBy: user.userId,
    lastUpdatedBy: user.userId,
    createdAt: now.utc().format(),
    startTime: now.format('YYYY-MM-DD HH:mm:ss'), // optional if needed
    finishTime: now.add(2, 'days').add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'), // optional if needed
  };
};

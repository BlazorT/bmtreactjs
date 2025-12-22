/* eslint-disable react/react-in-jsx-scope */
// userFormConfig.js
import dayjs from 'dayjs';

import { cilCalendar, cilEnvelopeClosed, cilUser } from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import HashtagInput from 'src/components/UI/HashtagInput';

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
    message: 'Enter Title',
    autoFocus: true,
  },
  {
    component: HashtagInput, // ✅ Use custom component
    label: '# Tag',
    value: campaignRegData.hashTags, // array
    onChange: handleCampaignAddForm,
    name: 'hashTags',
    placeholder: 'Enter hashtag and press Enter or comma',
  },
  {
    component: CustomInput,
    label: 'Media Attachment',
    info: '(MP4/3GP • Max 16MB)',
    onChange: (e) => handleCampaignAddForm(e, 'video'),
    icon: cilEnvelopeClosed,
    type: 'file',
    id: 'videoAttachment',
    name: 'videoAttachment',
    src: campaignRegData?.videoAttachment?.name,
    helperText: campaignRegData?.videoAttachment?.name,
    className: 'form-control item',
    isRequired: false,
    accept: 'video/mp4, video/3gpp', // ✅ MP4, 3GP, and GIF supported
  },
  {
    component: CustomInput,
    label: 'Image Attachment',
    info: '(PNG/JPEG/GIF • Max 5MB)',
    onChange: (e) => handleCampaignAddForm(e, 'image'),
    icon: cilEnvelopeClosed,
    type: 'file',
    id: 'imageAttachment',
    name: 'imageAttachment',
    src: campaignRegData?.imageAttachment?.id
      ? campaignRegData?.imageAttachment?.name
      : campaignRegData?.imageAttachment
        ? URL.createObjectURL(campaignRegData?.imageAttachment)
        : '',
    helperText: campaignRegData?.imageAttachment?.name,
    className: 'form-control item',
    isRequired: false,
    accept: 'image/png, image/jpeg, image/gif', // ✅ only PNG and JPEG
  },
  {
    component: CustomInput,
    label: 'Pdf Attachment',
    info: '(Max 100MB)',
    onChange: (e) => handleCampaignAddForm(e, 'pdf'),
    icon: cilEnvelopeClosed,
    type: 'file',
    id: 'pdfAttachment',
    name: 'pdfAttachment',
    src: campaignRegData?.pdfAttachment?.name,
    // src: 'pdf',
    helperText: campaignRegData?.pdfAttachment?.name,
    className: 'form-control item',
    isRequired: false,
    accept: 'application/pdf',
  },
  {
    component: CFormCheck,
    label: 'Generate Auto Leads',
    checked: campaignRegData.autoGenerateLeads,
    onChange: handleCampaignAddForm,
    id: 'autoGenerateLeads',
    name: 'autoGenerateLeads',
    className: 'item mt-4 pt-2 d-flex align-items-center',
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
  {
    component: 'RadioGroup',
    label: 'Status',
    name: 'status',
    value: campaignRegData.status,
    options: [
      { label: 'Active', value: 1 },
      { label: 'Paused', value: 2 },
      { label: 'Cancel', value: 3 },
    ],
    onChange: handleCampaignAddForm,
    className: 'item mt-3',
  },
];
export const getInitialCampaignData = (user) => {
  const now = dayjs();
  return {
    id: 0,
    logoPath: '',
    name: '',
    hashTags: [], // ✅ Store as array
    genderId: 1, // ✅ if undefined, default to Men
    status: 1,
    rowVer: 1,
    minAge: 18,
    maxAge: 65,
    locations: [],
    interests: [],
    compaignDetailId: 0,
    isTermsAccepted: false,
    createdBy: user.userId,
    lastUpdatedBy: user.userId,
    createdAt: now.utc().format(),
    startTime: now.format('YYYY-MM-DD HH:mm:ss'), // optional if needed
    finishTime: now.add(2, 'days').add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'), // optional if needed
  };
};

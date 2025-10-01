import { cilBuilding, cilCalendar, cilLink, cilLockLocked, cilUser } from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import dayjs, { utc } from 'dayjs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';

const getLabels = (networkId, labelId) => {
  if (labelId === 'businessId') {
    switch (networkId) {
      case 2:
        return 'Whatsapp Buisness Account Id';
      case 4:
        return 'X Client Id';
      case 5:
        return 'Facebook Page Id';
      case 6:
        return 'Instragram User Id';
      default:
        return 'Business Id'; // optional fallback
    }
  }
  if (labelId === 'apiKeySecret') {
    switch (networkId) {
      case 2:
        return 'Whatsapp Access Token ';
      case 4:
        return 'X Client Secret';
      case 5:
        return 'Facebook Access Token';
      case 6:
        return 'Instragram Page Access Token';
      default:
        return 'API Key'; // optional fallback
    }
  }
};

export const getNetworkInputFields = (
  networkState,
  handleNetworkSetting,
  networkId,
  organizationId,
) => [
  {
    component: CustomInput,
    label: getLabels(networkId, 'businessId'),
    icon: cilBuilding,
    value: networkState.businessId,
    onChange: handleNetworkSetting,
    type: 'text',
    id: 'businessId',
    name: 'businessId',
    placeholder: getLabels(networkId, 'businessId'),
    className: 'form-control item',
    isRequired: false,
    title: 'Business Id e.g(19288)',
  },
  {
    component: CustomInput,
    label: 'Key' + `${networkId === 5 ? ' (Facebook User Access Token)' : ''}`,
    icon: cilLockLocked,
    value: networkState.apikey,
    onChange: handleNetworkSetting,
    type: 'text',
    id: 'apikey',
    name: 'apikey',
    placeholder: 'API Key e.g(uk08l00**)',
    className: 'form-control item',
    isRequired: false,
    title: 'API Key e.g(uk08l00**)',
    message: 'Enter API Key',
  },
  {
    component: CustomInput,
    label: getLabels(networkId, 'apiKeySecret'),
    icon: cilLockLocked,
    value: networkState.apiKeySecret,
    onChange: handleNetworkSetting,
    type: 'text',
    id: 'apiKeySecret',
    name: 'apiKeySecret',
    placeholder: 'Secret Key e.g(uk08l00**)',
    className: 'form-control item',
    isRequired: false,
    title: 'Secret Key Secret e.g(uk08l00**)',
    message: 'Enter Secret Key',
  },
  {
    component: CustomInput,
    label: 'API Uri',
    icon: cilLink,
    value: networkState.apiuri,
    onChange: handleNetworkSetting,
    type: 'text',
    id: 'apiuri',
    name: 'apiuri',
    placeholder: 'API URI',
    className: 'form-control item',
    isRequired: false,
    message: 'Enter API Uri',
  },
  {
    component: CustomInput,
    label: 'Url',
    icon: cilLink,
    value: networkState.url,
    onChange: handleNetworkSetting,
    type: 'text',
    id: 'url',
    name: 'url',
    placeholder: 'Url e.g (https:/api.example.com)',
    className: 'form-control item',
    isRequired: false,
    title: 'Url e.g (https:/api.example.com)',
    message: 'Enter Url',
  },
  {
    component: CustomInput,
    label: 'Sender' + `${networkId === 2 ? ' (Whatsapp Phone Number Id)' : ''}`,
    icon: cilUser,
    value: networkState.sender,
    onChange: handleNetworkSetting,
    type: 'text',
    id: 'sender',
    name: 'sender',
    placeholder: 'Sender Email Account',
    className: 'form-control item',
    isRequired: false,
    title: 'Sender Email Account',
  },
  {
    component: CustomInput,
    label: 'Unit',
    icon: cilUser,
    value: networkState.unitId,
    onChange: handleNetworkSetting,
    type: 'number',
    id: 'unitId',
    name: 'unitId',
    placeholder: 'Enter Unit e.g (40)',
    className: 'form-control item',
    isRequired: false,
    title: 'Enter Unit e.g (40)',
    message: 'Enter Unit',
  },
  {
    component: CustomInput,
    label: 'Quota',
    icon: cilUser,
    value: networkState.purchasedQouta,
    onChange: handleNetworkSetting,
    type: 'number',
    id: 'purchasedQouta',
    name: 'purchasedQouta',
    placeholder: 'Purchased Qouta e.g (1000)',
    className: 'form-control item',
    isRequired: false,
    title: 'Purchased Qouta e.g (1000 Quantity Purchased)',
    message: 'Enter Purchased Qouta',
  },

  ...(networkId === 3 && organizationId === 1
    ? [
        {
          component: CustomInput,
          label: 'SMTP Server',
          icon: cilUser,
          value: networkState.smtpServer,
          onChange: handleNetworkSetting,
          type: 'text',
          id: 'smtpServer',
          name: 'smtpServer',
          placeholder: 'SMTP Server',
          className: 'form-control item',
          isRequired: false,
          title: 'SMTP Server',
        },
        {
          component: CustomInput,
          label: 'POP Server',
          icon: cilUser,
          value: networkState.popServer,
          onChange: handleNetworkSetting,
          type: 'text',
          id: 'popServer',
          name: 'popServer',
          placeholder: 'POP Server',
          className: 'form-control item',
          isRequired: false,
          title: 'POP Server',
        },
        {
          component: CustomInput,
          label: 'Port',
          icon: cilUser,
          value: networkState.port,
          onChange: handleNetworkSetting,
          type: 'number',
          id: 'port',
          name: 'port',
          placeholder: 'Port',
          className: 'form-control item',
          isRequired: false,
          title: 'Port ex. 9003',
        },

        {
          component: CustomInput,
          label: 'Mail Server Email Account',
          icon: cilUser,
          value: networkState.serverEmail,
          onChange: handleNetworkSetting,
          type: 'text',
          id: 'serverEmail',
          name: 'serverEmail',
          placeholder: 'Mail Server Email Account',
          className: 'form-control item',
          isRequired: false,
          title: 'Mail Server Email Account',
        },
        {
          component: CustomInput,
          label: 'Password',
          icon: cilUser,
          value: networkState.password,
          onChange: handleNetworkSetting,
          type: 'password',
          id: 'password',
          name: 'password',
          placeholder: 'Account Password',
          className: 'form-control item',
          isRequired: false,
          title: 'Account Password',
          autoComplete: 'off', // 👈 disables autocomplete/suggestions
        },
      ]
    : []),
  {
    component: CustomDatePicker,
    label: 'Date From',
    icon: cilCalendar,
    value: networkState.startTime,
    onChange: (e) => handleNetworkSetting(e, 'startTime'),
    id: 'startTime',
    name: 'startTime',
    title: 'Date From',
    maxDate: dayjs(networkState.finishTime),
  },
  {
    component: CustomDatePicker,
    label: 'Date To',
    icon: cilCalendar,
    value: networkState.finishTime,
    onChange: (e) => handleNetworkSetting(e, 'finishTime'),
    id: 'finishTime',
    name: 'finishTime',
    title: 'Date To',
    minDate: dayjs(networkState.startTime),
  },

  {
    component: CustomInput,
    label: 'Message - Message Interval (in seconds)',
    icon: cilUser,
    value: networkState.m2mIntervalSeconds,
    onChange: handleNetworkSetting,
    type: 'number',
    id: 'm2mIntervalSeconds',
    name: 'm2mIntervalSeconds',
    placeholder: 'Message - Message Interval (in seconds)',
    className: 'form-control item',
    isRequired: false,
  },
  {
    component: CustomInput,
    label: 'Auto Reply Message',
    icon: cilUser,
    value: networkState.autoReplyContent,
    onChange: handleNetworkSetting,
    type: 'text',
    id: 'autoReplyContent',
    name: 'autoReplyContent',
    placeholder: 'Auto Reply Message',
    className: 'form-control item',
    isRequired: false,
    title: 'Auto Reply Message',
  },
  {
    component: CFormCheck,
    id: 'autoReplyAllowed',
    label: 'Auto Reply Message',
    value: networkState.autoReplyAllowed,
    checked: networkState.autoReplyAllowed,
    name: 'autoReplyAllowed',
    className: 'mg-topset',
    onChange: handleNetworkSetting,
  },
  {
    component: CustomSelectInput,
    label: 'Auto Reply Attachment',
    icon: cilUser,
    value: networkState.replyAttachment,
    onChange: handleNetworkSetting,
    id: 'replyAttachment',
    name: 'replyAttachment',
    placeholder: 'Auto Reply Attachment',
    disableOption: 'Select Auto Reply Attachment',
    className: 'form-control item',
    isRequired: false,
    title: 'Auto Reply Attachment',
  },
  {
    component: CFormCheck,
    id: 'virtualAccount',
    label: 'Virtual Account',
    value: networkState.virtualAccount,
    checked: networkState.virtualAccount,
    name: 'virtualAccount',
    className: 'mg-topset',
    onChange: handleNetworkSetting,
  },
  {
    component: CFormCheck,
    id: 'status',
    label: 'Status',
    value: networkState.status,
    name: 'status',
    checked: networkState.status,
    className: 'mg-topset small-3',
    onChange: handleNetworkSetting,
  },
];

dayjs.extend(utc);
// Function to get initial user data
export const getInitialNetworkData = (organizationId, user, networkId) => ({
  id: 0,
  orgId: organizationId || user.orgId,
  name: '',
  attachment: '',
  excelAttachment: '',
  businessId: '',
  url: '',
  apiuri: '',
  sender: '',
  port: 0,
  apikey: '',
  templateSubject: '',
  templateTitle: '',
  apiKeySecret: '',
  password: '',
  autoReplyAllowed: 1,
  autoReplyContent: '',
  accountAuthData: '',
  replyAttachment: '',
  virtualAccount: 0,
  posttypejson: [],
  networkId: networkId,
  rowVer: 0,
  status: 1,
  Custom1: '',
  Custom2: '',
  m2mIntervalSeconds: 60,
  createdBy: user.userId,
  lastUpdatedBy: user.userId,
  startTime: dayjs().utc().format(),
  finishTime: dayjs().utc().format(),
  createdAt: dayjs().utc().startOf('month').format(),
  lastUpdatedAt: dayjs().utc().format(),
});

import { cilBuilding, cilCalendar, cilLink, cilLockLocked, cilUser } from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import dayjs, { utc } from 'dayjs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { packageUnits } from 'src/constants/constants';
import globalutil from 'src/util/globalutil';

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
      case 8:
        return 'Tiktok Client Id';
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
      case 8:
        return 'Tiktok Client Secret';
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
  ...(networkId !== 0
    ? [
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
      ]
    : []),

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

  ...(networkId === 3
    ? [
        {
          component: CustomInput,
          label: 'SMTP Server',
          icon: cilUser,
          value: networkState.smtpserver,
          onChange: handleNetworkSetting,
          type: 'text',
          id: 'smtpserver',
          name: 'smtpserver',
          placeholder: 'SMTP Server',
          className: 'form-control item',
          isRequired: false,
          title: 'SMTP Server',
        },
        {
          component: CustomInput,
          label: 'SMTP Port',
          icon: cilUser,
          value: networkState.smtpport,
          onChange: handleNetworkSetting,
          type: 'text',
          id: 'smtpport',
          name: 'smtpport',
          placeholder: 'Port',
          className: 'form-control item small-3',
          isRequired: false,
          title: 'Port ex. 9003',
        },
        {
          component: CFormCheck,
          id: 'smtpsslenabled',
          label: 'SMTP SSL Enabled',
          value: networkState.smtpsslenabled,
          checked: networkState.smtpsslenabled,
          name: 'smtpsslenabled',
          className: 'mg-topset small-3',
          onChange: handleNetworkSetting,
        },
        {
          component: CustomInput,
          label: 'SMTP User',
          icon: cilUser,
          value: networkState.smtpcreduser,
          onChange: handleNetworkSetting,
          type: 'text',
          id: 'smtpcreduser',
          name: 'smtpcreduser',
          placeholder: 'SMTP Server',
          className: 'form-control item',
          isRequired: false,
          title: 'SMTP Server',
        },
        {
          component: CustomInput,
          label: 'SMTP Password',
          icon: cilUser,
          value: networkState.smtpcredpwd,
          onChange: handleNetworkSetting,
          type: 'password',
          id: 'smtpcredpwd',
          name: 'smtpcredpwd',
          placeholder: 'SMTP Password',
          className: 'form-control item',
          isRequired: false,
          title: 'SMTP Password',
          autoComplete: 'off', // 👈 disables autocomplete/suggestions
        },
        {
          component: CustomInput,
          label: 'SMTP Secret Key',
          icon: cilUser,
          value: networkState.smtpsecretkey,
          onChange: handleNetworkSetting,
          type: 'text',
          id: 'smtpsecretkey',
          name: 'smtpsecretkey',
          placeholder: 'SMTP Secret Key',
          className: 'form-control item',
          isRequired: false,
          title: 'SMTP Secret Key',
        },
      ]
    : []),
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
    component: CustomSelectInput,
    label: 'Unit',
    icon: cilUser,
    id: 'unitId',
    options: globalutil.campaignunits(),
    // options: packageUnits,
    className: 'form-control item form-select',
    value: networkState.unitId,
    name: 'unitId',
    onChange: (e) => handleNetworkSetting(e),
    isRequired: parseInt(networkState?.price) > 0,
    disableOption: 'Select Unit',
    message: 'Please select unit',
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
    minDate: dayjs(),
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
    label: 'Price',
    icon: cilUser,
    value: networkState.price,
    onChange: handleNetworkSetting,
    type: 'text',
    id: 'price',
    name: 'price',
    placeholder: 'Pricing',
    className: 'form-control item',
    isRequired: false,
    title: 'Pricing',
  },
  {
    component: CustomInput,
    label: 'Discount',
    icon: cilUser,
    value: networkState.discount,
    onChange: handleNetworkSetting,
    type: 'text',
    id: 'discount',
    name: 'discount',
    placeholder: 'Discount',
    className: 'form-control item',
    isRequired: false,
    title: 'Discount',
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
  apikey: '',
  templateSubject: '',
  templateTitle: '',
  apiKeySecret: '',
  port: 0,
  smtpcreduser: '',
  smtpcredpwd: '',
  purchasedQouta: '',
  smtpsslenabled: 0,
  smtpsecretkey: '',
  smtpserver: '',
  smtpport: '',
  password: '',
  autoReplyAllowed: 1,
  autoReplyContent: '',
  accountAuthData: '',
  replyAttachment: '',
  unitId: '',
  virtualAccount: 0,
  posttypejson: [],
  networkId: networkId,
  rowVer: 0,
  status: 1,
  Custom1: '',
  Custom2: '',
  m2mIntervalSeconds: 60,
  price: '',
  discount: '',
  createdBy: user.userId,
  lastUpdatedBy: user.userId,
  startTime: dayjs().utc().format(),
  finishTime: dayjs().utc().format(),
  createdAt: dayjs().utc().startOf('month').format(),
  lastUpdatedAt: dayjs().utc().format(),
});

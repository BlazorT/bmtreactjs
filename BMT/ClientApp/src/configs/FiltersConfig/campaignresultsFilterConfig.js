// userFormConfig.js

import { cilCalendar, cilFlagAlt, cilUser } from '@coreui/icons';
import CustomSearch from 'src/components//InputsComponent/CustomSearch';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import CustomInput from 'src/components/InputsComponent/CustomInput';
export const campaignresultsFilterConfig = (filters, changeFilter, orgs, Role) => [
  {
    component: CustomInput,
    label: 'keyword',
    value: filters.recipient,
    onChange: changeFilter,
    icon: cilUser,
    type: 'text',
    id: 'recipient',
    name: 'recipient',
    placeholder: 'using by Network, Contact, Recipient',
    className: 'form-control item',
    isRequired: false,
    title: ' using by Network, Contact, Recipients',
  },
  {
    component: CustomSearch,
    label: 'Organization',
    value: filters.name,
    onChange: (e) => changeFilter(e, null, 'name', 'name'),
    icon: cilUser,
    type: 'text',
    id: 'name',
    data: orgs,
    name: 'name',
    placeholder: 'organization',
    className: 'form-control item',
    isRequired: false,
    title: 'name of organization',
    disabled: Role !== 1, // <-- This disables unless roleId is 1
  },

  // Multi-select for Networks
  {
    component: CustomSelectInput,
    label: 'Networks',
    value: filters.networkId || [],           // ← must be array []
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'networkId',
    name: 'networkId',
    disableOption: 'Select Networks',        // ignored when multiple=true
    options: globalutil.networks(),
    className: 'form-control item form-select',
    title: 'Networks',
    multiple: true,                          // ← this enables multi-select
  },
  {
    component: CustomSelectInput,
    label: 'Delivery Status',
    value: filters.deliveryStatus,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'deliveryStatus',
    name: 'deliveryStatus',
    disableOption: 'Select Delivery Status',
    options: globalutil.deliverstatus(),
    className: 'form-control item form-select',
    title: 'delivery Status ',
  },
  {
    component: CustomDatePicker,
    label: 'Date From ',
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'createdAt'),
    icon: cilCalendar,
    // title: ' DA Registration Date',
    isRequired: true,
    // min: dayjs(filters.createdAt),
    message: 'Enter Valid To Date',
  },
  {
    component: CustomDatePicker,
    label: 'Date To',
    value: filters.lastUpdatedAt,
    onChange: (e) => changeFilter(e, 'lastUpdatedAt'),
    icon: cilCalendar,
    // title: ' DA Registration Date',
    isRequired: true,
    // min: dayjs(filters.createdAt),
    message: 'Enter Valid To Date',
  },
 
];

// userFormConfig.js

import { cilFlagAlt, cilCalendar, cilUser } from '@coreui/icons';
import dayjs from 'dayjs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import CustomSearch from 'src/components//InputsComponent/CustomSearch';

export const getorgUsersFilterFields = (filters, changeFilter, orgs) => [
  {
    component: CustomSearch,
    label: 'Organization',
    value: filters.keyword,
    // onChange: setOrg,
    onChange: changeFilter,
    icon: cilUser,
    type: 'text',
    id: 'organization',
    data: Array.isArray(orgs) ? orgs : [],
    name: 'organization',
    placeholder: 'organization',
    className: 'form-control item',
    isRequired: false,
    title: 'name of organization',
  },
  {
    component: CustomSelectInput,
    label: 'Networks',
    value: filters.state,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'networks',
    name: 'networks',
    disableOption: 'Select Networks',
    options: globalutil.networks(),
    className: 'form-control item form-select',
    title: 'Networks',
  },
  
  {
    component: CustomDatePicker,
    label: 'Date To (Apply, Join)',
    value: filters.lastUpdatedAt,
    onChange: (e) => changeFilter(e, 'lastUpdatedAt'),
    icon: cilCalendar,
   // title: ' DA Registration Date',
    isRequired: true,
    min: dayjs(filters.createdAt),
    message: 'Enter Valid To Date',
  },
  //{
  //  component: CustomInput,
  //  label: ' #Tag',
  //  value: filters.tags,
  //  onChange: changeFilter,
  //  icon: cilFlagAlt,
  //  id: 'tags',
  //  name: 'tags',
  //  className: 'form-control item',
  //  title: '# tags',
  //},
];

// userFormConfig.js

import { cilFlagAlt, cilCalendar, cilUser } from '@coreui/icons';
import dayjs from 'dayjs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import CustomSearch from 'src/components//InputsComponent/CustomSearch';
import { useDispatch, useSelector } from 'react-redux';

export const getorgUsersFilterFields = (filters, changeFilter, orgs, Role) => [
  {
    component: CustomSearch,
    label: 'Organization',
    value: filters.name,
    // onChange: setOrg,
    onChange: changeFilter,
    icon: cilUser,
    type: 'text',
    id: 'name',
    data: orgs,
    name: 'name',
    placeholder: 'organization',
    className: 'form-control item',
    isRequired: false,
    title: 'name of organization',
    disabled: Role !== 1 // <-- This disables unless roleId is 1
  },

  {
    component: CustomSelectInput,
    label: 'Networks',
    value: filters.networks,
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
    component: CustomSelectInput,
    label: 'Status',
    value: filters.status,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'status',
    name: 'status',
    disableOption: 'Select Status',
    options: globalutil.statuses(),
    className: 'form-control item form-select',
    title: 'user status',
  },
  {
    component: CustomDatePicker,
    label: 'Date From (>=)',
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'createdAt'),
    icon: cilCalendar,
   // title: ' DA Registration Date',
    isRequired: true,
   // min: dayjs(filters.createdAt),
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

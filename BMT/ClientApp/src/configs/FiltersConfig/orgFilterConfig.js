// userFormConfig.js

import { cilFlagAlt, cilCalendar, cilUser } from '@coreui/icons';
import dayjs from 'dayjs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import CustomSearch from 'src/components//InputsComponent/CustomSearch';

export const getOrgFiltersFields = (filters, changeFilter, orgs, Role) => [
  {
    component: CustomSearch,
    label: 'Organization',
    value: orgs?.find((o) => o.id == filters.orgId) || '',
    onChange: (e) => changeFilter(e, 'orgId'),
    icon: cilUser,
    type: 'text',
    id: 'name',
    data: orgs,
    name: 'name',
    placeholder: 'Organization',
    isRequired: false,
    title: 'Name Of Organization',
    disabled: Role !== 1, // <-- This disables unless roleId is 1
  },
  {
    component: CustomSelectInput,
    label: 'Networks',
    value: filters.networkId,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'networkId',
    name: 'networkId',
    disableOption: 'Select Networks',
    options: globalutil.networks(),
    className: 'form-control item form-select',
    title: 'Networks',
  },

  {
    component: CustomDatePicker,
    label: 'Date >=',
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'createdAt'),
    icon: cilCalendar,
    // title: ' DA Registration Date',
    isRequired: true,
    min: dayjs(filters.createdAt),
    message: 'Enter Valid To Date',
  },
  //{
  //  component: CustomInput,
  //  label: ' #Tag',
  //  value: filters.HashTags,
  //  onChange: changeFilter,
  //  icon: cilFlagAlt,
  //  id: 'HashTags',
  //  name: 'HashTags',
  //  placeholder:'# hash tags',
  //  className: 'form-control item',
  //  title: '# tags',
  //},
  {
    component: CustomInput,
    label: 'Campaign Name',
    value: filters.name,
    onChange: (e) => changeFilter(e, 'name'), // ✅ pass fieldName
    icon: cilFlagAlt,
    id: 'name',
    name: 'name',
    placeholder: 'Campaign Name',
    className: 'form-control item',
    title: 'Campaign Names  ',
  },
];

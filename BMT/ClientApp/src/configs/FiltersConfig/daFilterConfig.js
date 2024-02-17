// userFormConfig.js

import { cilFlagAlt, cilCalendar, cilUser } from '@coreui/icons';
import dayjs from 'dayjs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';

export const getDaFiltersFields = (filters, changeFilter) => [
  {
    component: CustomInput,
    label: 'Name',
    value: filters.keyword,
    onChange: changeFilter,
    icon: cilUser,
    type: 'text',
    id: 'keyword',
    name: 'keyword',
    placeholder: 'Name, Contact, Email',
    className: 'form-control item',
    isRequired: false,
    title: ' Using Name, Contact, Email',
  },
  {
    component: CustomSelectInput,
    label: 'States',
    value: filters.state,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'state',
    name: 'state',
    disableOption: 'Select States',
    options: globalutil.states(),
    className: 'form-control item form-select',
    title: 'DA States',
  },
  {
    component: CustomDatePicker,
    label: 'Date From (Apply, Join)',
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'createdAt'),
    icon: cilCalendar,
    title: ' DA Registration Date',
    isRequired: true,
    max: dayjs(),
    message: 'Enter From Date',
  },
  {
    component: CustomDatePicker,
    label: 'Date To (Apply, Join)',
    value: filters.lastUpdatedAt,
    onChange: (e) => changeFilter(e, 'lastUpdatedAt'),
    icon: cilCalendar,
    title: ' DA Registration Date',
    isRequired: true,
    min: dayjs(filters.createdAt),
    message: 'Enter Valid To Date',
  },
  {
    component: CustomSelectInput,
    label: 'Boarding Status',
    value: filters.boardingStatus,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'boardingStatus',
    name: 'boardingStatus',
    disableOption: 'Select Boarding Status',
    options: globalutil.dastatuses(),
    className: 'form-control item form-select',
    title: ' DA Status',
  },
];

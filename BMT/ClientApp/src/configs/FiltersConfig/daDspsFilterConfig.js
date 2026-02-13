// userFormConfig.js

import { cilCalendar, cilFlagAlt, cilUser } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';

export const getDaDspsFiltersFields = (filters, changeFilter, cityList) => [
  {
    component: CustomInput,
    label: 'keyword',
    value: filters.keyword,
    onChange: changeFilter,
    icon: cilUser,
    type: 'text',
    id: 'keyword',
    name: 'keyword',
    placeholder: 'Name',
    className: 'form-control item',
    isRequired: false,
    title: ' using by Name, Contact, Email',
  },
  {
    component: CustomDatePicker,
    label: `Reg. Date (>=)`,
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'date'),
    icon: cilCalendar,
    title: ' DSPS Registration Date',
  },
  {
    component: CustomSelectInput,
    label: 'City',
    icon: cilFlagAlt,
    id: 'cityId',
    className: 'form-control item form-select',
    name: 'cityId',
    value: filters.cityId,
    onChange: changeFilter,
    isRequired: false,
    disableOption: 'Select City',
    message: 'Please select your city',
    options: cityList,
  },
];

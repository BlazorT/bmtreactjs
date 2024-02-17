// userFormConfig.js

import { cilList, cilFlagAlt, cilCalendar, cilUser } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';

export const getDaDspsFiltersFields = (filters, changeFilter) => [
  {
    component: CustomInput,
    label: 'keyword',
    value: filters.keyword,
    onChange: changeFilter,
    icon: cilUser,
    type: 'text',
    id: 'keyword',
    name: 'keyword',
    placeholder: 'Name, Contact, Email',
    className: 'form-control item',
    isRequired: false,
    title: ' using by Name, Contact, Email',
  },
  {
    component: CustomSelectInput,
    label: 'Buisness Type',
    value: filters.businessTypeId,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'businessTypeId',
    name: 'businessTypeId',
    options: globalutil.businesstypes(),
    disableOption: 'Select Business Type',
    className: 'form-control item form-select',
    title: ' Buisness Type',
  },
  {
    component: CustomSelectInput,
    label: 'Country',
    value: filters.country,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'country',
    name: 'country',
    disableOption: 'Select Country',
    options: globalutil.countries(),
    className: 'form-control item form-select',
    title: 'DA Country',
  },
  {
    component: CustomSelectInput,
    label: 'State / Province',
    value: filters.stateId,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'stateId',
    name: 'stateId',
    disableOption: 'Select State',
    options:
      filters.country === ''
        ? []
        : filters.country == 1
        ? globalutil.states().slice(0, 50)
        : globalutil.states().slice(50),
    className: 'form-control item form-select',
    title: 'DA State',
  },
  {
    component: CustomDatePicker,
    label: `Reg. Date (>=)`,
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'date'),
    icon: cilCalendar,
    title: ' DSPS Registration Date',
  },
];

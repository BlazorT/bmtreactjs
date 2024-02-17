// userFormConfig.js

import { cilList, cilCalendar, cilGraph } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';

export const getInventoryDispatchFiltersFields = (filters, changeFilter) => [
  {
    component: CustomInput,
    label: 'keyword',
    value: filters.keyword,
    onChange: changeFilter,
    icon: cilList,
    type: 'text',
    id: 'keyword',
    name: 'keyword',
    placeholder: 'Product name, UPC code',
    className: 'form-control item',
    isRequired: false,
    title: ' Using Product name, UPC code'
  },
  {
    component: CustomSelectInput,
    label: 'Product For',
    value: filters.businessEntityId,
    onChange: changeFilter,
    icon: cilGraph,
    id: 'businessEntityId',
    name: 'businessEntityId',
    disableOption: 'Select Business Entity',
    options: globalutil.businessentities(),
    className: 'form-control item form-select',
    title: ' Business Entity'
  },
  
  {
    component: CustomDatePicker,
    label: 'Date From',
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'createdAt'),
    icon: cilCalendar,
    title: ' Dispatchment Registration Date'
  },
  {
    component: CustomDatePicker,
    label: 'Date To',
    value: filters.lastUpdatedAt,
    onChange: (e) => changeFilter(e, 'lastUpdatedAt'),
    icon: cilCalendar,
    title: ' Dispatchment Updated Time'
  },
  {
    component: CustomSelectInput,
    label: 'Category',
    value: filters.categoryId,
    onChange: changeFilter,
    icon: cilGraph,
    disableOption: 'Select Product Category',
    id: 'categoryId',
    name: 'categoryId',
    options: globalutil.productGroup(),
    className: 'form-control item form-select',
    title: ' Product Category'
  },
];

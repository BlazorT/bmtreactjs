/* eslint-disable @typescript-eslint/no-explicit-any */

import { cilList, cilFlagAlt, cilCalendar } from '@coreui/icons';
import dayjs, { Dayjs } from 'dayjs';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import { FilterField } from 'src/components/Filters/CustomFilters';

export const getUsersFiltersFields = (
  filters: any,
  changeFilter: (e: any, date?: string) => void,
): FilterField[] => [
  {
    component: CustomInput,
    label: 'keyword',
    value: filters.keyword,
    onChange: changeFilter,
    icon: cilList,
    type: 'text',
    id: 'keyword',
    name: 'keyword',
    placeholder: 'Name, Contact, Email',
    className: 'form-control item',
    isRequired: false,
    title: 'using by Name, Contact, Email',
  },
  {
    component: CustomSelectInput,
    label: 'Status',
    value: filters.status,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'status',
    name: 'status',
    disableOption: 'Select DA Status',
    options: globalutil.statuses(),
    className: 'form-control item form-select',
    title: 'DA status',
  },
  {
    component: CustomDatePicker,
    label: 'Date From (Apply, Join)',
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'createdAt'),
    icon: cilCalendar,
    max: dayjs(),
    title: ' User Registration date',
  },
  {
    component: CustomDatePicker,
    label: 'Date To (Apply, Join)',
    value: filters.lastUpdatedAt,
    onChange: (e) => changeFilter(e, 'lastUpdatedAt'),
    icon: cilCalendar,
    min: dayjs(filters.createdAt),
    title: ' User Registration date',
  },
];

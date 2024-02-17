// userFormConfig.js

import { cilFlagAlt, cilCalendar, cilUser } from '@coreui/icons';
import dayjs from 'dayjs';
import CustomSearch from 'src/components/InputsComponent/CustomSearch';

import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';

export const getInspectionFiltersFields = (usersData, filters, changeFilter) => [
  {
    component: CustomSearch,
    label: 'Inspector Name',
    value: filters.driverName,
    onChange: changeFilter,
    placeholder: 'Search inspectors...',
    icon: cilUser,
    id: 'driverName',
    name: 'driverName',
    data: usersData.current?.data?.data.filter((insp) => insp.roleId !== 3),
    // className: 'form-control item form-select',
    title: 'Driver name or inspector name',
  },
  {
    component: CustomSelectInput,
    label: 'Report Type',
    value: filters.status,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'status',
    name: 'status',
    disableOption: 'Select Report Type Status',
    options: globalutil.inspectionstatuses(),
    className: 'form-control item form-select',
    title: 'report status',
  },
  {
    component: CustomDatePicker,
    label: 'Date From (Apply, Join)',
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'createdAt'),
    icon: cilCalendar,
    isRequired: true,
    max: dayjs(),
    title: 'inspection registraion date',
  },
  {
    component: CustomDatePicker,
    label: 'Date To (Apply, Join)',
    value: filters.lastUpdatedAt,
    onChange: (e) => changeFilter(e, 'lastUpdatedAt'),
    icon: cilCalendar,
    isRequired: true,
    min: dayjs(filters.createdAt),
    title: 'inspection registraion date',
  },
];

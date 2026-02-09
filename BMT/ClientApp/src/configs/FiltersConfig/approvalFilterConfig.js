// userFormConfig.js

import { cilCalendar, cilUser } from '@coreui/icons';
import CustomSearch from 'src/components//InputsComponent/CustomSearch';
import CustomDatePicker from 'src/components/UI/DatePicker';

export const approvalFilterConfig = (filters, changeFilter, orgs, roleId) => [
  {
    component: CustomSearch,
    label: 'Organization',
    value: filters.name,
    onChange: (e) => changeFilter(e, 'name', 'name'), // ✅ fixed
    icon: cilUser,
    type: 'text',
    id: 'name',
    data: orgs,
    name: 'name',
    placeholder: 'Organization',
    isRequired: false,
    title: 'Name Of Organization',
    disabled: roleId !== 1,
  },
  {
    component: CustomDatePicker,
    label: 'Date (>=)',
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'createdAt'),
    icon: cilCalendar,
    // title: ' DA Registration Date',
    isRequired: true,
    // min: dayjs(filters.createdAt),
    message: 'Enter Valid To Date',
  },
];

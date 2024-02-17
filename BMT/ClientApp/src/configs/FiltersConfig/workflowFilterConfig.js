// userFormConfig.js

import { cilList, cilFlagAlt, cilCalendar } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';

export const getWorkflowFiltersFields = (filters, changeFilter) => [
  {
    component: CustomInput,
    label: 'keyword',
    value: filters.keyword,
    onChange: changeFilter,
    icon: cilList,
    type: 'text',
    id: 'keyword',
    name: 'keyword',
    placeholder: 'workflow name, task name, ancestor, predecessor',
    isRequired: false,
    title: ' using by workflow name, task name, ancestor, predecessor',
  },
  {
    component: CustomSelectInput,
    label: 'Status',
    value: filters.currentStatus,
    onChange: changeFilter,
    disableOption: 'Select Status',
    icon: cilFlagAlt,
    id: 'currentStatus',
    name: 'currentStatus',
    options: globalutil.commonstatuses(),
    title: ' Workflow status',
  },
  {
    component: CustomDatePicker,
    label: 'DSP Reg. Date (>=)',
    value: filters.createdAt,
    onChange: (e) => changeFilter(e, 'createdAt'),
    icon: cilCalendar,
    title: ' DSP registration date',
  },
];

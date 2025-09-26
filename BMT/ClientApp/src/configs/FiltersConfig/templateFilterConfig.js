/* eslint-disable @typescript-eslint/no-explicit-any */

import { cilFlagAlt, cilList } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import globalutil from 'src/util/globalutil';

export const getTemplateFilters = (filters, changeFilter) => [
  {
    component: CustomInput,
    label: 'Keyword',
    value: filters.keyword,
    onChange: changeFilter,
    icon: cilList,
    type: 'text',
    id: 'keyword',
    name: 'keyword',
    placeholder: 'Template name, title',
    className: 'form-control item',
    isRequired: false,
    title: 'using by Name',
  },
  {
    component: CustomSelectInput,
    label: 'Network',
    value: filters.networkId,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'networkId',
    name: 'networkId',
    disableOption: 'Select Network',
    options: globalutil.networks(),
    className: 'form-control item form-select',
    title: '',
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
    options: globalutil?.statuses()?.filter((s) => s.id === 1 || s.id === 2),
    className: 'form-control item form-select',
    title: 'status',
  },
];

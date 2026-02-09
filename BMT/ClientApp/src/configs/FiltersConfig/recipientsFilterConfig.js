// userFormConfig.js

import { cilFlagAlt, cilCalendar, cilUser } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import globalutil from 'src/util/globalutil';
import CustomSearch from 'src/components//InputsComponent/CustomSearch';

export const getRecipientsFilterConfig = (filters, changeFilter, orgs, Role, albums) => [
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
    disabled: Role !== 1,
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
    component: CustomSelectInput,
    label: 'Album',
    value: filters.albumid,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'albumid',
    name: 'albumid',
    optionsList: (ol) =>
      `${ol?.name} (${globalutil.networks()?.find((n) => n?.id === ol?.networkid)?.name || ''})`,
    disableOption: 'Select Networks',
    options: filters.networkId ? albums?.filter((a) => a?.networkid == filters.networkId) : albums,
    className: 'form-control item form-select',
    title: 'Album',
  },
  {
    component: CustomInput,
    label: 'Recipients',
    value: filters.contentId,
    onChange: changeFilter,
    icon: cilFlagAlt,
    id: 'contentId',
    name: 'contentId',
    placeholder: 'recipients e.g (0301300...)',
    className: 'form-control item',
    title: 'recipients',
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

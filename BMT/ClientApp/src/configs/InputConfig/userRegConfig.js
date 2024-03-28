/* eslint-disable react/react-in-jsx-scope */
// userFormConfig.js

import {
  cilUser,
  cilEnvelopeClosed,
  cilLockLocked,
  cilScreenSmartphone,
  cilFlagAlt,
  cilInfo,
} from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import moment from 'moment';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import ImagePicker from 'src/components/UI/ImagePicker';
import globalutil from 'src/util/globalutil';

export const getUserInputFields = (
  daUserData,
  handleUserInput,
  handleFocus,
  emailReadonly,
  user,
  location,
  emailMessage,
  userNameMessage,
  inputRef,
  dspsListRes,
  TermsModal,
  onBlur,
  cityList
) => [
  {
    component: ImagePicker,
    image: daUserData.avatar,
    name: 'avatar',
    onChange: (e) => handleUserInput(e, 'avatar'),
  },
  {
    component: CustomInput,
    label: 'First Name',
    value: daUserData.firstName,
    onChange: handleUserInput,
    icon: cilUser,
    type: 'text',
    id: 'FirstName',
    name: 'firstName',
    placeholder: 'First Name',
    className: 'form-control item',
    isRequired: true,
    maxLength: 10,
    // pattern: '.*[A-Z].*',
    inputRef: inputRef,
    autoFocus: true,
    message: 'Enter First Name',
  },
  {
    component: CustomInput,
    label: 'Middle Name',
    value: daUserData.middleName,
    onChange: handleUserInput,
    icon: cilUser,
    type: 'text',
    id: 'middleName',
    name: 'middleName',
    placeholder: 'Middle Name',
    className: 'form-control item',
    isRequired: false,
    maxLength: 10,
    // pattern: '.*[A-Z].*',
    message: 'Enter Middle Name',
  },
  {
    component: CustomInput,
    label: 'Last Name',
    value: daUserData.lastName,
    onChange: handleUserInput,
    icon: cilUser,
    type: 'text',
    id: 'lastName',
    name: 'lastName',
    placeholder: 'Last Name',
    className: 'form-control item',
    isRequired: true,
    maxLength: 10,
    // pattern: '.*[A-Z].*',
    message: 'Enter Last Name',
  },
  {
    component: CustomInput,
    label: 'Ims',
    value: daUserData.ims,
    onChange: handleUserInput,
    icon: cilEnvelopeClosed,
    type: 'text',
    id: 'ims',
    name: 'ims',
    placeholder: 'Instant message Id',
    className: 'form-control item',
    isRequired: false,
    
  },
  {
    component: CustomInput,
    label: 'Email',
    value: daUserData.email,
    onChange: handleUserInput,
    icon: cilUser,
    type: 'text',
    id: 'email',
    name: 'email',
    placeholder: 'email',
    className: 'form-control item',
    isRequired: true,

    // pattern: '.*[A-Z].*',
    message: emailMessage,
  },
  {
    component: CustomInput,
    label: 'Password',
    value: daUserData.password,
    onChange: handleUserInput,
    icon: cilLockLocked,
    type: 'password',
    id: 'password',
    name: 'password',
    placeholder: 'Enter Password',
    className: 'form-control item',
    isRequired: true,
    readOnly: user.userId === daUserData.id || location.state === null ? false : true,
    // pattern: '.*[A-Z].*',
    message: 'Enter valid password',
  },
  //{
  //  component: CustomInput,
  //  label: 'User ID',
  //  value: daUserData.userId,
  //  onChange: handleUserInput,
  //  icon: cilUser,
  //  type: 'text',
  //  id: 'userId',
  //  name: 'userId',
  //  placeholder: 'Enter User ID',
  //  className: 'form-control item',
  //  isRequired: true,
  //  maxLength: 14,
  //  // pattern: '.*[A-Z].*',
  //  message: 'Enter valid user id',
  //},
  {
    component: CustomInput,
    label: 'Contact',
    value: daUserData.contact,
    onChange: handleUserInput,
    icon: cilScreenSmartphone,
    type: 'number',
    id: 'contact',
    name: 'contact',
    placeholder: 'Enter Contact e.g (0301*****)',
    className: 'form-control item',
    isRequired: true,
    maxLength: 14,
    // pattern: '[0-9]{3}[0-9]{3}[0-9]{4}',
    message: 'Enter valid contact number',
  },
  //{
  //  component: CFormCheck,
  //  name: 'isWhatsappAsso',
  //  checked: daUserData.isWhatsappAsso,
  //  onChange: handleUserInput,
  //  className: 'mt-5',
  //  id: 'flexCheckChecked',
  //  label: 'Is this whatsapp associated?',
  //},
  {
    component: CustomSelectInput,
    label: 'State',
    icon: cilFlagAlt,
    id: 'country',
    options: globalutil.states(),
    className: 'form-control item form-select',
    value: daUserData.country,
    name: 'country',
    onChange: (e) => handleUserInput(e),
    isRequired: true,
    disableOption: 'Select State',
    message: 'Please select your country',
  },
  {
    component: CustomSelectInput,
    label: 'City',
    icon: cilFlagAlt,
    id: 'stateId',
    className: 'form-control item form-select',
    value: daUserData.stateId,
    name: 'stateId',
    onChange: (e) => handleUserInput(e),
    isRequired: false,
    disableOption: daUserData.country === '' ? 'Select Country First' : 'Select City',
    message: 'Please select your city',
    options: cityList
     
  },
  {
    component: CustomSelectInput,
    label: 'Status',
    icon: cilInfo,
    id: 'status',
    options: globalutil.statuses(),
    className: 'form-control item form-select',
    value: daUserData.status,
    name: 'status',
    onChange: (e) => handleUserInput(e),
    isRequired: false,
    disableOption: 'Select Status',
    message: 'Please select user status',
  },
  {
    component: CustomSelectInput,
    label: 'Role',
    icon: cilInfo,
    id: 'roleId',
    options: globalutil
      .userroles()
      .filter((role) => role.name !== 'DA' && role.name !== 'Driver Helper'),
    className: 'form-control item form-select',
    value: daUserData.roleId,
    name: 'roleId',
    onChange: (e) => handleUserInput(e),
    isRequired: true,
    disableOption: 'Select Role',
    message: 'Please select user role',
  },
  //{
  //  component: CustomSelectInput,
  //  label: 'DSP',
  //  icon: cilInfo,
  //  id: 'dspid',
  //  options: dspsListRes,
  //  className: 'form-control item form-select',
  //  value: daUserData.dspid,
  //  name: 'dspid',
  //  onChange: (e) => handleUserInput(e),
  //  isRequired: true,
  //  disableOption: 'Select DSP',
  //  message: 'Please select user dsp',
  //},
  {
    component: CustomInput,
    label: 'Mailing Address',
    value: daUserData.address,
    onChange: handleUserInput,
    icon: cilUser,
    type: 'text',
    id: 'address',
    name: 'address',
    placeholder: 'Enter Mailing Address',
    className: 'form-control item',
  },
  //{
  //  component: CFormCheck,
  //  name: 'isTermsAccepted',
  //  checked: daUserData.isTermsAccepted,
  //  onChange: handleUserInput,
  //  className: 'mt-3 d-flex flex-row justify-content-center',
  //  id: 'isTermsAccepted',
  //  required: true,
  //  label: (
  //    <span>
  //      By providing this info, you agree to our terms & conditions, read our{' '}
  //      <strong className="lblTerms" onClick={TermsModal}>
  //        Terms & Conditions (EULA)
  //      </strong>
  //    </span>
  //  ),
  //},
];
// Function to get initial user data
export const getInitialUserData = (user, role) => ({
  id: 0,
  avatar: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  contact: '',
  orgId: user.orgId,
  genderId: 1,
  roleId: role,
  status: 1,
  cityId: 1,
  password: '',
  userName: '',
  ims: '',
  securityToken: '',      
  userCode: '',
  rowVer: 1,
  paymentDetailId: 0,
  createdBy: user.userId,
  createdAt: moment().utc().format(),
  registrationTime: moment().utc().format(),

  lastUpdatedAt: moment().utc().format(),
});

// userFormConfig.js

import {
  cilUser,
  cilEnvelopeClosed,
  cilScreenSmartphone,
  cilFlagAlt,
  cilInfo,
  cilDescription,
  cilCalendar,
  cilLink,
  cilItalic,
} from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import dayjs from 'dayjs';
import moment from 'moment';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import ImagePicker from 'src/components/UI/ImagePicker';
import { generateRandomNumbers } from 'src/helpers/generatePassowrd';
import globalutil from 'src/util/globalutil';

export const getDaAppllyInputs = (
  daUserData,
  handleUserInput,
  handleFocus,
  emailReadonly,
  emailMessage,
  canAdd,
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
    label: ' Name',
    value: daUserData.name,
    onChange: handleUserInput,
    icon: cilUser,
    type: 'text',
    id: 'name',
    name: 'name',
    placeholder: 'Name Of Organization e.g. (BMT, Alexa Traders)',
    className: 'form-control item',
    isRequired: true,
    maxLength: 20,
    // pattern: '.*[A-Z].*',
    autoFocus: true,
    disabled: canAdd === 0,
    message: 'Enter Organization Name',
  },

  {
    component: CustomInput,
    label: 'Email Address',
    value: daUserData.email,
    onChange: handleUserInput,
    icon: cilEnvelopeClosed,
    type: 'email',
    id: 'email',
    name: 'email',
    placeholder: 'Email Address e.g. john***deody@gmail.com',
    className: 'form-control item',
    isRequired: true,
    onBlur: onBlur,
    // pattern: '.*[A-Z].*',
    message: emailMessage,
   // onClick: handleFocus,
    disabled: canAdd === 0,
   // readOnly: emailReadonly,
  },
  {
    component: CustomInput,
    label: 'Contact',
    value: daUserData.contact,
    onChange: handleUserInput,
    icon: cilScreenSmartphone,
    type: 'tel',
    id: 'contact',
    name: 'contact',
    placeholder: 'Contact,+1(973) 2345XXX1',
    className: 'form-control item',
    isRequired: true,
    maxLength: 14,
   // pattern: '[0-9]{3}[0-9]{3}[0-9]{4}',
    message: 'Enter valid contact number Format: 1234567890',
    disabled: canAdd === 0,
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
    isRequired: true,
    disabled: canAdd === 0,
    disableOption: 'Select Status',
    message: 'Please select status',
  },
 
  {
    component: CustomInput,
    label: ' Address',
    value: daUserData.mailAddress,
    onChange: handleUserInput,
    icon: cilUser,
    type: 'text',
    id: 'mailAddress',
    name: 'mailAddress',
    placeholder: 'Enter Mailing Address',
    className: 'form-control item',
  },
    {
      component: CustomInput,
      label: ' Iban Or Wire Transfer Id',
      value: daUserData.ibanorWireTransferId,
      onChange: handleUserInput,
      icon: cilUser,
      type: 'text',
      id: 'ibanorWireTransferId',
      name: 'ibanorWireTransferId',
      placeholder: 'Iban or Wire Transfer Id e.g. (123*****)',
      className: 'form-control item',
    },
    {
      component: CustomInput,
      label: ' Whatsapp',
      value: daUserData.whatsapp,
      onChange: handleUserInput,
      icon: cilUser,
      type: 'text',
      id: 'whatsapp',
      name: 'whatsapp',
      placeholder: 'WhatsApp,+1(973) 2345XXX1',
      className: 'form-control item',
    },
    {
      component: CustomInput,
      label: ' Instagram',
      value: daUserData.instagram,
      onChange: handleUserInput,
      icon: cilUser,
      type: 'text',
      id: 'instagram',
      name: 'instagram',
      placeholder: 'instagram id',
      className: 'form-control item',
    },
    {
      component: CustomInput,
      label: ' Facebook',
      value: daUserData.fb,
      onChange: handleUserInput,
      icon: cilUser,
      type: 'text',
      id: 'fb',
      name: 'fb',
      placeholder: 'Facebook id',
      className: 'form-control item',
    },
    {
      component: CustomSelectInput,
      label: 'Currency',
      icon: cilInfo,
      id: 'currencyId',
      options: globalutil.currencies(),
      className: 'form-control item form-select',
      value: daUserData.currencyId,
      name: 'currencyId',
      onChange: (e) => handleUserInput(e),
      isRequired: false,
      disabled: canAdd === 0,
      disableOption: 'Select currency',
      message: 'Please select currency',
    },
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
      isRequired: false,
      disableOption: 'Select Country',
      message: 'Please select your country',
    },
    {
      component: CustomSelectInput,
      label: 'City',
      icon: cilFlagAlt,
      id: 'cityId',
      className: 'form-control item form-select',
      value: daUserData.cityId,
      name: 'cityId',
      onChange: (e) => handleUserInput(e),
      isRequired: false,
      disableOption: daUserData.country === '' ? 'Select Country First' : 'Select City',
      message: 'Please select your city',
      options: cityList
    },
    {
      component: CustomInput,
      label: 'Strength',
      value: daUserData.strength,
      onChange: handleUserInput,
      icon: cilUser,
      type: 'text',
      id: 'strength',
      name: 'strength',
      placeholder: 'strength',
      className: 'form-control item',
    },
];

export const getDaAppllySsnInputs = (daIdentificationData, handleDAIdentification) => [
  {
    component: CustomSelectInput,
    label: 'Country',
    icon: cilFlagAlt,
    id: 'country',
    //options: globalutil.countries(),
    className: 'form-control item form-select',
    value: daIdentificationData.ssnCountry,
    name: 'ssnCountry',
    onChange: (e) => handleDAIdentification(e),
    isRequired: false,
    message: 'Please select your country',
  },
  {
    component: CustomSelectInput,
    label: 'State / Province',
    icon: cilFlagAlt,
    options:
      daIdentificationData.ssnCountry === ''
        ? []
        : daIdentificationData.ssnCountry === 1
        ? globalutil.states().slice(0, 50)
        : globalutil.states().slice(50),
    className: 'form-control item form-select',
    value: daIdentificationData.ssnState,
    id: 'state',
    name: 'ssnState',
    onChange: (e) => handleDAIdentification(e),
    isRequired: false,
    message: 'Please select your state',
  },
  {
    component: CustomInput,
    label: 'SSN NO',
    value: daIdentificationData.ssnNo,
    onChange: (e) => handleDAIdentification(e),
    icon: cilItalic,
    type: 'text',
    id: 'ssnNo',
    name: 'ssnNo',
    placeholder: 'SSN NO',
    className: 'form-control item',
    isRequired: false,
    maxLength: 14,
    message: 'enter SSN NO',
  },
  {
    component: CustomInput,
    label: 'Attch Copy (Front)',
    value: daIdentificationData.ssnFront,
    onChange: (e) => handleDAIdentification(e),
    accept: 'image/*',
    icon: cilLink,
    type: 'file',
    id: 'ssnFront',
    name: 'ssnFront',
    placeholder: 'SSN copy front upload',
    className: 'form-control item',
    isRequired: false,
    message: 'SSN copy front upload',
  },
  {
    component: CustomInput,
    label: 'Attch Copy (Back)',
    value: daIdentificationData.ssnBack,
    onChange: (e) => handleDAIdentification(e),
    accept: 'image/*',
    icon: cilLink,
    type: 'file',
    id: 'ssnBack',
    name: 'ssnBack',
    placeholder: 'SSN copy back upload',
    className: 'form-control item',
    isRequired: false,
    message: 'SSN copy back upload',
  },
];
export const getDaAppllyIDInputs = (daIdentificationData, handleDAIdentification) => [
  {
    component: CustomSelectInput,
    label: 'Country',
    icon: cilFlagAlt,
    id: 'idCountry',
   // options: globalutil.countries(),
    className: 'form-control item form-select',
    value: daIdentificationData.idCountry,
    name: 'idCountry',
    onChange: (e) => handleDAIdentification(e),
    isRequired: false,
    message: 'Please select your country',
  },
  {
    component: CustomSelectInput,
    label: 'State / Province',
    icon: cilFlagAlt,
    id: 'state',
    options:
      daIdentificationData.idCountry === ''
        ? []
        : daIdentificationData.idCountry === 1
        ? globalutil.states().slice(0, 50)
        : globalutil.states().slice(50),
    className: 'form-control item form-select',
    value: daIdentificationData.idState,
    name: 'idState',
    onChange: (e) => handleDAIdentification(e),
    isRequired: false,
    message: 'Please select your country',
  },
  {
    component: CustomInput,
    label: 'ID No',
    value: daIdentificationData.idNo,
    onChange: handleDAIdentification,
    icon: cilItalic,
    type: 'text',
    id: 'idNo',
    name: 'idNo',
    maxLength: 14,
    placeholder: 'ID NO',
    className: 'form-control item',
    isRequired: false,
    message: 'enter ID NO',
  },
  {
    component: CustomInput,
    label: 'Attach Copy (Front)',
    value: daIdentificationData.idFront,
    onChange: handleDAIdentification,
    accept: 'image/*',
    icon: cilLink,
    type: 'file',
    id: 'idFront',
    name: 'idFront',
    placeholder: 'id copy front upload',
    className: 'form-control item',
    isRequired: false,
    message: 'id copy front upload',
  },
  {
    component: CustomInput,
    label: 'Attach Copy (back)',
    value: daIdentificationData.idBack,
    onChange: handleDAIdentification,
    accept: 'image/*',
    icon: cilLink,
    type: 'file',
    id: 'idBack',
    name: 'idBack',
    placeholder: 'id copy back upload',
    className: 'form-control item',
    isRequired: false,
    message: 'id copy back upload',
  },
];
export const getDaAppllyBirthInputs = (daIdentificationData, handleDAIdentification) => [
  {
    component: CustomSelectInput,
    label: 'Country',
    icon: cilFlagAlt,
    id: 'bCertificateCountry',
   // options: globalutil.countries(),
    className: 'form-control item form-select',
    value: daIdentificationData.bCertificateCountry,
    name: 'bCertificateCountry',
    onChange: (e) => handleDAIdentification(e),
    isRequired: false,
    message: 'Please select your country',
  },
  {
    component: CustomSelectInput,
    label: 'State / Province',
    icon: cilFlagAlt,
    id: 'state',
    options:
      daIdentificationData.bCertificateCountry === ''
        ? []
        : daIdentificationData.bCertificateCountry === 1
        ? globalutil.states().slice(0, 50)
        : globalutil.states().slice(50),
    className: 'form-control item form-select',
    value: daIdentificationData.bCertificateState,
    name: 'bCertificateState',
    onChange: (e) => handleDAIdentification(e),
    isRequired: false,
    message: 'Please select your country',
  },
  {
    component: CustomInput,
    label: 'Birth Certificate No',
    value: daIdentificationData.bCertificateNo,
    onChange: handleDAIdentification,
    icon: cilLink,
    type: 'text',
    id: 'bCertificateNo',
    name: 'bCertificateNo',
    placeholder: 'Birth Certificate No',
    className: 'form-control item',
    isRequired: false,
    maxLength: 14,
    message: 'Birth Certificate No',
  },
  {
    component: CustomInput,
    label: 'Attach Copy',
    value: daIdentificationData.bCertificateFile,
    onChange: handleDAIdentification,
    icon: cilLink,
    type: 'file',
    accept: 'image/*',
    id: 'bCertificateFile',
    name: 'bCertificateFile',
    placeholder: 'birth certificate copy upload',
    className: 'form-control item',
    isRequired: false,
    message: 'birth certificate copy upload',
  },
];

export const getInitialDaData = (user) => ({
  id: 0,
  currencyId: 1,
  stateId: 1,
  cityId: 1,
  rowVer: 1,
  avatar: '',
  name: '',
  userCode: '',
  contact: '',
  email: '',
  whatsapp: '',
  instagram: '',
  fb: '',
  ibanorWireTransferId: '',
 // orgId: user.orgId,
  status: 1,
  strength: 0,
  genderId: 1,
  isTermsAccepted: false,
  mailAddress: '',
  paymentDetailId: 0,
  createdAt: moment().utc().format(),
  registrationTime: moment().utc().format(),
  lastUpdatedAt: moment().utc().format(),
  createdBy: user.userId,
  lastUpdatedBy: user.userId,
});
export const getInitialDaIdentificationData = () => ({
  ssnCountry: '',
  idCountry: '',
  bCertificateCountry: '',
  ssnState: '',
  idState: '',
  bCertificateState: '',
  ssnNo: '',
  ssnFront: '',
  ssnBack: '',
  idNo: '',
  idFront: '',
  idBack: '',
  bCertificateNo: '',
  bCertificateFile: '',
  additionalInfo: '',
});

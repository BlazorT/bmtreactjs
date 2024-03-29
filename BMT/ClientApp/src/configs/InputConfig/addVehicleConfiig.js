// userFormConfig.js

import { cilUser, cilCarAlt, cilList, cilCode, cilColorPalette, cilCheck } from '@coreui/icons';
import globalutil from 'src/util/globalutil';

export const getVehicleInputs = (daUserData, handleUserInput) => [
  {
    label: 'Fleet ID',
    value: daUserData.fleetId,
    onChange: handleUserInput,
    icon: cilList,
    type: 'text',
    id: 'fleetId',
    name: 'fleetId',
    placeholder: 'Fleet ID',
    className: 'form-control item',
    isRequired: true,
    // maxLength: 10,
    // pattern: '.*[A-Z].*',
    message: 'Enter Fleet ID',
  },
  {
    label: 'Vehicle Name',
    value: daUserData.vehicleName,
    onChange: handleUserInput,
    icon: cilList,
    type: 'text',
    id: 'vehicleName',
    name: 'vehicleName',
    placeholder: 'Vehicle Name',
    className: 'form-control item',
    isRequired: true,
    // maxLength: 10,
    // pattern: '.*[A-Z].*',
    message: 'Enter Vehicle Name',
  },
  {
    label: 'Model Year',
    value: daUserData.model,
    onChange: handleUserInput,
    icon: cilCarAlt,
    type: 'number',
    id: 'model',
    name: 'model',
    placeholder: 'Modal Year',
    className: 'form-control item',
    isRequired: true,
    // maxLength: 4,
    // pattern: '.*[A-Z].*',
    message: 'Please enter a valid model year',
  },
  {
    label: 'Number Plate',
    value: daUserData.vehiclePlate,
    onChange: handleUserInput,
    icon: cilList,
    type: 'text',
    id: 'vehiclePlate',
    name: 'vehiclePlate',
    placeholder: 'Vehicle Number Plate',
    className: 'form-control item',
    isRequired: true,
    // maxLength: 10,
    // pattern: '.*[A-Z].*',
    message: 'Enter Vehicle Number Plate',
  },
  // {
  //   label: 'Color',
  //   icon: cilColorPalette,
  //   type: 'text',
  //   value: daUserData.color,
  //   onChange: handleUserInput,
  //   id: 'color',
  //   name: 'color',
  //   placeholder: 'enter color of vehicle',
  //   isRequired: true,
  //   message: 'please enter color of vehicle',
  // },
  {
    label: 'Vehicle Code | VIN',
    value: daUserData.vehicleCode,
    onChange: handleUserInput,
    icon: cilCode,
    type: 'text',
    id: 'vehicleCode',
    name: 'vehicleCode',
    placeholder: 'Vehicle Code | VIN',
    className: 'form-control item',
    message: 'enter VIN number',
  },
  {
    label: 'Address',
    value: daUserData.address,
    onChange: handleUserInput,
    icon: cilUser,
    type: 'text',
    id: 'address',
    name: 'address',
    placeholder: 'Vehicle Address',
    className: 'form-control item',
    isRequired: false,

  },
  {
    label: 'Card Number',
    value: daUserData.cardNumber,
    onChange: handleUserInput,
    icon: cilUser,
    type: 'text',
    id: 'cardNumber',
    name: 'cardNumber',
    placeholder: 'card number',
    className: 'form-control item',
    isRequired: false,

  },
];
export const getVehicleSelects = (vehicleFormData, handleVehicleData, daList) => [
  {
    label: 'Make',
    icon: cilCarAlt,
    value: vehicleFormData.make,
    onChange: handleVehicleData,
    id: 'make',
    name: 'make',
    disableOption:'Select Vehicle Make',
    options: globalutil.makes(),
    isRequired: true,
    message: 'Please select make of vehicle',
  },
  {
    label: 'Ownership Type',
    icon: cilList,
    value: vehicleFormData.ownershipType,
    onChange: handleVehicleData,
    id: 'ownershipType',
    disableOption: 'Select Ownership Type',
    name: 'ownershipType',
    options: globalutil.ownerships(),
    isRequired: false,
  },
  {
    label: 'Vehicle Type',
    icon: cilCarAlt,
    value: vehicleFormData.vehicleType,
    onChange: handleVehicleData,
    name: 'vehicleType',
    id: 'vehicleType',
    disableOption: 'Select Vehicle Type',
    options: globalutil.vehicletypes(),
    isRequired: false,
  },
  {
    label: 'Driver',
    icon: cilUser,
    value: vehicleFormData.driverName,
    onChange: handleVehicleData,
    name: 'driverName',
    id: 'driverName',
    disableOption: 'Select Vehicle Driver',
    options:
      vehicleFormData.assistantDriver != ''
        ? daList?.filter((item) => item.id != vehicleFormData.assistantDriver)
        : daList,
    isRequired: false,
  },
  vehicleFormData.vehicleType == 10 && vehicleFormData.vehicleType !== ''
    ? {
        label: 'Assistant Driver',
        icon: cilUser,
        value: vehicleFormData.assistantDriver,
        onChange: handleVehicleData,
        name: 'assistantDriver',
        id: 'assistantDriver',
        options: daList?.filter((item) => item.id != vehicleFormData.driverName),
        isRequired: false,
      }
    : null, // Set to null if the condition is not met
  {
    label: 'Status',
    icon: cilCheck,
    value: vehicleFormData.status,
    onChange: handleVehicleData,
    name: 'status',
    id: 'status',
    disableOption: 'Select Status',
    options: globalutil.vehiclestatuss(),
    isRequired: false,
  },
];

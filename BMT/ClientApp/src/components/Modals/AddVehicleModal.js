import React, { useEffect, useState } from 'react';

import { cilCalendar } from '@coreui/icons';

import { CCol, CRow } from '@coreui/react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import CustomInput from '../InputsComponent/CustomInput';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import { formValidator } from 'src/helpers/formValidator';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import useFetch from 'src/hooks/useFetch';

import { getVehicleInputs, getVehicleSelects } from 'src/configs/InputConfig/addVehicleConfiig';
import CustomDatePicker from '../UI/DatePicker';
import moment from 'moment';
import dayjs from 'dayjs';
import LoadingBtn from '../UI/LoadingBtn';

const AddVehicleModal = (prop) => {
  const { header, onCancel, isOpen, vehicle, fetchVehicleData, daList } = prop;
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    response: addVehicleRes,
    error: addVehicleErr,
    loading: addVehicleLoading,
    fetchData: addVehicle,
  } = useFetch();

  let editData;

  useEffect(() => {
    if (vehicle) {
      editData = {
        id: vehicle.id,
        fleetId: vehicle.fleetCode,
        make: vehicle.makeDetailId,
        model: vehicle.model,
        vehicleName: vehicle.name,
        vehicleCode: vehicle.code,
        ownershipType: vehicle.ownershipTypeId,
        vehicleType: vehicle.categoryId !== null ? vehicle.categoryId : '',
        driverName: vehicle.assignedDAId !== null ? vehicle.assignedDAId : '',
        assistantDriver: vehicle.helperDriverId !== null ? vehicle.helperDriverId : '',
        contractExp: vehicle.expiryDate,
        status: vehicle.status !== null ? vehicle.status : '',
        color: vehicle.color,
        address: vehicle.address,
        vehiclePlate: vehicle.numberPlate,
        createdBy: vehicle.createdBy,
        lastUpdatedBy: user.userId,
      };
      setVehicleFormData(editData);
    }
  }, []);
  const initialFormData = {
    id: 0,
    fleetId: '',
    make: '',
    model: '',
    vehicleName: '',
    vehicleCode: '',
    ownershipType: '',
    vehicleType: '',
    driverName: '',
    assistantDriver: '',
    contractExp: moment().add(1, 'day').utc().format(),
    status: '',
    color: '',
    address: '',
    vehiclePlate: '',
    createdBy: user.userId,
    lastUpdatedBy: user.userId,
  };

  const [vehicleFormData, setVehicleFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const handleVehicleData = (event, label) => {
    if (label === 'contractExp') {
      setVehicleFormData((prevFilters) => ({
        ...prevFilters,
        [label]: moment(event).utc().format(),
      }));
    } else {
      const { name, value } = event.target;
      if (name === 'model') {
        checkVehicleModel(event.target.value);
      }

      setVehicleFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const checkVehicleModel = async (value) => {
    const emailInputElement = document.getElementById('model');
    const currentYear = new Date().getFullYear();

    const isValidModel =
      value.toString().length === 4 &&
      !isNaN(parseInt(value, 10)) &&
      parseInt(value, 10) <= currentYear;

    if (!isValidModel) {
      emailInputElement.setCustomValidity(`already associated with existing account`);
    } else {
      emailInputElement.setCustomValidity('');
    }
    // const form = emailInputElement.closest('form');
    // if (form) {
    //   form.addEventListener('submit', (event) => {
    //     if (!form.checkValidity()) {
    //       event.preventDefault();
    //     }
    //     form.classList.add('was-validated');
    //   });
    // }
  };
  const onSave = async () => {
    formValidator();
    checkVehicleModel(vehicleFormData.model);
    const form = document.querySelector('.add-vehicle-form');
    if (form.checkValidity()) {
      const vehicleBody = {
        id: vehicleFormData.id,
        dspid: user.dspId.toString(),
        makeDetailId: vehicleFormData.make,
        model: vehicleFormData.model,
        name: vehicleFormData.vehicleName,
        color: '',
        code: vehicleFormData.vehicleCode,
        status: vehicleFormData.status,
        expiryDate: vehicleFormData.contractExp,
        ownershipTypeId: vehicleFormData.ownershipType,
        categoryId: vehicleFormData.vehicleType,
        address: vehicleFormData.address,
        numberPlate: vehicleFormData.vehiclePlate,
        assignedDAId: parseInt(vehicleFormData.driverName),
        helperDriverId: parseInt(vehicleFormData.assistantDriver),
        fleetCode: vehicleFormData.fleetId,
        createdBy: vehicleFormData.createdBy,
        lastUpdatedBy: vehicleFormData.lastUpdatedBy,
      };

      setIsLoading(true);
      await addVehicle(
        '/Vehicles/submitvehicle',
        {
          method: 'POST',
          body: JSON.stringify(vehicleBody),
        },
        (res) => {
          if (res.status === true) {
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: res.message,
                toastVariant: 'success',
              }),
            );

            onCancel();
            fetchVehicleData();
          } else {
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: res.message,
                toastVariant: 'error',
              }),
            );
          }
        },
      );
      setIsLoading(false);
    }
  };

  const onCancelBtn = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: 'Are you sure you want to cancel?',
        isOpen: true,
        onYes: () => onYesConfirm(),
        onNo: () => onNoConfirm(),
      }),
    );
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    // setIsConfirmMdlOpen(false);
  };
  const onYesConfirm = () => {
    onCancel();
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );

    // setVehicleFormData({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const vehicleInputs = getVehicleInputs(vehicleFormData, handleVehicleData);
  const vehicleSelects = getVehicleSelects(vehicleFormData, handleVehicleData, daList);
  return (
    <>
      <Modal
        isOpen={isOpen}
        size="lg"
        backdrop={true}
        fullscreen="lg"
        className="w-100 "
        centered={true}
      >
        <form noValidate className="needs-validation add-vehicle-form" onSubmit={handleSubmit}>
          <ModalHeader className="confirmation-modal-header">{header}</ModalHeader>
          <ModalBody className="confirmation-modal-body">
            <CRow>
              <CCol md={6} className="border-right-1px">
                {vehicleInputs.map((input, index) => (
                  <CustomInput
                    key={index}
                    label={input.label}
                    value={input.value}
                    onChange={input.onChange}
                    icon={input.icon}
                    type={input.type}
                    id={input.id}
                    name={input.name}
                    placeholder={input.placeholder}
                    className={input.className}
                    isRequired={input.isRequired}
                    maxLength={input.maxLength}
                    pattern={input.pattern}
                    message={input.message}
                    readOnly={input.readOnly}
                    onClick={input.onClick}
                  />
                ))}
              </CCol>
              <CCol md={6}>
                {vehicleSelects
                  .filter((item) => item !== null)
                  .map((input, index) => (
                    <CustomSelectInput
                      key={index}
                      label={input.label}
                      icon={input.icon}
                      id={input.id}
                      options={input.options}
                      className={input.className}
                      value={input.value}
                      name={input.name}
                      onChange={input.onChange}
                      isRequired={input.isRequired}
                      disableOption={input.disableOption}
                      message={input.message}
                    />
                  ))}
                <CustomDatePicker
                  icon={cilCalendar}
                  label="Contract Expiry"
                  value={vehicleFormData.contractExp}
                  onChange={(e) => handleVehicleData(e, 'contractExp')}
                  isRequired={true}
                  min={dayjs().add(1, 'day')}
                  message={'Enter Valid Exp Date'}
                />
              </CCol>
            </CRow>
          </ModalBody>
          <ModalFooter className="confirmation-modal-footer">
            {isLoading ? (
              <LoadingBtn
                title={`${vehicleFormData.id === 0 ? 'Adding' : 'Updating'} Vehicle...`}
              />
            ) : (
              <React.Fragment>
                <button
                  type="button"
                  className="btn_Default m-2 sales-btn-style"
                  onClick={() => onCancelBtn()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn_Default m-2 sales-btn-style"
                  onClick={() => onSave()}
                >
                  Save
                </button>
              </React.Fragment>
            )}
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
};

export default AddVehicleModal;

import React, { useState } from 'react';

import CIcon from '@coreui/icons-react';

import { cilCalendar, cilUser } from '@coreui/icons';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import CustomInput from '../InputsComponent/CustomInput';
import { useDispatch } from 'react-redux';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import { formValidator } from 'src/helpers/formValidator';

const DSPListModal = (prop) => {
  const { isOpen, toggle } = prop;
  const dispatch = useDispatch();

  const initialData = {
    name: '',
    lastName: '',
    sole: '',
    DOB: '',
    contact: '',
    isAuthority: false,
  };
  const [dspsLitsData, setDspsLitsData] = useState(initialData);

  const handleDspsList = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setDspsLitsData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const onSave = () => {
    formValidator();

    const form = document.querySelector('.dsps-list-form');
    if (form.checkValidity()) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'partner added succesfully',
          toastVariant: 'success',
        }),
      );
      toggle();
    }
  };

  const onCancel = () => {
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

  const onYesConfirm = () => {
    toggle();
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    setDspsLitsData(initialData);
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader>
        <h5 className="labelName">Add New Partner</h5>
      </ModalHeader>
      <ModalBody className="paddingAllSide">
        <form
          className="needs-validation dsps-list-form"
          noValidate
          onSubmit={(e) => e.preventDefault()}
        >
          <div className=" text-center">
            <div className="row">
              <div className="col-md-6">
                <CustomInput
                  label="Name"
                  icon={cilUser}
                  type="text"
                  value={dspsLitsData.name}
                  onChange={handleDspsList}
                  id="name"
                  name="name"
                  className="form-control item "
                  placeholder="enter full name"
                  isRequired={true}
                  message="please enter name"
                />
              </div>
              <div className="col-md-6">
                <CustomInput
                  label="Last Name"
                  icon={cilUser}
                  type="text"
                  value={dspsLitsData.lastName}
                  onChange={handleDspsList}
                  id="lastName"
                  name="lastName"
                  className="form-control item "
                  placeholder="enter last name"
                  isRequired={true}
                  message="please enter last name"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <CustomInput
                  label="Sole"
                  icon={cilUser}
                  type="text"
                  value={dspsLitsData.sole}
                  onChange={handleDspsList}
                  id="sole"
                  name="sole"
                  className="form-control item "
                  placeholder="enter sole"
                  isRequired={false}
                  message="please enter name"
                />
              </div>
              <div className="col-md-6">
                <CustomInput
                  label="Date Of Birth"
                  icon={cilCalendar}
                  type="date"
                  value={dspsLitsData.DOB}
                  onChange={handleDspsList}
                  id="DOB"
                  name="DOB"
                  className="form-control item "
                  placeholder="date of birth"
                  isRequired={false}
                  message="please enter name"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <CustomInput
                  label="Contact"
                  icon={cilUser}
                  type="text"
                  value={dspsLitsData.contact}
                  onChange={handleDspsList}
                  id="contact"
                  name="contact"
                  className="form-control item "
                  placeholder="enter contact"
                  isRequired={false}
                  message="please enter name"
                />
              </div>
              <div className="col-md-6">
                <div className=" custom-control checkbox-animate text-start">
                  <label htmlFor="isAuthority" className="labelName">
                    <input
                      type="checkbox"
                      name="isAuthority"
                      id="isAuthority"
                      onChange={handleDspsList}
                      checked={dspsLitsData.isAuthority}
                    />
                    <span className="input-check"></span>Decision Making Authority
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="CenterAlign pt-2">
            <button
              onClick={() => onCancel()}
              type="button"
              className="btn btn_Default m-2 sales-btn-style"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave()}
              type="submit"
              className="btn btn_Default sales-btn-style m-2"
            >
              Submit
            </button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
export default DSPListModal;

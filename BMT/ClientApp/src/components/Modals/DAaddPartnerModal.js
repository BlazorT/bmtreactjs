import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { cilCalendar, cilEnvelopeClosed, cilUser } from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import moment from 'moment';
import dayjs from 'dayjs';

import CustomInput from '../InputsComponent/CustomInput';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { formValidator } from 'src/helpers/formValidator';
import { updateToast } from 'src/redux/toast/toastSlice';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import useEmailVerification from 'src/hooks/useEmailVerification';
import validateEmail from 'src/helpers/validateEmail';
import { useShowToast } from 'src/hooks/useShowToast';

const DAaddPartnerModal = (prop) => {
  const { isOpen, toggle, partner, rows, setRows, isAdd, allPartners } = prop;

  const { data, loading, error, checkEmailValidation } = useEmailVerification();
  const showToast = useShowToast();

  useEffect(() => {
    if (partner && isOpen) {
      editPartnerData = {
        id: partner.uid,
        fullName: partner.fullName,
        businessName: partner.businessName,
        pEmail: partner.email,
        dob: partner.dob,
        primaryContact: partner.primaryContact,
        createdAt: partner.createdAt,
        lastUpdatedAt: moment().utc().format(),
        decisionMakingAuthority:
          partner.decisionMakingAuthority == 1 || partner.decisionMakingAuthority == true
            ? true
            : false,
        createdBy: partner.createdBy,
        lastUpdatedBy: user.userId,
      };
      setPartnerData(editPartnerData);
    } else {
      setPartnerData(initialData);
    }
  }, [isOpen]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  let editPartnerData;

  const initialData = {
    id: 0,
    fullName: '',
    businessName: '',
    pEmail: '',
    dob: moment().subtract(18, 'years'),
    primaryContact: '',
    createdAt: moment().utc().format(),
    lastUpdatedAt: moment().utc().format(),
    decisionMakingAuthority: false,
    createdBy: user.userId,
    lastUpdatedBy: user.userId,
  };

  const [partnerData, setPartnerData] = useState(initialData);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');

  const handleAddPartner = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    if (name === 'decisionMakingAuthority' && fieldValue) {
      if (!initialData.decisionMakingAuthority) {
        const hasDecisionTrue = allPartners.some(
          (partner) =>
            partner.decisionMakingAuthority == true || partner.decisionMakingAuthority == 1,
        );

        if (hasDecisionTrue) {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: `you already has a decision maker partner`,
              toastVariant: 'warning',
            }),
          );
        }

        setPartnerData((prevData) => ({
          ...prevData,
          decisionMakingAuthority: hasDecisionTrue ? false : fieldValue,
        }));
      } else {
        setPartnerData((prevData) => ({
          ...prevData,
          decisionMakingAuthority: fieldValue,
        }));
      }
    } else {
      setPartnerData((prevData) => ({
        ...prevData,
        [name]: fieldValue,
      }));
    }
  };

  const onBlur = async () => {
    const fieldValue = partnerData.pEmail;
    if (validateEmail(fieldValue)) {
      const isValidEmail = await checkEmailValidation(fieldValue);

      const emailInputElement = document.getElementById('pEmail');
      if (isValidEmail === 'valid') {
        //
      } else if (isValidEmail === 'invalid') {
        showToast(`${fieldValue} is not a valid email`, 'error');
        setEmailMessage(`${fieldValue} is not a valid email`);
        emailInputElement.setCustomValidity(`${fieldValue} is not a valid email`);
      } else {
        // setEmailMessage(`${fieldValue} can not be verified Api error`);
        // emailInputElement.setCustomValidity(`${fieldValue} can not verify api error`);
      }
    }
  };

  const updateRowById = (updatedRow) => {
    // Find the index of the row with the matching id

    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index + 1 === rows.id
          ? { ...row, ...updatedRow } // Update the specific row
          : row,
      ),
    );
  };

  const onSave = async () => {
    formValidator();

    const form = document.querySelector('.add-partner-form');
    form.classList.add('needs-validation');
    if (form.checkValidity()) {
      const partners = {
        uid: partnerData.id,
        fullName: partnerData.fullName,
        businessName: partnerData.businessName,
        email: partnerData.pEmail,
        dob: partnerData.dob,
        primaryContact: partnerData.primaryContact,
        decisionMakingAuthority: partnerData.decisionMakingAuthority ? 1 : 0,
        rowVer: 1,
        status: 1,
        createdAt: partnerData.createdAt,
        lastUpdatedAt: partnerData.lastUpdatedAt,
        createdBy: partnerData.createdBy,
        lastUpdatedBy: partnerData.lastUpdatedBy,
      };

      if (!isAdd) {
        updateRowById(partners);
      } else {
        setRows((prevRows) => [...prevRows, partners]);
      }

      form.reset();
      form.classList.remove('needs-validation');
      form.classList.remove('was-validated');

      toggle();
      // setPartnerData(initialData);
    } else {
      form.classList.add('was-validated');
    }
  };
  const handleDAFormData = (event, label = '') => {
    if (label !== '') {
      setPartnerData((prevdaApplyFormData) => ({
        ...prevdaApplyFormData,
        [label]: moment(event).utc().format(),
      }));
    } else {
      const { name, value, type, checked } = event.target;

      // Use the spread operator to create a new object with updated field
      setPartnerData((prevdaApplyFormData) => ({
        ...prevdaApplyFormData,
        [name]: type === 'checkbox' ? checked : value,
      }));
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
    // setPartnerData(initialData);
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
      <ModalHeader className="border-bottom-custom">Add New Partner</ModalHeader>
      <ModalBody className="paddingAllSide">
        <form noValidate className="add-partner-form" onSubmit={(e) => e.preventDefault()}>
          <div className="">
            <div className=" text-center">
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Full Name"
                    icon={cilUser}
                    type="text"
                    value={partnerData.fullName}
                    onChange={handleAddPartner}
                    id="fullName"
                    name="fullName"
                    className="form-control item "
                    placeholder="enter full name"
                    isRequired={true}
                    message="please enter full name"
                  />
                </div>
                <div className="col-md-6">
                  <CustomInput
                    label="Buisness Name"
                    icon={cilUser}
                    type="text"
                    value={partnerData.businessName}
                    onChange={handleAddPartner}
                    id="businessName"
                    name="businessName"
                    className="form-control item "
                    placeholder="enter full name"
                    isRequired={true}
                    message="please enter buisness name"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Email"
                    icon={cilEnvelopeClosed}
                    type="email"
                    value={partnerData.email}
                    onChange={handleAddPartner}
                    id="pEmail"
                    name="pEmail"
                    className="form-control item "
                    placeholder="enter email "
                    isRequired={true}
                    message={emailMessage}
                    onBlur={onBlur}
                  />
                </div>
                <div className="col-md-6 mt-2">
                  <CustomDatePicker
                    label="DOB / Registration"
                    icon={cilCalendar}
                    id="dob"
                    name="dob"
                    value={partnerData.dob}
                    onChange={(e) => handleDAFormData(e, 'dob', 'date')}
                    isRequired={false}
                    max={dayjs().subtract(18, 'years')}
                    message={'Partner age should be 18 or above'}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomInput
                    label="Contact"
                    icon={cilUser}
                    type="text"
                    value={partnerData.primaryContact}
                    onChange={handleAddPartner}
                    id="primaryContact"
                    name="primaryContact"
                    className="form-control item "
                    placeholder="enter contact"
                    pattern="[0-9]{1,14}"
                    isRequired={true}
                    maxLength={14}
                    message="Enter valid contact number Format: 1234567890"
                  />
                </div>
                <div className="col-md-3">
                  <CFormCheck
                    className="mt-5"
                    id="decisionMakingAuthority"
                    name="decisionMakingAuthority"
                    checked={partnerData.decisionMakingAuthority}
                    onChange={handleAddPartner}
                    value={partnerData.decisionMakingAuthority}
                    label="Decision Making "
                  />
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
                {partner ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
export default DAaddPartnerModal;

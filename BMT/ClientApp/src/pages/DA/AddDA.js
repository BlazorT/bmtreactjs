import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import moment from 'moment';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import { CFormCheck } from '@coreui/react';
import { cilChevronBottom } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import { updateToast } from 'src/redux/toast/toastSlice';
import { cilTask, cilCalendar, cilCode, cilExcerpt, cilGraph, cilInfo } from '@coreui/icons';

import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';

import EmailBrandNewModal from 'src/components/Modals/EmailBrandNewModal';

import { formValidator } from 'src/helpers/formValidator';
import { generateRandomNumbers, generateRandomPassword } from 'src/helpers/generatePassowrd';
import {
 // getDaAppllyBirthInputs,
  //getDaAppllyIDInputs,
  getDaAppllyInputs,
//  getDaAppllySsnInputs,
  getInitialDaData,
  //getInitialDaIdentificationData,
} from 'src/configs/InputConfig/addDAFormConfig';
import validateEmail from 'src/helpers/validateEmail';
import Loading from 'src/components/UI/Loading';
import { useUserAvailability } from 'src/hooks/api/useUserAvailability';
import { useUpdateUser } from 'src/hooks/api/useUpdateUser';
import Form from 'src/components/UI/Form';
import AppContainer from 'src/components/UI/AppContainer';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Inputs from 'src/components/Filters/Inputs';
import useEmailVerification from 'src/hooks/useEmailVerification';
import { useShowToast } from 'src/hooks/useShowToast';
import { useFetchDsps } from 'src/hooks/api/useFetchDsps';
const AddDA = () => {
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Apply Form (DA)',
  );
  const user = useSelector((state) => state.user);

  useEffect(() => {
    fetchDspList();
    if (pageRoles.canAdd === 0) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: `You dont have a privilege to add a DA, please contact admin for access`,
          toastVariant: 'warning',
        }),
      );
    }
    formValidator();

    const state = location.state;

    if (state !== null) {
      const daData = state.user[0];
      const initialData = {
        ...daData,
        isWhatsAppAsso: daData.secondaryContact ? true : false,
        mailAddress: daData.address,
        dspId: daData.dspid,
      };

     // console.log({ initialData });

      setDaApplyFormData(initialData);
    }
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { data, loading, error, checkEmailValidation } = useEmailVerification();
  const showToast = useShowToast();

  const [daApplyFormData, setDaApplyFormData] = useState(getInitialDaData(user));
  
  const [showStock, setShowStock] = useState(true);
  const [isThisBrandnew, setIsThisBrandnew] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [emailReadonly, setEmailReadonly] = useState(true);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');
  const { getDsps } = useFetchDsps();
  const [dspList, setdspList] = useState([]);
  const { createUpdateUser } = useUpdateUser();

  const { checkUserAvailability } = useUserAvailability();

  const handleDAFormData = (event, label = '') => {
    if (label === 'avatar') {
      setDaApplyFormData((prevdaApplyFormData) => ({
        ...prevdaApplyFormData,
        [label]: event,
      }));
    } else {
      if (label !== '') {
        setDaApplyFormData((prevdaApplyFormData) => ({
          ...prevdaApplyFormData,
          [label]: moment(event).utc().format(),
        }));
      } else {
        const { name, value, type, checked } = event.target;

        // Use the spread operator to create a new object with updated field
        // console.log(name, type === 'checkbox' ? checked : value);
        setDaApplyFormData((prevdaApplyFormData) => ({
          ...prevdaApplyFormData,
          [name]: type === 'checkbox' ? checked : value,
        }));
      }
    }
  };

  const onBlur = async () => {
    const fieldValue = daApplyFormData.email;
    if (validateEmail(fieldValue)) {
      const isValidEmail = await checkEmailValidation(fieldValue);

      if (isValidEmail === 'valid') {
        checkUserAvailability(fieldValue, '', daApplyFormData.id, setEmailMessage);
      } else if (isValidEmail === 'invalid') {
        showToast(`${fieldValue} is not a valid email`, 'error');
        const emailInputElement = document.getElementById('email');
        setEmailMessage(`${fieldValue} is not a valid email`);
        emailInputElement.setCustomValidity(`${fieldValue} is not a valid email`);
      } else {
        checkUserAvailability(fieldValue, '', daApplyFormData.id, setEmailMessage);
        // const emailInputElement = document.getElementById('email');
        // setEmailMessage(`${daUserData.email} can not be verified Api error`);
        // emailInputElement.setCustomValidity(`${daUserData.email} can not verify api error`);
        // return;
      }
    }
  };
  // Define a single change handler handleDAIdentification to update daIdentificationData dynamically


  const toggleOther = () => {
    setShowOther((prev) => !prev);
  };

  const submitDA = async () => {
    formValidator();
    const form = document.querySelector('.apply-da-form');
    if (daApplyFormData.email === '') {
      setEmailReadonly(false);
      return;
    }

    if (form.checkValidity()) {
      const daBody = {
        ...daApplyFormData,
        secondaryContact: daApplyFormData.isWhatsAppAsso ? daApplyFormData.primaryContact : '',
        hasValidDrivingLicense: daApplyFormData.hasValidDrivingLicense ? 1 : 0,
        address: daApplyFormData.mailAddress,
       // ssn: daIdentificationData.ssnNo,
       // IdentityId: daIdentificationData.idNo,
        userName: daApplyFormData.userName ? daApplyFormData.userName : daApplyFormData.email,
        password: daApplyFormData.password ? daApplyFormData.password : generateRandomPassword(12),
        roleId: 3,
        dspid: daApplyFormData.dspid,
        dspId: daApplyFormData.dspid,
        issuingStateId: daApplyFormData.dspid ? daApplyFormData.dspid :0,
        lastUpdatedBy: daApplyFormData.dspid,
        rowVer: daApplyFormData.rowVer ? daApplyFormData.rowVer : 0,
        createdBy: daApplyFormData.createdBy ? daApplyFormData.createdBy : user.dspid,
        status: daApplyFormData.status === '' ? 5 : daApplyFormData.status,
        createdAt: daApplyFormData.createdAt,
        lastUpdatedAt: moment().utc().format(),
        //lastUpdatedBy: moment().utc().format(),
        remarks: 'created da',
      };

      const res = await createUpdateUser(daBody);
      console.log({ res });
      if (res.status) {
        if (user.userId !== '') {
          navigate('/Delivery');
        } else {
          navigate('/');
        }
      }
    }
  };

  const toggleStock = () => {
    setShowStock(!showStock);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const TermsModal = () => {
    setTermsmodalOpen(!termsmodalOpen);
  };

  const confirmationModal = () => {
    setConfirmationModalOpen(!confirmationModalOpen);
  };
  const goToAnotherPage = () => {
    if (user.userId === '') {
      navigate('/');
    } else {
      navigate('/Delivery');
    }
  };

  const IsThisBrandNewClick = () => {
    setIsThisBrandnew(!isThisBrandnew);
  };
  const maxlength = 14;
  const associatedWithAmazonNo = () => {
    toggleModal();
    setEmailReadonly(false);
  };

  const associatedWithAmazon = () => {
    toggleModal();
    setEmailReadonly(true);
  };

  const handleFocus = () => {
    toggleModal(true);
    setIsThisBrandnew(true);
  };
  const fetchDspList = async () => {
    const dspData = await getDsps();
    setdspList(dspData);
    setIsLoading(false);
  };
  const daApplyInputs = getDaAppllyInputs(
    daApplyFormData,
    handleDAFormData,
    handleFocus,
    emailReadonly,
    emailMessage,
    pageRoles.canAdd,
    onBlur,
    dspList,
  );
  const [selectedOption, setSelectedOption] = useState('');
  const options = [
    //  { value: 'Select Shift Type',label: 'Select Shift Type' },
    { value: 1, name: 'Driver' },
    { value: 2, name: 'Helper' },
  ];
  //const daAppllySsnInputs = getDaAppllySsnInputs(daIdentificationData, handleDAIdentification);
  //const daAppllyIDInputs = getDaAppllyIDInputs(daIdentificationData, handleDAIdentification);
  //const daAppllyBirthInputs = getDaAppllyBirthInputs(daIdentificationData, handleDAIdentification);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      <AppContainer>
        <DataGridHeader
          title="DSP Basic Information"
          otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
          filterDisable={true}
        />

        {showStock && (
          <React.Fragment>
            <Form name="apply-da-form">
              <Inputs inputFields={daApplyInputs} yesFn={goToAnotherPage} submitFn={submitDA}>
                <CRow className="w-50 align-self-center mt-3">
                  <CCol md="12">
                    <CustomSelectInput
                      label="Select Position(s)"
                      value={daApplyFormData.positionType}
                      onChange={handleDAFormData}
                      icon={cilGraph}
                      id="positionType"
                      disableOption="Select Position Type"
                      name="positionType"
                      options={options}
                      title="Position Type"
                      // selectedOption={options}
                      isRequired={false}
                    // alue={selectedOption}
                    // onChange={handleOptionChange}
                    />
                  </CCol>
                </CRow>
                <CFormCheck
                  className="mt-3 d-flex flex-row justify-content-center"
                  title="Are you agree for this?"
                  label={
                    <span>
                      By providing this info, you agree to our terms & conditions, read our{' '}
                      <strong className="lblTerms" onClick={TermsModal}>
                        Terms & Conditions (EULA)
                      </strong>
                    </span>
                  }
                  name="isTermsAccepted"
                  id="isTermsAccepted"
                  required
                  checked={daApplyFormData.isTermsAccepted}
                  onChange={handleDAFormData}
                />
              </Inputs>
            </Form>
          </React.Fragment>
        )}

        <ConfirmationModal
          header="Confirmation!"
          body="Are you sure you want to cancel?"
          isOpen={confirmationModalOpen}
          onYes={goToAnotherPage}
          onNo={confirmationModal}
        />
      </AppContainer>
      <EmailBrandNewModal
        isOpen={modalOpen}
        toggle={toggleModal}
        isThisBrandnew={isThisBrandnew}
        IsThisBrandNewClick={IsThisBrandNewClick}
        associatedWithAmazonNo={associatedWithAmazonNo}
        associatedWithAmazon={associatedWithAmazon}
      />
      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </React.Fragment>
  );
};

export default AddDA;

import { CCol, CForm, CFormCheck, CFormLabel, CRow } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
//import { CFormCheck } from '@coreui/react';
// Icons
import { cilChevronBottom } from '@coreui/icons';
// Custom Components
import EmailBrandNewModal from 'src/components/Modals/EmailBrandNewModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
//import Loading from 'src/components/UI/Loading';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Inputs from 'src/components/Filters/Inputs';
import AppContainer from 'src/components/UI/AppContainer';
import Form from 'src/components/UI/Form';
// Hooks and Helpers
import { formValidator } from 'src/helpers/formValidator';
import validateEmail from 'src/helpers/validateEmail';
import useFetch from 'src/hooks/useFetch';
import { setUserData as setLoginUser } from 'src/redux/user/userSlice';
import { getInitialUserData, getUserInputFields } from 'src/configs/InputConfig/userRegConfig';
import { useFetchOrgs } from 'src/hooks/api/useFetchOrgs';
import { useUpdateUser } from 'src/hooks/api/useUpdateUser';
import { useUserAvailability } from 'src/hooks/api/useUserAvailability';
import useEmailVerification from 'src/hooks/useEmailVerification';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import { updateToast } from 'src/redux/toast/toastSlice';
//import Spinner from 'src/components/UI/Spinner';
import {} from 'src/components/UI/ImagePicker';
import Loading from 'src/components/UI/Loading';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
import globalutil from 'src/util/globalutil';
import useApi from 'src/hooks/useApi';

const UserRegister = () => {
  dayjs.extend(utc);
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Hooks and Helper Functions
  const { data, error, loading, checkEmailValidation } = useEmailVerification();
  const { getOrgs } = useFetchOrgs();
  const { createUpdateUser, loading: userLoading } = useUpdateUser();
  const { loading: avatarLoading, uploadAvatar } = useUploadAvatar();
  const { checkUserAvailability } = useUserAvailability();
  const showConfirmation = useShowConfirmation();
  const { postData: getCities, loading: citiesLoading, data: cityRes } = useApi('/Common/cities');

  const showToast = useShowToast();
  const inputRef = useRef(null);

  const [UserData, setUserData] = useState(getInitialUserData(user));
  const [showForm, setshowForm] = useState(true);
  const [orgList, setOrgList] = useState([]);
  const [isThisBrandnew, setIsThisBrandnew] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [emailReadonly, setEmailReadonly] = useState(true);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');
  const [userNameMessage, setUserNameMessage] = useState('Enter Valid User Name');
  // useEffect to handle initial setup
  useEffect(() => {
    formValidator();
    fetchOrgList();
    getCities();
  }, [location.state]);

  useEffect(() => {
    const state = location.state;
    if (state !== null && cityRes?.data?.length > 0) {
      const userData = state.user[0];
      const findState = cityRes?.data?.find((cl) => cl?.id == userData?.cityId)?.stateId;
      setUserData({
        ...userData,
        roleId: userData.roleId === 0 ? '' : (userData.roleId ?? ''),
        password: userData.password ? atob(userData.password) : '',
        country: findState,
        isTermsAccepted: false,
        contact: userData.contact,
        genderId: userData.genderId,
      });
    }
  }, [location.state, cityRes?.data]);

  // Handle user input changes
  const handleUserInput = async (e, label) => {
    if (label === 'avatar') {
      setUserData((prevData) => ({ ...prevData, [label]: e }));
    } else {
      const { name, value, type, checked } = e.target;

      const fieldValue = type === 'checkbox' ? checked : value;

      if (name === 'userName') {
        checkUserAvailability('', fieldValue, UserData.id, setEmailMessage, setUserNameMessage);
      }

      setEmailMessage('Enter Valid Email Address');
      setUserNameMessage('Enter Valid User Name');
      setUserData((prevData) => ({ ...prevData, [name]: fieldValue }));
    }
  };

  const onBlur = async () => {
    const fieldValue = UserData.email;
    if (validateEmail(fieldValue)) {
      const isValidEmail = await checkEmailValidation(fieldValue);

      if (isValidEmail === 'valid') {
        checkUserAvailability(fieldValue, '', UserData.id, setEmailMessage, setUserNameMessage);
      } else if (isValidEmail === 'invalid') {
        showToast(`${fieldValue} is not a valid email`, 'error');
        const emailInputElement = document.getElementById('email');
        setEmailMessage(`${fieldValue} is not a valid email`);
        emailInputElement.setCustomValidity(`${fieldValue} is not a valid email`);
      } else {
        checkUserAvailability(fieldValue, '', UserData.id, setEmailMessage, setUserNameMessage);
      }
    }
  };

  // Function to add a new user
  const addUser = async () => {
    formValidator();
    const form = document.querySelector('.da-user-form');
    if (UserData.email === '') {
      setEmailReadonly(false);
      return;
    }
    if (!form.checkValidity()) {
      return;
    }
    let userBody = {
      ...UserData,
      //secondaryContact: daUserData.isWhatsappAsso ? daUserData.primaryContact : '',
      password: btoa(UserData.password),
      orgId: parseInt(UserData.orgId),
      cityId: parseInt(UserData.cityId),
      lastUpdatedBy: user.userId,
      lastUpdatedAt: dayjs().utc().format(),
      remarks: 'created user',
    };
    // Upload & Submit
    const fUpload = document.getElementById('fileAvatar');

    if (fUpload.files !== null && fUpload.files.length > 0) {
      var avatar = fUpload.files[0];
      const formData = new FormData();
      formData.append('file', avatar);
      formData.append('id', '0');
      formData.append('name', avatar.name);
      formData.append('fileName', avatar.name);
      formData.append('createdBy', user.userId);
      formData.append('createdAt', dayjs().utc().format());

      // for (const entry of formData.entries()) {
      //   console.log(entry[0], entry[1]);
      // }
      const uploadAvatarRes = await uploadAvatar(formData);
      //console.log({ uploadAvatarRes });
      if (uploadAvatarRes.status === true) {
        const avatarPath = 'productimages/' + uploadAvatarRes.keyValue.toString().split('\\').pop();
        userBody = { ...userBody, avatar: avatarPath };
        //console.log({ userBody, avatarPath });
        const res = await createUpdateUser(userBody);
        if (res.status === true) {
          if (user.userId === UserData.id) {
            dispatch(
              setLoginUser({
                roleId: parseInt(userBody?.roleId),
                userInfo: {
                  ...user?.userInfo,
                  roleId: parseInt(userBody?.roleId),
                },
              }),
            );
          }
          navigate('/Users');
        } else if (res.errorCode) {
          showToast(res?.message || res?.errorCode, 'danger');
        }
      }
    } else {
      const res = await createUpdateUser(userBody);
      if (res.status === true) {
        navigate('/Users');
      } else if (res.errorCode) {
        showToast(res?.message || res?.errorCode, 'danger');
      }
    }
  };

  const toggleForm = () => {
    setshowForm((prev) => !prev);
  };

  // Handle focus event
  const handleFocus = () => {
    toggleModal(true);
    setIsThisBrandnew(true);
  };

  // Toggle modal state
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  // Function to handle Terms and Condition modal
  const TermsModal = () => {
    setTermsmodalOpen((prev) => !prev);
  };

  // Handle click event for brand new user
  const IsThisBrandNewClick = () => {
    setIsThisBrandnew((prev) => !prev);
  };

  // Navigate to another page
  const goToAnotherPage = () => {
    showConfirmation({ isOpen: false });
    navigate('/Users');
  };

  // Handle associatedWithAmazonNo event
  const associatedWithAmazonNo = () => {
    toggleModal(true);
    setEmailReadonly(false);
  };

  // Handle associatedWithAmazon event
  const associatedWithAmazon = () => {
    toggleModal(true);
    setEmailReadonly(true);
  };

  // Fetch DSP list
  const fetchOrgList = async () => {
    const orgData = await getOrgs({
      createdAt: dayjs().utc().subtract(100, 'years').format(),
    });

    if (orgData && Array.isArray(orgData)) setOrgList(orgData?.filter((o) => o?.name !== ''));
  };

  // Define user input fields
  const userInputFields = getUserInputFields(
    UserData,
    handleUserInput,
    handleFocus,
    emailReadonly,
    user,
    location,
    emailMessage,
    userNameMessage,
    inputRef,
    orgList,
    TermsModal,
    onBlur,
    cityRes?.data ? cityRes?.data : [],
  );

  const comparableFields = [
    'firstName',
    'middleName',
    'lastName',
    'email',
    'contact',
    'address',
    'cityId',
    'status',
    'orgId',
    'roleId',
    'genderId',
  ];

  const DEFAULTS = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    contact: '',
    address: '',
    cityId: '',
    status: 1,
    orgId: user.orgId,
    roleId: '',
    genderId: 1,
  };

  const state = location?.state?.user?.[0];

  const isDiscard =
    UserData?.id === 0
      ? // CREATE MODE: check if any field differs from default
        comparableFields.some((key) => {
          const value = UserData?.[key];
          const defaultValue = DEFAULTS[key];
          // treat null / undefined / empty string as default
          if (value === null || value === undefined) return false;

          return value !== defaultValue;
        })
      : // EDIT MODE: compare against original data
        comparableFields.some((key) => UserData?.[key] !== state?.[key]);
  return (
    <React.Fragment>
      {userLoading || avatarLoading || citiesLoading ? (
        <Loading />
      ) : (
        <>
          <AppContainer>
            <DataGridHeader
              title="Advance Information"
              onClick={toggleForm}
              otherControls={[{ icon: cilChevronBottom, fn: toggleForm }]}
              filterDisable={true}
            />
            <Form name="da-user-form">
              {showForm && (
                <Inputs
                  inputFields={userInputFields}
                  yesFn={goToAnotherPage}
                  submitFn={addUser}
                  isDiscard={isDiscard}
                >
                  <CRow className="w-50 align-self-center mt-2 mb-3">
                    <CCol md="6">
                      <CForm>
                        <CFormLabel className="labelName" htmlFor="gender-radio-group">
                          Gender
                        </CFormLabel>
                        <div className="d-flex">
                          <CFormCheck
                            type="radio"
                            id="male"
                            name="genderId"
                            value={0}
                            inline
                            label="Male"
                            checked={UserData?.genderId?.toString() === '0'}
                            onChange={handleUserInput}
                            className="me-3 d-flex"
                          />
                          <CFormCheck
                            type="radio"
                            id="female"
                            name="genderId"
                            inline
                            value={1}
                            label="Female"
                            checked={UserData?.genderId?.toString() === '1'}
                            onChange={handleUserInput}
                            className="d-flex"
                          />
                        </div>
                      </CForm>
                    </CCol>
                  </CRow>
                  <CFormCheck
                    name="isTermsAccepted"
                    checked={UserData.isTermsAccepted}
                    onChange={handleUserInput}
                    className="d-flex flex-row justify-content-center"
                    id="isTermsAccepted"
                    required
                    label={
                      <span>
                        By providing this info, you agree to our terms & conditions, read our{' '}
                        <strong className="lblTerms" onClick={TermsModal}>
                          Terms & Conditions (EULA)
                        </strong>
                      </span>
                    }
                  />
                </Inputs>
              )}
            </Form>
            <EmailBrandNewModal
              isOpen={modalOpen}
              toggle={toggleModal}
              isThisBrandnew={isThisBrandnew}
              IsThisBrandNewClick={IsThisBrandNewClick}
              associatedWithAmazonNo={associatedWithAmazonNo}
              associatedWithAmazon={associatedWithAmazon}
            />
            <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
          </AppContainer>
        </>
      )}
    </React.Fragment>
  );
};

export default UserRegister;

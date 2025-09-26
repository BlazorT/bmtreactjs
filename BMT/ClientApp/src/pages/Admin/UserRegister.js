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
import useFetch from 'src/hooks/useFetch';
import { formValidator } from 'src/helpers/formValidator';
import validateEmail from 'src/helpers/validateEmail';
//import { setUserData } from 'src/redux/user/userSlice';
import { useUpdateUser } from 'src/hooks/api/useUpdateUser';
import { useUserAvailability } from 'src/hooks/api/useUserAvailability';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { updateToast } from 'src/redux/toast/toastSlice';
import { getInitialUserData, getUserInputFields } from 'src/configs/InputConfig/userRegConfig';
import { useFetchOrgs } from 'src/hooks/api/useFetchOrgs';
import useEmailVerification from 'src/hooks/useEmailVerification';
import { useShowToast } from 'src/hooks/useShowToast';
//import Spinner from 'src/components/UI/Spinner';
import {} from 'src/components/UI/ImagePicker';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';

const UserRegister = () => {
  dayjs.extend(utc);
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Hooks and Helper Functions
  const { data, error, loading, checkEmailValidation } = useEmailVerification();
  const { getOrgs } = useFetchOrgs();
  const { createUpdateUser } = useUpdateUser();
  const { loading: avatarLoading, uploadAvatar } = useUploadAvatar();
  const { checkUserAvailability } = useUserAvailability();
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();
  const inputRef = useRef(null);

  const [UserData, setUserData] = useState(getInitialUserData(user));
  const [showForm, setshowForm] = useState(true);
  const [dspList, setdspList] = useState([]);
  const [isThisBrandnew, setIsThisBrandnew] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [emailReadonly, setEmailReadonly] = useState(true);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');
  const [userNameMessage, setUserNameMessage] = useState('Enter Valid User Name');

  // useEffect to handle initial setup
  useEffect(() => {
    formValidator();
    fetchDspList();
    const state = location.state;
    console.log({ state });
    if (state !== null) {
      const userData = state.user[0];
      //console.log({ userData });
      setUserData({
        ...userData,
        roleId: userData.roleId === 0 ? '' : (userData.roleId ?? ''),
        password: userData.password ? atob(userData.password) : '',
        country: userData.stateId < 54 ? 1 : (2 ?? ''),
        isTermsAccepted: false,
        contact: userData.contact,
        genderId: userData.genderId,
      });
    }
  }, [location.state]);

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

      if (name === 'roleId' && user.userId === UserData.id) {
        dispatch(setUserData({ roleId: parseInt(fieldValue) }));
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
      lastUpdatedBy: user.userId,
      lastUpdatedAt: dayjs().utc().format(),
      remarks: 'created user',
    };
    setIsLoading(false);
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
          navigate('/Users');
        } else if (res.errorCode) {
          showToast(res?.message || res?.errorCode, 'danger');
        }
      }
    } else {
      const res = await createUpdateUser(userBody);
      console.log({ res });
      if (res.status === true) {
        navigate('/Users');
      } else if (res.errorCode) {
        console.log('first');
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
  const fetchDspList = async () => {
    const orgData = await getOrgs();
    setdspList(orgData);
    setIsLoading(false);
  };
  const {
    response: GetCityRes,
    loading: CityLoading,
    error: createCityError,
    fetchData: GetCity,
  } = useFetch();
  useEffect(() => {
    getCityList();
  }, []);
  const getCityList = async () => {
    await GetCity(
      '/Common/cities',
      {
        method: 'POST',
        // body: JSON.stringify(fetchBody),
      },
      (res) => {
        console.log(res, 'city');
        if (res.status === true) {
          //const mappedArray = res.data.map((data, index) => ({
          //  id: data.id,
          //  userId: data.userId,
          //  dspid: user.dspId.toString(),
          //  logDesc: data.logDesc,
          //  entityName: data.entityName,
          //  menuId: data.menuId,
          //  machineIp: data.machineIp,
          //  actionType: data.actionType,
          //  logTime: formatDateTime(data.logTime),
          //}));
          // setRows(mappedArray);
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          /*   setRows([]);*/
        }
        setIsLoading(CityLoading.current);
      },
    );
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
    dspList,
    TermsModal,
    onBlur,
    GetCityRes?.current?.data ? GetCityRes.current.data : [],
  );

  return (
    <React.Fragment>
      {/*{isLoading ? (*/}
      {/*  <Loading />*/}
      {/*) : (*/}
      <AppContainer>
        <DataGridHeader
          title="Advance Information"
          onClick={toggleForm}
          otherControls={[{ icon: cilChevronBottom, fn: toggleForm }]}
          filterDisable={true}
        />
        <Form name="da-user-form">
          {showForm && (
            <Inputs inputFields={userInputFields} yesFn={goToAnotherPage} submitFn={addUser}>
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
      {/* )}*/}
    </React.Fragment>
  );
};

export default UserRegister;

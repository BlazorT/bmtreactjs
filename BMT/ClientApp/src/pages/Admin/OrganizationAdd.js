import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

// Icons
import { cilChevronBottom } from '@coreui/icons';

// Custom Components
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import EmailBrandNewModal from 'src/components/Modals/EmailBrandNewModal';
import Loading from 'src/components/UI/Loading';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Inputs from 'src/components/Filters/Inputs';
import Form from 'src/components/UI/Form';
import AppContainer from 'src/components/UI/AppContainer';

// Hooks and Helpers
import { formValidator } from 'src/helpers/formValidator';
import validateEmail from 'src/helpers/validateEmail';
import { setUserData } from 'src/redux/user/userSlice';
import { useUpdateUser } from 'src/hooks/api/useUpdateUser';
import { useUserAvailability } from 'src/hooks/api/useUserAvailability';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';

import { useFetchDsps } from 'src/hooks/api/useFetchDsps';
import { getInitialUserData, getUserInputFields } from 'src/configs/InputConfig/userRegConfig';
import useEmailVerification from 'src/hooks/useEmailVerification';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from 'src/components/UI/Spinner';
import {} from 'src/components/UI/ImagePicker';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
const OrganizationAdd = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Hooks and Helper Functions
  const { data, error, loading, checkEmailValidation } = useEmailVerification();
  const { getDsps } = useFetchDsps();
  const { createUpdateUser } = useUpdateUser();
  const { loading: avatarLoading, uploadAvatar } = useUploadAvatar();
  const { checkUserAvailability } = useUserAvailability();
  const showConfirmation = useShowConfirmation();
  const showToast = useShowToast();
  const inputRef = useRef(null);

  const [daUserData, setdaUserData] = useState(getInitialUserData(user));
  const [showForm, setshowForm] = useState(true);
  const [dspList, setdspList] = useState([]);
  const [isThisBrandnew, setIsThisBrandnew] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [emailReadonly, setEmailReadonly] = useState(true);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');
  const [userNameMessage, setUserNameMessage] = useState('Enter Valid User Name');

  // useEffect to handle initial setup
  useEffect(() => {
    formValidator();
    fetchDspList();
    const state = location.state;

    if (state !== null) {
      const userData = state.user[0];
      console.log({ userData });
      setdaUserData({
        ...userData,
        roleId: userData.roleId === 0 ? '' : userData.roleId ?? '',
        password: userData.password ? atob(userData.password) : '',
        country: userData.stateId < 54 ? 1 : 2 ?? '',
        isWhatsappAsso: userData.secondaryContact ? true : false,
        isTermsAccepted: false,
      });
    }
  }, [location.state]);

  // Handle user input changes
  const handleUserInput = async (e, label) => {
    if (label === 'avatar') {
      setdaUserData((prevData) => ({ ...prevData, [label]: e }));
    } else {
      const { name, value, type, checked } = e.target;
      const fieldValue = type === 'checkbox' ? checked : value;

      if (name === 'userName') {
        checkUserAvailability('', fieldValue, daUserData.id, setEmailMessage, setUserNameMessage);
      }

      if (name === 'roleId' && user.userId === daUserData.id) {
        dispatch(setUserData({ roleId: parseInt(fieldValue) }));
      }
      setEmailMessage('Enter Valid Email Address');
      setUserNameMessage('Enter Valid User Name');
      setdaUserData((prevData) => ({ ...prevData, [name]: fieldValue }));
    }
  };

  const onBlur = async () => {
    const fieldValue = daUserData.email;
    if (validateEmail(fieldValue)) {
      const isValidEmail = await checkEmailValidation(fieldValue);

      if (isValidEmail === 'valid') {
        checkUserAvailability(fieldValue, '', daUserData.id, setEmailMessage, setUserNameMessage);
      } else if (isValidEmail === 'invalid') {
        showToast(`${fieldValue} is not a valid email`, 'error');
        const emailInputElement = document.getElementById('email');
        setEmailMessage(`${fieldValue} is not a valid email`);
        emailInputElement.setCustomValidity(`${fieldValue} is not a valid email`);
      } else {
        checkUserAvailability(fieldValue, '', daUserData.id, setEmailMessage, setUserNameMessage);
      }
    }
  };

  // Function to add a new user
  const addUser = async () => {
    formValidator();
    const form = document.querySelector('.da-user-form');
    if (daUserData.email === '') {
      setEmailReadonly(false);
      return;
    }
    if (!form.checkValidity()) {
      return;
    }
    let userBody = {
      ...daUserData,
      secondaryContact: daUserData.isWhatsappAsso ? daUserData.primaryContact : '',
      password: btoa(daUserData.password),
      dspid: parseInt(daUserData.dspid),
      lastUpdatedBy: user.userId,
      lastUpdatedAt: moment().utc().format(),
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
      formData.append('createdAt', moment().utc().format());

      // for (const entry of formData.entries()) {
      //   console.log(entry[0], entry[1]);
      // }
      const uploadAvatarRes = await uploadAvatar(formData);
      console.log({ uploadAvatarRes });
      if (uploadAvatarRes.status === true) {
        const avatarPath = 'productimages/' + uploadAvatarRes.keyValue.toString().split('\\').pop();
        userBody = { ...userBody, avatar: avatarPath };
        console.log({ userBody, avatarPath });
        const res = await createUpdateUser(userBody);
        if (res.status === true) {
          navigate('/Users');
        }
      }
    } else {
      const res = await createUpdateUser(userBody);
      if (res.status === true) {
        navigate('/Users');
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
    const dspData = await getDsps();
    setdspList(dspData);
    setIsLoading(false);
  };

  // Define user input fields
  const userInputFields = getUserInputFields(
    daUserData,
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
  );

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <AppContainer>
          <DataGridHeader
            title="Advance Search"
            otherControls={[{ icon: cilChevronBottom, fn: toggleForm }]}
            filterDisable={true}
          />
          <Form name="da-user-form">
            {showForm && (
              <Inputs inputFields={userInputFields} yesFn={goToAnotherPage} submitFn={addUser} />
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
      )}
    </React.Fragment>
  );
};

export default OrganizationAdd;

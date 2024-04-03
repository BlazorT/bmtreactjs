import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
import moment from 'moment';
import useFetch from 'src/hooks/useFetch';
import { CFormCheck } from '@coreui/react';
import { cilChevronBottom } from '@coreui/icons';
import { updateToast } from 'src/redux/toast/toastSlice';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
//import EmailBrandNewModal from 'src/components/Modals/EmailBrandNewModal';
import { formValidator } from 'src/helpers/formValidator';
//import { generateRandomNumbers, generateRandomPassword } from 'src/helpers/generatePassowrd';
import {
  getDaAppllyBirthInputs,
  getDaAppllyIDInputs,
  getDaAppllyInputs,
  getDaAppllySsnInputs,
  getInitialDaData,
  getInitialDaIdentificationData,
} from 'src/configs/InputConfig/addOrgsConfig';
import validateEmail from 'src/helpers/validateEmail';
//import Loading from 'src/components/UI/Loading';
import { useUserAvailability } from 'src/hooks/api/useUserAvailability';
import { useUpdateOrg } from 'src/hooks/api/useUpdateOrg';
import Form from 'src/components/UI/Form';
import AppContainer from 'src/components/UI/AppContainer';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Inputs from 'src/components/Filters/Inputs';
import useEmailVerification from 'src/hooks/useEmailVerification';
import { useShowToast } from 'src/hooks/useShowToast';
//import useApi from 'src/hooks/useApi';
//alert('ORG Called')
const organizationadd = () => {
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => (item.name.toLowerCase() === 'BMT Subscription'.toLowerCase() || item.name.toLowerCase() === 'organizationadd'.toLowerCase()),
  );
  const user = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pageRoles.canAdd === 0) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: `You dont have a privilege of setting up of organization, please contact admin for access`,
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

      //  console.log({ initialData });
      setDaApplyFormData(initialData);
    }
    setIsLoading(false);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const uploadRef = useRef(null);
  const { data, loading, error, checkEmailValidation } = useEmailVerification();

  const showToast = useShowToast();
  const { uploadAvatar, uploadAttachments } = useUploadAvatar();
  const [daApplyFormData, setDaApplyFormData] = useState(getInitialDaData(user));
  const [daIdentificationData, setDAIdentificationData] = useState(
    getInitialDaIdentificationData(),
  );
  const [showStock, setShowStock] = useState(true);
  const [isThisBrandnew, setIsThisBrandnew] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [emailReadonly, setEmailReadonly] = useState(true);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');

  const { createUpdateOrg } = useUpdateOrg();

  const { checkUserAvailability } = useUserAvailability();

  const handleDAFormData = (event, label = '') => {
    if (label === 'avatar') {
      console.log({ event });
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
        const { name, value, type, files, checked } = event.target;

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
  const handleDAIdentification = (event) => {
    const { name, value, files } = event.target;

    setDAIdentificationData((prevData) => ({
      ...prevData,
      [name]: value, // If it's a file input, use files[0], otherwise use the value
    }));
  };

  const toggleOther = () => {
    setShowOther((prev) => !prev);
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
        id:0,
        contact: daApplyFormData.contact,
        address: daApplyFormData.mailAddress,
       // status: 0,
       // orgId: daApplyFormData.orgId,
       // lastUpdatedBy: moment().utc().format(),
        rowVer: daApplyFormData.rowVer ? daApplyFormData.rowVer : 0,
       // createdBy: daApplyFormData.createdBy ? daApplyFormData.createdBy : user.orgId,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
        remarks: 'created org',
      };
      console.log(daBody);
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

        // alert("Upload version before upload");
        const uploadAvatarRes = await uploadAvatar(formData);
        if (uploadAvatarRes.status === true) {
          const avatarPath =
            'productimages/' + uploadAvatarRes.keyValue.toString().split('\\').pop();

          const res = await createUpdateOrg({ ...daBody, avatar: avatarPath });
          console.log(res);
          if (res.status === true) {
            await uploadDaAttachments(res.data.id);
          }
        }
      } else {
        const res = await createUpdateOrg(daBody);
        console.log({ res });
        if (res.status === true) {
          await uploadDaAttachments(res.data.id);
        }
      }
    }
  };

  const isFormDataEmpty = (formData) => {
    // Use the entries() method to get an iterator of key/value pairs
    const formDataIterator = formData.entries();

    // Check if the iterator has at least one entry
    return formDataIterator.next().done;
  };

  const createArrayOfFormData = (fileInputs, userId) => {
    const formData = new FormData();

    let hasFiles = false; // Flag to check if at least one file is present

    fileInputs.forEach((fileInput, index) => {
      // Check if files are present in the input
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        formData.append(index, file);
        hasFiles = true; // Set the flag to true if at least one file is present
      }
    });

    if (hasFiles) {
      // Append additional attributes only if at least one file is present
      formData.append('id', '0');
      formData.append('fileName', '');
      formData.append('userId', userId);
      formData.append('daid', userId);
      formData.append('createdBy', user.userId);
      formData.append('lastUpdatedBy', user.userId);
      formData.append('createdAt', moment().utc().format());
      formData.append('lastUpdatedAt', moment().utc().format());
      formData.append('rowVer', 1);
    }

    return formData;
  };

  const uploadDaAttachments = async (userId) => {
    const fileInputs = [
      document.getElementById('licenceImageFront'),
      document.getElementById('licenceImageBack'),
      document.getElementById('ssnFront'),
      document.getElementById('ssnBack'),
      document.getElementById('idFront'),
      document.getElementById('idBack'),
      document.getElementById('bCertificateFile'),
    ];

    const formDataArray = createArrayOfFormData(fileInputs, userId);

    if (!isFormDataEmpty(formDataArray)) {
      const attachmentsRes = await uploadAttachments(formDataArray);
      console.log({ attachmentsRes });
      if (attachmentsRes.status === true) {
        if (user.userId !== '') {
          navigate('/DspsList');
        } else {
          navigate('/');
        }
      } else {
        if (attachmentsRes.errorCode == 405) showToast(attachmentsRes.data, 'error');
        else showToast(attachmentsRes.message, 'error');
      }
    } else {
      if (user.userId !== '') {
        navigate('/DspsList');
      } else {
        navigate('/');
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
      navigate('/DspsList');
    }
  };

  //const IsThisBrandNewClick = () => {
  //  setIsThisBrandnew(!isThisBrandnew);
  //};
  const maxlength = 14;
  const associatedWithAmazonNo = () => {
    toggleModal();
    setEmailReadonly(false);
  };

  //const associatedWithAmazon = () => {
  //  toggleModal();
  //  setEmailReadonly(true);
  //};

  const handleFocus = () => {
    toggleModal(true);
    setIsThisBrandnew(true);
  };

  const daApplyInputs = getDaAppllyInputs(
    daApplyFormData,
    handleDAFormData,
    handleFocus,
    emailReadonly,
    emailMessage,
    pageRoles.canAdd,
    onBlur,
    GetCityRes?.current?.data ? GetCityRes.current.data:[]
  );

  const daAppllySsnInputs = getDaAppllySsnInputs(daIdentificationData, handleDAIdentification);
  const daAppllyIDInputs = getDaAppllyIDInputs(daIdentificationData, handleDAIdentification);
  const daAppllyBirthInputs = getDaAppllyBirthInputs(daIdentificationData, handleDAIdentification);

  /*if (isLoading) {
    return <Loading />;
  }*/
  return (
    <React.Fragment>
      <AppContainer>
        <DataGridHeader
          title="Organization Basic Information"
          otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
          filterDisable={true}
        />
        {showStock && (
          <React.Fragment>
            <Form name="apply-da-form">
              <Inputs inputFields={daApplyInputs} yesFn={goToAnotherPage} submitFn={submitDA}>
                
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
     
      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </React.Fragment>
  );
};

export default organizationadd;

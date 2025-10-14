import { cilChevronBottom } from '@coreui/icons';
import { CFormCheck } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Inputs from 'src/components/Filters/Inputs';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import AppContainer from 'src/components/UI/AppContainer';
import Form from 'src/components/UI/Form';
import { getDaAppllyInputs, getInitialDaData } from 'src/configs/InputConfig/addOrgsConfig';
import { formValidator } from 'src/helpers/formValidator';
import validateEmail from 'src/helpers/validateEmail';
import { useUpdateOrg } from 'src/hooks/api/useUpdateOrg';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
import { useUserAvailability } from 'src/hooks/api/useUserAvailability';
import useEmailVerification from 'src/hooks/useEmailVerification';
import useFetch from 'src/hooks/useFetch';
import { useShowToast } from 'src/hooks/useShowToast';
import { updateToast } from 'src/redux/toast/toastSlice';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';

const OrganizationAdd = () => {
  dayjs.extend(utc);
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name.toLowerCase() === 'Organizations'.toLowerCase(),
  );
  const user = useSelector((state) => state.user);
  const showConfirmation = useShowConfirmation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { checkEmailValidation } = useEmailVerification();

  const showToast = useShowToast();
  const { uploadAvatar, uploadAttachments } = useUploadAvatar();
  const [daApplyFormData, setDaApplyFormData] = useState(getInitialDaData(user));

  const [showStock, setShowStock] = useState(true);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');

  useEffect(() => {
    if ((pageRoles == null || pageRoles.canAdd === 0) && user) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: `You dont have a rights of setting up of organization, please contact admin for access`,
          toastVariant: 'warning',
        }),
      );

      navigate(-1);
      return;
    }
    formValidator();
    const state = location.state;
    console.log({ state });
    if (state !== null) {
      const daData = state.user[0];
      const initialData = {
        ...daData,
        isWhatsAppAsso: daData.secondaryContact ? true : false,
        mailAddress: daData.address,
        dspId: daData.dspid,
      };

      setDaApplyFormData(initialData);
    }
  }, [user]);

  const { createUpdateOrg } = useUpdateOrg();

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
          [label]: dayjs(event).utc().format(),
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
      }
    }
  };

  const { response: GetCityRes, loading: CityLoading, fetchData: GetCity } = useFetch();

  useEffect(() => {
    getCityList();
  }, []);

  const getCityList = async () => {
    await GetCity(
      '/Common/cities',
      {
        method: 'POST',
      },
      (res) => {
        console.log(res, 'city');
        if (res.status === true) {
          // setRows(mappedArray);
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
  };
  const submitDA = async () => {
    formValidator();
    const form = document.querySelector('.apply-org-form');

    if (form.checkValidity()) {
      const daBody = {
        ...daApplyFormData,
        contact: daApplyFormData.contact,
        address: daApplyFormData.mailAddress,
        cityId: daApplyFormData?.cityId ? parseInt(daApplyFormData?.cityId) : 0,
        stateId: daApplyFormData?.stateId ? parseInt(daApplyFormData?.stateId) : 0,
        rowVer: daApplyFormData.rowVer ? daApplyFormData.rowVer : 0,
        // createdBy: daApplyFormData.createdBy ? daApplyFormData.createdBy : user.orgId,
        createdAt: dayjs().utc().format(),
        lastUpdatedAt: dayjs().utc().format(),
        remarks: 'Organization registered successfully',
        lastUpdatedBy: user?.userId || 1,
      };
      //console.log(daBody);
      // Upload & Submit
      const fUpload = document.getElementById('fileAvatar');
      if (fUpload.files !== null && fUpload.files.length > 0) {
        var avatar = fUpload.files[0];
        const formData = new FormData();

        formData.append('file', avatar);
        formData.append('id', '0');
        formData.append('name', avatar.name);
        formData.append('fileName', avatar.name);
        formData.append('createdBy', user?.userId || 1);
        formData.append('createdAt', dayjs().utc().format());
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        // alert("Upload version before upload");
        const uploadAvatarRes = await uploadAvatar(formData);
        console.log({ uploadAvatarRes });
        if (uploadAvatarRes?.status === true) {
          const avatarPath =
            'productimages/' + uploadAvatarRes.keyValue.toString().split('\\').pop();

          const res = await createUpdateOrg({ ...daBody, avatar: avatarPath });
          console.log(res);
          if (res.status === true) {
            await uploadDaAttachments(res.data.id);
          }
        }
      } else {
        console.log({ daBody });
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
      formData.append('createdBy', user?.userId || 1);
      formData.append('lastUpdatedBy', user?.userId || 1);
      formData.append('createdAt', dayjs().utc().format());
      formData.append('lastUpdatedAt', dayjs().utc().format());
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
      //console.log({ attachmentsRes });
      if (attachmentsRes.status === true) {
        if (user?.userId !== '') {
          navigate('/Organizations');
        } else {
          navigate('/');
        }
      } else {
        if (attachmentsRes.errorCode == 405) showToast(attachmentsRes.data, 'error');
        else showToast(attachmentsRes.message, 'error');
      }
    } else {
      if (user?.userId !== '') {
        navigate('/Organizations');
      } else {
        navigate('/');
      }
    }
  };

  const toggleStock = () => {
    setShowStock(!showStock);
  };

  const TermsModal = () => {
    setTermsmodalOpen(!termsmodalOpen);
  };

  const confirmationModal = () => {
    setConfirmationModalOpen(!confirmationModalOpen);
  };
  const goToAnotherPage = () => {
    showConfirmation({
      isOpen: false,
    });
    if (user?.userId === '') {
      navigate('/');
    } else {
      navigate('/Organizations');
    }
  };

  const daApplyInputs = getDaAppllyInputs(
    daApplyFormData,
    handleDAFormData,
    emailMessage,
    true,
    onBlur,
    GetCityRes?.current?.data ? GetCityRes.current.data : [],
  );

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
            <Form name="apply-org-form">
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

export default OrganizationAdd;

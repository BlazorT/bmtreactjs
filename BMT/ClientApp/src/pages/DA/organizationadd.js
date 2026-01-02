import { CFormCheck } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
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
import ConfirmationModal from 'src/components/Modals/ConfirmationModal';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import Loading from 'src/components/UI/Loading'; // existing loader component

const OrganizationAdd = () => {
  dayjs.extend(utc);

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
  const [submitting, setSubmitting] = useState(false);
  // Loader states
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    formValidator();
    const state = location.state;
    if (state !== null) {
      const daData = state.org[0];
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
      setDaApplyFormData((prev) => ({ ...prev, [label]: event }));
    } else {
      if (label !== '') {
        setDaApplyFormData((prev) => ({ ...prev, [label]: dayjs(event).utc().format() }));
      } else {
        const { name, value, type, checked } = event.target;
        setDaApplyFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        setEmailMessage(`${fieldValue} is not a valid email`);
        document.getElementById('email')?.setCustomValidity(`${fieldValue} is not a valid email`);
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
    await GetCity('/Common/cities', { method: 'POST' }, (res) => {
      if (!res.status) {
        dispatch(
          updateToast({ isToastOpen: true, toastMessage: res.message, toastVariant: 'error' }),
        );
      }
    });
  };

  const submitDA = async () => {
    formValidator();
    const form = document.querySelector('.apply-org-form');
    if (!form.checkValidity()) return;

    setSubmitting(true); // start submitting loader

    const daBody = {
      ...daApplyFormData,
      contact: daApplyFormData.contact,
      address: daApplyFormData.mailAddress,
      cityId: daApplyFormData?.cityId ? parseInt(daApplyFormData?.cityId) : 0,
      stateId: daApplyFormData?.stateId ? parseInt(daApplyFormData?.stateId) : 0,
      rowVer: daApplyFormData.rowVer || 0,
      createdAt: dayjs().utc().format(),
      lastUpdatedAt: dayjs().utc().format(),
      remarks: 'Organization registered successfully',
      lastUpdatedBy: user?.userId || 1,
    };

    try {
      const fUpload = document.getElementById('fileAvatar');
      if (fUpload?.files?.length > 0) {
        const avatar = fUpload.files[0];
        const formData = new FormData();
        formData.append('file', avatar);
        formData.append('id', '0');
        formData.append('name', avatar.name);
        formData.append('fileName', avatar.name);
        formData.append('createdBy', user?.userId || 1);
        formData.append('createdAt', dayjs().utc().format());

        const uploadAvatarRes = await uploadAvatar(formData);
        if (uploadAvatarRes?.status === true) {
          const avatarPath =
            'productimages/' + uploadAvatarRes.keyValue.toString().split('\\').pop();
          const res = await createUpdateOrg({ ...daBody, avatar: avatarPath });
          if (res.status === true) await uploadDaAttachments(res.data.id);
        }
      } else {
        const res = await createUpdateOrg(daBody);
        if (res.status === true) await uploadDaAttachments(res.data.id);
      }
    } catch (error) {
      console.error(error);
      showToast('Error submitting form', 'error');
    } finally {
      setSubmitting(false); // stop submitting loader
    }
  };

  const uploadDaAttachments = async (userId) => {
    const fileInputs = [
      'licenceImageFront',
      'licenceImageBack',
      'ssnFront',
      'ssnBack',
      'idFront',
      'idBack',
      'bCertificateFile',
    ].map((id) => document.getElementById(id));

    const formData = new FormData();
    fileInputs.forEach((input, i) => {
      if (input?.files?.length > 0) formData.append(i, input.files[0]);
    });

    if ([...formData].length > 0) {
      const res = await uploadAttachments(formData);
      if (!res.status) showToast(res.message, 'error');
    }

    navigate(user?.userId ? '/Organizations' : '/');
  };

  const toggleStock = () => setShowStock(!showStock);

  const TermsModal = async () => {
    setLoadingModal(true); // show loader
    setTermsmodalOpen(true);
    setTimeout(() => setLoadingModal(false), 500); // simulate load time
  };

  const confirmationModal = () => setConfirmationModalOpen(!confirmationModalOpen);

  const goToAnotherPage = () => {
    showConfirmation({ isOpen: false });
    navigate(user?.userId ? '/Organizations' : '/');
  };

  const daApplyInputs = getDaAppllyInputs(
    daApplyFormData,
    handleDAFormData,
    emailMessage,
    true,
    onBlur,
    GetCityRes?.current?.data || [],
  );

  return (
    <React.Fragment>
      <AppContainer>
        {showStock && (
          <Form name="apply-org-form">
            <Inputs
              inputFields={daApplyInputs}
              yesFn={goToAnotherPage}
              submitFn={submitDA}
              submitting={submitting} // ✅ pass submitting state
            >
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
        )}

        <ConfirmationModal
          header="Confirmation!"
          body="Are you sure you want to cancel?"
          isOpen={confirmationModalOpen}
          onYes={goToAnotherPage}
          onNo={confirmationModal}
        />
      </AppContainer>

      {/* Terms & Conditions Modal */}
      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={() => setTermsmodalOpen(false)} />

      {/* Loader while modal content loads */}
      {loadingModal && <Loading />}
    </React.Fragment>
  );
};

export default OrganizationAdd;

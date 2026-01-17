import { CCol, CFormCheck } from '@coreui/react';
import { faFileContract, faSign, faSignature } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Inputs from 'src/components/Filters/Inputs';
import ConfirmationModal from 'src/components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import AppContainer from 'src/components/UI/AppContainer';
import Button from 'src/components/UI/Button';
import Form from 'src/components/UI/Form';
import Loading from 'src/components/UI/Loading'; // existing loader component
import { getDaAppllyInputs, getInitialDaData } from 'src/configs/InputConfig/addOrgsConfig';
import { formValidator } from 'src/helpers/formValidator';
import validateEmail from 'src/helpers/validateEmail';
import { useUpdateOrg } from 'src/hooks/api/useUpdateOrg';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
import { useUserAvailability } from 'src/hooks/api/useUserAvailability';
import useApi from 'src/hooks/useApi';
import useEmailVerification from 'src/hooks/useEmailVerification';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import { setUserData } from 'src/redux/user/userSlice';
import { generateAgreementPDF } from 'src/reports/orgAggrrement';

const OrganizationAdd = () => {
  dayjs.extend(utc);

  const user = useSelector((state) => state.user);
  // console.log({ user });
  const showConfirmation = useShowConfirmation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { checkEmailValidation } = useEmailVerification();
  const showToast = useShowToast();
  const { uploadAvatar, uploadAttachments, loading: avatarLoading } = useUploadAvatar();
  const [daApplyFormData, setDaApplyFormData] = useState(getInitialDaData(user));

  const { postData: getCities, loading: citiesLoading, data: cityRes } = useApi('/Common/cities');

  const [showStock, setShowStock] = useState(true);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');
  const [submitting, setSubmitting] = useState(false);
  const [signature, setSignature] = useState('');
  const [signatureJSON, setSignatureJSON] = useState('');
  // Loader states
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    getCities();
    formValidator();
    const state = location.state;
    if (state !== null) {
      const daData = state.org[0];
      const initialData = {
        ...daData,
        isWhatsAppAsso: daData.secondaryContact ? true : false,
        mailAddress: daData.address,
        dspId: daData.dspid,
        avatar: daData?.logoAvatar || '',
      };
      const sJSON = daData?.signature ? JSON.parse(daData?.signature) : '';
      setSignatureJSON(sJSON);
      setSignature(sJSON?.signature || '');
      setDaApplyFormData(initialData);
    }
  }, [user]);

  useEffect(() => {
    if (signature && !daApplyFormData.isTermsAccepted) {
      setDaApplyFormData((prev) => ({ ...prev, isTermsAccepted: true }));
    }
  }, [signature]);

  const { createUpdateOrg, addOrgLoading } = useUpdateOrg();
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

  const submitDA = async () => {
    if (termsmodalOpen) setTermsmodalOpen(false);
    formValidator();
    const form = document.querySelector('.apply-org-form');
    if (!form.checkValidity()) return;

    if (user?.isAuthenticated && user?.roleId === 2 && !signature) {
      showToast('To proceed, review and sign the aggreement.', 'warning');
      setTermsmodalOpen(true);
      return;
    }

    setSubmitting(true); // start submitting loader

    const daBody = {
      ...daApplyFormData,
      // signature: JSON.stringify(signatureJSON),
      signature: signatureJSON === '' ? signatureJSON : JSON.stringify(signatureJSON),
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
    // console.log("daBody", daBody);
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
        console.log({ uploadAvatarRes })
        if (uploadAvatarRes?.status === true) {
          const avatarPath =
            'productimages/' + uploadAvatarRes.keyValue.toString().split('\\').pop();
          const res = await createUpdateOrg({ ...daBody, logoAvatar: avatarPath });
          if (res.status === true) {
            if (user?.orgId === daBody?.id) {

              dispatch(
                setUserData({
                  orgInfo: { ...user?.orgInfo, signature: daBody?.signature },
                  isAuthenticated: true,
                }),
              );
            }
            await uploadDaAttachments(res.data.id)
          }
        }
      } else {
        const res = await createUpdateOrg(daBody);
        if (res.status === true) {
          if (user?.orgId === daBody?.id) {

            dispatch(
              setUserData({
                orgInfo: { ...user?.orgInfo, signature: daBody?.signature },
                isAuthenticated: true,
              }),
            );
          }

          await uploadDaAttachments(res.data.id);
        }
      }
    } catch (error) {
      console.error(error);
      // showToast('Error submitting form', 'error');
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
    cityRes?.data || [],
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
              {user?.isAuthenticated && (user?.roleId === 2 || signature) && (
                <CCol
                  md={
                    user?.isAuthenticated &&
                      user?.roleId === 2 &&
                      signature &&
                      user?.userId === signatureJSON?.adminId
                      ? 3
                      : 6
                  }
                >
                  <div className="d-flex flex-column ">
                    <label className="login_label labelName text-left mb-2 mt-2">
                      Agreement Contract
                    </label>
                    <Button
                      title={
                        signature
                          ? 'View and Download'
                          : !signature
                            ? 'View and Sign'
                            : 'View and Download'
                      }
                      onClick={async () => {
                        if (signature)
                          await generateAgreementPDF(
                            signature,
                            signatureJSON?.adminName,
                            signatureJSON?.dt,
                          );
                        else setTermsmodalOpen(true);
                      }}
                      className="w-auto"
                      icon={
                        <FontAwesomeIcon
                          icon={faFileContract}
                          size="xl"
                          style={{
                            marginRight: 10,
                          }}
                        />
                      }
                    />
                  </div>
                </CCol>
              )}
              {user?.isAuthenticated &&
                user?.roleId === 2 &&
                signature &&
                user?.userId === signatureJSON?.adminId && (
                  <CCol md={3}>
                    <div className="d-flex flex-column ">
                      <div className="change-signature-margin"></div>
                      <Button
                        title={'Change Signature'}
                        onClick={() => {
                          setTermsmodalOpen(true);
                        }}
                        className="w-auto"
                        icon={
                          <FontAwesomeIcon
                            icon={faSignature}
                            size="xl"
                            style={{
                              marginRight: 10,
                            }}
                          />
                        }
                      />
                    </div>
                  </CCol>
                )}
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
      <TermsAndConditionModal
        isOpen={termsmodalOpen}
        toggle={() => setTermsmodalOpen(false)}
        signature={signature}
        setSignature={user?.roleId === 2 && user?.isAuthenticated ? setSignature : null}
        onSubmit={submitDA}
        setSignatureJSON={setSignatureJSON}
      />

      {/* Loader while modal content loads */}
      {(loadingModal || citiesLoading || addOrgLoading || avatarLoading) && <Loading />}
    </React.Fragment>
  );
};

export default OrganizationAdd;

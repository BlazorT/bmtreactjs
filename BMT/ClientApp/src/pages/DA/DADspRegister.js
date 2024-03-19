//import React, { useEffect, useRef, useState } from 'react';
//import { useLocation, useNavigate } from 'react-router-dom';
//import { useSelector } from 'react-redux';

//import moment from 'moment';
//import { cilChevronBottom } from '@coreui/icons';
//import ConfirmationModal from '../../components/Modals/ConfirmationModal';
//import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
//import DAaddPartnerModal from 'src/components/Modals/DAaddPartnerModal';
//import { formValidator } from 'src/helpers/formValidator';
//import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
//import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
//import {
//  getDaDspsRegisterInputs,
//  getInitialDspData,
//} from 'src/configs/InputConfig/daDspsRegConfig';

//import Inputs from 'src/components/Filters/Inputs';
//import AppContainer from 'src/components/UI/AppContainer';
//import { CFormCheck } from '@coreui/react';
//import { getDspPartnersCols } from 'src/configs/ColumnsConfig/dspPartnersCols';
//import Form from 'src/components/UI/Form';
//import { useFetchPartners } from 'src/hooks/api/useFetchPartners';
//import { useRegisterDsp } from 'src/hooks/api/useRegisterDsp';
//import { useCreatePartners } from 'src/hooks/api/useCreatePartners';
//import useEmailVerification from 'src/hooks/useEmailVerification';
//import validateEmail from 'src/helpers/validateEmail';
//import { useShowToast } from 'src/hooks/useShowToast';
//import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
//import Loading from 'src/components/UI/Loading';

//const DADspRegister = () => {
//  // let state;
//  const location = useLocation();
//  const user = useSelector((state) => state.user);
//  const navigate = useNavigate();
//  const uploadRef = useRef(null);
//  const { uploadAvatar } = useUploadAvatar();
//  const { fetchPartners } = useFetchPartners();
//  //const { createUpdateDsp } = useRegisterDsp();
//  //const { createPartners } = useCreatePartners();
//  const { data, loading, error, checkEmailValidation } = useEmailVerification();
//  const showToast = useShowToast();

//  useEffect(() => {
//    const state = location.state;
//    formValidator();
//    if (state !== null) {
//      const daDsps = state.user;
//      console.log({ daDsps });
//      const daInititalData = {
//        ...daDsps,
//        isWhatsappAsso: daDsps.whatsApp !== '' ? true : false,
//        country: daDsps.stateId && daDsps.stateId < 54 ? 1 : 2,
//      };
//      setdspRegData(daInititalData);
//      getPartnerList(daDsps.id);
//    }
//  }, [location.state]);

//  const [dspRegData, setdspRegData] = useState(getInitialDspData(user));
//  const [rows, setRows] = useState([]);
//  const [showForm, setshowForm] = useState(true);
//  const [addPartnerModalOpen, setModalOpen] = useState(false);
//  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
//  // const { createUpdateDsp, createUpdateDspdata } = useRegisterDsp();
//  const [showPartners, setshowPartners] = useState(true);
//  const [isLoading, setIsLoading] = useState(false);
//  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
//  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');

//  const getPartnerList = async (id) => {
//    const partnerList = await fetchPartners(id);
//    const mappedArray = partnerList.map((data, index) => ({
//      uid: data.id,
//      businessName: data.businessName,
//      rowVer: 1,
//      createdAt: data.createdAt,
//      lastUpdatedAt: moment().utc().format(0),
//      fullName: data.fullName,
//      primaryContact: data.primaryContact,
//      dob: data.dob,
//      email: data.email,
//      status: data.status,
//      createdBy: data.createdBy,
//      decisionMakingAuthority: data.decisionMakingAuthority,
//    }));
//    setIsLoading(false);
//    setRows(mappedArray);
//  };

//  const registerDsp = async () => {
//    const form = document.querySelector('.dsp-reg-form');
//    formValidator();
//    if (form.checkValidity()) {
//      // Upload & Submit
//      const fUpload = document.getElementById('fileAvatar');
//      if (fUpload.files !== null && fUpload.files.length > 0) {
//        var avatar = fUpload.files[0];
//        const formData = new FormData();

//        formData.append('file', avatar);
//        formData.append('id', '0');
//        formData.append('name', avatar.name);
//        formData.append('fileName', avatar.name);
//        formData.append('createdBy', user.userId);
//        formData.append('createdAt', moment().utc().format());

//        // alert("Upload version before upload");
//        const uploadAvatarRes = await uploadAvatar(formData);
//        if (uploadAvatarRes.status === true) {
//          const avatarPath =
//            'productimages/' + uploadAvatarRes.keyValue.toString().split('\\').pop();
//          const res = await createUpdateDsp({ ...dspRegData, logoPath: avatarPath });
//          console.log(res);
//          if (res.status) {
//            navigate('/DspsList');
//          }
//        }
//      } else {
//        const res = await createUpdateDsp(dspRegData);
//        console.log({ res });
//        if (res.status) {
//          if (rows.length > 0) {
//            createPartnerData(res.data.id);
//          } else {
//            navigate('/DspsList');
//          }
//        }
//      }
//    }
//  };

//  const createPartnerData = async (dspIs) => {
//    const updatedRows = rows.map((row) => {
//      const { uid, ...rest } = row;
//      return {
//        ...rest,
//        id: uid,
//        dspid: dspIs,
//        lastUpdatedBy: user.userId,
//      };
//    });

//    await createPartners(updatedRows);

//    navigate('/DspsList');
//  };

//  const handleDspRegForm = (e, label) => {
//    if (label === 'logoPath') {
//      setdspRegData((prevData) => ({ ...prevData, [label]: e }));
//    } else {
//      const { name, value, type, checked } = e.target;

//      const updatedValue = type === 'checkbox' ? checked : value;

//      setdspRegData((prevData) => ({
//        ...prevData,
//        [name]: updatedValue,
//      }));
//    }
//  };

//  const onBlur = async () => {
//    const fieldValue = dspRegData.email;
//    if (validateEmail(fieldValue)) {
//      const isValidEmail = await checkEmailValidation(fieldValue);

//      if (isValidEmail === 'valid') {
//        //
//      } else if (isValidEmail === 'invalid') {
//        showToast(`${fieldValue} is not a valid email`, 'error');
//        const emailInputElement = document.getElementById('email');
//        setEmailMessage(`${fieldValue} is not a valid email`);
//        emailInputElement.setCustomValidity(`${fieldValue} is not a valid email`);
//      } else {
//        // const emailInputElement = document.getElementById('email');
//        // setEmailMessage(`${fieldValue} can not be verified Api error`);
//        // emailInputElement.setCustomValidity(`${fieldValue} can not verify api error`);
//      }
//    }
//  };

//  const AddPartnerClick = () => {
//    toggleAddPartMdl(true);
//  };

//  const toggleAddPartMdl = () => {
//    setModalOpen(!addPartnerModalOpen);
//  };

//  const toggleStock = () => {
//    setshowForm((prev) => !prev);
//  };

//  const toggleLicence = () => {
//    setshowPartners(!showPartners);
//  };

//  const TermsModal = () => {
//    setTermsmodalOpen(!termsmodalOpen);
//  };
//  const confirmationModal = () => {
//    setConfirmationModalOpen(!confirmationModalOpen);
//  };
//  const goToAnotherPage = () => {
//    navigate('/DspsList');
//  };

//  const dspPartnersCols = getDspPartnersCols(setRows, rows);
//  const daDspsRegisterInputs = getDaDspsRegisterInputs(
//    dspRegData,
//    handleDspRegForm,
//    TermsModal,
//    emailMessage,
//    onBlur,
//  );

//  if (isLoading) {
//    return <Loading />;
//  }
//  return (
//    <Form name="dsp-reg-form">
//      <AppContainer>
//        <DataGridHeader
//          title=" DSP Basic Information"
//          otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
//          filterDisable={true}
//        />

//        {showForm && (
//          <React.Fragment>
//            <Inputs
//              inputFields={daDspsRegisterInputs}
//              yesFn={goToAnotherPage}
//              submitFn={registerDsp}
//            >
            
//              <CFormCheck
//                name="isTermsAccepted"
//                checked={dspRegData.isTermsAccepted}
//                onChange={handleDspRegForm}
//                className="d-flex flex-row justify-content-center"
//                id="isTermsAccepted"
//                required
//                label={
//                  <span>
//                    By providing this info, you agree to our terms & conditions, read our{' '}
//                    <strong className="lblTerms" onClick={TermsModal}>
//                      Terms & Conditions (EULA)
//                    </strong>
//                  </span>
//                }
//              />
//            </Inputs>
//          </React.Fragment>
//        )}
//      </AppContainer>
//      <ConfirmationModal
//        header="Confirmation!"
//        body="Are you sure you want to cancel?"
//        isOpen={confirmationModalOpen}
//        onYes={goToAnotherPage}
//        onNo={confirmationModal}
//      />

//      <DAaddPartnerModal
//        isOpen={addPartnerModalOpen}
//        toggle={() => toggleAddPartMdl()}
//        rows={rows}
//        allPartners={rows}
//        setRows={setRows}
//        isAdd={true}
//      />

//      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
//    </Form>
//  );
//};

//export default DADspRegister;

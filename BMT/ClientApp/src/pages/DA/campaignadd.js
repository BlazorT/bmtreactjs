import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sms from '@mui/icons-material/Sms';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Email from '@mui/icons-material/Email';
import Facebook from '@mui/icons-material/Facebook';
import LinkedIn from '@mui/icons-material/LinkedIn';
import Twitter from '@mui/icons-material/Twitter';
import Instagram from '@mui/icons-material/Instagram';
import { CCard, CCardHeader, CCol, CRow } from '@coreui/react';

import moment from 'moment';
import { cilChevronBottom } from '@coreui/icons';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import DAaddPartnerModal from 'src/components/Modals/DAaddPartnerModal';
import { formValidator } from 'src/helpers/formValidator';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import {
  getCampaignAddConfig,
  getInitialDspData,
} from 'src/configs/InputConfig/campaignAddConfig';
import { CContainer } from '@coreui/react';
import FleetDashboardTabs from '../../components/FleetComponents/FleetDashboardTabs';
import globalutil from 'src/util/globalutil';

import Inputs from 'src/components/Filters/Inputs';
import AppContainer from 'src/components/UI/AppContainer';
import { CFormCheck } from '@coreui/react';
import { getDspPartnersCols } from 'src/configs/ColumnsConfig/dspPartnersCols';
import Form from 'src/components/UI/Form';
import { useFetchPartners } from 'src/hooks/api/useFetchPartners';
import { useRegisterDsp } from 'src/hooks/api/useRegisterDsp';
import { useCreatePartners } from 'src/hooks/api/useCreatePartners';
import useEmailVerification from 'src/hooks/useEmailVerification';
import validateEmail from 'src/helpers/validateEmail';
import { useShowToast } from 'src/hooks/useShowToast';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
import Loading from 'src/components/UI/Loading';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';

const campaignadd = () => {
  // let state;
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const uploadRef = useRef(null);
  const { uploadAvatar } = useUploadAvatar();
  const { fetchPartners } = useFetchPartners();
  const { createUpdateDsp } = useRegisterDsp();
  const { createPartners } = useCreatePartners();
  const { data, loading, error, checkEmailValidation } = useEmailVerification();
  const showToast = useShowToast();

  useEffect(() => {
    const state = location.state;
    formValidator();
    if (state !== null) {
      const daDsps = state.user;
      console.log({ daDsps });
      const daInititalData = {
        ...daDsps,
        isWhatsappAsso: daDsps.whatsApp !== '' ? true : false,
        country: daDsps.stateId && daDsps.stateId < 54 ? 1 : 2,
      };
      setdspRegData(daInititalData);
      getPartnerList(daDsps.id);
    }
  }, [location.state]);

  const [dspRegData, setdspRegData] = useState(getInitialDspData(user));
  const [rows, setRows] = useState([]);
  const [showForm, setshowForm] = useState(true);
  const [addPartnerModalOpen, setModalOpen] = useState(false);
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const showConfirmation = useShowConfirmation();
  const [showPartners, setshowPartners] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState('Enter Valid Email Address');
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Campaign', 'Networks', 'Schedule'];
  const [scheduleTab, setScheduleTab] = useState(0);
  const Scheduletabs = ['Add Schedules', 'Schedules'];
  const getPartnerList = async (id) => {
    const partnerList = await fetchPartners(id);
    const mappedArray = partnerList.map((data, index) => ({
      uid: data.id,
      businessName: data.businessName,
      rowVer: 1,
      createdAt: data.createdAt,
      lastUpdatedAt: moment().utc().format(0),
      fullName: data.fullName,
      primaryContact: data.primaryContact,
      dob: data.dob,
      email: data.email,
      status: data.status,
      createdBy: data.createdBy,
      decisionMakingAuthority: data.decisionMakingAuthority,
    }));
    setIsLoading(false);
    setRows(mappedArray);
  };

  const registerDsp = async () => {
    const form = document.querySelector('.dsp-reg-form');
    formValidator();
    if (form.checkValidity()) {
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
          const res = await createUpdateDsp({ ...dspRegData, logoPath: avatarPath });
          console.log(res);
          if (res.status) {
            navigate('/DspsList');
          }
        }
      } else {
        const res = await createUpdateDsp(dspRegData);
        console.log({ res });
        if (res.status) {
          if (rows.length > 0) {
            createPartnerData(res.data.id);
          } else {
            navigate('/DspsList');
          }
        }
      }
    }
  };

  const createPartnerData = async (dspIs) => {
    const updatedRows = rows.map((row) => {
      const { uid, ...rest } = row;
      return {
        ...rest,
        id: uid,
        dspid: dspIs,
        lastUpdatedBy: user.userId,
      };
    });

    await createPartners(updatedRows);

    navigate('/DspsList');
  };

  const handleDspRegForm = (e, label) => {
    if (label === 'logoPath') {
      setdspRegData((prevData) => ({ ...prevData, [label]: e }));
    } else {
      const { name, value, type, checked } = e.target;

      const updatedValue = type === 'checkbox' ? checked : value;

      setdspRegData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
      }));
    }
  };

  const onBlur = async () => {
    const fieldValue = dspRegData.email;
    if (validateEmail(fieldValue)) {
      const isValidEmail = await checkEmailValidation(fieldValue);

      if (isValidEmail === 'valid') {
        //
      } else if (isValidEmail === 'invalid') {
        showToast(`${fieldValue} is not a valid email`, 'error');
        const emailInputElement = document.getElementById('email');
        setEmailMessage(`${fieldValue} is not a valid email`);
        emailInputElement.setCustomValidity(`${fieldValue} is not a valid email`);
      } else {
        // const emailInputElement = document.getElementById('email');
        // setEmailMessage(`${fieldValue} can not be verified Api error`);
        // emailInputElement.setCustomValidity(`${fieldValue} can not verify api error`);
      }
    }
  };

  const AddPartnerClick = () => {
    toggleAddPartMdl(true);
  };

  const toggleAddPartMdl = () => {
    setModalOpen(!addPartnerModalOpen);
  };

  const toggleStock = () => {
    setshowForm((prev) => !prev);
  };

  const toggleLicence = () => {
    setshowPartners(!showPartners);
  };

  const TermsModal = () => {
    setTermsmodalOpen(!termsmodalOpen);
  };
  const confirmationModal = () => {
    setConfirmationModalOpen(!confirmationModalOpen);
  };
  const goToAnotherPage = () => {
    navigate('/DspsList');
  };
  const onCancel = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel?',
      isOpen: true,
      onYes: () => onYesConfirm(),
      onNo: () => onNoConfirm(),
    });
  };

  const onYesConfirm = () => {
   // toggle();
    onNoConfirm();

  };

  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };
  const dspPartnersCols = getDspPartnersCols(setRows, rows);
  const campaignAddInputs = getCampaignAddConfig(
    dspRegData,
    handleDspRegForm,
    TermsModal,
    emailMessage,
    onBlur,
  );
  const icons = {
    Tiktock: Email,
    Snapchat: Email,
    Facebook: Facebook,
    Sms: Sms,
    Linkedin: LinkedIn,
    Twitter: Twitter,
    Instagram: Instagram,
    Whatsapp: WhatsApp, // Assuming WhatsApp is your component for WhatsApp icon
    Email: Email // Assuming Email is your component for Email icon
  };
  const [vehDisprows, setVehDispRow] = useState([
    {
      id: 1,
      date: '01/16/2024',
      //vehicleCode: 'Ubl488',
      //vinCode: '22U88',
      daName: 'Basedine, 089029',
      //lastUpdated: '9:45:13',
      vehicleCount: 0,
    },
    //{
    //  id: 2,
    //  date: '01/10/2024',
    //  //vName: 'Toyota Xli',
    //  quantity: '22',
    //  daName: 'Asif hussain, 20989029',
    //  lastUpdated: '9:45:13',

    //},
    {
      id: 3,
      /* date: '01/16/2024',*/
      vehicleName: 'Honda civic, V45008, Sedan',
      quantity: '--',
      // daName: '776389'
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
    {
      id: 8,
      /* date: '01/16/2024',*/
      vehicleName: ' Left Side Miror, 995008',
      quantity: '9',
      // daName: 'Zeeshan ahmad',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },

    {
      id: 5,
      /* date: '01/16/2024',*/
      // vehicleName: 'Toyota Revo,U878',
      // vCode: 'UNO2898',
      daName: 'Geraldine, 837899',
      // lastUpdated: '9:45:13',
      vehicleCount: 0,
    },
    {
      id: 6,
      /* date: '01/16/2024',*/
      vehicleName: 'Toyota Grandee, Vb9973, Sedan',
      quantity: '--',
      //daName: 'Abdul Basit, 2098',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
    {
      id: 9,
      /* date: '01/16/2024',*/
      vehicleName: 'headphone, Hb9973',
      quantity: '15',
      //daName: 'Abdul Basit, 2098',
      lastUpdated: '9:45:13',
      vehicleCount: 5,
    },
  ]);
  const [vehDispcolumns, setVehDispcolumns] = useState([
    {
      field: 'date',
      headerClassName: 'custom-header-data-grid',
      width: 100,
      //   flex: 1,
      headerName: 'Date',
      filterable: false,
      sortable: false,
      renderCell: (params) =>
        params.row.date && <h6 className="m-0 p-0 fw-bold">{params.row.date}</h6>,
    },
    {
      /* flex: 1,*/
      minWidth: 130,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: 'DA',
      type: 'text',
      align: 'left',
      headerAlign: 'left',
      field: 'daName',
      editable: false,
      renderCell: (params) =>
        params.row.daName && <strong className="m-0 p-0 ">{params.row.daName}</strong>,
    },

    {
      field: 'vehicleName',
      headerClassName: 'custom-header-data-grid',
      minWidth: 250,
      flex: 1,
      headerName: 'Assignments',
      editable: false,
      filterable: true,
    },

    {
      /*flex: 1,*/
      minWidth: 200,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: 'Quantity',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      field: 'quantity',
      editable: false,
      renderCell: (params) => !params.row.date && params.row.availableStock,
    },
    {
      /* flex: 1,*/
      minWidth: 150,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      headerName: ' vehicle Count',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      field: 'vehicleCount',
      editable: false,
      renderCell: (params) => !params.row.date && params.row.availableStock,
    },

    {
      field: 'lastUpdated',
      headerClassName: 'custom-header-data-grid',
      minWidth: 130,
      /* flex: 1,*/
      headerName: 'Disp. Time',
      sortable: false,
      filterable: false,
      type: 'timestamp',
      //renderCell: (params) => !params.row.date && formatTime(params.row.lastUpdated),
    },
  ]);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Form name="dsp-reg-form">
      <FleetDashboardTabs
        title="camaign"
        fleetTabs={tabs}
        activeTab={activeTab}
        handleActiveTab={setActiveTab}
      />
      <CContainer fluid className="mt-4">
        {tabs[activeTab] === 'Campaign' && (
          <React.Fragment>
            <AppContainer>
              <DataGridHeader
                title="Campaign Basic Information"
                otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
                filterDisable={true}
              />

              {showForm && (
                <React.Fragment>
                  <Inputs
                    inputFields={campaignAddInputs}
                    yesFn={goToAnotherPage}
                    submitFn={registerDsp}
                  >

                    
                  </Inputs>
                </React.Fragment>
              )}
            </AppContainer>
          </React.Fragment>
        )}
        {tabs[activeTab] === 'Networks' && (
          <React.Fragment>
            <AppContainer>
              <DataGridHeader
                title="Networks"
                filterDisable={false}
              />
            </AppContainer>
            <CRow>
              {globalutil.networks().map((network, index) => {
                const IconName = network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase();
                // Assuming WhatsApp and Email are your icon components
                const IconComponent = icons[IconName];
                //console.log({ IconName })
                return (
                  <CCol md={4} key={index}>
                    <ul className="inlinedisplay">
                      <li className="divCircle">
                        <IconComponent className="BlazorIcon pdngleft" fontSize="large" color="success" />
                      </li>
                      <li className='network-checkbox-animate'>
                        <CFormCheck
                          className=""
                          id={IconName}
                          name={IconName}
                          label={network.name}
                         // checked={notificationData[IconName]}
                         // onChange={(e) => handleNotificationSetting(e, network)}
                        />
                      </li>
                    </ul>
                  </CCol>
                )
              })}


            </CRow>
            <React.Fragment>
              <div className="CenterAlign pt-2">
                <button
                  onClick={() => onCancel()}
                  type="button"
                  className="btn btn_Default m-2 sales-btn-style"
                >
                  Cancel
                </button>
                <button
                 // onClick={() => onSave()}
                  type="submit"
                  className="btn btn_Default sales-btn-style m-2"
                >
                  Save
                </button>
              </div>
              {/*  <Button title="Cancel" className="" onClick={() => onCancel()} />*/}
              {/*  <Button title="Save" onClick={() => onSave()} />*/}
            </React.Fragment>
          </React.Fragment>
        )}
        {tabs[activeTab] === 'Schedule' && (
          <React.Fragment>
            <AppContainer>
              <FleetDashboardTabs
                title="Schedule"
                fleetTabs={Scheduletabs}
                activeTab={scheduleTab}
                handleActiveTab={setScheduleTab}
              />
             
            </AppContainer>
            {tabs[activeTab] === 'Add Schedules' && (
              <React.Fragment>
                <AppContainer>
                 <h1>ADD</h1>
                </AppContainer>
              </React.Fragment>
            )}
            {tabs[activeTab] === 'Schedules' && (
              <React.Fragment>
                <AppContainer>
                    <React.Fragment>
                      <DataGridHeader  title="Schedules" />
                      <div className="show-stock">
                        <div className="row ">
                          <div className="col-md-12 col-xl-12">
                            <CustomDatagrid
                              rows={vehDisprows}
                              columns={vehDispcolumns}
                              rowHeight={55}
                              pagination={true}
                             // canExport={pageRoles.canExport}
                             // canPrint={pageRoles.canPrint}
                            />
                          </div>
                        </div>
                      </div>
                     
                    </React.Fragment>
                
                </AppContainer>
              </React.Fragment>
            )}
            <React.Fragment>
              <div className="CenterAlign pt-2">
                <button
                  onClick={() => onCancel()}
                  type="button"
                  className="btn btn_Default m-2 sales-btn-style"
                >
                  Cancel
                </button>
                <button
                  // onClick={() => onSave()}
                  type="submit"
                  className="btn btn_Default sales-btn-style m-2"
                >
                  Save
                </button>
              </div>
            </React.Fragment>
          </React.Fragment>
        )}
      </CContainer>


    
      <ConfirmationModal
        header="Confirmation!"
        body="Are you sure you want to cancel?"
        isOpen={confirmationModalOpen}
        onYes={goToAnotherPage}
        onNo={confirmationModal}
      />

     

      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </Form>
  );
};

export default campaignadd;

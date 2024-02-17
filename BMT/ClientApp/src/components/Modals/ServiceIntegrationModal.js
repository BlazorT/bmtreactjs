import React, { useEffect, useState } from 'react';

import {
  cilClock,
  cilExcerpt,
  cilFeaturedPlaylist,
  cilGraph,
  cilListNumbered,
  cilLockLocked,
  cilUser,
} from '@coreui/icons';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import CustomInput from '../InputsComponent/CustomInput';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import { CCol, CRow } from '@coreui/react';
import { formValidator } from 'src/helpers/formValidator';
import { useDispatch } from 'react-redux';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from 'src/util/globalutil';
import useFetch from 'src/hooks/useFetch';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';

const ServiceIntegrationModal = (prop) => {
  const { header, toggle, isOpen, serviceData, getServices } = prop;

  const dispatch = useDispatch();
  const {
    response: createServiceRes,
    loading: createServiceLoading,
    error: createServiceError,
    fetchData: createService,
  } = useFetch();

  const initialData = {
    id: serviceData ? serviceData.id : 0,
    name: serviceData ? serviceData.name : '',
    serviceUri: serviceData ? serviceData.serviceUri : '',
    frequency: serviceData ? serviceData.frequency : '',
    token: serviceData ? serviceData.token : '',
    entity: serviceData ? serviceData.entity : '',
    credential: serviceData ? serviceData.credential : '',
    status: serviceData ? serviceData.status : '',
    userName: serviceData ? serviceData.userName : '',
    password: serviceData ? serviceData.password : '',
    rowVer: 0,
    createdAt: moment().utc().startOf('month').format(),
    lastUpdatedAt: moment().utc().format(),
  };
  

  const [serviceIntegrationData, setServiceIntegrationData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleServiceIntegration = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setServiceIntegrationData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const onSave = async () => {
    const form = document.querySelector('.service-integration-form');
    formValidator();
    if (form.checkValidity()) {
      const service = {
        id: serviceIntegrationData.id,
        name: serviceIntegrationData.name,
        serviceUri: serviceIntegrationData.serviceUri,
        userName: serviceIntegrationData.userName,
        password: serviceIntegrationData.password,
        frequency: serviceIntegrationData.frequency,
        token: serviceIntegrationData.token,
        status: serviceIntegrationData.status === '' ? 5 : serviceIntegrationData.status,
        rowVer: serviceIntegrationData.rowVer,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
      };

      setIsLoading(createServiceLoading.current);
      await createService('/Common/submitintegrationservice', {
        method: 'POST',
        body: JSON.stringify(service),
      });

      if (createServiceRes.current?.status === true) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createServiceRes.current.message,
            toastVariant: 'success',
          }),
        );
        navigate('/ServiceIntegrated');
        getServices();
        setServiceIntegrationData(initialData);
        toggle();
      } else {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: createServiceRes.current?.message,
            toastVariant: 'error',
            //  `${JSON.stringify(createUserRes.current.message)}`,
          }),
        );

        setIsLoading(createServiceLoading.current);
      }
    }
  };

  const onTest = () => {
    const form = document.querySelector('.service-integration-form');

    formValidator();

    if (form.checkValidity()) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'test successfull',
          toastVariant: 'success',
        }),
      );
      toggle();
      setServiceIntegrationData(initialData);
    }
  };

  const onCancel = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: 'Are you sure you want to cancel?',
        isOpen: true,
        onYes: () => onYesConfirm(),
        onNo: () => onNoConfirm(),
      }),
    );
  };

  const onYesConfirm = () => {
    toggle();
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    setServiceIntegrationData(initialData);
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader>
        <h5 className="labelName">3rd Party Service Integration</h5>
      </ModalHeader>
      <ModalBody className="paddingAllSide">
        <form
          className="needs-validation service-integration-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="">
            <div className=" text-center">
              <CRow>
                <CCol md={6}>
                  <CustomInput
                    label="Service Name"
                    value={serviceIntegrationData.name}
                    onChange={handleServiceIntegration}
                    icon={cilExcerpt}
                    type="text"
                    className="form-control item "
                    id="name"
                    name="name"
                    maxLength={15}
                    placeholder="Accurate, Background verification"
                    isRequired={true}
                    message="Enter Task name"
                    title="Task Name"
                  />
                  <CustomInput
                    label="Secret field"
                    value={serviceIntegrationData.password}
                    onChange={handleServiceIntegration}
                    icon={cilLockLocked}
                    type="text"
                    className="form-control item "
                    id="password"
                    name="password"
                    placeholder="Secret field"
                    isRequired={true}
                    message="Enter Task name"
                    title="Task Name"
                  />
                  <CustomSelectInput
                    label="Entity"
                    value={serviceIntegrationData.entity}
                    onChange={handleServiceIntegration}
                    name="entity"
                    placeholder="Ancestor task"
                    message="Enter Ancestor Task"
                    title="Ancestor Task"
                    icon={cilGraph}
                    className="form-control item"
                    id="entity"
                    options={globalutil.businessentities()}
                    isRequired={true}
                  />

                  <CustomInput
                    label="Credential"
                    value={serviceIntegrationData.credential}
                    onChange={handleServiceIntegration}
                    icon={cilFeaturedPlaylist}
                    type="text"
                    className="form-control item"
                    id="credential"
                    name="credential"
                    placeholder="Credential"
                    maxLength={15}
                    isRequired={false}
                  />
                </CCol>
                <CCol md={6}>
                  <CustomInput
                    icon={cilListNumbered}
                    label="Service URI"
                    value={serviceIntegrationData.serviceUri}
                    onChange={handleServiceIntegration}
                    type="text"
                    className="form-control item"
                    id="serviceUri"
                    name="serviceUri"
                    placeholder="Service URI"
                    maxLength={15}
                    isRequired={false}
                  />

                  <CustomInput
                    label="User"
                    value={serviceIntegrationData.userName}
                    onChange={handleServiceIntegration}
                    icon={cilUser}
                    className="form-control item"
                    id="userName"
                    name="userName"
                    placeholder="User"
                    type="text"
                    maxLength={15}
                    isRequired={false}
                  />

                  <CustomInput
                    label="Interval"
                    value={serviceIntegrationData.frequency}
                    onChange={handleServiceIntegration}
                    icon={cilClock}
                    type="text"
                    className="form-control item"
                    id="frequency"
                    name="frequency"
                    placeholder="Interval"
                    maxLength={5}
                    isRequired={false}
                  />
                  <CustomSelectInput
                    label="Status"
                    value={serviceIntegrationData.status}
                    onChange={handleServiceIntegration}
                    name="status"
                    message="Enter Ancestor Task"
                    icon={cilGraph}
                    className="form-control item"
                    id="status"
                    options={globalutil.commonstatuses()}
                    isRequired={false}
                  />
                </CCol>
              </CRow>
            </div>
            <div className="CenterAlign pt-2">
              <button
                onClick={() => onCancel()}
                type="button"
                className="btn btn_Default m-2 sales-btn-style"
              >
                Cancel
              </button>
              <button
                onClick={toggle}
                type="button"
                className="btn btn_Default m-2 sales-btn-style"
              >
                Back
              </button>
              <button
                onClick={() => onTest()}
                type="submit"
                className="btn btn_Default m-2 sales-btn-style"
              >
                Test
              </button>
              <button
                type="submit"
                className="btn btn_Default sales-btn-style m-2"
                onClick={() => onSave()}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
export default ServiceIntegrationModal;

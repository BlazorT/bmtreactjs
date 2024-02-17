/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import {
  cilEqualizer,
  cilExcerpt,
  cilFunctionsAlt,
  cilGraph,
  cilList,
  cilListNumbered,
  cilMinus,
  cilUser,
} from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import CustomSearch from '../InputsComponent/CustomSearch';

import BuilderModal from './ExpressionBuilderModal';
import CustomInput from '../InputsComponent/CustomInput';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import { formValidator } from 'src/helpers/formValidator';

import { useSelector } from 'react-redux';

import globalutil from 'src/util/globalutil';
import moment from 'moment';
import useFetch from 'src/hooks/useFetch';
import { getOperatorsForId } from 'src/helpers/getOperatorsForType';
import Button from '../InputsComponent/Button';
import Loading from '../UI/Loading';
import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';

const FieldMappingModal = ({
  header,
  isOpen,
  toggle,
  isOnlyField,
  fields,
  fetchFeildMapping,
  editFieldData,
}) => {
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();

  const user = useSelector((state) => state.user);

  const { fetchData: submitWFlowField } = useFetch();
  const { response: getWorkFlowfieldRes, fetchData: GetWorkFlowfield } = useFetch();

  useEffect(() => {
    formValidator();

    const handleWorkFlowSubTaskList = (arg) => {
      getWorkFlowSubTaskList(arg);
    };

    const handleSetDspField = () => {
      if (editFieldData) {
        setdspField({
          ...editFieldData,
          id: editFieldData.id,
          fieldType: editFieldData.fieldTypeId,
          entity: editFieldData.entityId,
          fieldName: editFieldData.name,
          dataType: editFieldData.dataTypeId,
          length: editFieldData.length,
          defaultValue: editFieldData.defaultValue,
          isRequired: editFieldData.status,
          createdAt: editFieldData.createdAt,
          createdBy: editFieldData.createdBy,
        });
      }
    };

    if (isOpen) {
      if (!isOnlyField && editFieldData) {
        handleWorkFlowSubTaskList(1);
      } else if (!isOnlyField) {
        handleWorkFlowSubTaskList(0);
      } else {
        handleSetDspField();
      }
    } else {
      setIsLoading(false);
    }
  }, [isOpen]);

  const initialData = {
    id: 0,
    fieldType: '',
    entity: '',
    fieldName: '',
    dataType: '',
    length: '',
    defaultValue: '',
    isRequired: 0,
  };
  const [dspField, setdspField] = useState(initialData);
  const [expressionBuilderModal, setExpressionBuilderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fieldData, setFieldData] = useState([]);

  const [sourceField, setsourceField] = useState({
    id: 0,
    service: '',
    fieldName: '',
    fieldType: '',
    dataType: '',
    length: '',
    postCondition: '',
    frequency: '',
    frequencyInMin: '',
    status: 0,
  });

  const handledspField = (event, label) => {
    if (label === 'fieldName') {
      // const field=fieldData
      setdspField((prevData) => ({
        ...prevData,
        [label]: event,
        entity: event.tid,
        fieldType: event.fieldType,
        defaultValue: event.defaultValue ? event.defaultValue : '',
        length: event.characterLength ? event.characterLength : '',
        isRequired: event.nullable,
        dataType: event.dataType,
      }));
      setsourceField((prevData) => ({
        ...prevData,
        dataType: getDataTypeId(event.dataType),
      }));
    } else {
      const { name, value, type, checked } = event.target;

      setdspField((prevData) => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  function getDataTypeId(searchString) {
    // Iterate through the list of data types
    const dataTypes = globalutil.datatypes();
    const typeMappings = {
      bigint: 'int',
      varchar: 'string',
      // Add more mappings as needed
    };

    // Check if there is a direct match in the predefined data types
    for (let i = 0; i < dataTypes.length; i++) {
      if (dataTypes[i].name.toLowerCase() === searchString.toLowerCase()) {
        return dataTypes[i].id;
      }
    }

    // Check if there is a dynamic mapping
    const mappedType = typeMappings[searchString.toLowerCase()];
    if (mappedType) {
      // Find the matching data type in the predefined list
      for (let i = 0; i < dataTypes.length; i++) {
        if (dataTypes[i].name.toLowerCase() === mappedType.toLowerCase()) {
          return dataTypes[i].id;
        }
      }
    }

    // Return null if no match is found
    return null;
  }

  const handlesourceField = (event) => {
    const { name, value } = event.target;

    setsourceField((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const getWorkFlowSubTaskList = async (id) => {
    const fetchBody = {
      id: 0,
      tid: 0,
      columnOrdinal: 0,
      nullable: 0,
    };
    //alert(JSON.stringify(fetchBody));
    await GetWorkFlowfield(
      '/Workflow/dspstables',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        if (res) {
          setFieldData(res.data);

          if (id !== 0) {
            const currField = res.data.find((item) => item.id == editFieldData.id);
            setdspField((prevData) => ({
              ...prevData,
              fieldName: currField,
              entity: currField.tid,
              fieldType: currField.fieldType,
              defaultValue: currField.defaultValue ? currField.defaultValue : '',
              length: currField.characterLength ? currField.characterLength : '',
              isRequired: currField.nullable,
              dataType: currField.dataType,
              createdAt: editFieldData.createdAt,
              createdBy: editFieldData.createdBy,
            }));
            setsourceField((prevData) => ({
              ...prevData,
              id: editFieldData.id,
              dataType: editFieldData.dataTypeId,
              service: editFieldData.serviceId,
              fieldName: editFieldData.name,
              length: editFieldData.length,
              postCondition: editFieldData.expression,
              status: editFieldData.status,
            }));
          }
        } else {
          showToast(res.message, 'error');
        }
      },
    );
    setIsLoading(false);
  };

  const onSave = async () => {
    setIsLoading(true);
    formValidator();

    const form = document.querySelector('.field-mapping-form');
    if (form.checkValidity()) {
      const submitBody = [
        {
          id: isOnlyField ? dspField.id : sourceField.id,
          entityId: isOnlyField ? dspField.entity : dspField.fieldName.tid,
          dataTypeId: !isOnlyField ? sourceField.dataType : dspField.dataType,
          fieldTypeId: dspField.fieldType,
          serviceId: !isOnlyField ? sourceField.service : 0,
          dspFieldId: !isOnlyField ? dspField.fieldName.id : 0,
          name: !isOnlyField ? sourceField.fieldName : dspField.fieldName,
          length:
            dspField.length !== '' || sourceField.length !== ''
              ? !isOnlyField
                ? sourceField.length
                : dspField.length
              : 0,
          expression: !isOnlyField ? sourceField.postCondition : '',
          defaultValue: dspField.defaultValue,
          createdBy: dspField.createdBy ? dspField.createdBy : user.userId,
          lastUpdatedBy: user.userId,
          lastUpdatedAt: moment().utc().format(),
          createdAt: dspField.createdAt ? dspField.createdAt : moment().utc().format(),
          status: !isOnlyField ? sourceField.status : dspField.isRequired,
          rowVer: 1,
        },
      ];

      await submitWFlowField(
        '/Workflow/submitfields',
        { method: 'POST', body: JSON.stringify(submitBody) },
        (res) => {
          if (res.status) {
            fetchFeildMapping();
            toggle();
            setdspField(initialData);
            showToast(res.message);
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    }
    setIsLoading(false);
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
    toggle();
    onNoConfirm();
    setdspField(initialData);
    setsourceField({
      id: 0,
      service: '',
      fieldName: '',
      fieldType: '',
      dataType: '',
      length: '',
      postCondition: '',
      frequency: '',
      frequencyInMin: '',
      status: 0,
    });
  };

  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  const toggleExpressionMdl = () => {
    setExpressionBuilderModal((prev) => !prev);
  };

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      backdrop={true}
      fullscreen="lg"
      className={isOnlyField ? 'w-30' : 'field-mapping-modal'}
      centered={true}
    >
      <form className="needs-validation field-mapping-form" onSubmit={handleSubmit} noValidate>
        <ModalHeader className="confirmation-modal-header">{header}</ModalHeader>
        <ModalBody className="confirmation-modal-body">
          {isLoading ? (
            <Loading />
          ) : (
            <CRow>
              <CCol
                md={isOnlyField ? 12 : 6}
                className={`${isOnlyField ? '' : 'border-right-1px'} d-flex flex-column`}
              >
                <h4>4DSPS Field</h4>
                {!isOnlyField && (
                  <CustomSearch
                    label="Field"
                    value={dspField.fieldName}
                    onChange={handledspField}
                    icon={cilExcerpt}
                    type="text"
                    id="fieldName"
                    name="fieldName"
                    data={fieldData}
                    isRequired={true}
                    title="workflow field name"
                    placeholder="search fields..."
                    message="please select a field"
                  />
                )}
                <CustomSelectInput
                  message="Select Field Type"
                  title="Field Type"
                  label="Field Type"
                  value={dspField.fieldType}
                  className="form-control item form-select"
                  onChange={handledspField}
                  icon={cilUser}
                  id="fieldType"
                  name="fieldType"
                  options={globalutil.fieldtypes()}
                  isRequired={isOnlyField ? true : false}
                  disabled={!isOnlyField ? true : false}
                />
                <CustomSelectInput
                  label="Entity"
                  value={dspField.entity}
                  onChange={handledspField}
                  className="form-control item form-select"
                  icon={cilUser}
                  id="entity"
                  name="entity"
                  title="business entity"
                  disableOption="Select Entity"
                  options={isOnlyField ? globalutil.businessentities() : globalutil.dsP_TABLES()}
                  isRequired={isOnlyField ? true : false}
                  disabled={!isOnlyField ? true : false}
                />
                {isOnlyField && (
                  <React.Fragment>
                    <CustomInput
                      label="Field Name"
                      value={dspField.fieldName}
                      onChange={handledspField}
                      className="form-control item"
                      icon={cilExcerpt}
                      type="text"
                      id="fieldName"
                      name="fieldName"
                      placeholder="Field Name"
                      isRequired={true}
                    />
                    <CustomSelectInput
                      label="Data Type"
                      className="form-control item form-select"
                      value={dspField.dataType}
                      onChange={handledspField}
                      icon={cilListNumbered}
                      id="dataType"
                      name="dataType"
                      placeholder="Field Name"
                      disableOption="Select data type"
                      options={globalutil.datatypes()}
                      isRequired={true}
                    />
                  </React.Fragment>
                )}
                {!isOnlyField && (
                  <React.Fragment>
                    <CustomInput
                      label="Data Type"
                      className="form-control item form-select"
                      value={dspField.dataType}
                      onChange={handledspField}
                      icon={cilListNumbered}
                      id="dataType"
                      name="dataType"
                      placeholder="Data Type"
                      isRequired={false}
                      disabled={true}
                    />
                  </React.Fragment>
                )}

                <CustomInput
                  className="form-control item "
                  label="Length"
                  value={dspField.length}
                  onChange={handledspField}
                  icon={cilEqualizer}
                  type="number"
                  id="length"
                  name="length"
                  placeholder="20 Chracters"
                  isRequired={false}
                  disabled={!isOnlyField ? true : dspField.dataType == 1 ? false : true}
                />
                <CustomInput
                  className="form-control item "
                  label="Default Value"
                  value={dspField.defaultValue}
                  onChange={handledspField}
                  icon={cilMinus}
                  type="text"
                  id="defaultValue"
                  name="defaultValue"
                  placeholder="Imported Value"
                  isRequired={false}
                  disabled={!isOnlyField ? true : false}
                />
                <CRow className="w-50 align-self-center mt-3">
                  <CCol md={6}>
                    <input
                      type="radio"
                      id="completed"
                      name="isRequired"
                      checked={dspField.isRequired.toString() === '0'}
                      value={0}
                      onChange={handledspField}
                      disabled={!isOnlyField ? true : false}
                    />
                    <label htmlFor="completed" className="login_label labelName m-0 text-white ">
                      Required
                    </label>
                  </CCol>
                  <CCol md={6}>
                    <input
                      type="radio"
                      id="optional"
                      name="isRequired"
                      value={1}
                      onChange={handledspField}
                      checked={dspField.isRequired.toString() === '1'}
                      disabled={!isOnlyField ? true : false}
                    />
                    <label htmlFor="optional" className="login_label labelName m-0 text-white ">
                      Optional
                    </label>
                  </CCol>
                </CRow>
              </CCol>
              {!isOnlyField && (
                <CCol md={6}>
                  <div>
                    <h4 className="">Source Field</h4>
                    <CustomSelectInput
                      className="form-control item form-select"
                      label="Service"
                      value={sourceField.service}
                      onChange={handlesourceField}
                      icon={cilList}
                      id="service"
                      name="service"
                      title="service types"
                      disableOption="Select service"
                      options={globalutil.servicetypes()}
                      isRequired={true}
                      message="Select service name"
                    />
                    <CustomInput
                      className="form-control item"
                      label="Field Name"
                      value={sourceField.fieldName}
                      onChange={handlesourceField}
                      icon={cilExcerpt}
                      type="text"
                      id="fieldName"
                      name="fieldName"
                      placeholder="Field Name"
                      isRequired={true}
                      message="Enter field name"
                    />
                    <CustomSelectInput
                      className="form-control item form-select"
                      label="Data Type"
                      value={sourceField.dataType}
                      onChange={handlesourceField}
                      icon={cilListNumbered}
                      id="dataType"
                      name="dataType"
                      disableOption="Select data type"
                      options={globalutil.datatypes()}
                      isRequired={false}
                    />
                    <CustomInput
                      className="form-control item "
                      label="Length"
                      value={sourceField.length}
                      onChange={handlesourceField}
                      icon={cilEqualizer}
                      type="number"
                      id="length"
                      name="length"
                      disabled={sourceField.dataType == 1 ? false : true}
                      placeholder="20 Chracters"
                      isRequired={false}
                    />
                    <CRow className="align-items-end">
                      <CCol md={8}>
                        <CustomInput
                          className="form-control item "
                          label="Post - Condition"
                          value={sourceField.postCondition}
                          onChange={handlesourceField}
                          icon={cilFunctionsAlt}
                          type="text"
                          id="postCondition"
                          name="postCondition"
                          placeholder="if status = success send notification"
                          isRequired={false}
                          disabled={true}
                        />
                      </CCol>
                      <CCol md={4}>
                        <Button
                          title="Expression"
                          onClick={() => setExpressionBuilderModal(true)}
                          className="w-100 mb-1"
                        />
                        <BuilderModal
                          isOpen={expressionBuilderModal}
                          toggle={toggleExpressionMdl}
                          value={sourceField.postCondition}
                          setDaWorkFlowData={setsourceField}
                          name="postCondition"
                          fields={fields.map((field) => ({
                            ...field,
                            operators: getOperatorsForId(field.dataTypeId),
                            field: field.name,
                          }))}
                          entities={globalutil.dsP_TABLES()}
                        />
                      </CCol>
                    </CRow>
                    <CRow className="align-items-end">
                      <CCol md={8}>
                        <CustomSelectInput
                          className="form-control item form-select"
                          label="Frequency (seconds)"
                          value={sourceField.frequency}
                          icon={cilGraph}
                          id="frequency"
                          name="frequency"
                          disableOption="Select frequency"
                          options={[
                            { id: 1, name: '5 Sec' },
                            { id: 2, name: '10 Sec' },
                            { id: 3, name: '30 Sec' },
                            { id: 4, name: '1 Min' },
                            { id: 5, name: '1 Hour' },
                            { id: 6, name: '1 Day' },
                            { id: 7, name: 'Custom' },
                          ]}
                          isRequired={false}
                          onChange={handlesourceField}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CustomInput
                          className="form-control item"
                          label="Interval (sec)"
                          onChange={handlesourceField}
                          icon={cilEqualizer}
                          value={sourceField.frequencyInMin}
                          type="number"
                          id="frequencyInMin"
                          name="frequencyInMin"
                          placeholder="Minutes"
                          title="frequency in minutes"
                          disabled={sourceField.frequency == 7 ? false : true}
                          isRequired={false}
                        />
                      </CCol>
                    </CRow>
                  </div>
                  <CRow className="w-50 align-self-center mt-3">
                    <CCol md={6}>
                      <input
                        type="radio"
                        id="completedS"
                        name="status"
                        checked={sourceField.status.toString() === '0'}
                        value={0}
                        onChange={handlesourceField}
                      />
                      <label htmlFor="completedS" className="login_label labelName m-0 text-white ">
                        Required
                      </label>
                    </CCol>
                    <CCol md={6}>
                      <input
                        type="radio"
                        id="optionalS"
                        name="status"
                        value={1}
                        onChange={handlesourceField}
                        checked={sourceField.status.toString() === '1'}
                      />
                      <label htmlFor="optionalS" className="login_label labelName m-0 text-white ">
                        Optional
                      </label>
                    </CCol>
                  </CRow>
                </CCol>
              )}
            </CRow>
          )}
        </ModalBody>
        <ModalFooter className="confirmation-modal-footer">
          <button
            type="button"
            className="btn_Default m-2 sales-btn-style"
            onClick={() => onCancel()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn_Default m-2 sales-btn-style"
            onClick={() => onSave()}
          >
            Save
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default FieldMappingModal;

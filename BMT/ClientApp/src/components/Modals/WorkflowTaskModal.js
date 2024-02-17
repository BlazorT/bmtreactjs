import React, { useEffect, useState } from 'react';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { cilFunctionsAlt, cilTask } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import { formValidator } from 'src/helpers/formValidator';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import { RuleValidator } from 'react-querybuilder';

import BuilderModal from './ExpressionBuilderModal';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from 'src/util/globalutil';
import useFetch from 'src/hooks/useFetch';
import moment from 'moment';
import { getOperatorsForId } from 'src/helpers/getOperatorsForType';

const WorkflowTaskModal = (prop) => {
  const { header, isOpen, toggle, isSubTask, tasksData, fetchWorkflowTask, isEdit, taskId } = prop;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [expressionBuilderModal, setExpressionBuilderModal] = useState(false);
  const [postExpressionBuilderModal, setPostExpressionBuilderModal] = useState(false);

  const initialData = {
    taskName: '',
    ancestorTask: '',
    preCondition: '',
    postCondition: '',
    predecessorTask: '',
    status: '',
    feildType: '',
  };
  const [daWorkFlowData, setDaWorkFlowData] = useState(initialData);
  const [fieldsEntites, setFieldsEntites] = useState([]);

  useEffect(() => {
    fetchFeildMapping();
    if (isOpen && isEdit) {
      const singleTask = tasksData.find((item) => item.id === taskId);

      setDaWorkFlowData({
        id: singleTask.id,
        taskName: singleTask.name,
        ancestorTask: singleTask.ancestorTaskId,
        preCondition: singleTask.initExpression,
        postCondition: singleTask.completionExpression,
        predecessorTask: singleTask.initExpression,
        status: singleTask.currentStatus,
        feildType: singleTask.taskTypeId,
        createdAt: singleTask.createdAt,
        createdBy: singleTask.createdBy,
      });
    }
  }, [isOpen]);

  const { fetchData: submitTasksApi } = useFetch();
  const { fetchData: fetchFields } = useFetch();

  const toggleExpressionModal = () => {
    setExpressionBuilderModal((prev) => !prev);
  };

  const togglePostExpressionModal = () => {
    setPostExpressionBuilderModal((prev) => !prev);
  };

  const handleUserInput = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setDaWorkFlowData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const fetchFeildMapping = async () => {
    const fetchBody = {
      id: 0,
      entityId: 0,
      dataTypeId: 0,
      fieldTypeId: 0,
      length: 0,
      createdBy: 0,
      status: 0,
      rowVer: 1,
    };

    await fetchFields(
      '/Workflow/workflowfields',
      { method: 'POST', body: JSON.stringify(fetchBody) },
      (res) => {
        if (res.status) {
          setFieldsEntites(res.data);
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

  const onSave = async () => {
    formValidator();
    const form = document.querySelector('.workflow-task-form');
    if (form.checkValidity()) {
      const submitBody = {
        id: daWorkFlowData.id ? daWorkFlowData.id : 0,
        dspId: user.dspId,
        name: daWorkFlowData.taskName,
        createdBy: daWorkFlowData.createdBy ? daWorkFlowData.createdBy : user.userId,
        lastUpdatedBy: user.userId,
        lastUpdatedAt: moment().utc().format(),
        createdAt: daWorkFlowData.createdAt ? daWorkFlowData.createdAt : moment().utc().format(),
        currentStatus: daWorkFlowData.status,
        ancestorTaskId: daWorkFlowData.ancestorTask !== '' ? daWorkFlowData.ancestorTask : 0,
        taskTypeId: daWorkFlowData.feildType,
        predesessorTaskId:
          daWorkFlowData.predecessorTask !== '' ? daWorkFlowData.predecessorTask : 0,
        initExpression: daWorkFlowData.preCondition,
        completionExpression: daWorkFlowData.postCondition,
        rowVer: 1,
      };

      await submitTasksApi(
        '/Workflow/submittask',
        { method: 'POST', body: JSON.stringify(submitBody) },
        (res) => {
          if (res.status) {
            toggle();
            setDaWorkFlowData(initialData);
            fetchWorkflowTask();
            dispatch(
              updateToast({
                isToastOpen: true,
                toastMessage: res.message,
                toastVariant: 'success',
              }),
            );
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
    setDaWorkFlowData(initialData);
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
      <ModalHeader>{header}</ModalHeader>
      <ModalBody className="paddingAllSide">
        <form className="needs-validation workflow-task-form" onSubmit={handleSubmit} noValidate>
          <div className="">
            <div className=" text-center">
              <div className="row">
                <div className="col-md-4">
                  <CustomInput
                    label={isSubTask ? 'Task Item Name' : 'Task Name'}
                    value={daWorkFlowData.taskName}
                    onChange={handleUserInput}
                    icon={cilTask}
                    type="text"
                    className="form-control item "
                    id="taskName"
                    name="taskName"
                    placeholder="Task name"
                    isRequired={true}
                    message="Enter Task name"
                    title="Task Name"
                  />
                </div>
                <div className="col-md-4">
                  <CustomSelectInput
                    label={isSubTask ? 'Ancestor Sub Task' : 'Ancestor Task'}
                    value={daWorkFlowData.ancestorTask}
                    onChange={handleUserInput}
                    icon={cilTask}
                    options={
                      tasksData
                        ? tasksData.filter((item) => item.id != daWorkFlowData.predecessorTask)
                        : []
                    }
                    className="form-control item form-select"
                    id="ancestorTask"
                    name="ancestorTask"
                    placeholder="Ancestor task"
                    isRequired={false}
                    disableOption="Select Ancestor Task"
                    message="Enter Ancestor Task"
                    title="Ancestor Task"
                  />
                </div>
                <div className="col-md-4">
                  <CustomSelectInput
                    label={'Task Type'}
                    value={daWorkFlowData.feildType}
                    onChange={handleUserInput}
                    icon={cilTask}
                    options={globalutil.fieldtypes()}
                    className="form-control item form-select"
                    id="feildType"
                    name="feildType"
                    disableOption="Select Task Type"
                    isRequired={true}
                    message="Enter Task Type"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-10">
                  <CustomInput
                    label="Pre - Condition"
                    value={daWorkFlowData.preCondition}
                    onChange={handleUserInput}
                    icon={cilFunctionsAlt}
                    type="text"
                    className="form-control item "
                    id="preCondition"
                    name="preCondition"
                    placeholder="Expression for example age >=22"
                    isRequired={false}
                    message="Enter Pre Condition"
                    title="Pre Condition"
                    disabled={true}
                  />
                </div>
                <div className="col-md-2 CenterAlign pt-4">
                  <button
                    type="button"
                    className="btn btn_Default sales-btn-style"
                    onClick={toggleExpressionModal}
                  >
                    Expression
                  </button>
                  <BuilderModal
                    isOpen={expressionBuilderModal}
                    toggle={toggleExpressionModal}
                    setDaWorkFlowData={setDaWorkFlowData}
                    name="preCondition"
                    value={daWorkFlowData.preCondition}
                    fieldsEntites={fieldsEntites}
                    fields={fieldsEntites.map((field) => ({
                      ...field,
                      operators: getOperatorsForId(field.dataTypeId),
                      field: field.name,
                      // validator: validator,
                    }))}
                    entities={globalutil.businessentities()}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-10">
                  <CustomInput
                    label="Post - Condition"
                    value={daWorkFlowData.postCondition}
                    onChange={handleUserInput}
                    icon={cilFunctionsAlt}
                    type="text"
                    className="form-control item "
                    id="postCondition"
                    name="postCondition"
                    placeholder="if status = success send notification"
                    isRequired={true}
                    message="Enter Post Condition"
                    title="Post Condition"
                    disabled={true}
                  />
                </div>
                <div className="col-md-2 CenterAlign pt-4">
                  <button
                    type="button"
                    className="btn btn_Default sales-btn-style "
                    onClick={togglePostExpressionModal}
                  >
                    Expression
                  </button>
                  <BuilderModal
                    isOpen={postExpressionBuilderModal}
                    toggle={togglePostExpressionModal}
                    value={daWorkFlowData.postCondition}
                    setDaWorkFlowData={setDaWorkFlowData}
                    fieldsEntites={fieldsEntites}
                    name="postCondition"
                    fields={fieldsEntites.map((field) => ({
                      ...field,
                      operators: getOperatorsForId(field.dataTypeId),
                      field: field.name,
                    }))}
                    entities={globalutil.businessentities()}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <CustomSelectInput
                    label="Predecessor Task"
                    value={daWorkFlowData.predecessorTask}
                    onChange={handleUserInput}
                    icon={cilTask}
                    options={
                      tasksData
                        ? tasksData.filter((item) => item.id != daWorkFlowData.ancestorTask)
                        : []
                    }
                    className="form-control item form-select"
                    id="predecessorTask"
                    name="predecessorTask"
                    disableOption="Select Predecessor Task"
                    placeholder="Predecessor task"
                    isRequired={false}
                    message="Enter Predecessor Task"
                    title="Predecessor Task"
                  />
                </div>
                <div className="col-md-6">
                  <CustomSelectInput
                    label="Status"
                    value={daWorkFlowData.status}
                    onChange={handleUserInput}
                    icon={cilTask}
                    options={globalutil.commonstatuses()}
                    className="form-control item form-select"
                    id="status"
                    name="status"
                    isRequired={true}
                    message="Select Task Status"
                    disableOption="Select Status"
                  />
                </div>
              </div>
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
export default WorkflowTaskModal;

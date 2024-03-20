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

import { Table, Form, Button } from 'react-bootstrap';
import { getOperatorsForId } from 'src/helpers/getOperatorsForType';

const AreaSelectModel = (prop) => {
  const { header, isOpen, toggle,setData,data, isSubTask, tasksData, fetchWorkflowTask, isEdit, taskId } = prop;

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
       // setIsLoading(CityLoading.current);
      },
    );
  };
  const citydata = GetCityRes?.current?.data ? GetCityRes.current.data : [];
  const [states, setStates] = useState('');
  const [city, setCity] = useState('');

  const handleAdd = () => {
    setData([...data, { states, city }]);
    setStates('');
    setCity('');
  };
  
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader>{header}</ModalHeader>
      <ModalBody className="paddingAllSide">
        <form className="needs-validation workflow-task-form" onSubmit={handleSubmit} noValidate>
          <div className="">
            <div className=" text-center">
              <div className="row">
                <div className="col-md-6">
                  <CustomSelectInput
                    label="States"
                    value={states}
                    onChange={(e) => setStates(e.target.value)}
                    icon={cilTask}
                    options={globalutil.states()}
                    className="form-control item form-select"
                    id="states"
                    name="states"
                    isRequired={false}
                    disableOption="Select states "
                  />
                </div>
              
                <div className="col-md-6">
                  <CustomSelectInput
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    icon={cilTask}
                    options={citydata}
                    className="form-control item form-select"
                    id="city"
                    name="city"
                    disableOption="Select City"
                    isRequired={false}
                    message="Select City"
                  />
                </div>
              </div>
             
            </div>
            <div className="CenterAlign pt-2">
              <button
                onClick={onCancel}
                type="button"
                className="btn btn_Default m-2 sales-btn-style"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn_Default sales-btn-style m-2"
                onClick={handleAdd}
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
export default AreaSelectModel;

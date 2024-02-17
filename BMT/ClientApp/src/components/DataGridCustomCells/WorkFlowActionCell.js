/* eslint-disable react/prop-types */
import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow } from '@coreui/react';
import moment from 'moment';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from 'src/hooks/useFetch';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import WorkflowTaskModal from '../Modals/WorkflowTaskModal';
import Tooltip from '@mui/material/Tooltip';
const WorkFlowActionCell = ({ params, tasksData, fetchWorkflowTask }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const { fetchData: submitTasksApi } = useFetch();
  const [taskItemModal, settaskItemModal] = useState(false);

  const toggleStatus = (status) => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${
          params.row.workFlowName
        }?`,
        isOpen: true,
        onYes: () => onYesToggle(status),
        onNo: () => onNoConfirm(),
      }),
    );
  };
  const onYesToggle = async (status) => {
    const singleTask = tasksData.find((item) => item.id === params.row.id);

    const submitBody = {
      id: params.row.id,
      dspId: singleTask.dspId,
      name: singleTask.name,
      createdBy: singleTask.createdBy,
      lastUpdatedBy: user.userId,
      taskTypeId: singleTask.taskTypeId,
      lastUpdatedAt: moment().utc().format(),
      createdAt: singleTask.createdAt,
      currentStatus: status,
      ancestorTaskId: singleTask.ancestorTaskId,
      predesessorTaskId: singleTask.predesessorTaskId,
      initExpression: singleTask.initExpression,
      completionExpression: singleTask.completionExpression,
      rowVer: 1,
      taskfields: [],
    };

    await submitTasksApi(
      '/Workflow/submittask',
      { method: 'POST', body: JSON.stringify(submitBody) },
      (res) => {
        if (res.status) {
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
        onNoConfirm();
      },
    );
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const toggleTaskItemMdl = () => {
    settaskItemModal((prev) => !prev);
  };
  return (
    <React.Fragment>
      {params.row.status === 6 ? (
        <CRow>
          <CCol>
            <Tooltip title="Re-Active workflow task">
              <CIcon
                onClick={() => toggleStatus(1)}
                className="stock-toggle-icon"
                icon={cilReload}
              />
            </Tooltip>
          </CCol>
        </CRow>
      ) : (
        <CRow>
          <CCol>
            <Tooltip title="Edit workflow task">
              <CIcon onClick={toggleTaskItemMdl} className="stock-toggle-icon" icon={cilPencil} />
            </Tooltip>
          </CCol>
          <CCol>
            <Tooltip title="Delete workflow task">
              <CIcon
                className={`stock-toggle-icon`}
                onClick={() => toggleStatus(6)}
                icon={cilTrash}
              />
            </Tooltip>
          </CCol>
          <WorkflowTaskModal
            isOpen={taskItemModal}
            toggle={toggleTaskItemMdl}
            header="Task Item"
            isSubTask={false}
            tasksData={tasksData}
            taskId={params.row.id}
            fetchWorkflowTask={fetchWorkflowTask}
            isEdit={true}
          />
        </CRow>
      )}
    </React.Fragment>
  );
};
export default WorkFlowActionCell;

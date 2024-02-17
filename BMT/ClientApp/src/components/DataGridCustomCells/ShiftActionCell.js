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
import ShiftAddModal from 'src/components/Modals/ShiftAddModal';
import Tooltip from '@mui/material/Tooltip';
const ShiftActionCell = ({ params, shiftData, getShiftList }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const { fetchData: submitTasksApi } = useFetch();
  const [taskItemModal, settaskItemModal] = useState(false);

  const toggleStatus = (status) => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${
          params.row.name
        }?`,
        isOpen: true,
        onYes: () => onYesToggle(status),
        onNo: () => onNoConfirm(),
      }),
    );
  };
  const onYesToggle = async (status) => {
    const shiftItem = shiftData;
   // console.log()
    const submitBody = {
      id: params.row.id,
      dspId: shiftItem.dspId,
      name: shiftItem.name,
      hours: shiftItem.hours,
      createdBy: shiftItem.createdBy,
      description: shiftItem.description,
      lastUpdatedBy: user.userId,
      assignmentType: shiftItem.assignmentType,
      lastUpdatedAt: moment().utc().format(),
      createdAt: shiftItem.createdAt,
      status: status,
      startTime: shiftItem.startTime,
      endTime: shiftItem.endTime,
      rowVer: 1,
    };

    await submitTasksApi(
      '/Common/submitshift',
      { method: 'POST', body: JSON.stringify(submitBody) },
      (res) => {

        if (res.status) {
          getShiftList();
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
            <Tooltip title="Re-Active wave data">
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
            <Tooltip title="Edit wave data">
              <CIcon onClick={toggleTaskItemMdl} className="stock-toggle-icon" icon={cilPencil} />
            </Tooltip>
          </CCol>
          <CCol>
            <Tooltip title="Delete wave data">
              <CIcon
                className="stock-toggle-icon"
                onClick={() => toggleStatus(6)}
                icon={cilTrash}
              />
            </Tooltip>
          </CCol>
            <ShiftAddModal
            isOpen={taskItemModal}
            toggle={toggleTaskItemMdl}
            header="Wave Item"
            isSubTask={false}
            shiftData={shiftData}
            taskId={params.row.id}
            getShiftList={getShiftList}
            isEdit={true}
            />
           
        </CRow>
      )}
    </React.Fragment>
  );
};
export default ShiftActionCell;

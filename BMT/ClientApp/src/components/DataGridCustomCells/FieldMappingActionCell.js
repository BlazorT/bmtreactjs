import { cilPencil, cilPlus, cilReload, cilSettings, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow } from '@coreui/react';
import React, { useState } from 'react';
import FieldMappingModal from '../Modals/FieldMappingModal';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from 'src/hooks/useFetch';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import moment from 'moment';
import Tooltip from '@mui/material/Tooltip';

const FieldMappingActionCell = (prop) => {
  const { value, canUpdate, canDelete, fetchFeildMapping, fieldData, fields } = prop;

  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const { fetchData: updateFieldStatus } = useFetch();

  const toggleStatus = (status) => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${
          value.row.fieldName
        }?`,
        isOpen: true,
        onYes: () => onYesToggle(status),
        onNo: () => onNoConfirm(),
      }),
    );
  };
  const onYesToggle = async (status) => {
    const submitBody = [
      {
        id: value.row.id,
        entityId: fieldData.entityId,
        dataTypeId: fieldData.dataTypeId,
        fieldTypeId: fieldData.fieldTypeId,
        name: fieldData.name,
        length: fieldData.length,
        defaultValue: fieldData.defaultValue,
        createdBy: fieldData.createdBy,
        lastUpdatedBy: user.userId,
        lastUpdatedAt: moment().utc().format(),
        createdAt: fieldData.createdAt,
        status: status,
        rowVer: 1,
      },
    ];

    await updateFieldStatus(
      '/Workflow/submitfields',
      { method: 'POST', body: JSON.stringify(submitBody) },
      (res) => {
        if (res.status) {
          fetchFeildMapping();
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

  const toggleFieldMdl = () => {
    setIsFieldModalOpen(!isFieldModalOpen);
  };

  return (
    <React.Fragment>
      <strong className="w-auto text-truncate">{value.row.fieldName.toUpperCase()}</strong>
      {value.row.status === 6 ? (
        <div className="d-flex justify-content-center align-items-center ">
          {/* <small className="pe-1">Re Active</small> */}
          <Tooltip title="Re-Actice Field">
            <CIcon
              size="sm"
              onClick={() => toggleStatus(1)}
              className="stock-toggle-icon"
              icon={cilReload}
            />
          </Tooltip>
        </div>
      ) : (
        <React.Fragment>
          <div className="d-flex justify-content-center align-items-center ">
            {/* <small className="pe-1">Edit</small> */}
            <Tooltip title="Edit Field">
              <CIcon size="sm" className="fs-6" onClick={toggleFieldMdl} icon={cilPencil} />
            </Tooltip>
          </div>
          <div className="d-flex justify-content-center align-items-center ">
            {/* <small className="pe-1">Delete</small> */}
            <Tooltip title="Delete Field">
              <CIcon
                size="sm"
                className={`stock-toggle-icon ${value.row.fieldType !== 20 && 'pe-none'}`}
                onClick={() => toggleStatus(6)}
                icon={cilTrash}
              />
            </Tooltip>
          </div>
        </React.Fragment>
      )}
      <FieldMappingModal
        header={value?.id ? `Edit ${value.row.fieldName.toUpperCase()}` : 'Add Field'}
        isOpen={isFieldModalOpen}
        toggle={toggleFieldMdl}
        isOnlyField={value.row.service !== null && value.row.service !== 0 ? false : true}
        fetchFeildMapping={fetchFeildMapping}
        fields={fields}
        editFieldData={fieldData}
      />
    </React.Fragment>
  );
};
export default FieldMappingActionCell;

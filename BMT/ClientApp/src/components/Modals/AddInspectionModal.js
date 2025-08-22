/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import { cilCheckAlt } from '@coreui/icons';
import { CButtonGroup, CCol, CFormCheck, CRow } from '@coreui/react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import LoadingBtn from '../UI/LoadingBtn';

import globalutil from 'src/util/globalutil';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';

import CIcon from '@coreui/icons-react';

import { useDispatch, useSelector } from 'react-redux';
import useFetch from 'src/hooks/useFetch';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { updateToast } from 'src/redux/toast/toastSlice';
import { getInspectionDetailCols } from 'src/configs/ColumnsConfig/inspectionDetailCols';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';

const AddInspectionModal = ({
  header,
  toggle,
  isOpen,
  reportField,
  vehicleId,
  fleetVin,
  fetchInspection,
}) => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { fetchData: updateInspection } = useFetch();

  const { fetchData: getReportData } = useFetch();

  const [vehicelInspectionData, setvehicelInspectionData] = useState({
    inspectionItemId: 13,
    createdBy: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (reportField && isOpen) {
      getReport();
    } else if (!reportField && isOpen) {
      makeGroupingRows(globalutil.inspectionitems());
    }
  }, [isOpen]);

  const getReport = async () => {
    setIsLoading(true);
    setvehicelInspectionData((prevData) => ({
      ...prevData,
      inspectionItemId: reportField[0].reportTypeId,
    }));
    const body = {
      id: reportField[0].id,
    };
    //
    await getReportData(
      '/Vehicles/inspectionswithitems',
      { method: 'POST', body: JSON.stringify(body) },
      (res) => {
        if (res.status) {
          const initialArray = res.data.inspectionItems.map((field, index) => ({
            id: field.id,
            index: index,
            name: globalutil.inspectionitems().find((item) => item.id === field.inspectionItemId)
              .name,
            desc: globalutil.inspectionitems().find((item) => item.id === field.inspectionItemId)
              .desc,
            found: field.found,
            remarks: field.remarks,
            inspectionItemId: field.inspectionItemId,
            vehicleid: reportField[0].vehicleId,
            status: 1,
            createdAt: field.createdAt,
            lastUpdatedAt: dayjs().utc().format() ,
            lastUpdatedBy: user.userId,
            createdBy: field.createdBy,
            inspectionReportId: reportField[0].id,
          }));

          makeGroupingRows(initialArray, true);
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
    setIsLoading(false);
  };

  const handleInspectionData = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setvehicelInspectionData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const onAdd = async () => {
    setIsLoading(true);

    let inspectBody;

    if (reportField) {
      inspectBody = {
        ...reportField[0],
        lastUpdatedAt: dayjs().utc().format(),
        lastUpdatedBy: user.userId,
        dspId: user.dspId,
        inspectedBy: user.userId,
        reportTypeId: vehicelInspectionData.inspectionItemId,
        inspectorName: user.userInfo.fullName,
        status: rows.some((row) => row.found == 1) ? 2 : 1,
        approvedBy: 0,
        approvalName: '',
        remarks: '',
        rowVer: 1,
        inspectionItems: rows
          .filter(({ group }) => !group)
          .map(({ index, file, ...rest }) => ({
            ...rest,
          })),
      };
    } else {
      inspectBody = {
        id: 0,
        createdAt: dayjs().utc().format() ,
        lastUpdatedAt: dayjs().utc().format(),
        createdBy: user.userId,
        lastUpdatedBy: user.userId,
        dspId: user.dspId,
        inspectedBy: user.userId,
        reportTypeId: vehicelInspectionData.inspectionItemId,
        inspectiontype: globalutil
          .inspectionstatuses()
          .find((item) => item.id == parseInt(vehicelInspectionData.inspectionItemId)).name,
        inspectorName: user.userInfo.fullName,
        status: rows.some((row) => row.found == 1) ? 2 : 1,
        approvedBy: 0,
        approvalName: '',
        remarks: '',
        rowVer: 1,
        vehicleId: vehicleId,
        vehicleWinCode: fleetVin,
        inspectionItems: rows
          .filter(({ group }) => !group)
          .map(({ id, index, file, ...rest }) => ({
            ...rest,
          })),
      };
    }

    await updateInspection(
      '/Vehicles/submitinspectionreportwithitems',
      {
        method: 'POST',
        body: JSON.stringify(inspectBody),
      },
      (res) => {
        if (res.status) {
          fetchInspection();
          toggle();
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
    setIsLoading(false);
  };

  const makeGroupingRows = (data, update) => {
    const updatedData = [];
    const uniqueDescValues = [...new Set(data.map((item) => item.desc))];

    uniqueDescValues.forEach((uniqueDesc) => {
      const id = Math.floor(Math.random() * 900) + 100; // Replace this with your actual parent name
      const group = uniqueDesc;

      updatedData.push({ group, id });

      data
        .filter((item) => item.desc === uniqueDesc)
        .forEach((item) => {
          updatedData.push(item);
        });
    });
    const mappedArray = updatedData.map((field, index) => {
      let mappedObject;

      if (field.group) {
        mappedObject = {
          id: field.id,
          index: index,
          group: field.group,
        };
      } else {
        mappedObject = {
          id: field.id,
          index: index,
          found: field.found ? field.found : 0,
          remarks: field.remarks ? field.remarks : '',
          itemName: field.name,
          inspectionItemId: field.inspectionItemId ? field.inspectionItemId : field.id,
          vehicleid: field.vehicleid ? field.vehicleid : vehicleId,
          status: 1,
          createdAt: dayjs().utc().format() ,
          lastUpdatedAt: dayjs().utc().format() ,
          file: '',
          lastUpdatedBy: user.userId,
          createdBy: user.userId,
          ...(update && { inspectionReportId: field.inspectionReportId }),
        };
      }
      return mappedObject;
    });

    setRows(mappedArray);
  };

  const inspectionDetailCols = getInspectionDetailCols(setRows, rows);

  const onCancelBtn = () => {
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

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
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
  };

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      backdrop={true}
      fullscreen="lg"
      className="w-75"
      centered={true}
    >
      <ModalHeader className="confirmation-modal-header">{header}</ModalHeader>

      <ModalBody className="confirmation-modal-body">
        <div className="d-flex flex-column">
          <CRow>
            <CCol sm={6}>
              <CButtonGroup
                role="group"
                className="float-start"
                aria-label="Basic checkbox toggle button group"
                onChange={handleInspectionData}
              >
                {globalutil.inspectionstatuses().map((type) => {
                  return (
                    <CFormCheck
                      key={type.id}
                      type="radio"
                      button={{ color: 'primary', variant: 'outline' }}
                      name="inspectionItemId"
                      id={type.name}
                      checked={vehicelInspectionData.inspectionItemId == type.id}
                      value={type.id}
                      onChange={handleInspectionData}
                      autoComplete="on"
                      label={type.name}
                    />
                  );
                })}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CRow className="mt-2">
            <CCol className="m-0 d-flex flex-row align-items-center justify-content-end ">
              <CIcon className={'stock-toggle-icon text-dim'} icon={cilCheckAlt} />
              <span className="text-dim"> = Not satisfactory (blank) = Satisfactory</span>
            </CCol>
          </CRow>
          <CustomDatagrid
            columns={inspectionDetailCols}
            rows={rows}
            rowHeight={55}
            pagination={true}
            // pageNumber={8}
            loading={isLoading}
          />
        </div>
      </ModalBody>
      <ModalFooter className="confirmation-modal-footer">
        {isLoading ? (
          <LoadingBtn title="Submitting" />
        ) : (
          <React.Fragment>
            {isLoading ? (
              <LoadingBtn title="Submiting" />
            ) : (
              <React.Fragment>
                <button
                  type="button"
                  className="btn_Default m-2 sales-btn-style"
                  onClick={() => onCancelBtn()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn_Default m-2 sales-btn-style"
                  onClick={() => onAdd()}
                >
                  {reportField ? 'Update' : 'Add'}
                </button>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default AddInspectionModal;

/* eslint-disable react/prop-types */
import { cilNotes, cilPencil, cilReload, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow } from '@coreui/react';
import React, { useState } from 'react';
import AddVehicleModal from '../Modals/AddVehicleModal';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import { Tooltip } from '@mui/material';

const VehicleActionCell = ({
  value,
  vehicle,
  fetchVehicleData,
  daList,
  setActiveTab,
  setvehicleId,
  setFleetVin,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isInspectionVehicleModalOpen, setIsInspectionVehicleModalOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    response: toggleRes,
    error: toggleErr,
    loading: toggleLoading,
    fetchData: toggleUserStatus,
  } = useFetch();

  const toggleStatus = (status) => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${vehicle.name}?`,
        isOpen: true,
        onYes: () => onYesToggle(status),
        onNo: () => onNoConfirm(),
      }),
    );
  };
  const onYesToggle = async (status) => {
    // setIsLoading(true);

    const deleteBody = {
      id: vehicle.id,
      status: status,
      dspid: vehicle.dspid.toString(),
      makeDetailId: vehicle.makeDetailId,
      model: vehicle.model,
      name: vehicle.name,
      color: '',
      fleetCode: vehicle.fleetCode,
      assignedDAId: vehicle.assignedDAId,
      helperDriverId: vehicle.helperDriverId,
      ownershipTypeId: vehicle.ownershipTypeId,
      code: vehicle.code,
      expiryDate: vehicle.expiryDate,
      categoryId: vehicle.categoryId,
      address: vehicle.address,
      numberPlate: vehicle.numberPlate,
      lastUpdatedBy: user.userId,
    };

    await toggleUserStatus(
      '/Vehicles/submitvehicle',
      {
        method: 'POST',
        body: JSON.stringify(deleteBody),
      },
      (res) => {
        if (res.status === true) {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'success',
            }),
          );
          fetchVehicleData();
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
        }

        dispatch(
          setConfirmation({
            isOpen: false,
          }),
        );
      },
    );
    // setIsLoading(toggleLoading.current);
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <div className="pt-3 text-center">
          <div className="sk-spinner sk-spinner-pulse"></div>
        </div>
      ) : (
        <React.Fragment>
          {value.row.status === 17 || value.row.status === 18 ? (
            <CRow>
              <CCol>
                <Tooltip title="Re-Active Vehicle">
                  <CIcon
                    onClick={() => toggleStatus(16)}
                    className="stock-toggle-icon"
                    icon={cilReload}
                  />
                </Tooltip>
              </CCol>
            </CRow>
          ) : (
            <CRow>
              <CCol>
                <Tooltip title="Check Reports">
                  <CIcon
                    className="stock-toggle-icon"
                    onClick={() => {
                      setvehicleId(vehicle.id);
                      setFleetVin(vehicle.code);
                      setActiveTab(2);
                    }}
                    icon={cilNotes}
                  />
                </Tooltip>
              </CCol>
              <CCol>
                <Tooltip title="Edit Vehicle">
                  <CIcon
                    onClick={() => setIsAddVehicleModalOpen(true)}
                    className="stock-toggle-icon"
                    icon={cilPencil}
                  />
                </Tooltip>
              </CCol>
              <CCol>
                <Tooltip title="Delete Vehicle">
                  <CIcon
                    className="stock-toggle-icon"
                    onClick={() => toggleStatus(17)}
                    icon={cilTrash}
                  />
                </Tooltip>
              </CCol>
            </CRow>
          )}
          <AddVehicleModal
            header="Edit Vehicle"
            isOpen={isAddVehicleModalOpen}
            onSave={() => setIsAddVehicleModalOpen(false)}
            onCancel={() => setIsAddVehicleModalOpen(false)}
            vehicle={vehicle}
            fetchVehicleData={fetchVehicleData}
            daList={daList}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default VehicleActionCell;

/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';

import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import FilterIconMenu from '../DataGridComponents/FilterIconMenu';

import { CCol, CContainer, CRow } from '@coreui/react';
import DaNewAssignment from '../Component/DaNewAssignment';
import useFetch from 'src/hooks/useFetch';
import { useSelector } from 'react-redux';

import moment from 'moment';
import Loading from '../UI/Loading';
import { useShowToast } from 'src/hooks/useShowToast';
import { getDaInventoryCols } from 'src/configs/ColumnsConfig/daInventoryCols';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import CustomSearch from '../InputsComponent/CustomSearch';

const DAInventoryModal = ({ header, toggle, isOpen, value, daList, getInventory, isSingleDis }) => {
  const user = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [submitRows, setSubmitRows] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [vehicle, setVehicle] = useState('');
  const [da, setDa] = useState(daList ? daList[0] : '');

  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { fetchData: fetchUnAssignInventory } = useFetch();
  const { fetchData: submitDispatchments } = useFetch();

  const daInventoryCols = getDaInventoryCols(setRows, showToast, rows.length > 0 ? false : true);

  useEffect(() => {
    if (isOpen) {
      getDaInventory(da !== '' ? da.id : '');
    }
  }, [isOpen]);

  const getDaInventory = async (daId) => {
    try {
      if (isOpen) {
        const assignToId = value.id === 0 ? daId : value.id;
        const invBody = {
          id: 0,
          dspid: user.dspId,
          inventoryOf: 0,
          assignedTo: 0,
          isAssigned: 2,
          createdAt: moment().startOf('month').utc().format(),
          lastUpdatedAt: moment().utc().format(),
          assignmentType: isSingleDis ? 30 : 29,
          remarks: '',
          status: 1,
          rowVer: 0,
        };

        await fetchUnAssignInventory(
          '/Dispatchment/dispatchments',
          {
            method: 'POST',
            body: JSON.stringify(invBody),
          },
          (res) => {
            console.log(JSON.stringify(invBody));
            console.log({ res });
            if (res.status) {
              setVehicleList(res.data.data.filter((item) => item.inventoryOf === 2));
              const mappedArray = res.data.data
                .filter((item) => item.assignedTo == 0 && item.inventoryOf !== 2)
                .map((data, index) => ({
                  ...data,
                  id: index,
                  index: index,
                  newAssign: data.isAssigned ? !(data.isAssigned === 0) : false,
                  assignedItem: data.productName + ' ,' + data.shortcode,
                  quantity: '',
                  availQuantity: data.availableQty ?? 0,
                  remarks: data.remarks,
                }));

              const mappedAssignArray = res.data.data
                .filter((item) => item.assignedTo !== 0 && item.assignedTo === assignToId)
                .map((data, index) => ({
                  ...data,
                  index: index,
                  assign: true,
                  code: data.shortcode,
                  assignedQty: data.assignedQty,
                  remarks: data.remarks,
                  assignedItem: data.productName + ` ,${data.shortcode}`,
                  lastUpdated: data.lastUpdatedAt,
                  status: data.status,
                }));

              setRows(mappedAssignArray);
              setSubmitRows(mappedArray);
              setIsLoading(false);
            } else {
              showToast(res.message, 'error');
              setIsLoading(false);
            }
          },
        );
      }
    } catch (error) {
      console.error('Error fetching DA Inventory:', error);
      showToast('Error fetching DA Inventory', 'error');
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to cancel?`,
      isOpen: true,
      onYes: () => onYes(),
      onNo: () => onNo(),
    });
  };

  const onYes = () => {
    toggle();
    setSubmitRows([]);
    setRows([]);
    setVehicle('');
    // setDa('');
    onNo();
  };

  const onNo = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  const onSave = async () => {
    let vehicleAssign = '';
    if (value.id === 0 && da === '') {
      showToast('Select Associate First', 'warning');
      return;
    }
    setLoading(true);
    if (vehicle !== '') {
      vehicleAssign = {
        id: 0,
        assignedQty: 1,
        availableQty: 1,
        assignedTo: value.id === 0 ? da.id : value.id,
        dspid: user.dspId,
        productDetailId: vehicle.productDetailId,
        vehicleId: vehicle.vehicleId,
        inventoryOf: vehicle.inventoryOf,
        isAssigned: 1,
        remarks: '',
        status: vehicle.status,
        rowVer: vehicle.rowVer,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
        createdBy: user.userId,
        lastUpdatedBy: user.userId,
      };
    }
    const newAssignRows = submitRows
      .filter((row) => row.newAssign !== false)
      .map((data) => ({
        id: 0,
        assignedQty: data.quantity,
        availableQty: data.availableQty,
        assignedTo: value.id === 0 ? da.id : value.id,
        dspid: user.dspId,
        productDetailId: data.productDetailId,
        vehicleId: data.vehicleId,
        inventoryOf: data.inventoryOf,
        isAssigned: data.newAssign ? 1 : 0,
        assignmentType: isSingleDis ? 30 : 29,
        remarks: data.remarks,
        status: data.status,
        rowVer: data.rowVer,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
        createdBy: user.userId,
        lastUpdatedBy: user.userId,
      }));
    const unAssignRows = rows
      .filter((row) => row.assign !== true)
      .map((data) => ({
        id: data.id,
        dspid: user.dspId,
        inventoryOf: data.inventoryOf,
        productDetailId: data.productDetailId,
        assignmentType: isSingleDis ? 30 : 29,
        vehicleId: data.vehicleId,
        assignedTo: 0,
        isAssigned: 0,
        availableQty: data.availableQty,
        remarks: data.remarks,
        status: data.status,
        rowVer: data.rowVer,
        createdAt: data.createdAt,
        lastUpdatedAt: moment().utc().format(),
        lastUpdatedBy: user.userId,
        createdBy: data.createdBy,
      }));

    const mergeData = [...unAssignRows, ...newAssignRows];
    if (vehicleAssign !== '') {
      mergeData.push(vehicleAssign);
    }
    console.log(JSON.stringify(mergeData));
    //

    if (mergeData.length > 0) {
      await submitDispatchments(
        '/Dispatchment/submitdadispatchments',
        {
          method: 'POST',
          body: JSON.stringify(mergeData),
        },
        (res) => {
          console.log({ res });
          if (res.status) {
            showToast(res.message);
            setVehicle('');
            // setDa('');
            getDaInventory(value.id === 0 ? da.id : '');
            getInventory ? getInventory() : '';
            // toggle();
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    } else {
      showToast('Assign Items First', 'warning');
    }
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      backdrop={false}
      fullscreen="lg"
      className={'w-75'}
      centered={true}
    >
      <ModalHeader className="confirmation-modal-header">
        <div className="w-100 d-flex flex-row justify-content-center align-items-center ">
          {value?.id === 0 ? (
            <CustomSearch
              value={da}
              onChange={(e) => {
                setDa(e);
                getDaInventory(e.id);
              }}
              className="w-50"
              textAlign="center"
              type="text"
              id="dispatchDa"
              name="dispatchDa"
              data={daList}
              isRequired={true}
              placeholder="Search DA..."
              message="please select a product"
            />
          ) : (
            <div>{header}</div>
          )}
        </div>
        {/* <FilterIconMenu /> */}
      </ModalHeader>
      <ModalBody className="confirmation-modal-body">
        <React.Fragment>
          {isLoading ? (
            <Loading />
          ) : (
            <CContainer fluid className="m-0 p-0 mt-1">
              <CRow>
                <CCol md={5}>
                  <h5>Pre Trip</h5>
                  <DaNewAssignment
                    value={value}
                    rows={submitRows}
                    setRows={setSubmitRows}
                    isLoading={loading}
                    canAssign={rows.length > 0 ? false : true}
                    vehicleList={vehicleList}
                    vehicle={vehicle}
                    setVehicle={setVehicle}
                    isSingleDispatch={value.id !== 0}
                    daList={daList}
                    da={da}
                    setDa={setDa}
                    isSingleDis={isSingleDis}
                  />
                </CCol>

                <CCol md={7} className="border-right-1px">
                  <h5 className="margin-bottom-2">Post Trip</h5>
                  <CustomDatagrid
                    rows={rows}
                    columns={daInventoryCols}
                    rowHeight={45}
                    pagination={true}
                    pageNumber={6}
                    loading={loading}
                    noRowsMessage="No Products"
                    hiddenCols={{
                      columnVisibilityModel: {
                        newAssign: false,
                        quantity: false,
                        availQuantity: false,
                      },
                    }}
                  />
                </CCol>
              </CRow>
            </CContainer>
          )}
        </React.Fragment>
      </ModalBody>
      <ModalFooter className="confirmation-modal-footer">
        <button type="button" className="btn_Default m-2 sales-btn-style" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn_Default m-2 sales-btn-style" onClick={onSave}>
          Save
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default DAInventoryModal;

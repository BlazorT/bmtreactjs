/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import { CCol, CContainer, CRow } from '@coreui/react';
import useFetch from 'src/hooks/useFetch';
import { useSelector } from 'react-redux';

import moment from 'moment';
import { useShowToast } from 'src/hooks/useShowToast';
import { getDaInventoryCols } from 'src/configs/ColumnsConfig/daInventoryCols';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import CustomSearch from 'src/components/InputsComponent/CustomSearch';
import Loading from 'src/components/UI/Loading';
import DaNewAssignment from 'src/components/Component/DaNewAssignment';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import Button from 'src/components/InputsComponent/Button';
import LoadingBtn from 'src/components/UI/LoadingBtn';
import AppContainer from 'src/components/UI/AppContainer';

const SingleDispatchment = () => {
  const user = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [rows, setRows] = useState([]);
  const [submitRows, setSubmitRows] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [vehicle, setVehicle] = useState('');
  const [da, setDa] = useState('');
  const [daList, setDaList] = useState([]);

  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { fetchUsers } = useFetchUsers();
  const { fetchData: fetchUnAssignInventory } = useFetch();
  const { fetchData: submitDispatchments } = useFetch();

  const daInventoryCols = getDaInventoryCols(setRows, showToast, rows.length > 0 ? false : true);

  useEffect(() => {
    getDasList();
  }, []);

  const getDasList = async () => {
    const usersList = await fetchUsers(3);
    const filterOffBoardedDa = usersList.filter((da) => da.status !== 4);
    setDaList(filterOffBoardedDa);
    setDa(filterOffBoardedDa[0]);
    getDaInventory(filterOffBoardedDa[0]?.id || 0);
  };

  const getDaInventory = async (daId) => {
    setIsUpdating(true);

    const invBody = {
      id: 0,
      dspid: user.dspId,
      inventoryOf: 0,
      assignedTo: daId,
      isAssigned: 2,
      assignmentType: 30,
      createdAt: moment().startOf('month').utc().format(),
      lastUpdatedAt: moment().utc().format(),
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
            .filter((item) => item.assignedTo !== 0 && item.assignedTo === daId)
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
        } else {
          showToast(res.message, 'error');
        }
      },
    );
    setIsUpdating(false);
    if (isLoading) setIsLoading(false);
  };

  const onSave = async () => {
    setIsUpdating(true);

    const newAssignRows = submitRows
      .filter((row) => row.newAssign !== false)
      .map((data) => ({
        id: 0,
        assignedQty: data.quantity,
        availableQty: data.availableQty,
        assignedTo: da.id,
        dspid: user.dspId,
        productDetailId: data.productDetailId,
        vehicleId: data.vehicleId,
        inventoryOf: data.inventoryOf,
        assignmentType: 30,
        isAssigned: data.newAssign ? 1 : 0,
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
        vehicleId: data.vehicleId,
        assignedTo: 0,
        isAssigned: 0,
        availableQty: data.availableQty,
        remarks: data.remarks,
        assignmentType: 30,
        status: data.status,
        rowVer: data.rowVer,
        createdAt: data.createdAt,
        lastUpdatedAt: moment().utc().format(),
        lastUpdatedBy: user.userId,
        createdBy: data.createdBy,
      }));

    const mergeData = [...unAssignRows, ...newAssignRows];

    // console.log(JSON.stringify(mergeData));
    console.log({ mergeData });
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
            getDaInventory(da.id);
          } else {
            showToast(res.message, 'error');
          }
        },
      );
    } else {
      showToast('Assign Items First', 'warning');
    }
    setIsUpdating(false);
  };

  return (
    <AppContainer>
      <div className="d-flex justify-content-center align-items-center w-100">
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
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <CContainer fluid className="m-0 p-0 mt-1">
          <CRow>
            <CCol md={5} className="border-right-1px">
              <h5>Pre Trip</h5>
              <DaNewAssignment
                rows={submitRows}
                setRows={setSubmitRows}
                isLoading={isUpdating}
                canAssign={rows.length > 0 ? false : true}
                isSingleDis={true}
              />
            </CCol>

            <CCol md={7} className="">
              <h5 className="margin-bottom-2">Post Trip</h5>
              <CustomDatagrid
                rows={rows}
                columns={daInventoryCols}
                rowHeight={45}
                pagination={true}
                pageNumber={6}
                loading={isUpdating}
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

      <div className="text-end mt-2">
        {isUpdating ? <LoadingBtn title="Updating" /> : <Button title="Save" onClick={onSave} />}
      </div>
    </AppContainer>
  );
};

export default SingleDispatchment;

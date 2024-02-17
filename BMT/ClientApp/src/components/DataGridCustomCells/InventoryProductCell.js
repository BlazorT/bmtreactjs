import React, { useState } from 'react';

import CIcon from '@coreui/icons-react';
import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import { useNavigate } from 'react-router-dom';

import useFetch from 'src/hooks/useFetch';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import InventoryProductModal from '../Modals/InventoryProductModal';

const InventoryProductCell = (prop) => {
  const { value, fetching, user } = prop;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showAddProducutModal, setShowAddProducutModal] = useState(false);

  const {
    response: deleteRes,
    error: deleteError,
    loading: delLoading,
    fetchData: deleteUserCall,
  } = useFetch();

  const {
    response: reActiveRes,
    error: reActiveErr,
    loading: reActiveLoading,
    fetchData: reActive,
  } = useFetch();

  const [isLoading, setIsLoading] = useState(false);

  const editUser = (id) => {
    navigate('/UserRegister', { state: { id: id, user: user } });
  };

  const deleteUser = async () => {
    setIsLoading(delLoading.current);

    const deleteBody = {
      id: user[0].id,
      email: user[0].email,
      lastName: user[0].lastName,
      password: user[0].password,
      primaryContact: user[0].primaryContact,
      userId: user[0].userId,
      userName: user[0].userName,
      status: 5,
      remarks: 'delete confrimation',
    };

    await deleteUserCall('/BlazorApi/updateda', {
      method: 'POST',
      body: JSON.stringify(deleteBody),
    });

    if (deleteRes.current?.status === true) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'user deleted successfully',
          toastVariant: 'success',
        }),
      );
      fetching();
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong',
          toastVariant: 'error',
        }),
      );
    }
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    setIsLoading(delLoading.current);
  };

  const reActiveUser = async () => {
    setIsLoading(reActiveLoading.current);
    const data = {
      id: user[0].id,
      status: 1,
      email: user[0].email,
      lastName: user[0].lastName,
      password: user[0].password,
      primaryContact: user[0].primaryContact,
      userId: user[0].userId,
      userName: user[0].userName,
    };
    await reActive('/BlazorApi/updateda', { method: 'POST', body: JSON.stringify(data) });

    if (reActiveRes.current?.status === true) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'user activated successfully',
          toastVariant: 'success',
        }),
      );

      fetching();
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong try again later',
          toastVariant: 'error',
        }),
      );
    }
    setIsLoading(reActiveLoading.current);
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const onReActice = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to re active ${user[0].userName}?`,
        isOpen: true,
        onYes: () => onYesReActiveConfirm(),
        onNo: () => onNoConfirm(),
      }),
    );
  };

  const onDelete = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to delete ${value.row.partName}?`,
        isOpen: true,
        onYes: () => onYesDelConfirm(),
        onNo: () => onNoConfirm(),
      }),
    );
  };
  const onYesDelConfirm = () => {
    // deleteUser();
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };
  const onYesReActiveConfirm = () => {
    reActiveUser();
  };
  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const toggleAddProducutModal = () => {
    setShowAddProducutModal(!showAddProducutModal);
  };

  return (
    <>
      {isLoading ? (
        <div className="pt-3 text-center">
          <div className="sk-spinner sk-spinner-pulse"></div>
        </div>
      ) : (
        <>
          {value.row.status > 1 ? (
            <CRow>
              <CCol>
                <CIcon
                  //   onClick={() => onReActice(params.id)}
                  className="stock-toggle-icon"
                  icon={cilReload}
                />
              </CCol>
            </CRow>
          ) : (
            <CRow>
              <CCol>
                <CIcon
                  onClick={() => toggleAddProducutModal()}
                  className="stock-toggle-icon"
                  icon={cilPencil}
                />
              </CCol>
            </CRow>
          )}
          <InventoryProductModal
            header="Edit Product"
            isOpen={showAddProducutModal}
            toggle={toggleAddProducutModal}
            productData={value.row}
          />
        </>
      )}
    </>
  );
};
export default InventoryProductCell;

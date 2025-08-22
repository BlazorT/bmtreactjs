import React, { useState } from 'react';

import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import InventoryProductModal from '../Modals/InventoryProductModal';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';

import useFetch from 'src/hooks/useFetch';
import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import ActionButton from '../UI/ActionButton';
import globalutil from 'src/util/globalutil';
import Spinner from '../UI/Spinner';

const ProductActionCell = (prop) => {
  const { value, getProducts, productData, canDelete, canUpdate } = prop;
  const user = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [showAddProducutModal, setShowAddProducutModal] = useState(false);

  const { response: getProductRes, fetchData: getProduct } = useFetch();

  const showToast = useShowToast();

  const toggleEditProducutModal = () => {
    setShowAddProducutModal(!showAddProducutModal);
  };

  const toggleStatus = async (status) => {
    setIsLoading(true);
    const deleteBody = {
      id: productData.id,
      name: productData.name,
      shortCode: productData.shortCode,
      barCode: '',
      groupId: productData.groupId,
      businessEntityId: productData.businessEntityId,
      manufactureCountryId: productData.manufactureCountryId,
      categoryId: productData.categoryId,
      status: status,
      lastUpdatedBy: user.dspId,
      rowVer: 1,
      remarks: 'delete confrimation',
    };

    await getProduct('/BlazorApi/addupdateproduct', {
      method: 'POST',
      body: JSON.stringify(deleteBody),
    });

    if (getProductRes.current?.status === true) {
      showToast(`${productData.name} ${status === 1 ? 're activated' : 'deleted'} successfully`);

      getProducts();
    } else {
      showToast(getProductRes.current.message, 'error');
    }
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          {value.row.status === 6 ? (
            <ActionButton
              title="Re-Active Product"
              status={1}
              updateFn={toggleStatus}
              name={productData.name}
              icon={cilReload}
            />
          ) : (
            <CRow>
              {canUpdate === 1 && (
                <CCol>
                  <CTooltip content="Edit Product">
                    <CIcon
                      onClick={() => {
                        toggleEditProducutModal();
                      }}
                      className="stock-toggle-icon"
                      icon={cilPencil}
                    />
                  </CTooltip>
                </CCol>
              )}
              {canDelete === 1 && (
                <ActionButton
                  title="Delete Product"
                  status={6}
                  updateFn={toggleStatus}
                  name={productData.name}
                  icon={cilTrash}
                />
              )}
              <InventoryProductModal
                header="Add Product"
                isOpen={showAddProducutModal}
                toggle={toggleEditProducutModal}
                productData={productData}
                getProducts={getProducts}
              />
            </CRow>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default ProductActionCell;

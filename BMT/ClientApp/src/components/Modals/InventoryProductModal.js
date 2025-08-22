import React, { useEffect, useState } from 'react';

import { cilCode, cilExcerpt, cilGraph, cilInfo } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { formValidator } from 'src/helpers/formValidator';

import CustomInput from '../InputsComponent/CustomInput';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import { useDispatch, useSelector } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import globalutil from 'src/util/globalutil';
import useFetch from 'src/hooks/useFetch';
import Loading from '../UI/Loading';
import LoadingBtn from '../UI/LoadingBtn';
import { countries, countriesWithId } from 'src/constants/countries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

const InventoryProductModal = (prop) => {
  dayjs.extend(utc);
  const { header, toggle, isOpen, productData, getProducts } = prop;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const {
    response: addProductRes,
    error: addProductErr,
    loading: addProductLoading,
    fetchData: addProduct,
  } = useFetch();

  let editProductData;

  useEffect(() => {
    if (isOpen && productData) {
      editProductData = {
        id: productData.id,
        productName: productData.name,
        upcCode: productData.shortCode,
        productFor: productData.businessEntityId,
        category: productData.categoryId,
        createdBy: user.userId,
        status: productData.status,
        country: productData.manufactureCountryId,
        productAssignment: productData.assignmentType,
      };
      setinventoryProductData(editProductData);
    }
  }, [isOpen]);

  const initialData = {
    id: 0,
    productName: '',
    upcCode: '',
    productFor: 1,
    category: 1,
    status: 1,
    country: 1,
    createdBy: user.userId,
    productAssignment: 29,
  };

  const [inventoryProductData, setinventoryProductData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleInvertoryData = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setinventoryProductData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  const onSave = async () => {
    formValidator();

    const form = document.querySelector('.add-product-form');
    if (form.checkValidity()) {
      const addProductBody = {
        id: inventoryProductData.id,
        name: inventoryProductData.productName,
        shortCode: inventoryProductData.upcCode,
        barCode: '',
        categoryId: inventoryProductData.category,
        status: parseInt(inventoryProductData.status),
        groupId: parseInt(inventoryProductData.productFor),
        businessEntityId: parseInt(inventoryProductData.productFor),
        assignmentType: inventoryProductData.productAssignment,
        manufactureCountryId: inventoryProductData.country,
        rowVer: 1,
        createdBy: inventoryProductData.createdBy,
        lastUpdatedBy: user.userId,
        createdAt:
          inventoryProductData.id === 0
            ? dayjs().utc().format()
            : dayjs(productData.createdAt).utc().format(),
        lastUpdatedAt: dayjs().utc().format()
      };

      setIsLoading(true);
      console.log({ addProductBody });
      await addProduct(
        '/BlazorApi/addupdateproduct',
        {
          method: 'POST',
          body: JSON.stringify(addProductBody),
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
            toggle();
            getProducts();
            // setinventoryProductData(initialData);
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
    setIsLoading(addProductLoading.current);
  };

  const onCancel = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: 'Are you sure you want to cancel?',
        isOpen: true,
        onYes: onYesConfirm,
        onNo: onNoConfirm,
      }),
    );
  };

  const onYesConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    toggle();
    // setinventoryProductData(initialData);
  };

  const onNoConfirm = () => {
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
      className="add-product-modal"
      centered={true}
    >
      <form className="needs-validation add-product-form" onSubmit={handleSubmit} noValidate>
        <ModalHeader className="confirmation-modal-header">{header}</ModalHeader>

        <ModalBody className="confirmation-modal-body">
          <CRow>
            <CCol>
              <CustomInput
                label="Product Name"
                value={inventoryProductData.productName}
                onChange={handleInvertoryData}
                icon={cilExcerpt}
                type="text"
                id="productName"
                name="productName"
                placeholder="Product Name"
                isRequired={true}
                maxLength={15}
                message="enter product name"
              />
              <CustomSelectInput
                label="Product Assignment"
                value={inventoryProductData.productAssignment}
                onChange={handleInvertoryData}
                icon={cilCode}
                id="productAssignment"
                name="productAssignment"
                //options={globalutil.product_assignment_types()}
                isRequired={true}
                message="Select Product Assignment"
              />
              <CustomSelectInput
                label="Manufactured Country"
                value={inventoryProductData.country}
                onChange={handleInvertoryData}
                icon={cilCode}
                id="country"
                name="country"
                options={countries}
                isRequired={true}
                message="enter manufactured country"
              />
              <CustomSelectInput
                label="Product For"
                value={inventoryProductData.productFor}
                onChange={handleInvertoryData}
                icon={cilGraph}
                id="productFor"
                name="productFor"
                //options={globalutil.businessentities()}
                isRequired={false}
                disabled={true}
              />
            </CCol>
            <CCol>
              <CustomInput
                label="UPC Code"
                value={inventoryProductData.upcCode}
                onChange={handleInvertoryData}
                icon={cilCode}
                type="text"
                id="upcCode"
                name="upcCode"
                placeholder="e.g U19256"
                isRequired={true}
                maxLength={10}
                pattern="^([^.]*)$"
                message="enter upc code, ( . ) not allowed"
              />

              <CustomSelectInput
                label="Category"
                value={inventoryProductData.category}
                onChange={handleInvertoryData}
                icon={cilGraph}
                id="category"
                name="category"
                //options={globalutil.productGroup()}
                isRequired={false}
              />
              <CustomSelectInput
                label="Status"
                icon={cilInfo}
                id="status"
                name="status"
                options={globalutil.statuses()}
                value={inventoryProductData.status}
                onChange={handleInvertoryData}
                isRequired={false}
                message="Please select status"
              />
            </CCol>
          </CRow>
        </ModalBody>
        <ModalFooter className="confirmation-modal-footer">
          {isLoading ? (
            <LoadingBtn title="Saving Product..." />
          ) : (
            <>
              <button type="button" className="btn_Default m-2 sales-btn-style" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn_Default m-2 sales-btn-style"
                onClick={() => onSave()}
              >
                Save
              </button>
            </>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default InventoryProductModal;

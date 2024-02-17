import React, { useEffect, useState } from 'react';

import { cilCalendar, cilExcerpt, cilLibrary, cilPencil, cilTrash } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import CustomInput from '../InputsComponent/CustomInput';
import { useDispatch, useSelector } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import useFetch from 'src/hooks/useFetch';
import moment from 'moment';
import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import CIcon from '@coreui/icons-react';
import CustomSearch from '../InputsComponent/CustomSearch';
import LoadingBtn from '../UI/LoadingBtn';
import { countries } from 'src/constants/countries';
import CustomDatePicker from '../UI/DatePicker';
import dayjs from 'dayjs';
import Form from '../UI/Form';
import Button from '../InputsComponent/Button';

const AddInventoryModal = (prop) => {
  const { header, toggle, isOpen, productData, getInventory } = prop;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const {
    response: submitDataRes,
    error: submitDataErr,
    loading: submitDataLoading,
    fetchData: submitInventoryData,
  } = useFetch();

  const initialData = {
    productName: '',
    upcCode: '',
    manufactureCountryId: '',
    productDetailId: 0,
    stockIn: '',
    stockOut: '',
    businessEntityId: '',
    categoryId: '',
    pNameId: '',
    createdAt: moment().utc().format(),
  };

  const [inventoryProductData, setinventoryProductData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInvertoryData = (e, pname) => {
    if (pname === 'createdAt') {
      setinventoryProductData((prevData) => ({
        ...prevData,
        [pname]: moment(e).utc().format(),
      }));
    } else {
      if (pname === 'productName') {
        const productSelect = productData.filter((item) => item.id == e.id);

        setinventoryProductData((prevData) => ({
          ...prevData,
          upcCode: productSelect[0].shortCode,
          manufactureCountryId: productSelect[0].manufactureCountryId,
          productName: productSelect[0].name,
          pNameId: productSelect[0],
          categoryId: productSelect[0].categoryId,
          businessEntityId: productSelect[0].businessEntityId,
          productDetailId: productSelect[0].id,
        }));
      } else {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setinventoryProductData((prevData) => ({
          ...prevData,
          [name]:
            name === 'stockIn' || name === 'stockOut'
              ? fieldValue > 999
                ? fieldValue.slice(0, 3)
                : fieldValue
              : fieldValue,
        }));
      }
    }
  };

  const onSave = async () => {
    if (rows.length > 0) {
      const addInvBody = rows.map((item) => ({
        id: 0,
        shortCode: item.shortCode,
        barCode: '',
        manufactureCountryId: item.manufactureCountryId,
        categoryId: item.categoryId,
        businessEntityId: item.businessEntityId,
        productName: item.productName,
        purchasedQty: item.newStock,
        soldQty: item.stockOut,
        productDetailId: item.productDetailId,
        dspid: user.dspId,
        lastUpdatedBy: user.dspId,
        createdBy: user.dspId,
        rowVer: 0,
        createdAt: item.createdAt,
        lastUpdatedAt: moment().utc().format(),
      }));

      console.log({ addInvBody });

      setIsLoading(true);
      await submitInventoryData('/Inventory/submitinventory', {
        method: 'POST',
        body: JSON.stringify(addInvBody),
      });

      if (submitDataRes.current?.status === true) {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: 'inventory added succesfully',
            toastVariant: 'success',
          }),
        );
        setinventoryProductData(initialData);
        setRows([]);
        getInventory();
        toggle();
      } else {
        dispatch(
          updateToast({
            isToastOpen: true,
            toastMessage: 'somthing went wrong try again later',
            toastVariant: 'error',
          }),
        );
      }
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'add inventory first',
          toastVariant: 'warning',
        }),
      );
    }
    setIsLoading(submitDataLoading.current);
  };

  const addInventoryRows = () => {
    const form = document.querySelector('.inventory-product-form');
    form.classList.add('needs-validation');
    if (form.checkValidity()) {
      const newRow = {
        id: rows.length < 1 ? 1 : rows[rows.length - 1].id + 1,
        shortCode: inventoryProductData.upcCode,
        barCode: '',
        manufactureCountryId: inventoryProductData.manufactureCountryId,
        categoryId: inventoryProductData.categoryId,
        businessEntityId: inventoryProductData.businessEntityId,
        productDetailId: inventoryProductData.productDetailId,
        productName: inventoryProductData.productName,
        newStock: inventoryProductData.stockIn ? parseInt(inventoryProductData.stockIn) : 0,
        stockOut: inventoryProductData.stockOut ? parseInt(inventoryProductData.stockOut) : 0,
        createdAt: inventoryProductData.createdAt,
      };

      form.reset();
      form.classList.remove('needs-validation');
      form.classList.remove('was-validated');

      setRows((prev) => [...prev, newRow]);
      setinventoryProductData(initialData);
    } else {
      form.classList.add('was-validated');
    }
  };

  const editRow = () => {
    const updatedData = {
      shortCode: inventoryProductData.upcCode,
      barCode: '',
      businessEntityId: inventoryProductData.businessEntityId,
      manufactureCountryId: inventoryProductData.manufactureCountryId,
      categoryId: inventoryProductData.categoryId,
      productDetailId: inventoryProductData.productDetailId,
      productName: inventoryProductData.productName,
      newStock: parseInt(inventoryProductData.stockIn),
      stockOut: parseInt(inventoryProductData.stockOut),
      createdAt: inventoryProductData.createdAt,
    };

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === inventoryProductData.id ? { id: row.id, ...updatedData } : row,
      ),
    );
    setinventoryProductData(initialData);
    setEditMode(false);
  };

  const onCancel = () => {
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

  const onYesConfirm = () => {
    toggle();
    onNoConfirm();
    setRows([]);
    setinventoryProductData(initialData);
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const [rows, setRows] = useState([]);
  const cols = [
    {
      width: 100,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Sr#',
      field: 'id',
      editable: false,
    },
    {
      flex: 1,
      minWidth: 130,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Product Name',
      field: 'productName',
      editable: false,
    },
    {
      headerName: 'UPC Code',
      field: 'shortCode',
      flex: 1,
      minWidth: 100,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      editable: false,
    },
    {
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Stock In',
      field: 'newStock',
      editable: false,
    },
    {
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Stock Out',
      field: 'stockOut',
      editable: false,
    },
    {
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Action',
      field: 'action',
      editable: false,
      renderCell: (params) => {
        return (
          <CRow>
            <CCol>
              <CIcon
                onClick={() => {
                  setinventoryProductData({
                    id: params.id,
                    createdAt: params.row.createdAt,
                    manufactureCountryId: params.row.manufactureCountryId,
                    categoryId: params.row.categoryId,
                    productDetailId: params.row.productDetailId,
                    businessEntityId: params.row.businessEntityId,
                    productName: params.row.productName,
                    stockIn: params.row.newStock,
                    stockOut: params.row.stockOut,
                    upcCode: params.row.shortCode,
                    pNameId: productData?.filter(
                      (item) => item.id == params.row.productDetailId,
                    )[0],
                  });
                  setEditMode(true);
                }}
                className="stock-toggle-icon"
                icon={cilPencil}
              />
              <CIcon
                onClick={() => {
                  setRows((prevRows) => prevRows.filter((item) => item.id !== params.id));
                  setEditMode(false);
                  setinventoryProductData(initialData);
                  if (rows.length <= 0) {
                    const form = document.querySelector('.inventory-product-form');
                    form.reset();
                    form.classList.remove('needs-validation');
                    form.classList.remove('was-validated');
                  }
                }}
                className="stock-toggle-icon ms-3"
                icon={cilTrash}
              />
            </CCol>
          </CRow>
        );
      },
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      backdrop={true}
      fullscreen="lg"
      className="w-50"
      centered={true}
    >
      <Form name="inventory-product-form">
        <ModalHeader className="confirmation-modal-header">{header}</ModalHeader>

        <ModalBody className="confirmation-modal-body">
          <div className="d-flex flex-column">
            <CRow>
              <CCol sm={6}>
                <CustomSearch
                  label="Product"
                  value={inventoryProductData.pNameId}
                  onChange={handleInvertoryData}
                  icon={cilExcerpt}
                  type="text"
                  id="productName"
                  name="productName"
                  data={productData}
                  isRequired={true}
                  placeholder="search products..."
                  message="please select a product"
                />
              </CCol>
              <CCol sm={3}>
                <CustomInput
                  label="Country"
                  value={
                    countries.find((item) => item.id === inventoryProductData.manufactureCountryId)
                      ?.name || ''
                  }
                  className="form-control item text-dim bg-secondary-color"
                  type="text"
                  id="manufactureCountryId"
                  name="manufactureCountryId"
                  placeholder="Country"
                  isRequired={false}
                  message="enter product name"
                  disabled={true}
                />
              </CCol>
              <CCol sm={3}>
                <CustomInput
                  label="UPC Code"
                  value={inventoryProductData.upcCode}
                  className="form-control item text-dim bg-secondary-color"
                  type="text"
                  id="upcCode"
                  name="upcCode"
                  placeholder="UPC code"
                  isRequired={false}
                  message="enter product name"
                  disabled={true}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CustomInput
                  label="Stock In"
                  value={inventoryProductData.stockIn}
                  onChange={handleInvertoryData}
                  icon={cilLibrary}
                  type="number"
                  id="stockIn"
                  name="stockIn"
                  placeholder="Purchased Quantity"
                  isRequired={false}
                  message="enter purchased stock"
                />
              </CCol>
              <CCol>
                <CustomInput
                  label="Stock Out"
                  value={inventoryProductData.stockOut}
                  onChange={handleInvertoryData}
                  icon={cilLibrary}
                  type="number"
                  id="stockOut"
                  name="stockOut"
                  placeholder="Consumed Quantity"
                  isRequired={false}
                  message="enter sold stock"
                />
              </CCol>
              <CCol>
                <CustomDatePicker
                  label="Inventory Date"
                  icon={cilCalendar}
                  id="createdAt"
                  name="createdAt"
                  value={inventoryProductData.createdAt}
                  onChange={(e) => handleInvertoryData(e, 'createdAt')}
                  isRequired={false}
                  max={dayjs()}
                  min={dayjs().subtract(7, 'days')}
                  message={'Invalid inventory date'}
                />
              </CCol>
            </CRow>
            <CRow className="">
              <CCol className="d-flex justify-content-end">
                {!isLoading && (
                  <React.Fragment>
                    {editMode ? (
                      <Button title="Update" type="submit" onClick={editRow} />
                    ) : (
                      <Button title="Add" type="submit" onClick={addInventoryRows} />
                    )}
                  </React.Fragment>
                )}
              </CCol>
            </CRow>
            {rows.length > 0 && (
              <CRow>
                <CustomDatagrid
                  rows={rows}
                  columns={cols}
                  pagination={true}
                  rowHeight={50}
                  pageNumber={5}
                  summary={[
                    {
                      field: 'newStock',
                      aggregates: [{ aggregate: 'sum', caption: 'Stock In' }],
                    },
                    {
                      field: 'stockOut',
                      aggregates: [{ aggregate: 'sum', caption: 'Stock Out' }],
                    },
                  ]}
                />
              </CRow>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="confirmation-modal-footer">
          {isLoading ? (
            <LoadingBtn title="Submitting" />
          ) : (
            <React.Fragment>
              <Button title="Cancel" className="" onClick={() => onCancel()} />
              <Button title="Save" onClick={() => onSave()} />
            </React.Fragment>
          )}
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddInventoryModal;

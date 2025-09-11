/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from 'react';
import useFetch from 'src/hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from 'src/util/globalutil';
import { countries } from 'src/constants/countries';
import { getInventoryPdf } from 'src/helpers/getInventoryPdf';
import CIcon from '@coreui/icons-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {
  cilCalendar,
  cilChevronBottom,
  cilExcerpt,
  cilUser,
  cilFlagAlt,
  cilParagraph,
  cilTextSize,
} from '@coreui/icons';
import CustomDatePicker from 'src/components/UI/DatePicker';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import _ from 'underscore';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import CustomSelectInput from 'src/components/InputsComponent/CustomSelectInput';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'react-toastify/dist/ReactToastify.css';

const StockRecord = ({ reportField, fetchInspection, value },prop) => {
  const { header, toggle, isOpen, productData } = prop;

  dayjs.extend(utc);
  const { response: inventoryDataRes, fetchData: fetchInventoryData } = useFetch();

  const [total, settotal] = useState({ totalstock: 0, totalsoldstock: 0, totalavailablestock: 0 });
  const [dates, setDates] = useState({
    FromDate: new Date().toISOString().substr(0, 10),

    availablestock: '',
  });

  useEffect(() => {
    applyFilters();
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const generatePdf = async () => {
   
    const reportRows = makeGroupingRows(rows);
    const doc = getInventoryPdf(reportRows, reportField);
    doc.output('dataurlnewwindow');
    console.log(reportRows, 'repoertdata');
  };
  const initialFilter = {
    keyword: '',
    categoryId: '',
    businessEntityId: '',
    manufactureCountryId: '',
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);
  const applyFilters = () => {
    const filterBody = {
      keyword: filters.keyword,
      productName: filters.productName,
      categoryId: filters.categoryId === '' ? 0 : filters.categoryId,
      manufactureCountryId: filters.businessEntityId === '' ? 0 : filters.businessEntityId,
      businessEntityId: filters.businessEntityId === '' ? 0 : filters.businessEntityId,
      createdAt: dayjs(filters.createdAt).utc().format().split('T')[0],
      lastUpdatedAt: dayjs(filters.lastUpdatedAt).utc().format().split('T')[0]
    };
    getInventory(filterBody);
  };

  const getInventory = async (filters) => {
    const invBody = {
      dspid: user.dspId.toString(),
      barCode: '',
      availableStock: '',
      id: 0,
      productDetailId: 0,
      purchasedQty: 0,
      rowVer: 0,
      ...filters,
    };
    await fetchInventoryData('/Inventory/inventoryfulldetails', {
      method: 'POST',
      body: JSON.stringify(invBody),
    });

    if (inventoryDataRes.current?.data?.status === true) {
      const mappedArray = inventoryDataRes.current.data.data.map((data, index) => ({
        id: index,
        invId: data.id,
        partName: data.productName + `, ${data.shortCode}`,
        code: data.shortCode,
        manufacturer: countries.find((item) => item.id === data.manufactureCountryId)?.name || null,
        barCode: data.barCode,
        newStock: data.purchasedQty,
        availableStock: data.totalAvailableStock,
        totalStock: data.totalSoldStock,
        damaged: 0,
        expired: 0,
        stockOut: data.soldQty,
        productDetailId: data.productDetailId,
        dspid: data.dspid,
        lastUpdatedBy: user.userId,
        createdBy: data.createdBy ? data.createdBy : user.userId,
        rowVer: data.rowVer,
        status: data.status,
        createdAt: formatDate(data.createdAt)
          ? formatDate(data.createdAt)
          : formatDate(data.createdAt),
        lastUpdated: formatDateTime(data.lastUpdatedAt),
      }));

      setRows(mappedArray);
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'somthing went wrong try again later',
          toastVariant: 'error',
        }),
      );
    }
    setIsLoading(false);
  };

  const navigate = useNavigate();

  //const divElem = document.querySelector('body > div');

  //const resizeObserver = new ResizeObserver((entries) => {
  //  for (let entry of entries) {
  //    if (entry.target.handleResize) entry.target.handleResize(entry);
  //  }
  //});

  //resizeObserver.observe(divElem);

  // window.ResizeObserver = resizeObserver;

  /*  ****************Grid Columns***************** */
  const [rows, setRows] = useState([]);

  const [columns, setColumns] = useState([
    {
      field: 'partName',
      headerName: 'Product Name',
      sortable: true,
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      editable: false,
      filterable: true,
      disableColumnMenu: false,
    },

    {
      field: 'newStock',
      headerName: 'Total Stock',
      flex: 1,
      maxWidth: 150,
      headerClassName: 'custom-header-data-grid',
      editable: false,
      filterable: true,
      sortable: true,
      align: 'center',
     // headerAlign: 'center',
      disableColumnMenu: false,
    },
    {
      field: 'totalStock',
      headerName: 'Consumed Stock',
      flex: 1,
      maxWidth: 190,
      headerClassName: 'custom-header-data-grid',
      editable: false,
      filterable: true,
      sortable: true,
      align: 'center',
    //  headerAlign: 'center',
      disableColumnMenu: false,
    },
    {
      field: 'availableStock',
      headerName: 'Available Stock',
      flex: 1,
      maxWidth: 190,
      headerClassName: 'custom-header-data-grid',
      editable: false,
      filterable: true,
      sortable: true,
      align: 'center',
     // headerAlign: 'right',
      disableColumnMenu: false,
    },
    {
      field: 'createdAt',
      headerName: 'Inventory Date',
      sortable: true,
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      editable: false,
      filterable: true,
      disableColumnMenu: false,
    },
  ]);
  const makeGroupingRows = (data) => {
    const updatedData = [];
    const uniqueDescValues = [...new Set(data.map((item) => item.daName))];

    uniqueDescValues.forEach((uniqueDesc) => {
      const id = Math.floor(Math.random() * 900) + 100; // Replace this with your actual parent name
      const group = uniqueDesc;
      updatedData.push({ group, id });

      data
        .filter((item) => item.daName === uniqueDesc)
        .forEach((item) => {
          updatedData.push(item);
        });
    });
    const mappedArray = data.map((field, index) => {
      let mappedObject;

      if (index == 0) {
        mappedObject = {
          partName: 'Product Name',
          newStock: 'Total Stock',
          totalStock: 'Consumed Stock',
          availableStock: 'Available Stock',
          createdAt: 'Inventory Date'
        }

      }
      else {
        mappedObject = {
          partName: field.partName,
          newStock: field.newStock,
          totalStock: field.totalStock,
          availableStock: field.availableStock,
          createdAt: field.createdAt,
        }
      }
      return mappedObject;
    });
     const header = ['name', 'contact', 'performance','status','date of joining'];

    const grouping = mappedArray.flatMap((item, index) => {
      const rowData = [item.partName, item.newStock.toString(), item.totalStock.toString(), item.availableStock.toString(), item.createdAt];
      return [rowData];

    });
    console.log({ grouping });
    return grouping;
  };
  const changeFilter = (e, date) => {
    if (date === 'lastUpdatedAt' || date === 'createdAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: dayjs(e).utc().format(),
      }));
    } else {
      const { name, value, type, checked } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };
  const [showStock, setShowStock] = useState(false);
  const toggleStock = () => {
    setShowStock((prev) => !prev);
  };
  /*****************Function to calculate total ***************/
  return (
    <>
          <div className="">
            <div className="bg_Div mb-2 d-flex flex-column">
              <div className="dashboard-stock-header dashboard-drop">
                <div className="pointer" onClick={() => toggleStock()}>
                  Advance Search
                </div>
                <CIcon
                  className="stock-toggle-icon"
                  onClick={() => toggleStock()}
                  icon={cilChevronBottom}
                />
              </div>
              {showStock == true ? (
                <div className="show-stock">
                  <div className="bg_Div">
                    <div className="row">
                      <div className="col-md-6">
                        <CustomInput
                          label="Keyword"
                          value={filters.keyword}
                          onChange={changeFilter}
                          icon={cilUser}
                          type="text"
                          id="keyword"
                          name="keyword"
                          placeholder="product name, total stock, consumed stock"
                          className="form-control item"
                          title="Search using by product name, total stock, consumed stock "
                          isRequired={false}
                        // message="Enter Buisness Name"
                        />
                      </div>
                      <div className="col-md-6">
                        <CustomInput
                          label="Product Name"
                          value={filters.productName}
                          onChange={changeFilter}
                          icon={cilExcerpt}
                          type="text"
                          id="productName"
                          name="productName"
                          isRequired={false}
                          placeholder=" products..."
                          title=" inventory stock products name "
                          message="please select a product"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <CustomSelectInput
                          label="Category"
                          icon={cilParagraph}
                          id="menuId"
                          disableOption="Select Product Group"
                          options={globalutil.productGroup()}
                          className="form-control item form-select"
                          value={filters.menuId}
                          name="menuId"
                          title=" inventory stock product category"
                          onChange={(e) => changeFilter(e)}
                        />
                      </div>
                      <div className="col-md-6">
                        <CustomInput
                          label="Quantity (>=)"
                          value={filters.keyword}
                          onChange={changeFilter}
                          icon={cilTextSize}
                          type="text"
                          id="keyword"
                          name="keyword"
                          title=" inventory stock product quantity "
                          placeholder="keyword"
                          className="form-control item"
                          isRequired={false}
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-6">
                        <CustomSelectInput
                          label="Manufacturer"
                          icon={cilFlagAlt}
                          id="manufactureCountryId"
                          options={countries}
                          disableOption="Select Countries"
                          className="form-control item form-select"
                          value={filters.manufactureCountryId}
                          name="manufactureCountryId"
                          title=" Stock Manufacture Country "
                          onChange={(e) => changeFilter(e)}
                        />
                      </div>
                      <div className="col-md-6">
                        <CustomSelectInput
                          label="Product Status"
                          icon={cilFlagAlt}
                          id="menuId"
                          disableOption="Select Product Status"
                          options={globalutil.commonstatuses()}
                          className="form-control item form-select"
                          value={filters.menuId}
                          name="menuId"
                          title=" inventory stock status "
                          onChange={(e) => changeFilter(e)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <CustomDatePicker
                          icon={cilCalendar}
                          label="Date To"
                          id="lastUpdatedAt"
                          name="lastUpdatedAt"
                          defaultValue={'2022-04-17'}
                          value={filters.lastUpdatedAt}
                          title=" stock last update date to "
                          onChange={(e) => changeFilter(e, 'lastUpdatedAt')}
                        />
                      </div>
                      <div className="col-md-6">
                        <CustomDatePicker
                          icon={cilCalendar}
                          label="Date From"
                          defaultValue={'2022-04-17'}
                          id="createdAt"
                          name="createdAt"
                          value={filters.createdAt}
                          title=" stock last update date from "
                          onChange={(e) => changeFilter(e, 'createdAt')}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12 text-right">
                        <div className="mt-2 text-right">
                          <button
                            title="Click for searcing inventory stock record"
                            onClick={() => applyFilters()}
                            type="button"
                            className="btn_Default m-2 sales-btn-style"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="bg_Div mt-2 d-flex flex-column">
              <DataGridHeader exportFn={() => generatePdf()} title="Stock Record" />
              <div className="show-stock">
                <div className="row pt-2">
                  <div className="col-md-12 col-xl-12">
                    <CustomDatagrid
                      rows={rows}
                      columns={columns}
                      pagination={false}
                      rowHeight={40}
                      summary={[
                        {
                          field: 'newStock',
                          aggregates: [{ aggregate: 'sum', caption: 'Total Stock' }],
                        },
                        {
                          field: 'availableStock',
                          aggregates: [{ aggregate: 'sum', caption: 'Available Stock' }],
                        },
                        //{
                        //  field: 'damageStock',
                        //  aggregates: [{ aggregate: 'sum', caption: 'Damaged Stock' }],
                        //},
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row sales-text-style">
              <div>
                <button type="button" className="btn_Default m-2 sales-btn-style">
                  Cancel
                </button>

                <button type="button" className="btn_Default sales-btn-style m-2">
                  Print
                </button>
              </div>
            </div>
          </div>
       
     
    </>
  );
  //return (
  //  <>
  //    <ToastContainer />
  //    <div className="">
  //      <div className="bg_Div">
  //        <div className="row">
  //          <div className="col-md-6">
  //            <CustomInput
  //              label="Keyword"
  //              value={filters.keyword}
  //              onChange={changeFilter}
  //              icon={cilUser}
  //              type="text"
  //              id="keyword"
  //              name="keyword"
  //              placeholder="product name, total stock, consumed stock"
  //              className="form-control item"
  //              title="Search using by product name, total stock, consumed stock "
  //              isRequired={false}
  //              // message="Enter Buisness Name"
  //            />
  //          </div>
  //          <div className="col-md-6">
  //            <CustomInput
  //              label="Product Name"
  //              value={filters.productName}
  //              onChange={changeFilter}
  //              icon={cilExcerpt}
  //              type="text"
  //              id="productName"
  //              name="productName"
  //              isRequired={false}
  //              placeholder=" products..."
  //              title=" inventory stock products name "
  //              message="please select a product"
  //            />
  //          </div>
  //        </div>
  //        <div className="row">
  //          <div className="col-md-6">
  //            <CustomSelectInput
  //              label="Category"
  //              icon={cilParagraph}
  //              id="menuId"
  //              disableOption="Select Product Group"
  //              options={globalutil.productGroup()}
  //              className="form-control item form-select"
  //              value={filters.menuId}
  //              name="menuId"
  //              title=" inventory stock product category"
  //              onChange={(e) => changeFilter(e)}
  //            />
  //          </div>
  //          <div className="col-md-6">
  //            <CustomInput
  //              label="Quantity (>=)"
  //              value={filters.keyword}
  //              onChange={changeFilter}
  //              icon={cilTextSize}
  //              type="text"
  //              id="keyword"
  //              name="keyword"
  //              title=" inventory stock product quantity "
  //              placeholder="keyword"
  //              className="form-control item"
  //              isRequired={false}
  //            />
  //          </div>
  //        </div>
  //        <div className="row mb-2">
  //          <div className="col-md-6">
  //            <CustomSelectInput
  //              label="Manufacturer"
  //              icon={cilFlagAlt}
  //              id="manufactureCountryId"
  //              options={countries}
  //              disableOption="Select Countries"
  //              className="form-control item form-select"
  //              value={filters.manufactureCountryId}
  //              name="manufactureCountryId"
  //              title=" Stock Manufacture Country "
  //              onChange={(e) => changeFilter(e)}
  //            />
  //          </div>
  //          <div className="col-md-6">
  //            <CustomSelectInput
  //              label="Product Status"
  //              icon={cilFlagAlt}
  //              id="menuId"
  //              disableOption="Select Product Status"
  //              options={globalutil.commonstatuses()}
  //              className="form-control item form-select"
  //              value={filters.menuId}
  //              name="menuId"
  //              title=" inventory stock status "
  //              onChange={(e) => changeFilter(e)}
  //            />
  //          </div>
  //        </div>
  //        <div className="row">
  //          <div className="col-md-6">
  //            <CustomDatePicker
  //              icon={cilCalendar}
  //              label="Date To"
  //              id="lastUpdatedAt"
  //              name="lastUpdatedAt"
  //              defaultValue={'2022-04-17'}
  //              value={filters.lastUpdatedAt}
  //              title=" stock last update date to "
  //              onChange={(e) => changeFilter(e, 'lastUpdatedAt')}
  //            />
  //          </div>
  //          <div className="col-md-6">
  //            <CustomDatePicker
  //              icon={cilCalendar}
  //              label="Date From"
  //              defaultValue={'2022-04-17'}
  //              id="createdAt"
  //              name="createdAt"
  //              value={filters.createdAt}
  //              title=" stock last update date from "
  //              onChange={(e) => changeFilter(e, 'createdAt')}
  //            />
  //          </div>
  //        </div>

  //        <div className="row">
  //          <div className="col-md-12 text-right">
  //            <div className="mt-2 text-right">
  //              <button
  //                title="Click for searcing inventory stock record"
  //                onClick={() => applyFilters()}
  //                type="button"
  //                className="btn_Default m-2 sales-btn-style"
  //              >
  //                Search
  //              </button>
  //            </div>
  //          </div>
  //        </div>
  //      </div>
  //    </div>
  //    <div className="bg_Div mt-2 d-flex flex-column">
  //      <DataGridHeader exportFn={() => generatePdf()} title="Stock Record" />
  //      <div className="show-stock">
  //        <div className="row pt-2">
  //          <div className="col-md-12 col-xl-12">
  //            <CustomDatagrid
  //              rows={rows}
  //              columns={columns}
  //              pagination={false}
  //              rowHeight={40}
  //              summary={[
  //                {
  //                  field: 'newStock',
  //                  aggregates: [{ aggregate: 'sum', caption: 'Total Stock' }],
  //                },
  //                {
  //                  field: 'availableStock',
  //                  aggregates: [{ aggregate: 'sum', caption: 'Available Stock' }],
  //                },
  //                //{
  //                //  field: 'damageStock',
  //                //  aggregates: [{ aggregate: 'sum', caption: 'Damaged Stock' }],
  //                //},
  //              ]}
  //            />
  //          </div>
  //        </div>
  //      </div>
  //    </div>

  //    <div className="row sales-text-style">
  //      <div>
  //        <button type="button" className="btn_Default m-2 sales-btn-style">
  //          Cancel
  //        </button>

  //        <button type="button" className="btn_Default sales-btn-style m-2">
  //          Print
  //        </button>
  //      </div>
  //    </div>
  //  </>
  //);
};

export default StockRecord;

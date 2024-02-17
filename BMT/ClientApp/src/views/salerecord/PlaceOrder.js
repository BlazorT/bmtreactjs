// /* eslint-disable no-debugger */
// /* eslint-disable prettier/prettier */
// import React, { useState, useMemo, useRef } from 'react';
// import './PlaceOrder.css';
// /*import { DataGrid} from "@mui/x-data-grid"*/
// import { Box } from '@mui/material';
// import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
// import moment from 'moment';
// import {
//   faLock,
//   faEdit,
//   faPaperPlane,
//   faTrash,
//   faBan,
//   faPlus,
//   faBarcode,
//   faFileText,
// } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { CButton } from '@coreui/react';
// import Loading from '../../components/UI/Loading.js';
// import 'react-data-grid/lib/styles.css';
// import Select from 'react-select';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import DataGrid from 'react-data-grid';
// import { useNavigate } from 'react-router-dom';
// const PlaceOrder = () => {
//   const [rows, setRows] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [priceDetail, setPriceDetail] = useState(false);
//   const [priceDetailButton, setPriceDetailButton] = useState(true);
//   const [storeLOVs, setStoreLOVs] = useState({ tcategories: [], products: [], tunits: [] });
//   const [total, settotal] = useState({
//     itemNo: 0,
//     totalquantity: 0,
//     totalamount: 0,
//     totalnetdiscount: 0,
//     tax: '',
//     totalpercdiscount: 0,
//     expense: '',
//   });
//   const [change, setchange] = useState('');
//   const [unitOption, setUnitOption] = useState([]);
//   const [product, setproduct] = useState([]);
//   const [grandTotal, setGrandTotal] = useState('');
//   const [selectedProductDetail_Price, setSelectedProductDetail_Price] = useState('');
//   const [isSearchable, setIsSearchable] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [isClearable, setIsClearable] = useState(true);
//   const [cash, setcash] = useState({ cash: '', payingamount: '' });
//   const [discount, setdiscount] = useState({ netDiscount: '', percDiscount: '' });
//   const [dueAmount, setdueAmount] = useState('');
//   const [payingAmountVal, setPayingAmountVal] = useState('');
//   const [productPriceDetail, setProductPriceDetail] = useState('');
//   const [storeProduct, setstoreProduct] = useState([]);
//   const [productCategoryList, setProductCategoryList] = useState([]);
//   const [productsUnitList, setProductsUnitList] = useState([]);
//   const [color, setColor] = useState('');
//   const [barcode, setbarcode] = useState('');
//   const [priceCheckbarcode, setPriceCheckbarcode] = useState('');
//   const [group, setGroup] = useState({ Pgroup: null, gproduct: null, tUnit: null });
//   const [groupCheckPrice, setGroupCheckPrice] = useState({
//     Prgroup: null,
//     grproduct: null,
//     trdUnit: null,
//   });
//   const productRef = useRef(null);
//   const qtyRef = useRef(null);
//   const sRateRef = useRef(null);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     productGroup: '',
//     product: '',
//     tradeUnit: '',
//     qty: '',
//     sRate: '',
//     disc: '',
//     discPercentage: '',
//     Stock: '0',
//     productdetailid: '',
//     productcategory: '',
//     productid: '',
//     categoryid: '',
//     barcode: '',
//     sku: '',
//     batchnumber: '',
//     unitid: '',
//   });
//   const [formDataChckPrice, setFormDataChckPrice] = useState({
//     productGroup: '',
//     product: '',
//     tradeUnit: '',
//     productdetailid: '',
//     productcategory: '',
//     productid: '',
//     categoryid: '',
//     barcode: '',
//   });
//   React.useEffect(() => {
//     var id = getstoreid();
//     fetchposdata(id);
//     fetchData();
//     calculateTotalValues();
//   }, [rows]);
//   const divElem = document.querySelector('body > div');
//   const getstoreid = () => {
//     const cookies = document.cookie.split(';');
//     const user = { username: null, storeId: null };
//     for (const cookie of cookies) {
//       const [name, value] = cookie.trim().split('=');
//       if (name === 'loggedInUser') {
//         user.username = decodeURIComponent(value);
//       } else if (name === 'storeId') {
//         user.storeId = decodeURIComponent(value);
//       }
//     }
//     if (!user.username || !user.storeId) {
//       // Navigate to another page
//       navigate('/');
//     } else {
//       return user.storeId;
//     }
//   };
//   /*  *********** Fetch storeLOVs api end point ************ */
//   const fetchData = async () => {
//     try {
//       const response = await fetch('/BlazorApi/storeLOVS', {
//         headers: {
//           Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
//         },
//       });
//       const jsonData = await response.json();
//       const data = jsonData.data;
//       /* console.log(jsonData.data)*/
//       setStoreLOVs(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   /*  *********** Fetch posProducts api end point ************ */
//   const fetchposdata = async (storeid) => {
//     const filterData = {
//       storeid: storeid,
//       name: '',
//       remarks: '',
//       id: '0',
//       datefrom: new Date().toISOString(),
//       dateto: new Date().toISOString(),
//       status: '1',
//     };
//     try {
//       const response = await fetch('/BlazorApi/posproducts', {
//         method: 'POST',
//         headers: {
//           Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(filterData),
//       });
//       const jsonData = await response.json();
//       //console.log('posproducts ',JSON.stringify(jsonData.data));
//       var SProd = jsonData.data;
//       const SelectedCategory = SProd.filter((un) => un.categoryid);
//       //console.log('SelectedCategory ', JSON.stringify(SelectedCategory));
//       const uniqueIds = {};
//       const filteredCategoryData = jsonData.data.filter((item) => {
//         if (!uniqueIds[item.categoryid]) {
//           uniqueIds[item.categoryid] = true;
//           return true;
//         }
//         return false;
//       });
//       setProductCategoryList(filteredCategoryData);
//       //console.log('filteredData ', JSON.stringify(filteredData));
//       setstoreProduct(jsonData.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   function generateRandomInvoiceNumber() {
//     const length = 9; // Length of the random part of the invoice number
//     const prefix = 'web'; // Desired prefix for the invoice number
//     const randomPart = generateRandomPart(length);

//     const invoiceNumber = prefix + randomPart;
//     return invoiceNumber;
//   }

//   function generateRandomPart(length) {
//     let randomPart = '';
//     for (let i = 0; i < length; i++) {
//       // Generate a random digit between 0 and 9
//       randomPart += Math.floor(Math.random() * 10).toString();
//     }
//     return randomPart;
//   }
//   /*  *********** Submit  Functions ************ */
//   const submit = async () => {
//     setIsLoading(true);
//     if (rows.length === 0) {
//       toast.error('Please Select atleast one product....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       setIsLoading(false);
//       return;
//     } else {
//       var id = getstoreid();
//       const invoiceNumber = generateRandomInvoiceNumber();

//       const SubmitData = rows.map((item) => ({
//         productdetailid: Number(item.productdetailid),
//         productname: item.productName,
//         productcategory: item.productcategory,
//         barcode: item.barcode,
//         sku: '',
//         batchnumber: '',
//         city: '',
//         username: '',
//         qty: item.quantity,
//         salerate: Number(item.price),
//         unitprice: Number(item.price),
//         linediscount: Number(item.discount) || 0,
//         storeid: Number(id),
//         createdby: 1,
//         producturl: '',
//         remarks: 'web',
//         status: 1,
//         businessagentid: 0,
//         salesinvoicecode: invoiceNumber,
//         amount: total.totalamount,
//         payableamount: Number(grandTotal),
//         paidamount: Number(grandTotal),
//         handedovercash: Number(cash.cash),
//         netdiscount: Number(discount.netDiscount),
//         changeamount: Number(change),
//         dueamount: Number(dueAmount),
//         payingamount: Number(cash.payingamount),
//         tax: Number(total.tax) || 0,
//         taxamount: Number(total.tax) || 0,
//         expense: Number(total.expense) || 0,
//       }));

//       try {
//         const response = await fetch('/BlazorApi/order', {
//           method: 'POST',
//           headers: {
//             Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(SubmitData),
//         });
//         const jsonData = await response.json();
//         setstoreProduct(jsonData.data);
//         //console.log('slelectedUnit ', JSON.stringify(slelectedUnit));
//         toast.success('Order has been submitted successfully....!', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//         ClearAll();
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     }
//   };

//   const ClearAll = () => {
//     setGroup({
//       tUnit: null,
//       Pgroup: null,
//       gproduct: null,
//     });
//     setRows([]);
//     setUnitOption([]);
//     setbarcode('');
//     setdiscount({ netDiscount: '', percDiscount: '' });
//     setdueAmount('');
//     setGrandTotal('');
//     setPayingAmountVal('');
//     setchange('');
//     setcash({ cash: '', payingamount: '' });
//     settotal({
//       itemNo: 0,
//       totalquantity: 0,
//       totalamount: 0,
//       totalnetdiscount: 0,
//       tax: '',
//       totalpercdiscount: 0,
//       expense: '',
//     });
//     setFormData({
//       productGroup: '',
//       product: '',
//       tradeUnit: '',
//       qty: '',
//       sRate: '',
//       disc: '',
//       discPercentage: '',
//       Stock: '0',
//       productdetailid: '',
//       productcategory: '',
//       productid: '',
//       categoryid: '',
//       barcode: '',
//       sku: '',
//       batchnumber: '',
//       unitid: '',
//     });
//   };
//   /*  *********** OnChange Call Functions ************ */
//   const handleCash = (event) => {
//     const { value } = event.target;
//     setcash((prevCash) => ({ ...prevCash, cash: value }));
//     var newChange = 0;
//     if (!cash.payingamount && value) {
//       newChange = value - grandTotal;
//     } else if (value) {
//       newChange = value - cash.payingamount;
//     }
//     setchange(newChange);
//   };

//   const handleNetDiscount = (event) => {
//     const { value } = event.target;
//     setdiscount({ netDiscount: value });
//     var num = total.totalamount;
//     if (value >= num) {
//       toast.error('Discount must be less then total amount:' + num, {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       setdiscount({ netDiscount: '', percDiscount: '' });
//       setGrandTotal(num);
//       setPayingAmountVal(num);
//       return;
//     }
//     if (value) {
//       num = total.totalamount - value;
//     }
//     setGrandTotal(num);
//     setPayingAmountVal(num);
//   };

//   const handleExpense = (event) => {
//     const { name, value } = event.target;
//     settotal((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     var x = total.totalamount;
//     if (value) {
//       x = total.totalamount + Number(value);
//     }
//     setGrandTotal(x);
//     setPayingAmountVal(x);
//   };

//   const handlePercDiscount = (event) => {
//     const { value } = event.target;
//     setdiscount({ percDiscount: value });
//     var num = total.totalamount;
//     if (value) {
//       const getdisc = (total.totalamount * value) / 100;
//       if (getdisc >= num) {
//         toast.error('Discount must be less then total amount:' + num, {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });

//         setGrandTotal(num);
//         setPayingAmountVal(num);

//         setdiscount({ netDiscount: '', percDiscount: '' });
//         return;
//       } else {
//         num = total.totalamount - getdisc;
//         setdiscount({ netDiscount: getdisc });
//       }
//     } else {
//       setdiscount({ netDiscount: '' });
//     }
//     setGrandTotal(num);
//     setPayingAmountVal(num);
//   };

//   const handlePaying = (event) => {
//     const { value } = event.target;
//     var amount = 0;
//     setcash({ payingamount: value });
//     console.log(value);
//     if (value) {
//       amount = value - grandTotal;
//       setColor(amount < 0 ? 'red' : 'green');
//     }
//     setdueAmount(amount);
//     setPayingAmountVal(amount);

//     //value = { cash.payingamount }
//   };

//   const handleProductGroup = (selectedGroup) => {
//     //alert('selectedGroup ', selectedGroup);
//     if (selectedGroup != null) {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         productGroup: selectedGroup.label,
//         categoryid: selectedGroup.value,
//       }));
//       //console.log('handleProductGroup ', JSON.stringify(formData));
//       //value: category.categoryid,
//       //label: category.productcategory,

//       if (selectedGroup.value) {
//         const selectedCategoryId = selectedGroup.value;
//         //alert(selectedCategoryId);
//         /* console.log(storeLOVs);*/
//         //const selectedproduct = storeLOVs.products.filter((product) => product.code === String(selectedCategoryId));
//         //var SProd = jsonData.data;
//         const SelectedCategory = storeProduct.filter((un) => un.categoryid === selectedCategoryId);

//         //console.log('SelectedCategory ', JSON.stringify(SelectedCategory));
//         const uniqueIds = {};
//         const filteredUnitidData = SelectedCategory.filter((item) => {
//           if (!uniqueIds[item.unitid]) {
//             uniqueIds[item.unitid] = true;
//             return true;
//           }
//           return false;
//         });
//         //console.log('filteredUnitidData ', JSON.stringify(filteredUnitidData));
//         //console.log('filteredUnitidData ', JSON.stringify(filteredUnitidData));
//         setProductsUnitList(filteredUnitidData);
//         //const units = storeLOVs.tunits;//.filter((unt) => unt.id === String(selectedCategoryId));
//         //const selectedproductUnits = storeLOVs.tunits.filter((unt) => unt.id === String(selectedCategoryId));
//         // alert("selectedCategoryId " + selectedCategoryId);
//         //alert("units " + JSON.stringify(units));
//         // alert("units detail " + JSON.stringify(selectedproductUnits));
//         //setproduct(selectedproduct);
//         //setproduct(selectedproduct);
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         productGroup: '',
//       }));
//     }
//     setGroup({
//       Pgroup: selectedGroup,
//       gproduct: '',
//       tUnit: '',
//     });
//     setUnitOption([]);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       sRate: '',
//     }));
//   };
//   const handleUnit = (selectedunitId) => {
//     //alert('selectedunitId ', selectedunitId);
//     if (selectedunitId != null) {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         tradeUnit: selectedunitId.label,
//         unitid: selectedunitId.value,
//       }));
//       if (selectedunitId.value) {
//         const selectedUnitId = selectedunitId.value;
//         const ProductCat = formData.categoryid;
//         //const filterProduct = storeProduct.filter((pro) => pro.unitid === selectedUnitId);

//         const filterProduct = storeProduct.filter(
//           (item) => item.unitid === selectedUnitId && item.categoryid === ProductCat,
//         );
//         console.log('productsUnitList new json filter  ', JSON.stringify(filterProduct));
//         setproduct(filterProduct);
//       }
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         productGroup: '',
//       }));
//     }
//     setGroup({
//       tUnit: selectedunitId,
//       gproduct: '',
//       // Pgroup:'',
//     });
//     //setUnitOption([]);
//     // setFormData((prevFormData) => ({
//     // ...prevFormData,
//     //sRate: '',
//     // }));
//   };

//   const handleProduct = (selected) => {
//     //alert('handleProduct ', selected);
//     //debugger;
//     if (selected != null) {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         product: selected.label,
//         productdetailid: selected.value,
//         //productid: selected.value
//       }));
//       //alert('handleProduct ', selected.value);
//       //console.log('product all selected ', JSON.stringify(product));
//       var selectedProduct = selected.value;
//       //alert('selectedProduct ', selectedProduct);
//       const bproduct = product.filter((pro) => pro.productdetailid === selectedProduct);
//       //console.log('bproduct ', JSON.stringify(bproduct));
//       // const bproduct = storeProduct.filter((product) => product.productid === selected.value); productdetailid
//       var un = [];
//       if (bproduct.length !== 0) {
//         un = bproduct.map((item) => ({
//           value: item.unitid,
//           label: item.unit,
//         }));
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           Stock: bproduct[0].quantity,
//           barcode: bproduct[0].barcode,
//           tradeUnit: bproduct[0].unit,
//           productdetailid: bproduct[0].productdetailid,
//           productid: bproduct[0].productid,
//           productcategory: bproduct[0].productcategory,
//           sku: bproduct[0].sku,
//           batchnumber: bproduct[0].batchnumber,
//           unitid: bproduct[0].unitid,
//           sRate: bproduct[0].saleprice,
//         }));
//       } else {
//         toast.error('Product is not ready for sale now.', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//         setGroup({ tUnit: null, Pgroup: null, gproduct: null });
//         //setFormData({ productGroup: '', categoryid: '', product:'',productid:'' })
//         return;
//       }

//       setUnitOption(un);

//       //var placeunit = { value: bproduct[0].unitid, label: bproduct[0].unit };
//       //setGroup((prevGroup) => ({
//       //  ...prevGroup,
//       //  tUnit: placeunit
//       //}));
//     } else {
//       //setFormData((prevFormData) => ({
//       //...prevFormData,
//       // product: null,
//       // productid:null
//       //}));
//     }
//     // setGroup((prevGroup) => ({
//     // ...prevGroup,
//     //  gproduct: selected,
//     // tUnit: ''
//     // }));
//     setGroup({ gproduct: selected });
//     //setFormData((prevFormData) => ({
//     // ...prevFormData,
//     // sRate:'',
//     //}));
//   };

//   const handleUnitX = (selectedunitId) => {
//     /// setFormData((prevFormData) => ({
//     // ...prevFormData,
//     // productGroup: selectedGroup.label,
//     //  categoryid: selectedGroup.value
//     // }));
//     //value: category.categoryid,
//     //label: category.productcategory,

//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       tradeUnit: selectedunitId.label,
//       unitid: selectedunitId.value,
//     }));
//     //alert('selectedunitId.value ', selectedunitId.value);
//     console.log('selectedunitId ', JSON.stringify(formData));
//     //var selectedunitId = selectedunitId.value;
//     if (selectedunitId != null) {
//       const bproduct = storeProduct.filter((product) => product.productid === formData.productid);
//       const x = bproduct.filter((item) => item.unitid === selectedunitId.value);
//       if (bproduct.length !== 0) {
//         //alert(JSON.stringify(x));
//         //alert('bproduct', JSON.stringify(bproduct));
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           tradeUnit: selectedunitId.label,
//           Stock: x[0].quantity,
//           sRate: x[0].saleprice,
//         }));
//       } else {
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           tradeUnit: selectedunitId.label,
//         }));
//       }
//       //setSelectedProductDetail_Price(bproduct[0].productname + ' : ' + bproduct[0].saleprice);
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         tradeUnit: '',
//         Stock: '',
//         sRate: '',
//       }));
//     }

//     setGroup({ tUnit: selectedunitId });
//   };

//   const handlebarcode = (event) => {
//     const { value } = event.target;
//     setbarcode(value);
//     if (value.length >= 2) {
//       const bproduct = storeProduct.filter((product) => product.barcode === value);
//       if (bproduct.length !== 0) {
//         const defaultOption = { value: bproduct[0].barcode, label: bproduct[0].product };
//         const btradeUnit = { value: bproduct[0].unitid, label: bproduct[0].unit };
//         const fdata = storeLOVs.tcategories.filter((id) => id.id === bproduct[0].categoryid);
//         const abc = fdata.map((category) => ({
//           value: category.id,
//           label: category.name,
//         }));
//         setGroup({ gproduct: defaultOption, tUnit: btradeUnit, Pgroup: abc });
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           product: bproduct[0].product,
//           Stock: bproduct[0].quantity,
//           sRate: String(bproduct[0].saleprice),
//           barcode: bproduct[0].barcode,
//           tradeUnit: bproduct[0].unit,
//           productid: bproduct[0].productid,
//           productdetailid: bproduct[0].productdetailid,
//           productcategory: bproduct[0].productcategory,
//           sku: bproduct[0].sku,
//           batchnumber: bproduct[0].batchnumber,
//           unitid: bproduct[0].unitid,
//         }));
//       } else {
//         toast.error('Please Enter Valid Barcode....!', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//       }
//     } else if (value.length < 1) {
//       setGroup({ gproduct: null, tUnit: null });
//       setbarcode('');
//       setFormData({
//         productGroup: '',
//         product: [],
//         tradeUnit: '',
//         qty: '',
//         sRate: '',
//         disc: '',
//         discPercentage: '',
//         batchNo: '',
//       });
//     }
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };
//   /*  *********** Fetch Product Price Detail api end point ************ */
//   const ClickPriceDetailData = async () => {
//     // alert(JSON.stringify(formDataChckPrice));
//     //debugger;
//     /*if (groupCheckPrice.Prgroup == '' || groupCheckPrice.Prgroup == null ) {
//       alert('Please select Product group');
//       return;
//     }
//     if (groupCheckPrice.grproduct == '' || groupCheckPrice.grproduct == null) {
//       alert('Please select Product');
//       return;
//     }*/
//     if (groupCheckPrice.trdUnit == '' || groupCheckPrice.trdUnit == null) {
//       //alert('Please select Product group or Product or Unit');
//       toast.error('Please select Product group or Product or Unit', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       return;
//     }

//     var storeid = getstoreid();
//     const filterData = {
//       productDetailId: formDataChckPrice.productdetailid,
//       productGroup: formDataChckPrice.productGroup,
//       unitid: formDataChckPrice.unitid,
//       unit: formDataChckPrice.tradeUnit,
//       barcode: formDataChckPrice.barcode,
//       productcategory: formDataChckPrice.productcategory,
//       categoryid: formDataChckPrice.categoryid,
//       //cate: formDataChckPrice.productcategory,
//       productname: formDataChckPrice.productname,
//       storeid: storeid,
//     };
//     //alert('filterData '+JSON.stringify(filterData));
//     try {
//       const response = await fetch('/BlazorApi/pricedetail', {
//         method: 'POST',
//         headers: {
//           Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(filterData),
//       });
//       if (response != '' || response != null) {
//         const jsonData = await response.json();
//         //alert('jsonData ' + JSON.stringify(jsonData.data));
//         setProductPriceDetail(jsonData.data);
//       } else {
//         toast.error('data not find', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   /*  *********** Check price onclick function ************ */
//   const handleProductGroupCheckPrice = (selectedGroup) => {
//     if (selectedGroup != null) {
//       setFormDataChckPrice((prevFormData) => ({
//         ...prevFormData,
//         productGroup: selectedGroup.label,
//         categoryid: selectedGroup.value,
//       }));

//       if (selectedGroup.value) {
//         const selectedCategoryId = selectedGroup.value;

//         /* console.log(storeLOVs);*/
//         const selectedproduct = storeLOVs.products.filter(
//           (product) => product.code === String(selectedCategoryId),
//         );

//         setproduct(selectedproduct);
//       }
//     } else {
//       setFormDataChckPrice((prevFormData) => ({
//         ...prevFormData,
//         productGroup: '',
//       }));
//     }
//     setGroupCheckPrice({
//       Prgroup: selectedGroup,
//       grproduct: '',
//       trdUnit: null,
//     });
//     setUnitOption([]);
//     setFormDataChckPrice((prevFormData) => ({
//       ...prevFormData,
//       sRate: '',
//     }));
//   };
//   const handleProductCheckPrice = (selected) => {
//     /*debugger;*/
//     if (selected != null) {
//       setFormDataChckPrice((prevFormData) => ({
//         ...prevFormData,
//         product: selected.label,
//         productid: selected.value,
//       }));
//       const bproduct = storeProduct.filter((product) => product.productid === selected.value);
//       var un = [];
//       if (bproduct.length !== 0) {
//         un = bproduct.map((item) => ({
//           value: item.unitid,
//           label: item.unit,
//         }));
//         setFormDataChckPrice((prevFormData) => ({
//           ...prevFormData,
//           Stock: bproduct[0].quantity,
//           barcode: bproduct[0].barcode,
//           tradeUnit: bproduct[0].unit,
//           productdetailid: bproduct[0].productdetailid,
//           productid: bproduct[0].productid,
//           productcategory: bproduct[0].productcategory,
//           sku: bproduct[0].sku,
//           batchnumber: bproduct[0].batchnumber,
//           unitid: bproduct[0].unitid,
//         }));
//       } else {
//         toast.error('Product is not ready for sale now.', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//         setGroupCheckPrice({ trdUnit: null, Prgroup: null, grproduct: null });
//         setFormDataChckPrice({ productGroup: '', categoryid: '', product: '', productid: '' });
//         return;
//       }

//       setUnitOption(un);

//       //var placeunit = { value: bproduct[0].unitid, label: bproduct[0].unit };
//       //setGroup((prevGroup) => ({
//       //  ...prevGroup,
//       //  tUnit: placeunit
//       //}));
//     } else {
//       setFormDataChckPrice((prevFormData) => ({
//         ...prevFormData,
//         product: null,
//         productid: null,
//       }));
//     }
//     setGroupCheckPrice((prevGroup) => ({
//       ...prevGroup,
//       grproduct: selected,
//       trdUnit: '',
//     }));
//     setFormDataChckPrice((prevFormData) => ({
//       ...prevFormData,
//       sRate: '',
//     }));
//   };

//   const handleUnitCheckPrice = (selectedunit) => {
//     if (selectedunit != null) {
//       const bproduct = storeProduct.filter(
//         (product) => product.productid === formDataChckPrice.productid,
//       );
//       const x = bproduct.filter((item) => item.unitid === selectedunit.value);
//       if (bproduct.length !== 0) {
//         setFormDataChckPrice((prevFormData) => ({
//           ...prevFormData,
//           tradeUnit: selectedunit.label,
//           sRate: x[0].saleprice,
//         }));
//       } else {
//         setFormDataChckPrice((prevFormData) => ({
//           ...prevFormData,
//           tradeUnit: selectedunit.label,
//         }));
//       }
//     } else {
//       setFormDataChckPrice((prevFormData) => ({
//         ...prevFormData,
//         tradeUnit: '',
//         sRate: '',
//       }));
//     }
//     setGroupCheckPrice({ trdUnit: selectedunit });
//   };
//   const handleCheckPriceBarcode = (event) => {
//     //debugger;
//     const { value } = event.target;
//     setPriceCheckbarcode(value);
//     if (value.length >= 2) {
//       const bproduct = storeProduct.filter((product) => product.barcode === value);
//       if (bproduct.length !== 0) {
//         const defaultOption = { value: bproduct[0].barcode, label: bproduct[0].product };
//         const btradeUnit = { value: bproduct[0].unitid, label: bproduct[0].unit };
//         const fdata = storeLOVs.tcategories.filter((id) => id.id === bproduct[0].categoryid);
//         const abc = fdata.map((category) => ({
//           value: category.id,
//           label: category.name,
//         }));
//         setGroupCheckPrice({ grproduct: defaultOption, trdUnit: btradeUnit, Prgroup: abc });
//         setFormDataChckPrice((prevFormData) => ({
//           ...prevFormData,
//           productdetailid: bproduct[0].productdetailid,
//           product: bproduct[0].product,
//           productid: bproduct[0].categoryid,
//           productGroup: bproduct[0].productcategory,
//           productname: bproduct[0].product,
//           productcategory: bproduct[0].productcategory,
//           batchnumber: bproduct[0].batchnumber,
//           unitid: bproduct[0].unitid,
//           barcode: bproduct[0].barcode,
//           tradeUnit: bproduct[0].unit,
//           categoryid: bproduct[0].categoryid,
//         }));
//       } else {
//         toast.error('Please Enter Valid Barcode....!', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//       }
//     } else if (value.length < 1) {
//       setGroupCheckPrice({ grproduct: null, trdUnit: null });
//       setbarcode('');
//       setFormDataChckPrice({
//         productGroup: '',
//         product: [],
//         tradeUnit: '',
//         qty: '',
//         sRate: '',
//         disc: '',
//         discPercentage: '',
//         batchNo: '',
//       });
//     }
//   };

//   /*  *********** Add Button onclick function ************ */
//   const handleAddData = () => {
//     //debugger
//     let checkdiscount;
//     var showDiscount = 0;
//     if (formData.product === '') {
//       toast.error('Please Select Product Name..!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       productRef.current.focus();
//       return;
//     } else if (formData.qty === '' || (formData.qty === '0' && formData.qty > formData.Stock)) {
//       toast.error('Please Enter Quantity....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       qtyRef.current.focus();
//       return;
//     } else if (formData.qty > formData.Stock) {
//       toast.error('Quantity must be less then total ' + formData.qty, {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       qtyRef.current.focus();
//       return;
//     } else if (formData.sRate === '' || formData.sRate === '0') {
//       toast.error('Please Enter Price....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       sRateRef.current.focus();
//       return;
//     } else {
//       if (formData.discPercentage) {
//         const num = (formData.qty * formData.sRate * formData.discPercentage) / 100;
//         formData.disc = num;
//       }
//       if (Number(formData.disc) >= formData.qty * formData.sRate) {
//         toast.error('Discount must be less then total amount:' + formData.qty * formData.sRate, {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//         return;
//       }
//       checkdiscount = formData.qty * formData.sRate - formData.disc;
//       showDiscount = formData.disc;
//       const newRow = {
//         id: rows.length,
//         productName: formData.product,
//         price: formData.sRate,
//         productGroup: formData.productGroup,
//         categoryid: formData.categoryid,
//         quantity: Number(formData.qty),
//         discount: Number(showDiscount),
//         total: checkdiscount,
//         Stock: formData.Stock,
//         barcode: formData.barcode,
//         tradeUnit: formData.tradeUnit,
//         productid: formData.productid,
//         productdetailid: formData.productdetailid,
//         productcategory: formData.productcategory,
//         sku: formData.sku,
//         batchnumber: formData.batchnumber,
//         unitid: formData.unitid,
//       };
//       setRows((prevRows) => [...prevRows, newRow]);
//       /*setGroup({ Pgroup: null, gproduct: null, tUnit: null });*/
//       setGroup({
//         tUnit: null, // or undefined, depending on your use case
//         Pgroup: null,
//         gproduct: null,
//       });
//       setUnitOption([]);
//       setbarcode('');
//       setFormData({
//         productGroup: '',
//         product: '',
//         tradeUnit: '',
//         qty: '',
//         sRate: '',
//         disc: '',
//         discPercentage: '',
//         Stock: '0',
//         productdetailid: '',
//         productcategory: '',
//         productid: '',
//         categoryid: '',
//         barcode: '',
//         sku: '',
//         batchnumber: '',
//         unitid: '',
//       });
//     }
//   };

//   /*  *********** Handel Resize observer ************ */
//   const resizeObserver = new ResizeObserver((entries) => {
//     for (let entry of entries) {
//       if (entry.target.handleResize) entry.target.handleResize(entry);
//     }
//   });

//   resizeObserver.observe(divElem);
//   /*  *********** Grid Columns ************ */
//   const columns = [
//     {
//       key: 'productName',
//       name: 'Product Name',
//       sortable: true,
//       renderSummaryCell() {
//         return <strong>Total Item : {total.itemNo}</strong>;
//       },
//     },
//     { key: 'price', name: 'Product Price (Rs)', align: 'center' },
//     {
//       key: 'quantity',
//       name: 'Quantity',
//       align: 'center',
//       renderSummaryCell() {
//         return <strong>Quantity : {total.totalquantity}</strong>;
//       },
//     },
//     {
//       key: 'discount',
//       name: 'Discount',
//       align: 'center',
//       renderSummaryCell() {
//         return <strong>Discount : {total.totalnetdiscount}</strong>;
//       },
//     },
//     {
//       key: 'total',
//       name: 'Total (Rs)',
//       align: 'center',
//       renderSummaryCell() {
//         return <strong>Price : {total.totalamount}</strong>;
//       },
//     },
//   ];

//   /*  *********** Calculate total for summary row  ************ */
//   const calculateTotalValues = () => {
//     const quantitySum = rows.reduce((total, row) => total + row.quantity, 0);
//     var amountSum = rows.reduce((sum, row) => sum + row.total, 0);
//     const discountSum = rows.reduce((sum, row) => sum + Number(row.discount), 0);
//     settotal({
//       itemNo: rows.length,
//       totalamount: amountSum,
//       totalquantity: quantitySum,
//       totalnetdiscount: discountSum,
//     });
//     setGrandTotal(amountSum);
//     setPayingAmountVal(amountSum);
//     if (amountSum != 0 || amountSum != '0') {
//       setSelectedProductDetail_Price(' Bill : ' + amountSum);
//     } else {
//       setSelectedProductDetail_Price('');
//     }
//   };
//   const toggleModal = () => {
//     setModalOpen(!modalOpen);
//   };
//   const PriceDetailClick = () => {
//     setPriceDetail(!priceDetail);
//     setPriceDetailButton(!priceDetailButton);
//     //priceDetailButton, setPriceDetailButton
//   };

//   /*  *********** Summary Row ************ */

//   const summaryRows = useMemo(() => {
//     return [
//       {
//         id: 'total_0',
//         totalCount: rows.length,
//       },
//     ];
//   }, [rows]);

//   return (
//     <>
//       {isLoading && (
//         <div className="loading-overlay">
//           <Loading />
//         </div>
//       )}
//       <ToastContainer />
//       <div className="row">
//         <div id="print-content bg_Color">
//           <Modal
//             id="print-content"
//             isOpen={modalOpen}
//             toggle={toggleModal}
//             className="custom-modal"
//           >
//             <ModalHeader toggle={toggleModal} className="inv-m-header">
//               <h5>
//                 <b>Check Item Price</b>
//               </h5>
//             </ModalHeader>
//             <ModalBody className="paddingAllSide">
//               <div>
//                 <div className="row m-inv-number mb-2 mt-1">
//                   <div className="col-md-8 top-barcode">
//                     <input
//                       type="text"
//                       value={priceCheckbarcode}
//                       className="txtBarcodePriceCheck txt_Default text-center"
//                       onChange={handleCheckPriceBarcode}
//                     />
//                     <img className="barCodeImg" name="image" src="/11.5546ert345345df.png" />
//                   </div>
//                   <div className="col-md-3 ">
//                     <button
//                       onClick={ClickPriceDetailData}
//                       className="btn btn_Default minWidth Float-Right"
//                     >
//                       Get Price
//                     </button>
//                   </div>
//                 </div>

//                 <div className=" mb-2">
//                   <div className="row mb-2">
//                     <div className="col-sm-6 col-md-4 col-lg-4">
//                       <div className="form-group">
//                         <label htmlFor="">Product Group</label>
//                         <br />
//                         <Select
//                           className="basic-single"
//                           isSearchable={isSearchable}
//                           isClearable={isClearable}
//                           value={groupCheckPrice.Prgroup}
//                           onChange={handleProductGroupCheckPrice}
//                           options={storeLOVs.tcategories.map((category) => ({
//                             value: category.id,
//                             label: category.name,
//                           }))}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-sm-6 col-md-4 col-lg-4">
//                       <div className="form-group place-width-inherit">
//                         <label htmlFor="">Product</label>
//                         <br />
//                         <Select
//                           className="basic-single"
//                           ref={productRef}
//                           isSearchable={isSearchable}
//                           isClearable={isClearable}
//                           value={groupCheckPrice.grproduct}
//                           onChange={handleProductCheckPrice}
//                           options={product.map((category) => ({
//                             value: category.id,
//                             label: category.name,
//                           }))}
//                         />
//                       </div>
//                     </div>
//                     <div className="col-sm-6 col-md-4 col-lg-4">
//                       <div className="form-group">
//                         <label htmlFor="">Trade Unit</label>
//                         <br />
//                         <Select
//                           className="basic-single"
//                           isSearchable={isSearchable}
//                           isClearable={isClearable}
//                           value={groupCheckPrice.trdUnit}
//                           onChange={handleUnitCheckPrice}
//                           options={unitOption}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="row mb-2">
//                     <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                       <div className="form-group">
//                         <label className="PriceDetaillbl" htmlFor="">
//                           Product{' '}
//                         </label>
//                         <br />
//                         <label className="PriceDetaillblVal" htmlFor="">
//                           {productPriceDetail.productname != ''
//                             ? productPriceDetail.productname
//                             : '--'}
//                         </label>
//                       </div>
//                     </div>
//                     <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                       <div className="form-group">
//                         <label className="PriceDetaillbl" htmlFor="">
//                           Unit
//                         </label>
//                         <br />
//                         <label className="PriceDetaillblVal" htmlFor="">
//                           {productPriceDetail.unit != '' ? productPriceDetail.unit : '--'}
//                         </label>
//                       </div>
//                     </div>
//                     <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                       <div className="form-group place-width-inherit">
//                         <label className="PriceDetaillbl" htmlFor="">
//                           Sale Price
//                         </label>
//                         <br />
//                         <label className="PriceDetaillblVal" htmlFor="">
//                           {productPriceDetail.saleprice == ''
//                             ? productPriceDetail.DefaultFixPrice
//                             : productPriceDetail.saleprice}{' '}
//                         </label>
//                       </div>
//                     </div>
//                     <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                       <div className="form-group">
//                         <label className="PriceDetaillbl" htmlFor="">
//                           Available Qty{' '}
//                         </label>
//                         <br />
//                         <label className="PriceDetaillblVal" htmlFor="">
//                           {productPriceDetail.quantity != '' ? productPriceDetail.quantity : '--'}
//                         </label>
//                       </div>
//                     </div>
//                     <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                       <div className="form-group">
//                         <label className="PriceDetaillbl" htmlFor="">
//                           Expiry Date{' '}
//                         </label>
//                         <br />
//                         <label className="PriceDetaillblVal" htmlFor="">
//                           {moment(productPriceDetail.expirydate).format('MM/DD/YYYY') != ''
//                             ? productPriceDetail.expirydate
//                             : '--'}
//                         </label>
//                       </div>
//                     </div>
//                   </div>

//                   {priceDetail && (
//                     <div className="moreDetail">
//                       <div className="row mb-2 text show-more-height">
//                         <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                           <div className="form-group">
//                             <label className="PriceDetaillbl" htmlFor="">
//                               Scheme Bundling{' '}
//                             </label>
//                             <br />
//                             <label className="PriceDetaillblVal" htmlFor="">
//                               {productPriceDetail.schemeBundleQty != ''
//                                 ? productPriceDetail.schemeBundleQty
//                                 : '--'}
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                           <div className="form-group">
//                             <label className="PriceDetaillbl" htmlFor="">
//                               Scheme Free Qty{' '}
//                             </label>
//                             <br />
//                             <label className="PriceDetaillblVal" htmlFor="">
//                               {productPriceDetail.schemeFreeQty != ''
//                                 ? productPriceDetail.schemeFreeQty
//                                 : '--'}
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                           <div className="form-group">
//                             <label className="PriceDetaillbl" htmlFor="">
//                               Discount
//                             </label>
//                             <br />
//                             <label className="PriceDetaillblVal" htmlFor="">
//                               {productPriceDetail.maxDiscountPercentage != ''
//                                 ? productPriceDetail.maxDiscountPercentage
//                                 : '--'}
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                           <div className="form-group place-width-inherit">
//                             <label className="PriceDetaillbl" htmlFor="">
//                               Batch Number
//                             </label>
//                             <br />
//                             <label className="PriceDetaillblVal" htmlFor="">
//                               {' '}
//                               {productPriceDetail.batchnumber != ''
//                                 ? productPriceDetail.batchnumber
//                                 : '--'}
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                           <div className="form-group">
//                             <label className="PriceDetaillbl" htmlFor="">
//                               Bar Code{' '}
//                             </label>
//                             <br />
//                             <label className="PriceDetaillblVal" htmlFor="">
//                               {productPriceDetail.barcode != '' ? productPriceDetail.barcode : '--'}
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-lg-2 text-center"></div>
//                       </div>

//                       <div className="row mb-2 text show-more-height">
//                         <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                           <div className="form-group">
//                             <label className="PriceDetaillbl" htmlFor="">
//                               Purchase price
//                             </label>
//                             <br />
//                             <label className="PriceDetaillblVal" htmlFor="">
//                               {productPriceDetail.purchaseprice != ''
//                                 ? productPriceDetail.purchaseprice
//                                 : '--'}
//                             </label>
//                           </div>
//                         </div>
//                         <div className="col-sm-6 col-md-4 col-lg-2 text-center">
//                           <div className="form-group">
//                             <label className="PriceDetaillbl" htmlFor="">
//                               Tax{' '}
//                             </label>
//                             <br />
//                             <label className="PriceDetaillblVal" htmlFor="">
//                               {productPriceDetail.taxCalculated != ''
//                                 ? productPriceDetail.taxCalculated
//                                 : '--'}
//                             </label>
//                           </div>
//                         </div>

//                         <div className="col-sm-1 col-md-1 col-lg-2 text-center"></div>
//                       </div>
//                     </div>
//                   )}
//                   <div className="row m-inv-number mb-2 mt-1">
//                     {/*<div className="col-md-6 text-center pt-4">*/}
//                     {/*  <button className="btn btn-danger minWidth" >Cancel</button>*/}
//                     {/*</div>*/}
//                     <div className=" text-center pt-4">
//                       {priceDetail && (
//                         <button
//                           onClick={PriceDetailClick}
//                           className="btn btn_Default minWidth Float-Right show-more"
//                         >
//                           Less Detail
//                         </button>
//                       )}
//                       {priceDetailButton && (
//                         <button
//                           onClick={PriceDetailClick}
//                           className="btn btn_Default minWidth Float-Right show-more"
//                         >
//                           More Detail
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </ModalBody>
//           </Modal>
//         </div>

//         <div className="row top-barcode">
//           <div className="col-lg-2 col-md-3">
//             <input
//               type="text"
//               value={barcode}
//               className="text-center txtBarcodeVal txt_Default "
//               onChange={handlebarcode}
//             />
//           </div>
//           <div className="col-lg-2 col-md-3 ml-3">
//             <img className="barCodeImg" name="image" src="/11.5546ert345345df.png" />
//           </div>
//           <div className="col-lg-5 col-md-3">
//             <label className="lblAmountShow">
//               {selectedProductDetail_Price != '' ? selectedProductDetail_Price : ''}{' '}
//             </label>
//           </div>
//           <div className="col-lg-3 col-md-3 text-right">
//             <img
//               className="PriceTagImage"
//               name="image"
//               onClick={toggleModal}
//               src="/pricetagicon.png"
//             />
//           </div>
//         </div>
//         <div className=" mb-2">
//           <div className="row">
//             <div className="col-sm-6 col-md-4 col-lg-2 col-padding">
//               <div className="form-group">
//                 <label className="lbl_Default" htmlFor="">
//                   Product Group
//                 </label>
//                 <br />
//                 <Select
//                   className="basic-single"
//                   isSearchable={isSearchable}
//                   isClearable={isClearable}
//                   value={group.Pgroup}
//                   onChange={handleProductGroup}
//                   options={productCategoryList.map((category) => ({
//                     value: category.categoryid,
//                     label: category.productcategory,
//                   }))}
//                 />
//               </div>
//             </div>
//             <div className="col-sm-6 col-md-4 col-lg-2 col-padding">
//               <div className="form-group">
//                 <label className="lbl_Default" htmlFor="">
//                   Trade Unit
//                 </label>
//                 <br />
//                 <Select
//                   className="basic-single"
//                   isSearchable={isSearchable}
//                   isClearable={isClearable}
//                   value={group.tUnit}
//                   onChange={handleUnit}
//                   // options={productsUnitList}
//                   options={productsUnitList.map((unit) => ({
//                     value: unit.unitid,
//                     label: unit.unit,
//                   }))}
//                 />
//               </div>
//             </div>
//             <div className="col-sm-6 col-md-4 col-lg-2 d-flex col-padding">
//               <div className="form-group place-width-inherit w-75">
//                 <label className="lbl_Default" htmlFor="">
//                   Product
//                 </label>
//                 <br />
//                 <Select
//                   className="basic-single"
//                   ref={productRef}
//                   isSearchable={isSearchable}
//                   isClearable={isClearable}
//                   value={group.gproduct}
//                   onChange={handleProduct}
//                   options={product.map((category) => ({
//                     value: category.productdetailid,
//                     label: category.productname,
//                   }))}
//                 />
//               </div>
//               <div className="form-group ms-2 ">
//                 <label className="lbl_Default" htmlFor="">
//                   Stock
//                 </label>
//                 <br />
//                 <h3 className="stock-size">{formData.Stock}</h3>
//               </div>
//             </div>

//             <div className="col-sm-6 col-md-4 col-lg-2 d-flex col-padding">
//               <div className="form-group top-textbox ">
//                 <label className="lbl_Default" htmlFor="">
//                   QTY
//                 </label>
//                 <br />
//                 <input
//                   type="number"
//                   className="set-input-width text-center txt_Default"
//                   placeholder="0"
//                   ref={qtyRef}
//                   id="qty"
//                   name="qty"
//                   value={formData.qty}
//                   onChange={handleChange}
//                   onKeyDown={(evt) =>
//                     ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
//                   }
//                   min={0}
//                 />
//               </div>
//               <div className="form-group ms-2 top-textbox">
//                 <label className="lbl_Default" htmlFor="">
//                   S-Rate
//                 </label>
//                 <br />
//                 <input
//                   type="number"
//                   className="set-input-width text-center txt_Default"
//                   placeholder="0"
//                   ref={sRateRef}
//                   id="sRate"
//                   name="sRate"
//                   value={formData.sRate}
//                   onChange={handleChange}
//                   onKeyDown={(evt) =>
//                     ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
//                   }
//                   min={0}
//                 />
//               </div>
//             </div>
//             <div className="col-sm-6 col-md-4 col-lg-2 d-flex col-padding">
//               <div className="form-group top-textbox">
//                 <label className="lbl_Default" htmlFor="">
//                   Disc
//                 </label>
//                 <br />
//                 <input
//                   type="number"
//                   className="set-input-width-disc txt_Default text-center"
//                   placeholder="0"
//                   id="disc"
//                   name="disc"
//                   value={formData.disc}
//                   onChange={handleChange}
//                   onKeyDown={(evt) =>
//                     ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
//                   }
//                   min={0}
//                 />
//               </div>
//               <div className="form-group ms-2 top-textbox">
//                 <label className="lbl_Default" htmlFor="">
//                   (%)
//                 </label>
//                 <br />
//                 <input
//                   type="number"
//                   className="set-input-width-disc text-center txt_Default"
//                   placeholder="0"
//                   id="discPercentage"
//                   name="discPercentage"
//                   value={formData.discPercentage}
//                   onChange={handleChange}
//                   onKeyDown={(evt) =>
//                     ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
//                   }
//                   min={0}
//                 />
//               </div>
//             </div>
//             <div className="col-sm-6 col-md-4 col-lg-2 d-flex col-padding">
//               <div className="form-group place-width-inherit w-60">
//                 <label className="lbl_Default" htmlFor="">
//                   Batch No
//                 </label>
//                 <br />
//                 <Select
//                   className="basic-single"
//                   isSearchable={isSearchable}
//                   isClearable={isClearable}
//                 />
//               </div>
//               <div className="form-group set-margin ms-2">
//                 <button className="btn btn_Default_SmallAdd " onClick={handleAddData}>
//                   Add
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-12 col-xl-9">
//           <Box style={{ height: 380, width: '100%' }}>
//             <DataGrid
//               responsive
//               id="dgPlaceOrder"
//               columns={columns}
//               rows={rows}
//               bottomSummaryRows={summaryRows}
//               sx={{ overflowX: 'scroll' }}
//             />
//           </Box>
//         </div>
//         <div className="col-xl-3 col-md-12 button-col ">
//           <div className=" gap-2 d-md-flex">
//             <div className="form-group md-width w-50">
//               <label className="lbl_Default" htmlFor="">
//                 Expense
//               </label>
//               <br />
//               <input
//                 type="number"
//                 className="set-input-width-disc txt_Default text-center"
//                 value={total.expense}
//                 onChange={handleExpense}
//                 placeholder="0"
//                 onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
//                 min={0}
//                 name="expense"
//               />
//             </div>
//             <div className="form-group md-width w-50">
//               <label className="lbl_Default" htmlFor="">
//                 Tax
//               </label>
//               <br />
//               <input
//                 type="number"
//                 className="set-input-width-disc txt_Default text-center"
//                 name="tax"
//                 value={total.tax}
//                 onChange={handleExpense}
//                 placeholder="0"
//                 onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
//                 min={0}
//               />
//             </div>
//           </div>

//           <div className=" gap-2 d-md-flex ">
//             <div className="form-group md-width w-50">
//               <label className="lbl_Default" htmlFor="">
//                 Net Disc
//               </label>
//               <br />
//               <input
//                 type="number"
//                 className="set-input-width-disc txt_Default text-center"
//                 placeholder="0"
//                 name="netDiscount"
//                 value={discount.netDiscount}
//                 onChange={handleNetDiscount}
//                 onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
//                 min={0}
//               />
//             </div>
//             <div className="form-group md-width w-50">
//               <label className="lbl_Default" htmlFor="">
//                 Disc(%)
//               </label>
//               <br />
//               <input
//                 type="number"
//                 className="set-input-width-disc txt_Default text-center"
//                 placeholder="0"
//                 name="percDiscount"
//                 value={discount.percDiscount}
//                 onChange={handlePercDiscount}
//                 onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
//                 min={0}
//               />
//             </div>
//           </div>
//           <div className=" gap-2 d-md-flex ">
//             <div className="form-group md-width w-100">
//               <label className="lbl_Default" htmlFor="">
//                 <b>Payable Amount</b>
//               </label>
//               <br />
//               <input
//                 type="number"
//                 className="w-100 text-center fw-bold txt_Default"
//                 id="payable"
//                 value={grandTotal}
//                 readOnly
//               />
//             </div>
//             {/*<div className="form-group md-width">*/}
//             {/*  <label htmlFor="">Paying Amount</label><br />*/}
//             {/*  <input type="number" className="set-input-width-disc " value="0" />*/}
//             {/*</div>*/}
//           </div>
//           <div className=" gap-2 d-md-flex ">
//             <div className="form-group md-width  w-100">
//               <label className="lbl_Default" htmlFor="">
//                 Paying Amount
//               </label>
//               <br />
//               <input
//                 type="number"
//                 className="w-100 text-center txt_Default"
//                 id="payingamount"
//                 placeholder="0"
//                 name="payingamount"
//                 value={cash.payingamount}
//                 onChange={handlePaying}
//                 onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
//                 min={0}
//               />
//             </div>
//           </div>
//           <div className=" gap-2 d-md-flex ">
//             <div className="form-group md-width w-50">
//               <label className="lbl_Default" htmlFor="">
//                 Cash
//               </label>
//               <br />
//               <input
//                 type="number"
//                 className="set-input-width-disc txt_Default text-center"
//                 id="cash"
//                 placeholder="0"
//                 name="cash"
//                 value={cash.cash}
//                 onChange={handleCash}
//                 onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
//                 min={0}
//               />
//             </div>
//             <div className="form-group md-width w-50">
//               <label className="lbl_Default" htmlFor="">
//                 Change
//               </label>
//               <br />
//               <input
//                 type="number"
//                 className="set-input-width-disc txt_Default text-center"
//                 placeholder="0"
//                 value={change}
//                 readOnly
//               />
//             </div>
//           </div>

//           <div className=" gap-2 d-md-flex w-100 ">
//             <div className="form-group w-100 ">
//               <label className="lbl_Default" htmlFor="">
//                 Due Amount
//               </label>
//               <br />
//               <input
//                 type="number"
//                 className="w-100 txt_Default text-center"
//                 style={{ color: color }}
//                 value={dueAmount}
//                 placeholder="0"
//                 readOnly
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="row mt-3 ">
//         <div className="gap-2 d-md-flex justify-content-center mb-3">
//           <CButton color="" className="btn me-md-2 menu-button btnPlaceOrder">
//             {' '}
//             <FontAwesomeIcon icon={faLock} size="2x" className="mb-1" />
//             <br /> Lock{' '}
//           </CButton>
//           <CButton color="" className="btn me-md-2 menu-button btnPlaceOrder">
//             <FontAwesomeIcon icon={faEdit} size="2x" className="mb-1 btn-change" />
//             <br />
//             Change
//           </CButton>
//           <CButton color="" className="btn me-md-2 menu-button btnPlaceOrder">
//             <FontAwesomeIcon icon={faTrash} size="2x" className="mb-1 btn-trash" />
//             <br />
//             Delete Inv
//           </CButton>
//           <CButton color="" className="btn me-md-2 menu-button btnPlaceOrder">
//             {' '}
//             <FontAwesomeIcon icon={faFileText} size="2x" className="mb-1" />
//             <br />
//             Hold Rec
//           </CButton>
//           <CButton color="" className="btn me-md-2 menu-button btnPlaceOrder">
//             {' '}
//             <FontAwesomeIcon icon={faPaperPlane} size="2x" className="mb-1 btn-submit" />
//             <br />
//             Submit+Print
//           </CButton>
//           <CButton color="" className="btn me-md-2 menu-button btnPlaceOrder">
//             {' '}
//             <FontAwesomeIcon icon={faPlus} size="2x" className="mb-1 btn-new-bill" />
//             <br />
//             New Bill
//           </CButton>
//           <CButton color="" className="btn me-md-2 menu-button btnPlaceOrder">
//             <FontAwesomeIcon icon={faTrash} size="2x" className="mb-1 btn-trash" />
//             <br />
//             Delete
//           </CButton>
//           <CButton color="" className="btn me-md-2 menu-button btnPlaceOrder" onClick={submit}>
//             <FontAwesomeIcon icon={faPaperPlane} size="2x" className="mb-1 btn-submit" />
//             <br />
//             Submit
//           </CButton>
//           <CButton color="" className="btn me-md-2 menu-button btnPlaceOrder">
//             <FontAwesomeIcon icon={faBan} size="2x" className="mb-1" />
//             <br className="mb-1" />
//             Cancel
//           </CButton>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PlaceOrder;

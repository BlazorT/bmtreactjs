// /* eslint-disable no-debugger */
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import './paymentAdd.css';
// /*import { DataGrid} from "@mui/x-data-grid"*/
// import { Box } from '@mui/material';
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
// import moment from 'moment';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import DataGrid from 'react-data-grid';
// //import { useNavigate } from 'react-router-dom';
// const paymentAdd = () => {
//   const [selectedCredit_Debit, setSelectedCredit_Debit] = useState('1');
//   const [selectedAgentsType, setSelectedAgentsType] = useState('1');
//   const [rows, setRows] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [disabledTrue, setDisabledTrue] = useState(true);
//   const [total, settotal] = useState({
//     itemNo: 0,
//     totalquantity: 0,
//     totalamount: 0,
//     totalnetdiscount: 0,
//     tax: '',
//     totalpercdiscount: 0,
//     expense: '',
//   });
//   const [paymentCode, setPaymentCode] = useState('');
//   const [randomIdForEdit, setRandomIdForEdit] = useState('');
//   const [editRowId, setEditRowId] = useState('');
//   const [editPaymentCode, setEditPaymentCode] = useState('');
//   const [editRandomId, setEditRandomId] = useState('');
//   const [customerDetail, setCustomerDetail] = useState('');
//   const [businessAgentIdEdit, setBusinessAgentIdEdit] = useState('');
//   const [isSearchable, setIsSearchable] = useState(true);
//   const [isClearable, setIsClearable] = useState(true);
//   const navigate = useNavigate();
//   //const [addPayment, setAddPayment] = useState({ amount: '', doc_Checque: '', remarks: '' });
//   //alert('new ',selectedCredit_Debit);
//   const [addPayment, setAddPayment] = useState({
//     amount: '',
//     //statusid: '',
//     //selectedStatus: '',
//     randomIdEdit: '',
//     doc_Checque: '',
//     remarks: '',
//     //methodname: 'Cash',
//     //methodid: 1,
//     //statusName: selectedStatus.label,
//     //statusId: selectedStatus.value,
//     statusName: 'Active',
//     statusId: 1,
//     //setSelectedStatus(1),
//     paymentDateTime: new Date().toISOString().substr(0, 10),
//     bounceTime: new Date().toISOString().substr(0, 10),
//     creditTime: new Date().toISOString().substr(0, 10),
//   });
//   const customerRef = useRef(null);
//   const [status, setStatus] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState([]);
//   const [paymentMethod, setPaymentMethod] = useState([]);
//   const [selectedMethod, setSelectedMethod] = useState([]);

//   const [storeCustomer, setStoreCustomer] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   // const isSearchable = true; // Set to true if you want a search input
//   // const isClearable = true;
//   const [selectedCustomer, setSelectedCustomer] = useState([]);
//   const paymentMethodcol = [
//     {
//       id: 1,
//       name: 'Cash',
//     },
//     {
//       id: 2,
//       name: 'Credit Card',
//     },
//     {
//       id: 3,
//       name: 'Jazz Cash',
//     },
//     {
//       id: 4,
//       name: 'eTransection',
//     },
//   ];
//   const statusJson = [
//     {
//       id: 1,
//       name: 'Active',
//     },
//     {
//       id: 2,
//       name: 'Inactive',
//     },
//     {
//       id: 3,
//       name: 'Delete',
//     },
//   ];
//   useEffect(() => {
//     const AddEditClick = JSON.parse(localStorage.getItem('checkEdit_add'));
//     if (AddEditClick == 1) {
//       generateRandomId();
//       EditDataAsync();
//     } else {
//       localStorage.removeItem('paymentDataAsync');
//       GeneratePaymentCode();
//     }
//   }, []);
//   React.useEffect(() => {
//     var id = getstoreid();

//     fetchData();
//     generateRandomId();
//     getcustomer();
//     calculateTotalValues();
//     //localStorage.setItem('checkEdit_add', JSON.stringify(0));
//     //alert('AddEditClick ' + JSON.stringify(AddEditClick));
//   }, [rows]);
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
//   /*  *********** EditDataAsync end point ************ */
//   const EditDataAsync = async () => {
//     const storedItems = JSON.parse(localStorage.getItem('paymentDataAsync'));
//     //setRows(storedItems);
//     //alert('Async ' + JSON.stringify(storedItems));
//     //console.log(JSON.stringify(storedItems));
//     setPaymentCode(storedItems[0].invoicecode);
//     var SelectCustomerId = storedItems[0].businessAgentId;
//     var SelectCustomername = storedItems[0].customername;
//     var selectdCustomer = { value: SelectCustomerId, label: SelectCustomername };
//     handleCustomer(selectdCustomer);
//     setBusinessAgentIdEdit(SelectCustomerId);
//     var CustomerId = storedItems[0].businessAgentId;
//     getcustomerDetail(CustomerId);
//     const EditDataJson = storedItems.map((item) => ({
//       //id: rows.length,
//       id: item.paymentId,
//       paymentId: item.paymentId,
//       paymentCode: item.documentcode,
//       invoicecode: item.invoicecode,
//       amount: item.amount,
//       documents: item.documentcode,
//       paymentMethodName: item.paymentmode,
//       paymentMethod: item.paymentmode == 'Cash' ? 1 : 2,
//       paymentTypeName: item.paymentmode.transactiontype != 1 ? 'Db' : 'Cr',
//       paymentType: item.transactiontype,
//       //paymentStatusName: item.statusName,
//       //paymentStatusId: item.status,
//       remarks: item.remarks,
//       paymentCreditDateTime: item.credittime, //moment(item.credittime).format('MM/DD/YYYY'),
//       paymentBounceDateTime: item.bouncetime, //moment(item.bouncetime).format('MM/DD/YYYY'),
//       paymentDate: item.transactiontime,
//       //paymentDate: moment(item.transactiontime).format('MM/DD/YYYY H:mm:ss'),
//       //paymentDate: moment(item.transactiontime).format('MM/DD/YYYY'),
//       customerid: item.businessagentId,
//       customername: item.customername,
//       paymentStatusName: item.status == 1 ? 'Active' : 'InActive',
//       paymentStatusId: item.status,
//       randomId: '208' + item.paymentId,

//       //randomId: randomIdForEdit,
//       // paymentTypeName: (selectedCredit_Debit != 1 ? 'Debit' : 'Credit'),
//       // paymentType: selectedCredit_Debit,
//       // storeid: getstoreid,
//     }));
//     setRows(EditDataJson);
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
//       //alert(JSON.stringify(data))
//       /* console.log(jsonData.data)*/
//       // setStoreLOVs(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   /*  *********GetData Customer From APi************ */ //setstoreProduct

//   const getcustomer = async () => {
//     var id = getstoreid();
//     const filterData = {
//       storeid: String(id),
//       status: 1,
//     };
//     try {
//       const response = await fetch('/BlazorApi/storecustomers', {
//         method: 'POST',
//         headers: {
//           Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(filterData),
//       });
//       const jsonData = await response.json();

//       const data = jsonData.data;
//       /*  console.log(jsonData.data)*/
//       //alert(JSON.stringify(statusJson));
//       if (data.length !== 0) {
//         setStoreCustomer(data);
//         setPaymentMethod(paymentMethodcol);
//         setStatus(statusJson);
//         //selectedStatus == '' ? 1 : selectedStatus
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   /*****************Seachable Customer function***************/
//   const handleCustomer = (selectedCustomer) => {
//     // alert('selectedCustomer '+ JSON.stringify(selectedCustomer.value));
//     if (selectedCustomer != null) {
//       setAddPayment((prevFormData) => ({
//         ...prevFormData,
//         customername: selectedCustomer.label,
//         customerid: selectedCustomer.value,
//       }));
//       setSelectedCustomer(selectedCustomer);
//     } else {
//       setSelectedCustomer(selectedCustomer);
//       setAddPayment((prevFormData) => ({
//         ...prevFormData,
//         customername: '',
//         customerid: '',
//       }));
//     }
//     var CustomerId = selectedCustomer.value;
//     getcustomerDetail(CustomerId);
//   };
//   /*  *********GetData Customer From APi************ */ //setstoreProduct
//   const getcustomerDetail = async (CustomerId) => {
//     debugger;
//     var id = getstoreid();
//     var userId = 1;
//     const filterData = {
//       storeid: String(id),
//       createdBy: userId,
//       id: CustomerId,
//       businessAgentId: CustomerId,
//       status: 1,
//     };
//     try {
//       const response = await fetch('/BlazorApi/businessagentbalance', {
//         method: 'POST',
//         headers: {
//           Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(filterData),
//       });
//       const jsonData = await response.json();
//       const data = jsonData.data;
//       if (data.length !== 0) {
//         setCustomerDetail(data);
//         //alert(JSON.stringify(jsonData.data));
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   /*****************Seachable Customer function***************/
//   const handlePaymentMethod = (selectedMethod) => {
//     if (selectedMethod != null) {
//       setAddPayment((prevFormData) => ({
//         ...prevFormData,
//         methodname: selectedMethod.label,
//         methodid: selectedMethod.value,
//       }));
//       setSelectedMethod(selectedMethod);
//     } else {
//       setSelectedMethod(selectedMethod);
//       setAddPayment((prevFormData) => ({
//         ...prevFormData,
//       }));
//     }
//   };
//   /*****************Seachable Customer function***************/
//   const handleStatus = (selectedStatus) => {
//     if (selectedStatus != null) {
//       setAddPayment((prevFormData) => ({
//         ...prevFormData,
//         statusName: selectedStatus.label,
//         statusId: selectedStatus.value,
//       }));
//       setSelectedStatus(selectedStatus);
//     } else {
//       setSelectedStatus(selectedStatus);
//       setAddPayment((prevFormData) => ({
//         ...prevFormData,
//       }));
//     }
//   };
//   const GeneratePaymentCode = async () => {
//     const invoiceNumbernew = paymentCode;
//     if (invoiceNumbernew == '') {
//       const length = 4; // Length of the random part of the invoice number
//       const prefix = '12019000'; // Desired prefix for the invoice number
//       const randomPart = generateRandomPart(length);
//       const invoiceNumber = prefix + randomPart;
//       //alert('new fetch ' + invoiceNumber);
//       setPaymentCode(invoiceNumber);
//     } else {
//       //alert('new fetch ');
//     }
//   };
//   function generateRandomPart(length) {
//     let randomPart = '';
//     for (let i = 0; i < length; i++) {
//       // Generate a random digit between 0 and 9
//       randomPart += Math.floor(Math.random() * 10).toString();
//     }
//     return randomPart;
//   }
//   function generateRandomId(length = 8) {
//     const randomIdForEditNew = randomIdForEdit;
//     // if (randomIdForEditNew == '') {
//     const characters = '0123456789';
//     let randomId = '';
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       randomId += characters.charAt(randomIndex);
//     }
//     // alert('if ');
//     setRandomIdForEdit(randomId);
//     // }
//     //else {
//     //setRandomIdForEdit('546766666');
//     // setRandomIdForEdit('');
//     // alert('else ');
//     //}
//   }
//   /*  *********** Submit  Functions ************ */
//   const submitData = async () => {
//     setIsLoading(true);
//     //alert('rows ' + JSON.stringify(rows));
//     if (rows.length === 0) {
//       toast.error('Please Select atleast one payment....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       setIsLoading(false);
//       return;
//     } else {
//       var id = getstoreid();
//       const SubmitData = rows.map((item) => ({
//         paymentId: item.paymentId == '' || item.paymentId == null ? 0 : item.paymentId,
//         documentcode: item.documents,
//         invoicecode: item.invoicecode,
//         //invoicecode: item.paymentCode,
//         amount: item.amount,
//         paymentmethodid: item.paymentMethod,
//         transactiontype: item.paymentType,
//         paymentmode: item.paymentType.toString(),
//         //agentType: item.agentType,
//         status: item.paymentStatusId,
//         remarks: item.remarks,
//         transactiontime: item.paymentDate,
//         credittime: item.paymentCreditDateTime,
//         //credittime: item.paymentCreditDateTime,
//         //bouncetime: item.paymentBounceDateTime,
//         bouncetime: item.paymentBounceDateTime, //moment(item.paymentBounceDateTime).format('MM/DD/YYYY'),
//         businessAgentId:
//           item.customerid == '' || item.customerid == null ? businessAgentIdEdit : item.customerid,
//         storeid: id,
//         createdby: (item.customerid == '' || item.customerid == null
//           ? businessAgentIdEdit
//           : item.customerid
//         ).toString(),
//         operatedby: (item.customerid == '' || item.customerid == null
//           ? businessAgentIdEdit
//           : item.customerid
//         ).toString(),
//         customername: item.customername,
//         //transactiontime: Date(item.transactiontime),
//       }));
//       //alert('final submit data '+JSON.stringify(SubmitData));

//       try {
//         const response = await fetch('/BlazorApi/payment', {
//           method: 'POST',
//           headers: {
//             Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(SubmitData),
//         });
//         const jsonData = await response.json();
//         if (jsonData.status == 'true' || jsonData.errorCode == '0') {
//           toast.success('Payment has been submitted successfully....!', {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//           });
//           if (jsonData.status == 'true' || jsonData.errorCode == '0') {
//             ClearAll();
//             setPaymentCode('');
//             GeneratePaymentCode;
//             setIsLoading(false);
//             navigate('/payment-Detail');
//           }
//         } else {
//           toast.success(jsonData, {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//           });
//           setIsLoading(false);
//         }
//       } catch (error) {
//         setIsLoading(false);
//         console.error('Error fetching data:', error);
//       }
//     }
//   };
//   const handleDateChange = (event) => {
//     const { name, value } = event.target;
//     setAddPayment((prevDate) => ({
//       // setDates((prevDate) => ({
//       ...prevDate,
//       [name]: value,
//     }));
//   };

//   const ClearAll = () => {
//     //setGroup({
//     //tUnit: null,
//     //Pgroup: null,
//     //gproduct: null,
//     // });
//     // setRows([]);
//     // setUnitOption([]);
//     //setbarcode('');
//     //setdiscount({ netDiscount: '', percDiscount: '' });
//     //setdueAmount('');
//     // setGrandTotal('');
//     // setchange('');
//     //setcash({ cash: '', payingamount: '' });
//     //settotal({ itemNo: 0, totalquantity: 0, totalamount: 0, totalnetdiscount: 0, tax: '', totalpercdiscount: 0, expense: '' });
//     //setAddPayment({
//     //productGroup: '',
//     // product: '',
//     // tradeUnit: '',
//     // qty: '',
//     // sRate: '',
//     //disc: '',
//     //discPercentage: '',
//     //Stock: '0',
//     //productdetailid: '',
//     //productcategory: '',
//     //productid: '',
//     // categoryid: '',
//     // barcode: '',
//     // sku: '',
//     // batchnumber: '',
//     // unitid: ''
//     // });
//   };
//   /*  *********** OnChange Call Functions ************ */
//   const handleAddPayment = (event) => {
//     const { name, value } = event.target;
//     setAddPayment((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   /*  *********** Add Button onclick function ************ */
//   const handleAddData = () => {
//     //alert(JSON.stringify(addPayment));
//     if (addPayment.customerid === '' || addPayment.customername === '') {
//       toast.error('Please Select Customer..!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       //productRef.current.focus();
//       return;
//     } else if (addPayment.methodname === '') {
//       toast.error('Please Enter Payment Method....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       //qtyRef.current.focus();
//       return;
//     } else if (addPayment.amount === '' || addPayment.amount === '0') {
//       toast.error('Please Enter Payment Amount....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       //qtyRef.current.focus();
//       return;
//     } else if (addPayment.doc_Checque === '' || addPayment.doc_Checque === '0') {
//       if (addPayment.methodname != 'Cash') {
//         toast.error('Please Enter Doc Checque....!', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//         return;
//       }
//     } else if (addPayment.remarks === '' || addPayment.remarks === '0') {
//       toast.error('Please Enter Doc Remarks....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       //sRateRef.current.focus();
//       return;
//     }
//     //checkdiscount = (addPayment.qty * addPayment.sRate) - addPayment.disc;
//     //showDiscount = addPayment.disc;
//     const newRow = {
//       id: rows.length,
//       paymentCode: paymentCode,
//       invoicecode: paymentCode,
//       amount: addPayment.amount,
//       documents: addPayment.doc_Checque,
//       paymentMethodName: addPayment.methodname,
//       paymentMethod: addPayment.methodid,
//       paymentTypeName: selectedCredit_Debit != 1 ? 'Db' : 'Cr',
//       paymentType: selectedCredit_Debit,
//       paymentStatusName: addPayment.statusName,
//       paymentStatusId: addPayment.statusId,
//       paymentDate: moment(addPayment.transactiontime).format('YYYY-MM-DDTHH:mm:ss'),
//       //paymentDate: moment(addPayment.transactiontime).format('YYYY-MM-DDTHH:mm:ss'),
//       remarks: addPayment.remarks,
//       paymentCreditDateTime: addPayment.creditTime, //moment(addPayment.creditTime).format('MM/DD/YYYY'),
//       paymentBounceDateTime: addPayment.bounceTime, //moment(addPayment.bounceTime).format('MM/DD/YYYY'),
//       customerid: addPayment.customerid,
//       customername: addPayment.customername,
//       storeid: getstoreid,
//       randomId: randomIdForEdit,
//     };
//     if (editRowId == '1') {
//       //alert('randomIdForEdit ' + randomIdForEdit);
//       //alert('editRowId ' + editRowId);
//       //var filteredRows = rows.filter((row) => row.Invoice !== randomIdForEdit);
//       var filteredRows = rows.filter((item) => item.randomId !== editRandomId);
//       //alert('filteredRows after ' + JSON.stringify(filteredRows));
//       var empty = '';
//       setRows(filteredRows);
//       //alert('rows after clean ' + JSON.stringify(rows));
//       setRows((prevRows) => [...prevRows, newRow]);
//     } else {
//       setRows((prevRows) => [...prevRows, newRow]);
//       //alert('else ' + JSON.stringify(rows));
//     }
//     setEditRowId('0');

//     setAddPayment({
//       amount: '',
//       randomIdEdit: '',
//       doc_Checque: '',
//       remarks: '',
//       //selectedStatus: '',
//       // statusName: selectedStatus.label,
//       customername: selectedCustomer.label,
//       customerid: selectedCustomer.value,
//       methodname: selectedMethod.label,
//       methodid: selectedMethod.value,
//       statusId: selectedStatus.value,
//       paymentDateTime: new Date().toISOString().substr(0, 10),
//       bounceTime: new Date().toISOString().substr(0, 10),
//       creditTime: new Date().toISOString().substr(0, 10),
//     });
//   };
//   /*  *********** Grid Columns ************ */
//   const columns = [
//     {
//       key: 'amount',
//       name: 'Amount',
//       sortable: true,
//       width: 170,
//       renderSummaryCell() {
//         return <strong>Total Item : {total.itemNo}</strong>;
//       },
//     },
//     { key: 'documents', name: 'Doc | Cheque #', align: 'center', width: 170 },
//     { key: 'randomId', name: 'Random Id', align: 'center' },
//     {
//       key: 'paymentMethodName',
//       name: 'Payment Method',
//       align: 'center',
//     },
//     {
//       key: 'paymentTypeName',
//       name: 'Payment Type',
//       align: 'center',
//     },
//     {
//       key: 'paymentDate',
//       name: 'Payment Date',
//       align: 'center',
//     },
//     {
//       key: 'remarks',
//       name: 'Remarks',
//       align: 'center',
//       width: 400,
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
//     //setGrandTotal(amountSum);
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
//   const handleAgentsType = (event) => {
//     setSelectedAgentsType(event.target.value);
//   };
//   const handleOptionCreditDebit = (event) => {
//     //alert('handleOptionCreditDebit ' + (JSON.stringify(event.target.value)));
//     setSelectedCredit_Debit(event.target.value);
//   };
//   /*****************Modal Window functions***************/
//   const handleCellClick = (args) => {
//     setEditPaymentCode(args.row.paymentCode);
//     setEditRandomId(args.row.randomId);
//   };
//   const EditData = () => {
//     if (rows == '' || rows == null) {
//       toast.error('please select atleast one record for edit....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//     } else {
//       // alert('editPaymentCode '+editPaymentCode);
//       // alert('rows ' + (JSON.stringify(rows)));
//       var EditRow = rows.filter((item) => item.paymentCode === editPaymentCode);
//       //var EditRowxx = rows.filter((item) => item.randomId !== editRandomId);

//       var EditData = EditRow[0];
//       var selectedMethodId = EditData.paymentMethod;
//       var selectedMethodName = EditData.paymentMethodName;
//       var selectedMethod = { value: selectedMethodId, label: selectedMethodName };
//       handlePaymentMethod(selectedMethod);
//       var selectedPaymentId = EditData.paymentStatusId;
//       var selectedPaymentName = EditData.paymentStatusName;

//       var selectedStatus = { value: selectedPaymentId, label: selectedPaymentName };
//       handleStatus(selectedStatus);
//       //var selectCreditDebit = EditData.paymentType;
//       //var selectCreditDebitqq = String(selectCreditDebit);
//       //alert(selectCreditDebitqq);
//       //handleOptionCreditDebit(selectCreditDebitqq);
//       // handleOptionCreditDebit(EditData.paymentType);
//       //selectedCredit_Debit: EditData.paymentType,
//       //const handleOptionCreditDebit = (event) => {
//       //setSelectedCredit_Debit(event.target.value);
//       // };
//       setAddPayment({
//         amount: EditData.amount,
//         methodid: EditData.paymentMethod,
//         paymentDateTime: moment(EditData.paymentDate).format('YYYY-MM-DD'),
//         creditTime: moment(EditData.paymentCreditDateTime).format('YYYY-MM-DD'),
//         bounceTime: moment(EditData.paymentBounceDateTime).format('YYYY-MM-DD'),
//         doc_Checque: EditData.documents,
//         paymentCode: EditData.paymentCode,
//         remarks: EditData.remarks,
//         randomIdForEdit: EditData.randomId,
//       });
//       setRandomIdForEdit(EditData.randomId);
//       setEditRowId('1');
//     }
//   };
//   const DeleteRowData = () => {
//     if (rows != '') {
//       // alert('editRandomId ', editRandomId);
//       //alert('randomId ', rows);
//       var DeleteRow = rows.filter((item) => item.randomId !== editRandomId);
//       setRows(DeleteRow);
//       console.log(rows);
//     } else {
//       toast.error('please select atleast one record for delete....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//     }
//   };
//   return (
//     <>
//       {isLoading && (
//         <div className="loading-overlay">
//           <Loading />
//         </div>
//       )}
//       <ToastContainer />
//       <div className="row">
//         <div className="mb-2">
//           <div className="row pt-2">
//             <div className="col-lg-6 col-md-6 col-padding rowLeftPadding">
//               <label className="col-lg-4 col-md-4 lblRdio col-padding lbl_Default">
//                 <input
//                   className="txtRadio form-check-input"
//                   type="radio"
//                   name="AgentsType"
//                   value="1"
//                   checked={selectedAgentsType === '1'}
//                   onChange={handleAgentsType}
//                 />
//                 Party
//               </label>
//               <label className="col-lg-4 col-md-4 lblRdio col-padding lbl_Default">
//                 <input
//                   className="txtRadio form-check-input"
//                   type="radio"
//                   name="AgentsType"
//                   value="2"
//                   disabled
//                   checked={selectedAgentsType === '2'}
//                   onChange={handleAgentsType}
//                 />
//                 Purchase
//               </label>
//               <label className="col-lg-4 col-md-4 lblRdio col-padding lbl_Default">
//                 <input
//                   className="txtRadio form-check-input"
//                   type="radio"
//                   name="AgentsType"
//                   value="3"
//                   disabled
//                   checked={selectedAgentsType === '3'}
//                   onChange={handleAgentsType}
//                 />
//                 Sale
//               </label>
//             </div>
//             <div className="col-lg-1 col-md-1 col-padding ">
//               <label className="lbl_Default ">Beneficiary </label>
//             </div>
//             <div disabled={disabledTrue} className="col-lg-3 col-md-3 col-padding pl-2">
//               <div disabled={disabledTrue} className="form-group">
//                 <Select
//                   ref={customerRef}
//                   disabled={disabledTrue}
//                   className="basic-single"
//                   isSearchable={isSearchable}
//                   isClearable={isClearable}
//                   value={selectedCustomer}
//                   onChange={handleCustomer}
//                   options={storeCustomer.map((item) => ({
//                     value: item.id,
//                     label: item.username,
//                   }))}
//                 />
//               </div>
//             </div>
//             <div className="col-lg-2 col-md-2 d-flex col-padding">
//               <div className="form-group md-width">
//                 <input
//                   type="number"
//                   className="set-input-width-disc txt_Default txtAgentBalance text-center"
//                   disabled
//                   value={customerDetail.balance}
//                   placeholder="0"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="row pt-3">
//             <div className="col-lg-6 col-md-4 rowRightView">
//               <div className="row pt-1">
//                 <div className="col-lg-3 col-md-4 col-padding">
//                   <label className="lbl_Default">Payment Code </label>
//                 </div>
//                 <div className="col-lg-4 col-md-4 col-padding">
//                   <div className="form-group md-width">
//                     <input
//                       type="number"
//                       className="txt_Default set-input-width-disc txtAgentBalance text-center"
//                       name="paymentCode"
//                       value={paymentCode}
//                       //onChange={handleAddPayment}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="row pt-2">
//                 <div className="col-lg-3 col-md-4 col-padding">
//                   <label className="lbl_Default">Payment Method </label>
//                 </div>
//                 <div className="col-lg-4 col-md-4 col-padding">
//                   <div className="form-group">
//                     <Select
//                       ref={customerRef}
//                       className="basic-single"
//                       isSearchable={isSearchable}
//                       isClearable={isClearable}
//                       value={selectedMethod}
//                       onChange={handlePaymentMethod}
//                       options={paymentMethod.map((item) => ({
//                         value: item.id,
//                         label: item.name,
//                       }))}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="row pt-2">
//                 <div className="col-lg-3 col-md-4 col-padding">
//                   <label className="lbl_Default">Amount </label>
//                 </div>
//                 <div className="col-lg-4 col-md-4 col-padding">
//                   <div className="form-group md-width">
//                     <input
//                       type="number"
//                       className="txt_Default set-input-width-disc txtAgentBalance text-center"
//                       name="amount"
//                       value={addPayment.amount}
//                       onChange={handleAddPayment}
//                       placeholder="0"
//                       onKeyDown={(evt) =>
//                         ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
//                       }
//                       min={0}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="row pt-2">
//                 <div className="col-lg-3 col-md-4 col-padding">
//                   <label className="lbl_Default">Doc | Cheque </label>
//                 </div>
//                 <div className="col-lg-4 col-md-4 col-padding">
//                   <div className="form-group md-width">
//                     <input
//                       type="text"
//                       className="txt_Default set-input-width-disc txtAgentBalance text-center"
//                       name="doc_Checque"
//                       value={addPayment.doc_Checque}
//                       onChange={handleAddPayment}
//                       placeholder="Doc | Cheque"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="row pt-2">
//                 <div className="col-lg-3 col-md-4 col-padding">
//                   <label className="lbl_Default">Payment Date </label>
//                 </div>
//                 <div className="col-lg-4 col-md-4 col-padding">
//                   <div className="form-group">
//                     <input
//                       type="date"
//                       className="form-control txt_Default"
//                       name="paymentDateTime"
//                       value={addPayment.paymentDateTime}
//                       onChange={handleDateChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="row pt-2">
//                 <div className="col-lg-3 col-md-4 col-padding">
//                   <label className="lbl_Default">Status </label>
//                 </div>
//                 <div className="col-lg-4 col-md-4 col-padding">
//                   <div className="form-group">
//                     <Select
//                       className="basic-single"
//                       //isSearchable={isSearchable}
//                       //isClearable={isClearable}
//                       value={selectedStatus}
//                       onChange={handleStatus}
//                       options={status.map((item) => ({
//                         value: item.id,
//                         label: item.name,
//                       }))}
//                       // defaultValue={{ label: "Active", value: 1 }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-lg-6 col-md-6 rowLeftView">
//               <div className="row pt-1">
//                 <label className="col-lg-6 col-md-4 lblRdio col-padding lbl_Default">
//                   <input
//                     className="txtRadio form-check-input"
//                     type="radio"
//                     name="credit_Debit"
//                     value="2"
//                     checked={selectedCredit_Debit === '2'}
//                     onChange={handleOptionCreditDebit}
//                   />
//                   Payment | Debit | ادائیگی
//                 </label>
//                 <label className="col-lg-6 col-md-4 lblRdio col-padding lbl_Default">
//                   <input
//                     className="txtRadio form-check-input"
//                     type="radio"
//                     name="credit_Debit"
//                     value="1"
//                     checked={selectedCredit_Debit === '1'}
//                     onChange={handleOptionCreditDebit}
//                   />
//                   Receiving | Credit | وصولی
//                 </label>
//               </div>
//               <div className="row pt-1">
//                 <div className="col-lg-3 col-md-3 d-flex col-padding"></div>
//                 <div className="col-lg-8 col-md-8 col-padding">
//                   <label className="">Address </label>
//                 </div>
//               </div>
//               <div className="row pt-1">
//                 <div className="col-lg-3 col-md-3 d-flex col-padding">
//                   <img
//                     className="set-input-width-disc txtAgentBalance text-center imgsize"
//                     name="image"
//                     src="https://www.w3schools.com/w3images/lights.jpg"
//                   />
//                 </div>
//                 <div className="col-lg-8 col-md-8 col-padding">
//                   <div className="form-group md-width">
//                     <p className="AdrresControlStyl">
//                       {customerDetail.address} {customerDetail.email}{' '}
//                       {customerDetail.primarycontact}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="row pt-2">
//                 <div className="col-lg-3 col-md-3 col-padding">
//                   <label className="lbl_Default">Credit Date </label>
//                 </div>
//                 <div className="col-lg-8 col-md-8 col-padding">
//                   <div className="form-group md-width">
//                     <input
//                       type="date"
//                       className="form-control txt_Default"
//                       name="creditTime"
//                       value={addPayment.creditTime}
//                       onChange={handleDateChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="row pt-2">
//                 <div className="col-lg-3 col-md-3 col-padding">
//                   <label className="lbl_Default">Bounce Date </label>
//                 </div>
//                 <div className="col-lg-8 col-md-8 col-padding">
//                   <div className="form-group md-width">
//                     <input
//                       type="date"
//                       className="form-control txt_Default"
//                       name="bounceTime"
//                       value={addPayment.bounceTime}
//                       onChange={handleDateChange}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="row pt-2 col-padding RemarksView">
//               <div className="col-lg-1 col-md-4 col-padding">
//                 <label className="lbl_Default">Remarks </label>
//               </div>
//               <div className="col-lg-11 ">
//                 <div className="form-group">
//                   <input
//                     type="textarea "
//                     rows={2}
//                     cols={150}
//                     className="set-input-width-disc txt_Default txtRemarkse"
//                     name="remarks"
//                     value={addPayment.remarks}
//                     onChange={handleAddPayment}
//                     placeholder="remarks"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="row sales-text-style text-right pt-2">
//               <div>
//                 <button type="button" disabled className="btn_Default m-2 sales-btn-style minWidth">
//                   Customers (+)
//                 </button>
//                 <button type="button" disabled className="btn_Default sales-btn-style m-2 minWidth">
//                   Payment Documents
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleAddData}
//                   className="btn_Default sales-btn-style m-2 minWidth"
//                 >
//                   Add in Grid
//                 </button>
//               </div>
//             </div>
//             <div className="row pt-2">
//               <div className="col-md-12 col-xl-12">
//                 <Box>
//                   <DataGrid
//                     responsive
//                     id="dgPlaceOrder"
//                     columns={columns}
//                     rows={rows}
//                     bottomSummaryRows={summaryRows}
//                     onCellClick={handleCellClick}
//                     sx={{ overflowX: 'scroll' }}
//                   />
//                 </Box>
//               </div>
//             </div>

//             <div className="row sales-text-style text-right">
//               <div>
//                 <NavLink to="/payment-Detail" activeclassname="active-link">
//                   <button type="button" className="btn_Default m-2 sales-btn-style">
//                     Cancel
//                   </button>
//                 </NavLink>
//                 <button
//                   type="button"
//                   onClick={DeleteRowData}
//                   className="btn_Default sales-btn-style m-2"
//                 >
//                   Delete
//                 </button>
//                 <button
//                   type="button"
//                   onClick={EditData}
//                   className="btn_Default sales-btn-style m-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   type="button"
//                   onClick={submitData}
//                   className="btn_Default sales-btn-style m-2"
//                 >
//                   Submit
//                 </button>
//                 <button type="button" disabled className="btn_Default sales-btn-style m-2">
//                   Approve
//                 </button>
//                 <button type="button" disabled className="btn_Default sales-btn-style m-2">
//                   Rejected
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default paymentAdd;

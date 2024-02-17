// /* eslint-disable no-debugger */

// import React, { useState, useRef, useMemo } from 'react';
// import './Grid.css';
// import './PaymentModal.css';
// import 'react-data-grid/lib/styles.css';
// import DataGrid from 'react-data-grid';
// import Select from 'react-select';
// import moment from 'moment';
// import { NavLink, useNavigate } from 'react-router-dom';
// import _ from 'underscore';
// import Loading from '../../components/UI/Loading.js';
// import { Modal, ModalBody, ModalHeader } from 'reactstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import PrintInvoice from './PaymentPrintInvoice';
// //import PrintInvoice from './../../components/ModalWindow/PrintInvoice'
// import 'react-toastify/dist/ReactToastify.css';

// const paymentDetail = () => {
//   const [storepayments, setStorepayments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectDataRow, setSelectDataRow] = useState('');
//   const [timeout, setTimeout] = useState('');
//   const [singleInvoiceTotalAmount, setSingleInvoiceTotalAmount] = useState('');
//   const [OrderDetail, setOderDetail] = useState([]);
//   const [invoiceData, setInvoiceData] = useState({});
//   const [allinvoices, setallinvoices] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalOpenNew, setModalOpenNew] = useState(false);
//   const [filter, setfilter] = useState({
//     amount: '',
//     invoice: '',
//     documentsCode: '',
//     customername: '',
//     customerid: '',
//   });
//   const [invoicedetail, setinvoicedetail] = useState({
//     invno: '',
//     invtotal: '',
//     expence: '',
//     netdiscount: '',
//     tax: '',
//   });
//   const [filterrow, setfilterrow] = useState([]);
//   const navigate = useNavigate();
//   const [total, settotal] = useState({ totalinvoices: 0, totalitems: 0, totalamount: 0 });
//   const [totalCredit_Debit, setTotalCredit_Debit] = useState({
//     totalCreditAmount: 0,
//     totalDebitAmount: 0,
//     differenceAmount: 0,
//   });
//   const currentDate = new Date();
//   // Set the date to the 1st day of the current month
//   currentDate.setDate(1);
//   // Format the date as "YYYY-MM-DD"
//   const startDateOfMonth = currentDate.toISOString().substr(0, 10);
//   const [dates, setDates] = useState({
//     FromDate: startDateOfMonth,
//     ToDate: new Date().toISOString().substr(0, 10),
//   });
//   const customerRef = useRef(null);
//   const [storeCustomer, setStoreCustomer] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const isSearchable = true; // Set to true if you want a search input
//   const isClearable = true;
//   const [selectedCustomer, setSelectedCustomer] = useState([]);
//   const [formdata, setformdata] = useState({
//     customername: '',
//     customerid: '',
//   });

//   React.useEffect(() => {
//     var id = getstoreid();
//     fetchData(id);
//     getcustomer();
//   }, []);
//   const divElem = document.querySelector('body > div');
//   React.useEffect(() => {
//     calculateTotalValues();
//   }, [storepayments]);

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
//   /*  *********GetData Customer From APi************ */
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
//       /* console.log(jsonData.data)*/
//       if (data.length !== 0) {
//         //alert(JSON.stringify(data));
//         setStoreCustomer(data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   /*  *********GetData search From APi************ */
//   const FilterFetchData = () => {
//     var storeid = getstoreid();
//     fetchData(storeid);
//   };
//   /*  *********GetData From APi************ */
//   const fetchData = async (storeid) => {
//     debugger;
//     setIsLoading(true);
//     const data = {
//       storeid: storeid,
//       amount: filter.amount == '' ? 0 : filter.amount,
//       paymentId: 0,
//       invoicecode: filter.invoice,
//       documentcode: filter.documentsCode,
//       customername: filter.customername,
//       // BusinessAgentId: filter.customerid,
//       createAt: dates.FromDate,
//       lastUpdatedAt: dates.ToDate,
//       status: 1,
//     };
//     //alert(JSON.stringify(data));
//     setStorepayments([]);
//     try {
//       const response = await fetch('/BlazorApi/storepayments', {
//         method: 'POST',
//         headers: {
//           Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       const jsonData = await response.json();
//       //console.log(jsonData);
//       if (jsonData.errorCode === '407') {
//         toast.error('Please wait 40 second for next request.!', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//       }
//       if (jsonData.data.length !== 0) {
//         //alert(JSON.stringify(jsonData.data))
//         console.log(JSON.stringify(jsonData.data));
//         //setallinvoices(jsonData.data);
//         setStorepayments(jsonData.data);
//         const uniqueInvoices = _.chain(jsonData.data)
//           .groupBy('saleinvoicecode')
//           .map((groupedRecords, invoiceNumber) => {
//             const { quantity, paidamount, username, saledate } = groupedRecords[0];
//             const totalItem = groupedRecords.length;
//             return { invoiceNumber, quantity, paidamount, username, saledate, totalItem };
//           })
//           .value();
//         setallinvoices(uniqueInvoices);
//       }
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   /*  ****************Grid Columns***************** */
//   const columns = [
//     {
//       key: 'Invoice',
//       name: 'Invoice No',
//       sortable: true,
//       renderSummaryCell() {
//         return <strong>Total Invocies : {total.totalinvoices}</strong>;
//       },
//     },
//     {
//       key: 'documentcode',
//       name: 'Documents Num',
//     },
//     {
//       key: 'amount',
//       name: 'Amount',
//     },
//     {
//       key: 'paymentmode',
//       name: 'Payment Mode',
//       align: 'center',
//     },
//     {
//       key: 'transactiontypename',
//       name: 'Transection',
//       align: 'center',
//     },
//     {
//       key: 'Customer',
//       name: 'Customer',
//       align: 'center',
//     },
//     {
//       key: 'Generatedby',
//       name: 'Operated By',
//     },
//     {
//       key: 'Datetime',
//       name: 'Payment Time',
//     },
//   ];

//   /* ***********Set Grid Rows***************/

//   var rows = storepayments.map((row, index) => ({
//     //id: index,
//     id: row.paymentId,
//     Invoice: row.invoicecode == 0 ? '--' : row.invoicecode,
//     documentcode: row.documentcode == 0 ? '--' : row.documentcode,
//     // paymentCode: row.invoicecode == 0 ? '000000' : row.invoicecode,
//     //Invoice: row.invoiceNumber.slice(-4),
//     transactiontypename: row.transactiontypename,
//     paymentmode: row.paymentmode,
//     amount: row.amount,
//     Customer: row.customername ? row.customername : 'Walk-in Customer',
//     Generatedby: row.operatedby,
//     Datetime: moment(row.transactiontime).format('MM/DD/YYYY H:mm:ss '),
//   }));

//   /*  **********Date Change function**************/

//   const handleDateChange = (event) => {
//     const { name, value } = event.target;
//     setDates((prevDate) => ({
//       ...prevDate,
//       [name]: value,
//     }));
//   };
//   /*****************Seachable Customer function***************/
//   const handleCustomer = (selectedCustomer) => {
//     if (selectedCustomer != null) {
//       setfilter((prevFormData) => ({
//         ...prevFormData,
//         customername: selectedCustomer.label,
//         customerid: selectedCustomer.value,
//       }));
//       setSelectedCustomer(selectedCustomer);
//     } else {
//       setSelectedCustomer(selectedCustomer);
//       setfilter((prevFormData) => ({
//         ...prevFormData,
//         customername: '',
//         customerid: '',
//       }));
//     }
//   };
//   /*****************DataGrid Summary Row***************/
//   const summaryRows = useMemo(() => {
//     return [
//       {
//         id: 'total_0',
//         totalCount: rows.length,
//       },
//     ];
//   }, [rows]);

//   /*****************Input field change function***************/
//   const handelchange = (event) => {
//     const { name, value } = event.target;
//     setfilter((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     var filteredRows = rows.filter((row) => row.invoice === value);
//     if (filteredRows.length !== 0) {
//       setfilter(filteredRows);
//     }
//     if (value === '') {
//       setfilter([]);
//     }
//   };
//   const handelamount = (event) => {
//     const { name, value } = event.target;
//     setfilter((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     var filteredamount = rows.filter((row) => row.Billamount >= Number(value));
//     if (filteredamount.length !== 0) {
//       setfilter(filteredamount);
//     }
//     if (value === '') {
//       setfilter([]);
//     }
//   };
//   const handelDocumentsCode = (event) => {
//     const { name, value } = event.target;
//     setfilter((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     var filteredocumentscode = rows.filter((row) => row.documentsCode >= Number(value));
//     if (filteredocumentscode.length !== 0) {
//       setfilter(filteredocumentscode);
//     }
//     if (value === '') {
//       setfilter([]);
//     }
//   };

//   /*****************Function to calculate total ***************/
//   const calculateTotalValues = () => {
//     const invoices = storepayments.reduce((count) => count + 1, 0);
//     var items = storepayments.reduce((sum, row) => sum + row.amount, 0);
//     const amount = storepayments.reduce((sum, row) => sum + Number(row.amount), 0);
//     settotal({ totalinvoices: invoices, totalamount: amount, totalitems: items });
//     var CreditData = storepayments.filter((item) => item.transactiontype === 1);
//     var DebitData = storepayments.filter((item) => item.transactiontype !== 1);
//     const CreditTotalAmount = CreditData.reduce((sum, row) => sum + Number(row.amount), 0);
//     const DebitTotalAmount = DebitData.reduce((sum, row) => sum + Number(row.amount), 0);
//     var DifferenceAmount = CreditTotalAmount - DebitTotalAmount;
//     setTotalCredit_Debit({
//       totalCreditAmount: CreditTotalAmount,
//       totalDebitAmount: DebitTotalAmount,
//       differenceAmount: DifferenceAmount,
//     });
//   };

//   /*****************Modal Window functions***************/
//   const handleCellClick = (args) => {
//     //alert(JSON.stringify(args.row.Invoice));
//     //alert(JSON.stringify(args.row));
//     var SelectInvoiceCode = args.row.Invoice;
//     //storepayments
//     var PaymentSelectedRow = storepayments.filter((item) => item.invoicecode === SelectInvoiceCode);

//     var CreditData = PaymentSelectedRow.filter((item) => item.transactiontype === 1);
//     var DebitData = PaymentSelectedRow.filter((item) => item.transactiontype !== 1);
//     const CreditTotalAmount = CreditData.reduce((sum, row) => sum + Number(row.amount), 0);
//     const DebitTotalAmount = DebitData.reduce((sum, row) => sum + Number(row.amount), 0);
//     var DifferenceAmount = CreditTotalAmount - DebitTotalAmount;

//     //alert(JSON.stringify(PaymentSelectedRow));
//     setOderDetail(PaymentSelectedRow);
//     //var TotalAmount = storepayments.filter((item) => item.amount !== 1);
//     //const TotalAmountshow = PaymentSelectedRow.reduce((sum, row) => sum + Number(row.amount), 0);
//     //alert(JSON.stringify(DifferenceAmount));
//     setSingleInvoiceTotalAmount(DifferenceAmount);
//     setSelectDataRow(args.row);
//   };
//   const EditDataClick = () => {
//     if (selectDataRow == '' || selectDataRow == null) {
//       toast.error('Please Select atleast one Item....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//     } else {
//       var CheckDocumentCode = selectDataRow.Invoice;
//       var filteredRows = storepayments.filter((item) => item.invoicecode === CheckDocumentCode);
//       //alert('filteredRows '+JSON.stringify(filteredRows));
//       localStorage.setItem('paymentDataAsync', JSON.stringify(filteredRows));
//       localStorage.setItem('checkEdit_add', JSON.stringify(1));
//       navigate('/add-payment');
//     }
//   };
//   const AddDataClick = () => {
//     localStorage.setItem('checkEdit_add', JSON.stringify(0));
//   };
//   const PrintDataClick = () => {
//     if (selectDataRow == '' || selectDataRow == null) {
//       toast.error('Please Select atleast one Item....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//     } else {
//       toggleModal();
//     }

//     //PrintScreen();
//   };
//   const toggleModal = () => {
//     setModalOpen(!modalOpen);
//     setModalOpenNew(modalOpenNew);
//   };
//   const PrintScreen = () => {
//     setModalOpenNew(true);
//     //setModalOpenNew(!modalOpenNew);
//   };
//   const openModal = () => {
//     // Set the data you want to pass to the modal
//     setInvoiceData(selectDataRow);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   /*  *********** Handel Resize observer ************ */
//   const resizeObserver = new ResizeObserver((entries) => {
//     for (let entry of entries) {
//       if (entry.target.handleResize) entry.target.handleResize(entry);
//     }
//   });
//   resizeObserver.observe(divElem);
//   return (
//     <>
//       {isLoading && (
//         <div className="loading-overlay">
//           <Loading />
//         </div>
//       )}
//       {modalOpen && (
//         <PrintInvoice
//           id="print-invoice"
//           isOpen={modalOpen}
//           toggle={closeModal}
//           data={OrderDetail}
//         />
//       )}
//       <ToastContainer />
//       <div className="row">
//         <div className="col-md-6 mb-2">
//           <div className="form-group">
//             <label className="lbl_Default" htmlFor="">
//               Invoice No
//             </label>
//             <br />
//             <input
//               type="number"
//               className="form-control txt_Default"
//               name="invoice"
//               id="invoice"
//               placeholder="Enter Invoice Number"
//               value={filter.invoice}
//               onChange={handelchange}
//               onKeyDown={(evt) =>
//                 ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()
//               }
//               min={0}
//             />
//           </div>
//         </div>
//         <div className="col-md-6 mb-2 form-group">
//           <label className="lbl_Default" htmlFor="">
//             Customer
//           </label>
//           <br />
//           <Select
//             ref={customerRef}
//             className="basic-single"
//             isSearchable={isSearchable}
//             isClearable={isClearable}
//             value={selectedCustomer}
//             onChange={handleCustomer}
//             options={storeCustomer.map((item) => ({
//               value: item.id,
//               label: item.username,
//             }))}
//           />
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-md-6 mb-2">
//           <div className="form-group">
//             <label className="lbl_Default" htmlFor="">
//               Documents No
//             </label>
//             <br />
//             <input
//               type="text"
//               className="form-control txt_Default"
//               name="documentsCode"
//               id="documentsCode"
//               placeholder="Enter Documents Code"
//               value={filter.documentsCode}
//               onChange={handelDocumentsCode}
//             />
//           </div>
//         </div>
//         <div className="col-md-6  mb-2">
//           <div className="form-group">
//             <label className="lbl_Default" htmlFor="">
//               Amount
//             </label>
//             <br />
//             <input
//               type="number"
//               className="form-control txt_Default"
//               name="amount"
//               id="amount"
//               placeholder="Greater than Equal (>=)"
//               value={filter.amount}
//               onChange={handelamount}
//               onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
//               min={0}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-md-6 mb-3">
//           <div className="form-group">
//             <label className="lbl_Default" htmlFor="">
//               Date (From)
//             </label>
//             <br />
//             <input
//               type="date"
//               className="form-control txt_Default"
//               name="FromDate"
//               value={dates.FromDate}
//               onChange={handleDateChange}
//             />
//           </div>
//         </div>
//         <div className="col-md-6 mb-3 d-flex">
//           <div className="form-group flex-grow-1">
//             <label className="lbl_Default" htmlFor="">
//               Date (To)
//             </label>
//             <br />
//             <input
//               type="date"
//               className="form-control txt_Default"
//               name="ToDate"
//               value={dates.ToDate}
//               onChange={handleDateChange}
//             />
//           </div>
//           <button type="button" className="btn_Default salesgrid-btn " onClick={FilterFetchData}>
//             Search
//           </button>
//         </div>
//       </div>
//       <div className="grid-div">
//         <DataGrid
//           className="saleGrid"
//           columns={columns}
//           rows={filterrow.length > 0 ? filterrow : rows}
//           bottomSummaryRows={summaryRows}
//           onCellClick={handleCellClick} // Set the cell click handler
//           rowKey="id"
//         />
//       </div>
//       <div className="row TotalPaymentView">
//         <div className="col-lg-4 TotalLabelValue">
//           <label className="TotalLabelTitle">Receiving (Cr) : </label>
//           <label className="TotalLabelTitleVal"> {totalCredit_Debit.totalCreditAmount} </label>{' '}
//         </div>
//         <div className="col-lg-4 TotalLabelValue">
//           <label className="TotalLabelTitle">Payments (Db) : </label>
//           <label className="TotalLabelTitleVal"> {totalCredit_Debit.totalDebitAmount} </label>{' '}
//         </div>
//         <div className="col-lg-4 TotalLabelValue">
//           <label className="TotalLabelTitle">Difference : </label>
//           <label className="TotalLabelTitleVal"> {totalCredit_Debit.differenceAmount} </label>{' '}
//         </div>
//       </div>
//       <div className="row sales-text-style">
//         <div>
//           <button type="button" className="btn_Default  m-2 sales-btn-style">
//             Cancel
//           </button>
//           <NavLink activeclassname="active-link">
//             <button
//               onClick={EditDataClick}
//               type="button"
//               className="btn_Default sales-btn-style m-2"
//             >
//               Edit
//             </button>
//           </NavLink>
//           <NavLink to="/add-payment" activeclassname="active-link">
//             <button
//               onClick={AddDataClick}
//               type="button"
//               className="btn_Default  sales-btn-style m-2"
//             >
//               Add+
//             </button>
//           </NavLink>
//           <button
//             type="button"
//             onClick={PrintDataClick}
//             className="btn_Default sales-btn-style m-2"
//           >
//             Print
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default paymentDetail;

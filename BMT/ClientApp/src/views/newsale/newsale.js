// /* eslint-disable no-debugger */
// /* eslint-disable prettier/prettier */
// import React, { useState, useRef } from 'react';

// import CIcon from '@coreui/icons-react';
// import { cilXCircle, cilX, cilMinus } from '@coreui/icons';
// import Loading from '../../components/UI/Loading.js';
// import 'react-data-grid/lib/styles.css';
// import Select from 'react-select';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import img from './cart2.png';
// import cart from './cart3.png';
// import { ImageList, ImageListItem, ImageListItemBar } from '@material-ui/core';
// import { isEmpty } from 'underscore';
// import PrintInvoice from './../../components/ModalWindow/PrintInvoice';
// const newsale = () => {
//   const isSearchable = true; // Set to true if you want a search input
//   const isClearable = true;
//   const [modalOpen, setModalOpen] = useState(false);
//   const [invoiceData, setInvoiceData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [storeLovs, setStoreLovs] = useState(JSON.parse(sessionStorage.getItem('data')));
//   const [products, setproducts] = useState(JSON.parse(sessionStorage.getItem('products')));
//   const [isVisible, setIsVisible] = useState(false);
//   const [activeButton, setActiveButton] = useState(null);
//   const [filteredProduct, setFilteredProduct] = useState([]);
//   const [productWithDiscount, setProductWithDiscount] = useState([]);
//   const [storeCustomer, setStoreCustomer] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedItemCount, setSelectedItemCount] = useState(0);
//   const [grandtotal, setgranttotal] = useState('');
//   const [selectedCustomer, setSelectedCustomer] = useState([]);
//   const [numCols, setNumCols] = useState(5); // Initial number of columns
//   var userName = '';
//   const customerRef = useRef(null);
//   const [formdata, setformdata] = useState({
//     netdiscount: '',
//     discountpercentage: '',
//     payableamount: 0,
//     payingamount: '',
//     cash: '',
//     change: '',
//     dueamount: 0,
//     customername: '',
//     customerid: '',
//   });

//   const styles = {
//     root: {
//       /* display: 'flex',*/
//       flexWrap: 'wrap',
//       /* justifyContent: 'space-between',*/
//       overflow: 'hidden',
//     },
//     gridList: {
//       height: '34em',
//     },
//   };
//   React.useEffect(() => {
//     totalbill();
//   }, [selectedItems]);

//   React.useEffect(() => {
//     // alert(JSON.stringify(products));
//     console.log(JSON.stringify(products));
//     checkdiscount();
//     getcustomer();
//   }, []);
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
//         setStoreCustomer(data);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   const handleCustomer = (selectedCustomer) => {
//     if (selectedCustomer != null) {
//       setformdata((prevFormData) => ({
//         ...prevFormData,
//         customername: selectedCustomer.label,
//         customerid: selectedCustomer.value,
//       }));
//       setSelectedCustomer(selectedCustomer);
//     } else {
//       setSelectedCustomer(selectedCustomer);
//       setformdata((prevFormData) => ({
//         ...prevFormData,
//         customername: '',
//         customerid: '',
//       }));
//     }
//   };

//   const checkdiscount = () => {
//     const processedProducts = products.map((item) => {
//       const { saleprice, maxDiscountPercentage } = item;

//       let discountAmount = 0;
//       let discountedPrice = saleprice;

//       if (maxDiscountPercentage > 0) {
//         discountAmount = (saleprice * maxDiscountPercentage) / 100;
//         discountedPrice = saleprice - discountAmount;
//       }

//       return {
//         ...item,
//         oldPrice: saleprice,
//         newPrice: discountedPrice,
//         discountAmount,
//       };
//     });
//     setFilteredProduct(processedProducts);
//     //alert(JSON.stringify(processedProducts));
//     //console.log(JSON.stringify(processedProducts));
//     setProductWithDiscount(processedProducts);
//   };
//   const removeSelectItem = (itemId) => {
//     const updatedItems = selectedItems.filter((item) => item.productdetailid !== itemId);
//     setSelectedItems(updatedItems);
//     setSelectedItemCount(selectedItemCount - 1);
//   };
//   const toggleVisibility = () => {
//     setIsVisible(!isVisible);
//   };
//   const handleIncrement = (itemId) => {
//     const updatedItems = selectedItems.map((item) => {
//       if (item.productdetailid === itemId) {
//         const updatedItem = { ...item, quantity: item.quantity + 1 };
//         updatedItem.amount =
//           updatedItem.quantity *
//           (updatedItem.newPrice ? updatedItem.newPrice : updatedItem.saleprice); // Update the amount
//         return updatedItem;
//       }
//       return item;
//     });
//     setSelectedItems(updatedItems);
//   };
//   const handleDecrement = (itemId) => {
//     const updatedItems = selectedItems.map((item) => {
//       if (item.productdetailid === itemId && item.quantity > 0) {
//         const updatedItem = { ...item, quantity: item.quantity - 1 };
//         updatedItem.amount =
//           updatedItem.quantity *
//           (updatedItem.newPrice ? updatedItem.newPrice : updatedItem.saleprice); // Update the amount
//         return updatedItem;
//       }
//       return item;
//     });
//     setSelectedItems(updatedItems);
//   };
//   const chnagequantity = (itemId, event) => {
//     if (isNaN(event)) {
//       event = '';
//     }
//     const updatedItems = selectedItems.map((item) => {
//       if (item.id === itemId) {
//         return { ...item, quantity: event };
//       }
//       return item;
//     });
//     setSelectedItems(updatedItems);
//   };

//   const toggleActiveButtonMenu = (id) => {
//     if (activeButton === id) {
//       setActiveButton(null);
//       setFilteredProduct(products);
//     } else {
//       setActiveButton(id);
//       const fproduct = productWithDiscount.filter((product) => product.categoryid === id);
//       setFilteredProduct(fproduct);
//     }
//   };

//   const pushselectitem = (itemId) => {
//     debugger;
//     var product = filteredProduct.filter((item) => item.productdetailid === itemId);
//     if (product && product[0].saleTypeID === 1 && product[0].quantity === 0) {
//       toast.error(product[0].product + ' is out of stock...!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//     } else {
//       var alreadyselect = selectedItems.filter(
//         (item) => item.productdetailid === product[0].productdetailid,
//       );
//       if (alreadyselect.length !== 0) {
//         const updatedItems = selectedItems.map((item) => {
//           if (item.productdetailid === itemId) {
//             const updatedItem = { ...item, quantity: item.quantity + 1 };
//             updatedItem.amount =
//               updatedItem.quantity *
//               (updatedItem.newPrice ? updatedItem.newPrice : updatedItem.saleprice); // Update the amount
//             return updatedItem;
//           }
//           return item;
//         });
//         setSelectedItems(updatedItems);
//       } else {
//         const newItem = {
//           ...product[0],
//           quantity: 1,
//           amount: product[0].newPrice ? product[0].newPrice : product[0].saleprice, // Initial amount
//           rowVersion: selectedItems.length + 1, // Increment row version
//         };
//         setSelectedItems((prevSelectedItems) => [newItem, ...prevSelectedItems]);
//         setSelectedItemCount(selectedItemCount + 1);
//       }
//     }
//   };
//   const totalbill = () => {
//     const p = selectedItems.reduce(
//       (sum, item) => sum + (item.newPrice ? item.newPrice : item.saleprice) * item.quantity,
//       0,
//     );
//     setformdata((prevFormData) => ({
//       ...prevFormData,
//       payableamount: p,
//       payingamount: p,
//       cash: p,
//     }));
//     setgranttotal(p);
//   };
//   const handlediscount = (event) => {
//     const { name, value } = event.target;
//     setformdata((prevCash) => ({ ...prevCash, [name]: value, cash: '', change: '' }));
//     if (name === 'discountpercentage') {
//       var num = grandtotal;
//       if (value) {
//         const getdisc = ((grandtotal * value) / 100).toFixed(2);
//         if (getdisc >= num) {
//           toast.error('Discount must be less then total amount:' + num, {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//           });

//           setformdata({
//             netdiscount: '',
//             discountpercentage: '',
//             payableamount: num,
//             dueamount: 0,
//           });
//           return;
//         } else {
//           num = (Number(grandtotal) - getdisc).toFixed(2);
//           //setformdata({ netdiscount: getdisc });
//           setformdata((prevCash) => ({ ...prevCash, netdiscount: getdisc }));
//         }
//       } else {
//         setformdata((prevCash) => ({ ...prevCash, netdiscount: '' }));
//       }
//       setformdata((prevCash) => ({ ...prevCash, payableamount: num }));
//     } else {
//       var x = grandtotal;
//       if (value >= x) {
//         toast.error('Discount must be less then total amount:' + x, {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//         setformdata({ netdiscount: '', discountpercentage: '', payableamount: x });
//         return;
//       }
//       if (value) {
//         setformdata((prevCash) => ({ ...prevCash, discountpercentage: '', payableamount: x }));

//         x = grandtotal - value;
//       }
//       setformdata((prevCash) => ({ ...prevCash, payableamount: x }));
//     }
//   };
//   const handleCash = (event) => {
//     const { value } = event.target;
//     setformdata((prevCash) => ({ ...prevCash, cash: value }));
//     var back = 0;
//     if (formdata.payingamount && value) {
//       back = value - formdata.payingamount;
//     } else if (value) {
//       back = Number(value) - formdata.payableamount;
//     }
//     setformdata((prevCash) => ({ ...prevCash, change: back }));
//   };
//   const handlePaying = (event) => {
//     const { value } = event.target;

//     var amount = 0;
//     setformdata((prevCash) => ({ ...prevCash, payingamount: value }));
//     if (value) {
//       amount = value - formdata.payableamount;
//       /* setColor(amount < 0 ? 'red' : 'green');*/
//       formdata.change = formdata.cash - value;
//     }
//     setformdata((prevCash) => ({ ...prevCash, dueamount: amount }));
//   };

//   React.useEffect(() => {
//     // Update the number of columns based on viewport width
//     const updateNumCols = () => {
//       const viewportWidth = window.innerWidth;
//       let newNumCols = 5; // Default value

//       if (viewportWidth <= 500) {
//         newNumCols = 1; // Set to 2 columns for smaller screens
//       } else if (viewportWidth <= 768) {
//         newNumCols = 2; // Set to 2 columns for smaller screens
//       } else if (viewportWidth <= 1024) {
//         newNumCols = 3; // Set to 3 columns for medium screens
//       } else if (viewportWidth <= 1424) {
//         newNumCols = 4; // Set to 3 columns for medium screens
//       }

//       setNumCols(newNumCols);
//     };

//     // Call the function initially and attach a resize event listener
//     updateNumCols();
//     window.addEventListener('resize', updateNumCols);

//     // Clean up the event listener on component unmount
//     return () => {
//       window.removeEventListener('resize', updateNumCols);
//     };
//   }, []);
//   const getstoreid = () => {
//     const cookies = document.cookie.split(';');
//     const user = { username: null, storeId: null };
//     for (const cookie of cookies) {
//       const [name, value] = cookie.trim().split('=');
//       if (name === 'loggedInUser') {
//         userName = user.username = decodeURIComponent(value);
//       } else if (name === 'storeId') {
//         user.storeId = decodeURIComponent(value);
//       }
//     }
//     if (!user.username || !user.storeId) {
//       // Navigate to another page
//       /* navigate('/');*/
//     } else {
//       return user.storeId;
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
//   const submit = async (action) => {
//     setIsLoading(true);
//     if (selectedItems.length === 0) {
//       toast.error('Please Select atleast one product....!', {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 3000,
//       });
//       setIsLoading(false);
//       return;
//     } else {
//       if (formdata.dueamount !== 0) {
//         if (formdata.customername === '') {
//           toast.error('Please Select Customer....!', {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 3000,
//           });
//           setIsLoading(false);
//           customerRef.current.focus();
//           return;
//         }
//       }
//       var id = getstoreid();
//       const invoiceNumber = generateRandomInvoiceNumber();
//       const SubmitData = selectedItems.map((item) => ({
//         productdetailid: item.productdetailid,
//         productname: item.product,
//         productcategory: item.productcategory,
//         barcode: item.barcode,
//         sku: '',
//         batchnumber: '',
//         city: '',
//         customername: formdata.customername,
//         username: userName,
//         qty: item.quantity,
//         salerate: item.newPrice ? item.newPrice : item.saleprice,
//         unitprice: item.newPrice ? item.newPrice : item.saleprice,
//         linediscount: 0,
//         storeid: Number(id),
//         createdby: 1,
//         producturl: item.producturl,
//         remarks: 'web',
//         status: 1,
//         businessagentid: Number(formdata.customerid || 0),
//         salesinvoicecode: invoiceNumber,
//         amount: Number(grandtotal),
//         payableamount: Number(formdata.payableamount),
//         paidamount: Number(formdata.payableamount),
//         handedovercash: Number(formdata.cash || 0),
//         netdiscount: Number(formdata.netdiscount || 0),
//         changeamount: Number(formdata.change),
//         dueamount: Number(formdata.dueamount || 0),
//         payingamount: Number(formdata.payingamount || 0),
//         tax: Number(item.taxCalculated) || 0,
//         taxamount: Number(item.taxCalculated) || 0,
//         expense: 0,
//       }));
//       if (action === 'submitAndPrint') {
//         openModal(SubmitData);
//       }

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
//         //setstoreProduct(jsonData.data);
//         clearall();
//         toast.success('Order has been submitted successfully....!', {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 3000,
//         });
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     }
//   };

//   const clearall = () => {
//     setformdata({
//       netdiscount: '',
//       discountpercentage: '',
//       payableamount: 0,
//       payingamount: '',
//       cash: '',
//       change: '',
//       dueamount: 0,
//       customername: '',
//       customerid: '',
//     });
//     setSelectedCustomer(null);
//     setSelectedItemCount(0);
//     setSelectedItems([]);
//     setgranttotal('');
//     setIsVisible(false);
//   };
//   const openModal = (data) => {
//     // Set the data you want to pass to the modal
//     setInvoiceData(data);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };
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
//           data={invoiceData}
//         />
//       )}
//       <ToastContainer />
//       <div className="row d-flex">
//         <div className="col-md-12 col-sm-12  col-lg-12 col-xs-12 col-xlg-12">
//           <div className="row col-12 h-8">
//             <div
//               className="col-lg-11 d-flex col-md-11 col-sm-11 custom-scroll"
//               style={{ overflowX: 'scroll' }}
//             >
//               {storeLovs.tcategories.map((item, index) => (
//                 <div key={index} className="col-lg-2 col-md-3 col-sm-4 col-6 newsale-filter">
//                   <button
//                     className={`btn btn-success ${activeButton === item.id ? 'menu-active' : ''}`}
//                     onClick={() => toggleActiveButtonMenu(item.id)}
//                   >
//                     {item.name}
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <div className="col-md-1 col-sm-1 newsale-filter">
//               {/*<CIcon className="cart-icon" onClick={toggleVisibility} icon={cilCart} size="3xl" />*/}
//               <img
//                 src={cart}
//                 className="cart-icon"
//                 height="40"
//                 onClick={toggleVisibility}
//                 alt="Cart-img"
//               />
//               {selectedItemCount > 0 && <span className="selected-count">{selectedItemCount}</span>}
//             </div>
//           </div>
//           <div className="h-2" style={styles.root}>
//             <ImageList cellHeight={180} style={styles.gridList} cols={numCols}>
//               {filteredProduct.map((item, index) => (
//                 <ImageListItem
//                   onClick={() => pushselectitem(item.productdetailid)}
//                   className="select-item-list"
//                   key={index}
//                 >
//                   <img
//                     src={'http://192.168.18.4:8099/productimages/' + item.productdetailid + '.jpg'}
//                     alt={item.product}
//                   />
//                   {item.maxDiscountPercentage > 0 && (
//                     <div className="ribbon-wrap">
//                       <div className="ribbon discount-rebon">{item.maxDiscountPercentage}% Off</div>
//                     </div>
//                   )}
//                   {/*{item.maxDiscountPercentage > 0 && <span className="product-sale-label">{item.maxDiscountPercentage}% Off</span>}*/}
//                   {item.saleTypeID === 1 && item.quantity === 0 ? (
//                     <div className="ribbon-wrap">
//                       <div className="ribbon ">Out of Stock</div>
//                     </div>
//                   ) : null}
//                   <ImageListItemBar
//                     title={
//                       <div className="item-title">
//                         <span className="card-item-name">{item.product}</span>
//                         {item.maxDiscountPercentage > 0 && (
//                           <p className="price-before">Rs:{item.saleprice}</p>
//                         )}
//                       </div>
//                     }
//                     subtitle={
//                       <div className="item-title">
//                         <span className="">{item.unit}</span>
//                         <p className="price-now">
//                           Rs:{item.newPrice ? item.newPrice : item.saleprice}
//                         </p>
//                       </div>
//                     }
//                   />
//                 </ImageListItem>
//               ))}
//             </ImageList>
//           </div>
//         </div>
//         <div className={`newsale-rigt-col p-3 ${isVisible ? 'visible' : ''}`}>
//           <div>
//             <div className="top-cross-icon">
//               <CIcon onClick={toggleVisibility} icon={cilX} size="lg" />
//             </div>
//             <div className="text-center item-text-div">
//               <p className="item-text">Shopping Cart</p>
//             </div>
//             <div className="selected-items">
//               <table className="">
//                 <tbody>
//                   <tr>
//                     <th className=" text-center"></th>
//                     <th>Product Name</th>
//                     {/*   <th className=" text-center">Discount</th>*/}
//                     <th className=" text-center">QTY</th>
//                     <th className=" text-center">Tax</th>
//                     <th className=" text-center">Amount</th>
//                   </tr>
//                   {selectedItems.map((item, index) => (
//                     <tr key={index} className="">
//                       <td className="sell-item-pic">
//                         <div className="item-thumb-pic">
//                           <img
//                             className="circular-image"
//                             src={item.producturl ? item.producturl : img}
//                           />
//                         </div>
//                       </td>
//                       <td>
//                         {item.product} @{item.newPrice ? item.newPrice : item.saleprice}
//                       </td>
//                       {/* <td className=" text-center">{item.discountAmount}</td>*/}
//                       <td className=" text-center w-11">
//                         <div className="qty-container">
//                           <button
//                             className="qty-btn-minus btn-light"
//                             onClick={() => handleDecrement(item.productdetailid)}
//                             type="button"
//                           >
//                             <CIcon icon={cilMinus} size="md" />
//                           </button>
//                           <input
//                             type="text"
//                             name="qty"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               chnagequantity(item.productdetailid, parseInt(e.target.value, 10))
//                             }
//                             className="input-qty input-bill-qty"
//                             min="0"
//                           />
//                           <button
//                             className="qty-btn-plus btn-light"
//                             onClick={() => handleIncrement(item.productdetailid)}
//                             type="button"
//                           >
//                             +
//                           </button>
//                         </div>
//                       </td>
//                       <td className=" text-center">{item.taxCalculated}</td>
//                       <td className=" text-center">{item.amount}</td>
//                       <td className="cross-icon text-center">
//                         <CIcon
//                           onClick={() => removeSelectItem(item.productdetailid)}
//                           icon={cilXCircle}
//                           size="xl"
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-sm-4">
//               <label htmlFor="input1">Net Discount</label>
//               <input
//                 type="number"
//                 name="netdiscount"
//                 onChange={handlediscount}
//                 value={formdata.netdiscount}
//                 className="form-control text-center"
//                 placeholder="0"
//                 onKeyDown={(evt) =>
//                   ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()
//                 }
//                 min={0}
//               />
//             </div>
//             <div className="col-sm-4">
//               <label htmlFor="input2">Discount(%)</label>
//               <input
//                 type="number"
//                 name="discountpercentage"
//                 onChange={handlediscount}
//                 value={formdata.discountpercentage}
//                 className="form-control text-center"
//                 placeholder="0"
//                 onKeyDown={(evt) =>
//                   ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()
//                 }
//                 min={0}
//               />
//             </div>
//             <div className="col-sm-4">
//               <label htmlFor="input3">
//                 <b>Payable Amount</b>
//               </label>
//               <input
//                 type="number"
//                 name="payableamount"
//                 value={formdata.payableamount}
//                 className="form-control font-weight-bold text-center"
//                 readOnly
//               />
//             </div>
//             <div className="col-sm-4">
//               <label htmlFor="input3">Paying Amount</label>
//               <input
//                 type="number"
//                 name="payingamount"
//                 value={formdata.payingamount}
//                 onChange={handlePaying}
//                 className="form-control text-center"
//                 placeholder="0"
//                 onKeyDown={(evt) =>
//                   ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()
//                 }
//                 min={0}
//               />
//             </div>
//             <div className="col-sm-4">
//               <label htmlFor="input3">Cash</label>
//               <input
//                 type="number"
//                 name="cash"
//                 onChange={handleCash}
//                 value={formdata.cash}
//                 className="form-control text-center"
//                 placeholder="0"
//                 onKeyDown={(evt) =>
//                   ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()
//                 }
//                 min={0}
//               />
//             </div>
//             <div className="col-sm-4">
//               <label htmlFor="input3">Change</label>
//               <input
//                 type="number"
//                 name="change"
//                 value={formdata.change}
//                 className="form-control text-center"
//                 readOnly
//                 placeholder="0"
//               />
//             </div>
//             <div className="col-sm-4">
//               <label htmlFor="input3">Due Amount</label>
//               <input
//                 type="number"
//                 id="dueamount"
//                 value={formdata.dueamount}
//                 className="form-control text-center"
//                 placeholder="0"
//                 onKeyDown={(evt) =>
//                   ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()
//                 }
//                 min={0}
//                 readOnly
//               />
//             </div>
//             <div className="col-sm-8 form-group">
//               <label htmlFor="">Customer</label>
//               <br />
//               <Select
//                 ref={customerRef}
//                 className="basic-single"
//                 isSearchable={isSearchable}
//                 isClearable={isClearable}
//                 value={selectedCustomer}
//                 onChange={handleCustomer}
//                 options={storeCustomer.map((item) => ({
//                   value: item.id,
//                   label: item.username,
//                 }))}
//               />
//             </div>
//           </div>
//           <div className="divider divider-dashed"></div>
//           <div className="row text-center">
//             <div className="col-sm-4">
//               <button className="btn_Default pay-btn" onClick={() => submit('submitAndPrint')}>
//                 Submit & Print
//               </button>
//             </div>
//             <div className="col-sm-4">
//               <button className="btn_Default pay-btn" onClick={() => submit('submitOnly')}>
//                 Submit
//               </button>
//             </div>
//             <div className="col-sm-4">
//               <button className="btn_Default pay-btn" onClick={clearall}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default newsale;

import React, { useState } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import QRCode from 'react-qr-code';
import moment from 'moment';
import PropTypes from 'prop-types';
const PaymentPrintInvoice = ({ isOpen, toggle, data }) => {
  const [total, settotal] = useState({ payableamount:0, totalDiscount: 0, totalAmount: 0, tax: 0,dueamount:0,payingamount:0 });
  const [invoiceno, setInvoiceno] = useState('');
  const [timeout, setTimeout] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [operatedBy, setOperatedBy] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [invoiceCode, setInvoiceCode] = useState('');

  const date = moment(new Date()).format('MM/DD/YYYY H:mm:ss ') 
  React.useEffect(() => {    
    if (data.length) {
      setCustomerName((data[0].customername));
      setOperatedBy((data[0].operatedby));      
      setInvoiceCode((data[0].invoicecode));      
     // alert(JSON.stringify(data[0]));
      var CreditData = data.filter((item) => item.transactiontype === 1);
      var DebitData = data.filter((item) => item.transactiontype !== 1);
      const CreditTotalAmount = CreditData.reduce((sum, row) => sum + Number(row.amount), 0);
      const DebitTotalAmount = DebitData.reduce((sum, row) => sum + Number(row.amount), 0);
      var DifferenceAmount = CreditTotalAmount - DebitTotalAmount;
      setTotalAmount(DifferenceAmount);
    }
   
  }, []);
  const printscrene = () => {
    const printContent = document.getElementById("print-content");

    if (printContent) {
      printContent.style.visibility = "visible"; // Ensure the section is visible before printing
      window.print();
      printContent.style.visibility = "hidden"; // Hide the section again after printing
    }
  } 

  return (
    <>
      <div id="print-content">
      <Modal isOpen={isOpen} id="print-content" toggle={toggle} className="custom-modal">
        <ModalHeader toggle={toggle} className="inv-m-header">
          <h5><b>Invoice</b></h5>
        </ModalHeader>
          <ModalBody>
            <div >
              <div className="row m-inv-number mt-2">
                <div className="col-md-6 text-center">
                  <h6>Invoice No : {invoiceCode}</h6>
                </div>
                <div className="col-md-6 text-center">
                  <h6>Date : {moment(data[0].transactiontime).format('MM/DD/YYYY')}</h6>
                </div>

              </div>
              <div className="row m-inv-number mt-2">
                <div className="col-md-6 text-center">
                  <h6>Operated By : {operatedBy}</h6>
                </div>
                <div className="col-md-6 text-center">
                  <h6>Customer : {customerName}</h6>
                </div>
              </div>
              <div className="row p-3">
                <table className="m-inv-table" >
                  <tr className="inv-tr-border">

                    <th>Documents Num</th>
                    <th className="text-center">Amount</th>
                    <th className="text-center">Payment Mode</th>
                    <th className="text-center">Transection</th>
                    <th className="text-center">Payment Time</th>
                  </tr>
                  {data.map((item, index) => (
                    <tr key={index} className="inv-tr-data">
                      <td>{item.documentcode}</td>
                      <td className="text-center">{item.amount}</td>
                      <td className="text-center">{item.paymentmode}</td>
                      <td className="text-center">{item.transactiontypename}</td>
                      <td className="text-center">{moment(item.transactiontime).format('MM/DD/YYYY H:mm:ss ')}</td>
                    </tr>
                  ))}
                  <tr className="m-inv-total">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="text-center" colSpan="2"><b>Total </b> : <span>{totalAmount}</span></td>

                  </tr>
                  <tr className="">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="">
                    <td className="m-inv-total">Customer ({customerName})</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
                <div className="row m-inv-footer">
                  <p>If you have any question please contact : info@blazortech.com </p>
                </div>
              </div>

            </div>
          </ModalBody>
          <ModalFooter>            
              <button className="hide-on-print btn btn-success" onClick={printscrene}>Print</button>            
        </ModalFooter>
        </Modal>
      </div>
    </>
  )
}
PaymentPrintInvoice.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen should be a boolean and is required
  toggle: PropTypes.func.isRequired, // toggle should be a function and is required
  data: PropTypes.array.isRequired, // data should be an object and is required
};
export default PaymentPrintInvoice

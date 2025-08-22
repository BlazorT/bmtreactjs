import React, { useState } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import QRCode from 'react-qr-code';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import PropTypes from 'prop-types';
const PrintInvoice = ({ isOpen, toggle, data }) => {
  dayjs.extend(utc);
  const [total, settotal] = useState({ payableamount:0, totalDiscount: 0, totalAmount: 0, tax: 0,dueamount:0,payingamount:0 });
  const [invoiceno, setInvoiceno] = useState('');
  const [userdetail, setUserdetail] = useState({name:'',customername:''});
  const date = dayjs(new Date()).format('MM/DD/YYYY H:mm:ss ') 
  //const toggle = () => {
  //  setModalOpen(!modalOpen);
  //};
 
  React.useEffect(() => {
    if (data.length) {
      setInvoiceno(data[0].salesinvoicecode);
      setUserdetail({ name: data[0].username, customername: data[0].customername });
    }
    totalbill();
   
  }, []);
  const printscrene = () => {
    const printContent = document.getElementById("print-content");

    if (printContent) {
      printContent.style.visibility = "visible"; // Ensure the section is visible before printing
      window.print();
      printContent.style.visibility = "hidden"; // Hide the section again after printing
    }
  }
  const totalbill = () => {
    if (data.length) {
      const Discount = data.reduce((sum, item) => sum + item.linediscount, 0);
      const Amount = data.reduce((sum, item) => sum + (item.salerate * (1 - item.linediscount)) * item.qty, 0);
      const tax = data.reduce((sum, item) => sum + item.tax, 0);

      settotal({
        totalDiscount: data[0].netdiscount, totalAmount: Amount, tax: tax,
        dueamount: data[0].dueamount,
        payableamount: data[0].payableamount,
        payingamount: data[0].payingamount,
      });
    }
  };

  return (
    <>
      <div id="print-content">
      <Modal isOpen={isOpen} id="print-content" toggle={toggle} className="custom-modal">
        <ModalHeader toggle={toggle} className="inv-m-header">
          <h5><b>Invoice</b></h5>
        </ModalHeader>
        <ModalBody>
          <div >
            <div className="row m-inv-number mb-2 mt-1">
              <div className="col-md-6 text-center">
                <h4>BEPOS</h4>
                <p>54700, 216-A Bahria Al-Rehmat, Pecco Rd, Lahore <br />Phone: +92 42-35132337 <br />Email: info@blazortech.com</p>
                
              </div>
              <div className="col-md-6 text-center">
                <div className='m-2'>
                  <QRCode value={invoiceno} size={128} />
                </div>
              </div>
            </div>
            {/*<div className="divider divider-solid-invoice"></div>*/}
            <div className='p-2'>
            <div className='row text-center divider-solid-invoice mt-2'>
              <div className="col-md-6 text-center margin-auto ">
                  <p><b>Invoice No : </b>{invoiceno}</p>
              </div>
              <div className="col-md-6 text-center margin-auto">
                  <p><b>Date:</b> {date}</p>
                  </div>
                  <div className="col-md-6 text-center margin-auto ">
                    <p><b>Issued By : </b>{userdetail.name}</p>
                  </div>
                  <div className="col-md-6 text-center margin-auto">
                    <p><b>Customer Name:</b> {userdetail.customername} </p>
                  </div>
            </div>
          </div>
            {/*<div className="divider divider-dashed-invoice"></div>*/}
            <div className="row p-2 pt-0">
              <table className="m-inv-table2 " >
                <tr className="inv-tr-border">
                  <th className="text-center">No</th>
                  <th>Item Name</th>
                  <th className="text-center">QTY</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Discount</th>
                  <th className="text-center">Total</th>
                </tr>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item.productname}</td>
                      <td className="text-center">{item.qty}</td>
                      <td className="text-center">{item.salerate}</td>
                      <td className="text-center">{item.linediscount}</td>
                      <td className="text-center">{item.qty * item.salerate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                      <td className="text-center no-data" colSpan="6">No data available</td>
                  </tr>
                )}
                
                <tr >
                  <td colSpan='4' rowSpan='7'></td>
                 
                </tr>
                <tr >
                  <td className="text-center"><b>Bill Amount</b></td>
                  <td className="text-center">{total.totalAmount}</td>
                </tr>
                <tr >
                    <td className="text-center"><b>Net Discount</b> </td>
                    <td className="text-center">{total.totalDiscount}</td>
                </tr>
                <tr >
                    <td className="text-center"><b>Tax</b></td>
                  <td className="text-center">{total.tax}</td>
                </tr>
                  <tr >
                    <td className="text-center"><b>Paying Amount</b></td>
                    <td className="text-center">{total.payingamount}</td>
                  </tr>
                  <tr >
                    <td className="text-center"><b>Due Amount</b></td>
                    <td className="text-center">{total.dueamount}</td>
                  </tr>
                  <tr >
                    <td className="text-center"><b>Payable Amount</b></td>
                    <td className="text-center">{total.payingamount ? total.payingamount : total.payableamount}</td>
                  </tr>
              </table>
              <div className="row m-inv-footer">
                  <p>Thank you for choosing <b>BEPOS</b>. If you have any question please contact : info@blazortech.com </p>
              </div>
            </div>

          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={printscrene}>Print</button>
        </ModalFooter>
        </Modal>
      </div>
    </>
  )
}
PrintInvoice.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen should be a boolean and is required
  toggle: PropTypes.func.isRequired, // toggle should be a function and is required
  data: PropTypes.array.isRequired, // data should be an object and is required
};
export default PrintInvoice

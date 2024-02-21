import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const TermsAndConditionModal = (prop) => {
  const { isOpen, toggle } = prop;
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="Modal_Term_Condition">
      <ModalHeader>Contact Us</ModalHeader>
      <ModalBody className="paddingAllSide">
        <div className="login-form" id="printTermsOfUse">
          <div>
            <p className="TROUSParagraph pt-2">
              <strong className="TROUSStrong ">
                Call us from the Blazor Media Toolkit app
              </strong>
              <br />  Contacting Blazor Media Toolkit is now easier than ever when you contact us from the BMT app on your Android or iOS phone or tablet! Calling through the app is free - all you need is an internet or cellular connection.
            </p>
            <div>
              <strong className="TROUSStrong ">
                Download BMT Mobile App
              </strong>
              <div className="PlayStoreDiv">
                <img className="PlayStoreImg" src="AppStore.png" />
                <img className="PlayStoreImg" src="GooglePlaystore.png" />
              </div>

            </div>
            <div>
              <strong className="TROUSStrong">
                Reach Us : &nbsp;<label className="TROUSParagraph"><a className="whitecolor" href="mailto:www.blazortech.com">www.blazortech.com</a> </label>
              </strong>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <strong className="TROUSStrong">
                  Address(USA) : &nbsp;<label className="TROUSParagraph">3408 Brunchberry Lane, Plano Tx 75023, USA</label>
                </strong>
              </div>

              <div className="col-lg-6 col-md-6">
                <strong className="TROUSStrong">
                  Address(PAK) : 216 A ,<label className="TROUSParagraph"> Al-Rehmat Project,Peco Road, Lahore, Pk</label>
                </strong>
              </div>
            </div>
            <div>
              <strong className="TROUSStrong">
              
                <a className="whitecolor" href="https://www.joinymc.com/"><u className="whitecolor">www.blazortech.com</u></a>,&nbsp; Contact:&nbsp;&nbsp;<i className="fa">&#xf095;</i><label className="TROUSParagraph"> +1(973)9197210</label>

              </strong>
            </div>

          </div>

        </div>
        <div className="CenterAlign">
          <button
            type="button"
            onClick={() => toggle()}
            className="btn_Default m-2 sales-btn-style"
          >
            Ok
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default TermsAndConditionModal;

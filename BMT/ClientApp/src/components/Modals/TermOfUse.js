import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const TermsAndConditionModal = (prop) => {
  const { isOpen, toggle } = prop;
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="Modal_Term_Condition">
      <ModalHeader>Terms Of Use</ModalHeader>
      <ModalBody className="paddingAllSide">
        <div className="login-form PrintForm" id="printTermsOfUse">
          <h1 className="ModelTitle">Terms of Use</h1>
          <div>
            <p className="TROUSParagraph">
              By using our site, you agree to the terms of use and agree to follow and be bound by these terms.
            </p>
            <p className="TROUSParagraph">
              Please allow 3 business days for order processing and payment verification. Please allow 2-4 weeks for us to process your order. Thanks for your patience and support.
            </p>
            <p className="TROUSParagraph">
              <strong className="TROUSStrong">COPYRIGHT & TRADEMARKS</strong>
              <br></br>Materials, images, illustrations, designs, icons, etc. are all copy written and trademarked under legal authority of Blazor Media Toolkit LLC.
            </p>
            <p className="TROUSParagraph">
              <strong className="TROUSStrong">CORRECTION OF ERRORS & INACCURACIES:</strong>
              <br></br>Information on this site may contain typographical errors or inaccuracies, some information may not be complete or current. The Blazor Media Toolkit (BMT) reserves the right to correct errors, inaccuracies, and to change or update information any time with out notice (Including after you’ve submitted your order.)
            </p>
            <p className="TROUSParagraph pt-2"><strong className="TROUSStrong">Last Updated:</strong> August 05, 2020</p>
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

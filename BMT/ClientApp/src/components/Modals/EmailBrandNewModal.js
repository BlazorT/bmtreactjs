import React from 'react';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const EmailBrandNewModal = (prop) => {
  const {
    isOpen,
    toggle,
    isThisBrandnew,
    IsThisBrandNewClick,
    associatedWithAmazonNo,
    associatedWithAmazon,
  } = prop;

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal_Email">
      <ModalHeader>Email Branding Confirmation</ModalHeader>
      <ModalBody className="paddingAllSide">
        {isThisBrandnew == true ? (
          <div className="">
            <div className=" text-center pt-4">
              <h6 className="labelName">Is this brand new email?</h6>
            </div>
            <div className="CenterAlign">
              <button
                type="button"
                onClick={() => IsThisBrandNewClick()}
                className="btn_Default m-2 sales-btn-style"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => IsThisBrandNewClick()}
                className="btn_Default sales-btn-style m-2"
              >
                Yes
              </button>
            </div>
          </div>
        ) : (
          <div className="labelName">
            <div className=" text-center pt-4">
              <h6 className="labelName">Is this email associated with amazon already?</h6>
            </div>
            <div className="CenterAlign">
              <button
                type="button"
                onClick={() => associatedWithAmazonNo()}
                className="btn_Default m-2 sales-btn-style"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => associatedWithAmazon()}
                className="btn_Default sales-btn-style m-2"
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};
export default EmailBrandNewModal;

import React from 'react';

import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

const ConfirmationModal = (prop) => {
  const { header, body, onYes, onNo, isOpen, type } = prop;

  return (
    <Modal
      isOpen={isOpen}
      size="sm"
      backdrop={false}
      fullscreen="sm"
      className="confirmation-modal"
      centered={true}
    >
      <ModalHeader className="confirmation-modal-header">{header}</ModalHeader>
      <ModalBody className="confirmation-modal-body">{body}</ModalBody>
      <ModalFooter className="confirmation-modal-footer">
        <button type="button" className="btn_Default m-2 sales-btn-style" onClick={() => onNo()}>
          NO
        </button>
        <button type="button" className="btn_Default m-2 sales-btn-style" onClick={() => onYes()}>
          YES
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;

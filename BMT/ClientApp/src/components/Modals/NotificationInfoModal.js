import React, { useState } from 'react';

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { CCol, CRow } from '@coreui/react';
import { useDispatch } from 'react-redux';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import { formValidator } from 'src/helpers/formValidator';

const NotificationInfoModal = (prop) => {
  const { isOpen, toggle, isShare } = prop;
  const dispatch = useDispatch();
  const [notifiResponse, setNotifiResponse] = useState('');

  const onCancel = () => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: 'Are you sure you want to cancel?',
        isOpen: true,
        onYes: () => onYesConfirm(),
        onNo: () => onNoConfirm(),
      }),
    );
  };

  const onRespond = () => {
    formValidator();
    const form = document.querySelector('.notification-form');
    if (form.checkValidity()) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'responded succesfully',
          toastVariant: 'success',
        }),
      );
      toggle();
      setNotifiResponse('');
    }
  };
  const onRead = () => {
    dispatch(
      updateToast({
        isToastOpen: true,
        toastMessage: 'read notification succesfully',
        toastVariant: 'success',
      }),
    );
    toggle();
    setNotifiResponse('');
  };
  const onUnread = () => {
    dispatch(
      updateToast({
        isToastOpen: true,
        toastMessage: 'unread notification succesfully',
        toastVariant: 'success',
      }),
    );
    toggle();
    setNotifiResponse('');
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const onYesConfirm = () => {
    onCancel();
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    setNotifiResponse('');
    toggle();
  };
  return (
    <Modal
      isOpen={isOpen}
      size="sm"
      toggle={toggle}
      backdrop={false}
      fullscreen="sm"
      className="inventory-edit-modal"
      centered={true}
    >
      <ModalHeader className="confirmation-modal-header">06 Nov 2023 4:15:00</ModalHeader>
      <form
        noValidate
        className="needs-validation notification-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <ModalBody className="confirmation-modal-body">
          <div className="form-outline text-start">
            <label className="lblNotification ">Notification</label>
            <CRow>
              <CCol md={12}>
                <div className="input-group position-relative">
                  <p>
                    An opportunity to lead As a DSP you are only as strong as your team of delivery
                    associates. Your leadership won’t just set them up for success on the road
                    today, but wherever their career takes them. Successful candidates are
                    passionate about hiring and coaching, building a strong company culture, and
                    giving back to the community.
                  </p>
                </div>
              </CCol>
            </CRow>
          </div>
          {isShare && (
            <div className="row mt-2">
              <div className="col-md-12">
                <div className="form-outline text-start">
                  <textarea
                    className="FullWidth bg-secondary-color form-control"
                    rows="3"
                    placeholder=" Reply To The Notification"
                    required
                    value={notifiResponse}
                    name="notifiRes"
                    onChange={(e) => setNotifiResponse(e.target.value)}
                  ></textarea>
                  <div className="invalid-tooltip">enter your response please</div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="confirmation-modal-footer">
          {isShare ? (
            <>
              <button
                onClick={onCancel}
                type="button"
                className="btn btn_Default m-2 sales-btn-style"
              >
                Cancel
              </button>
              <button
                onClick={onRead}
                type="button"
                className="btn btn_Default m-2 sales-btn-style"
              >
                Read
              </button>
              <button
                onClick={onUnread}
                type="button"
                className="btn btn_Default sales-btn-style m-2"
              >
                UnRead
              </button>
              <button
                onClick={onRespond}
                type="submit"
                className="btn btn_Default sales-btn-style m-2"
              >
                Respond
              </button>
            </>
          ) : (
            <button onClick={toggle} type="button" className="btn btn_Default m-2 sales-btn-style">
              OK
            </button>
          )}
        </ModalFooter>
      </form>
    </Modal>
  );
};
export default NotificationInfoModal;

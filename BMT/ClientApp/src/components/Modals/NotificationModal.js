/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';

import { cilItalic } from '@coreui/icons';
import { CCol, CFormCheck, CRow } from '@coreui/react';
import { useDispatch } from 'react-redux';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { formValidator } from 'src/helpers/formValidator';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';

const NotificationModal = (prop) => {
  const { isOpen, toggle } = prop;
  const dispatch = useDispatch();
  const initialFormData = {
    noticeType: '',
    noticeDescription: '',
    isSendToAll: false,
  };
  const [noticeData, setNoticeData] = useState(initialFormData);

  const handleNoticeChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setNoticeData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const onSave = () => {
    formValidator();
    const form = document.querySelector('.notice-form');
    if (form.checkValidity()) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'notification send succesfully',
          toastVariant: 'success',
        }),
      );
      setNoticeData(initialFormData);
      toggle();
    }
  };

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

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    // setIsConfirmMdlOpen(false);
  };
  const onYesConfirm = () => {
    onCancel();
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    toggle();
    setNoticeData(initialFormData);
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
      <ModalHeader className="confirmation-modal-header">Notice</ModalHeader>
      <form
        noValidate
        className="needs-validation notice-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <ModalBody className="confirmation-modal-body">
          <CRow>
            <CCol md={12}>
              <div className="input-group position-relative">
                <h5 className="labelName">John Doe</h5>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="12">
              <CustomSelectInput
                label="Notice Type"
                icon={cilItalic}
                value={noticeData.noticeType}
                onChange={handleNoticeChange}
                id="noticeType"
                name="noticeType"
                options={[
                  { name: 'Warning Notice' },
                  { name: 'Traffic Violation Notice' },
                  { name: 'Low Performance Notice' },
                ]}
                isRequired={true}
                message="please select a notice type"
              />
            </CCol>
          </CRow>
          <div className="row">
            <div className="col-md-12">
              <div className="form-outline text-start">
                <label htmlFor="noticeDescription" className="form-label  mb-2">
                  Notice Description
                </label>
                <textarea
                  onChange={handleNoticeChange}
                  className="form-control FullWidth bg-secondary-color"
                  rows="3"
                  name="noticeDescription"
                  id="noticeDescription"
                  value={noticeData.noticeDescription}
                  placeholder="Notice Details"
                ></textarea>
              </div>
            </div>
          </div>
          <CRow>
            <CCol md={5}>
              <div className="input-group position-relative">
                <CFormCheck
                  className="lblStyle"
                  id="isSendToAll"
                  label="Send To All?"
                  checked={noticeData.isSendToAll}
                  onChange={handleNoticeChange}
                  name="isSendToAll"
                />
              </div>
            </CCol>
          </CRow>
        </ModalBody>
        <ModalFooter className="confirmation-modal-footer">
          <button
            onClick={() => onCancel()}
            type="button"
            className="btn btn_Default m-2 sales-btn-style"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave()}
            type="submit"
            className="btn btn_Default m-2 sales-btn-style"
          >
            Submit
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
export default NotificationModal;

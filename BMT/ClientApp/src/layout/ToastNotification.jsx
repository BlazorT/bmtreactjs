import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CToast, CToastBody, CToaster } from '@coreui/react';
import { selectToast, updateToast } from 'src/redux/toast/toastSlice';

const ToastNotification = () => {
  const dispatch = useDispatch();
  const { isToastOpen, toastMessage, toastVariant } = useSelector(selectToast);

  const handleClose = () => {
    dispatch(updateToast({ isToastOpen: false, toastMessage: '' }));
  };

  return (
    <CToaster placement="bottom-end" className="p-3">
      <CToast
        autohide={true}
        visible={isToastOpen}
        color={toastVariant}
        className="align-items-center"
        onClose={handleClose}
      >
        <div className="d-flex">
          <CToastBody className="text-white">
            {/* Render HTML safely */}
            <div dangerouslySetInnerHTML={{ __html: toastMessage }} />
          </CToastBody>
        </div>
      </CToast>
    </CToaster>
  );
};

export default ToastNotification;

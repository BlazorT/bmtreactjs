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

  // Map toastVariant → bg + text color
  const toastVariants = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    warning: 'bg-warning text-dark',
    info: 'bg-info text-white',
  };

  return (
    <CToaster placement="bottom-end" className="p-3">
      <CToast
        autohide
        visible={isToastOpen}
        onClose={handleClose}
        className={`${toastVariants[toastVariant] || 'bg-dark text-white'} align-items-center`}
      >
        <div className="d-flex">
          <CToastBody>
            {/* Render HTML safely */}
            <div dangerouslySetInnerHTML={{ __html: toastMessage }} />
          </CToastBody>
        </div>
      </CToast>
    </CToaster>
  );
};

export default ToastNotification;

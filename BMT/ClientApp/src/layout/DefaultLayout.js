import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { updateToast, selectToast } from '../redux/toast/toastSlice';

import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import CustomSnackbar from 'src/components/UI/CustomSnackbar';
import ConfirmationModal from 'src/components/Modals/ConfirmationModal';
import AppContainer from 'src/components/UI/AppContainer';

const DefaultLayout = () => {
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);
  const confirMdl = useSelector((state) => state.confirMdl);

  const divElem = document.querySelector('body > div');
  /*  *********** Handel Resize observer ************ */
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.target.handleResize) entry.target.handleResize(entry);
    }
  });

  resizeObserver.observe(divElem);
  return (
    <div>
      <ConfirmationModal
        header={confirMdl.header}
        body={confirMdl.body}
        isOpen={confirMdl.isOpen}
        onYes={() => confirMdl.onYes()}
        onNo={() => confirMdl.onNo()}
      />
      <CustomSnackbar
        message={toast.toastMessage}
        variant={toast.toastVariant}
        open={toast.isToastOpen}
        setOpen={() =>
          dispatch(
            updateToast({
              isToastOpen: false,
            }),
          )
        }
      />
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body bg-body-color px-3">
          <div className="job-application-form">
            <AppContent />
          </div>
        </div>
        {/*<AppFooter />*/}
      </div>
    </div>
  );
};

export default DefaultLayout;

import React from 'react';
import { useSelector } from 'react-redux';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import ConfirmationModal from 'src/components/Modals/ConfirmationModal';

const DefaultLayout = () => {
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

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import ConfirmationModal from 'src/components/Modals/ConfirmationModal';

const DefaultLayout = () => {
  const confirMdl = useSelector((state) => state.confirMdl);

  //useEffect(() => {
  //  const divElem = document.querySelector('body > div');
  //  if (!divElem) return;

  //  const resizeObserver = new ResizeObserver((entries) => {
  //    for (let entry of entries) {
  //      // If you want to do something when body > div resizes:
  //      console.log('Resized:', entry.contentRect);
  //    }
  //  });

  //  resizeObserver.observe(divElem);

  //  return () => {
  //    resizeObserver.disconnect();
  //  };
  //}, []);
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

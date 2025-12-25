/* eslint-disable react/react-in-jsx-scope */
import { AppContent, AppHeader, AppSidebar } from '../components/index';

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body bg-body-color">
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

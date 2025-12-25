import 'react-data-grid/lib/styles.css';
import './scss/style.scss';
import '../src/CSS/Style.css';
import '../src/CSS/Form.css';
import React, { Suspense, useEffect } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ForgotPassword from './pages/Auth/ForgotPassword';
import { useSelector } from 'react-redux';
import ToastNotification from './layout/ToastNotification';
import OrganizationAdd from './pages/DA/organizationadd';
import ConfirmationModal from './components/Modals/ConfirmationModal';
import PaymentConfirmation from './pages/Admin/EPToken';
import PricingDetails from './pages/Admin/pricingDetails';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfUse from './pages/PrivacyPolicy/TermsOfUse';

const Loading = React.lazy(() => import('../src/components/UI/Loading'));

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Page
const Index = React.lazy(() => import('./pages/Auth/SignIn'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
const Page404 = React.lazy(() => import('./pages/Error/Page404'));
const Page500 = React.lazy(() => import('./pages/Error/Page500'));
const Page401 = React.lazy(() => import('./pages/Error/Page401'));

const App = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const confirMdl = useSelector((state) => state.confirMdl);

  useEffect(() => {
    function hideError(e) {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div',
        );
        const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay');
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    }

    window.addEventListener('error', hideError);
    return () => {
      window.addEventListener('error', hideError);
    };
  }, []);

  return (
    <React.Fragment>
      <ToastNotification />
      <ConfirmationModal
        header={confirMdl.header}
        body={confirMdl.body}
        isOpen={confirMdl.isOpen}
        onYes={() => confirMdl.onYes()}
        onNo={() => confirMdl.onNo()}
      />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route exact path="/" name="Index Page" element={<Index />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route exact path="/add-org" name="addorganization" element={<OrganizationAdd />} />
            <Route exact path="/PrivacyPolicy" name="PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route
              exact
              path="/pricingDetails"
              name="pricingDetails"
              element={<PricingDetails />}
            />
            <Route exact path="/TermsOfUse" name="TermsOfUse" element={<TermsOfUse />} />
            <Route
              exact
              path="/ep-token"
              name="Payment Confirmation"
              element={<PaymentConfirmation />}
            />
            {/*  <Route exact path="/AddDA" name="AddDA" element={<AddDA />} />*/}
            <Route
              exact
              path="/forgot-password"
              name="Forgot Password"
              element={<ForgotPassword />}
            />
            <Route exact path="*" element={isAuthenticated ? <DefaultLayout /> : <Page401 />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;

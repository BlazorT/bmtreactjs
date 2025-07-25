import React, { Suspense } from 'react';

import { HashRouter, Route, Routes } from 'react-router-dom';

import './scss/style.scss';
import '../src/CSS/Style.css';
import '../src/CSS/Form.css';
import ForgotPassword from './pages/Auth/ForgotPassword';
import { useSelector } from 'react-redux';
import AddDA from './pages/DA/AddDA';
/*import Blazorhub from './Blazorhub';*/
import { selectToast } from './redux/toast/toastSlice';

const Loading = React.lazy(() => import('../src/components/UI/Loading'));

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Page
const Index = React.lazy(() => import('./pages/Auth/SignIn'));
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
const Page404 = React.lazy(() => import('./pages/Error/Page404'));
const Page500 = React.lazy(() => import('./pages/Error/Page500'));
const Page401 = React.lazy(() => import('./pages/Error/Page401'));

const App = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <React.Fragment>
      <HashRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route exact path="/" name="Index Page" element={<Index />} />
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
           {/* <Route exact path="/addorganization" name="addorganization" element={<addorganization />} />*/}
            <Route exact path="/AddDA" name="AddDA" element={<AddDA />} />
            <Route
              exact
              path="/forgot-password"
              name="Forgot Password"
              element={<ForgotPassword />}
            />
            <Route exact path="*" element={isAuthenticated ? <DefaultLayout /> : <Page401 />} />
            {/* <Route path="*" name="Home" element={<DefaultLayout />} /> */}
          </Routes>
        </Suspense>
      </HashRouter>
    </React.Fragment>
  );
};

export default App;

import React from 'react';

import { CButton, CCol, CContainer, CRow } from '@coreui/react';

import { Link, useLocation } from 'react-router-dom';

const Page401 = () => {
  const location = useLocation();
  return (
    <div className="bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} className="text-center">
            <div className="clearfix">
              <h1 className="display-3 me-4 text-white">401</h1>
              <h4 className="text-white">Oops! Login First To Access This Page.</h4>
            </div>

            <Link to="/" state={{ redirectPath: location }}>
              <CButton className="w-25 mt-4" color="info">
                Log In
              </CButton>
            </Link>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Page401;

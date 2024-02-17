import React from 'react';
import { CCol, CContainer, CRow } from '@coreui/react';

const DAAssociateTab = () => {
  return (
    <CContainer fluid className="dashboard-header">
      <CRow>
        <CCol className="dashboard-header-input border-bottom-1px mb-2" md={12}>
          <div style={{ justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
            <div>
              <h1 className="dashboard-card-number">Associate Details</h1>
              <h1 className="dashboard-card-number">Enter Persnol Information</h1>
              <strong className=" dashboard-header-light-text">Name :</strong>
              <p className="dashboard-header-light-text txtWeight">Helper Driver</p>
              <strong className=" dashboard-header-light-text">Date Of Birth :</strong>
              <p className="dashboard-header-light-text"> Jul 21, 1998</p>
              <strong className=" dashboard-header-light-text">Email :</strong>
              <p className="dashboard-header-light-text">Johndoe172@gmail.com</p>
              <strong className=" dashboard-header-light-text">Mobile :</strong>
              <p className="dashboard-header-light-text">(410)7133922 </p>
              <strong className=" dashboard-header-light-text">Address :</strong>
              <p className="dashboard-header-light-text">232 Hollywood street</p>
            </div>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol className="dashboard-header-input border-bottom-1px mt-2" md={12}>
          <div style={{ justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
            <div>
              <h1 className="dashboard-card-number">Drivers License</h1>
              <strong className=" dashboard-header-light-text">Driver Licence # :</strong>
              <p className="dashboard-header-light-text txtWeight">330wsm333</p>
              <strong className=" dashboard-header-light-text">Expiration Date :</strong>
              <p className="dashboard-header-light-text"> Jul 21, 2025</p>
            </div>
          </div>
        </CCol>
      </CRow>

      <CRow>
        <CCol className="dashboard-header-input border-bottom-1px mt-2" md={12}>
          <div style={{ justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
            <div>
              <h1 className="dashboard-card-number">Associate Settings</h1>
              <strong className=" dashboard-header-light-text">Primary Delivery Station:</strong>
              <p className="dashboard-header-light-text txtWeight">Seaford (WDE-1)-Amazon.com</p>
              <strong className=" dashboard-header-light-text">Service Types :</strong>
              <p className="dashboard-header-light-text"> Amazon Logistics</p>
              <strong className=" dashboard-header-light-text">Supervisor :</strong>
              <p className="dashboard-header-light-text"> Mehmood</p>
            </div>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  );
};
export default DAAssociateTab;

import React from 'react';
import { CCol, CRow } from '@coreui/react';

import FleetCard from '../Cards/FleetCard';

function Tab() {
  return (
    <>
      <CRow>
        <h1 className="dashboard-card-title mb-2">Current Vehicle Health</h1>
      </CRow>
      <CRow>
        <CCol md={4}>
          <FleetCard
            heading="Vehicles By Operational Status"
            headerContent={[
              { title: 'Total Active', number: 56 },
              { title: 'Operational', number: 49 },
            ]}
            fotterList={[
              { title: 'Grounded', number: 0 },
              { title: 'due to inspection defect', number: 4 },
              { title: 'due to preventative defect', number: 4 },
              { title: 'due to inspection defect', number: 4 },
            ]}
          />
        </CCol>
        <CCol md={4}>
          <FleetCard
            heading="Todays Completed DVIC & VSA"
            headerContent={[
              { title: 'Pre-tip DVIC', number: 0 },
              { title: 'Post-tip DVIC', number: 40 },
              { title: 'Post-trip remaining', number: 0 },
            ]}
            fotterContent={[{ title: 'New Defects', number: 0 }]}
          />
        </CCol>
        <CCol md={4}>
          <FleetCard
            heading="Vehicles With Inspection Defects"
            headerContent={[
              { title: 'All Defects', number: 5 },
              { title: 'Repairs due within 2 days', number: 0 },
            ]}
            fotterContent={[{ title: 'Vehicles Grounded', number: 4 }]}
          />
        </CCol>
      </CRow>
      <CRow className="mt-2 mb-4">
        <CCol md={4}>
          <FleetCard
            heading="Preventative Maintainance"
            headerContent={[
              { title: 'Total PMs', number: 5 },
              { title: 'Due now', number: 1 },
              { title: 'Overdue', number: 0 },
            ]}
            fotterContent={[{ title: 'Vehicles Grounded', number: 4 }]}
          />
        </CCol>
        <CCol md={4}>
          <FleetCard
            heading="Odometer Defects"
            headerContent={[{ title: 'Total Defects', number: 2 }]}
          />
        </CCol>
      </CRow>
      <CRow>
        <h1 className="dashboard-card-title mb-2">Fleet</h1>
      </CRow>
      <CRow>
        <CCol md={4}>
          <FleetCard
            heading="Authorized Vehicles"
            headerContent={[{ title: 'This Week', number: 53 }]}
            fotterContent={[
              { title: 'Planned', number: 40 },
              { title: 'Supplimental', number: 4 },
            ]}
          />
        </CCol>
        <CCol md={4}>
          <FleetCard
            heading="Registered Vehicles"
            headerContent={[{ title: 'Total', number: 53 }]}
            fotterContent={[
              { title: 'Amazon Branded', number: 24 },
              { title: 'Rentals', number: 4 },
              { title: 'Amazon last mile rental', number: 4 },
            ]}
          />
        </CCol>
        <CCol md={4}>
          <FleetCard
            heading="Paid Off-site parking"
            headerContent={[{ title: 'Parking Spots', number: 0 }]}
          />
        </CCol>
      </CRow>
    </>
  );
}

export default Tab;

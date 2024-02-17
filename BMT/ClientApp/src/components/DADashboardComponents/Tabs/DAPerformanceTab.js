import React, { useState } from 'react';

import { CCol, CCollapse, CContainer, CRow } from '@coreui/react';

import DateSelector from '../DateSelector';
import CollapseHeader from '../CollapseHeader';
import StatusMetricCard from '../../Cards/StatusMetricCard';

const DAPerformanceTab = () => {
  const [selectedDate, setSelectedDate] = useState('2023-01-01');
  const [matricVisible, setMatricVisible] = useState(true);
  const [safetyMatricVisible, setSafetyMatricVisible] = useState(true);
  const [qualityMatricVisible, setQualityMatricVisible] = useState(true);

  return (
    <CContainer fluid className="mt-3">
      <DateSelector date={selectedDate} onDateChange={(e) => setSelectedDate(e)} />
      <CRow>
        <CollapseHeader
          title="Matrics Summary"
          isVisible={matricVisible}
          toggleVisible={() => setMatricVisible(!matricVisible)}
        />
        <CCollapse visible={matricVisible} className="mt-3">
          <CRow>
            <CCol md={12}>
              <StatusMetricCard
                val={45}
                attributesStatus2={[
                  { title: 'Safe Driving Metric', value: 25 },
                  { title: 'Delivery Success Behaviors', value: 45 },
                  { title: 'Customer Escalations Defect', value: 55 },
                ]}
              />
            </CCol>
          </CRow>
        </CCollapse>
      </CRow>

      <CRow className="mt-2">
        <CollapseHeader
          title="Safety Matrics Summary"
          isVisible={safetyMatricVisible}
          toggleVisible={() => setSafetyMatricVisible(!safetyMatricVisible)}
        />
        <CCollapse visible={safetyMatricVisible} className="mt-3">
          <CRow>
            <CCol md={12}>
              <StatusMetricCard
                val={95}
                attributesStatus2={[
                  { title: 'Safe Driving Metric', value: 20 },
                  { title: 'Seatbelt-Off Rate', status: 'Great', heading: '100%', value: 60 },
                  { title: 'Speeding Event Rate', value: 30 },
                ]}
                attributesStatus3={[
                  { title: 'Distraction Rate', value: 20 },
                  { title: 'Following Distance Rate', value: 50 },
                  { title: 'Sign / Signal Violation', value: 40 },
                ]}
              />
            </CCol>
          </CRow>
        </CCollapse>
      </CRow>
      <CRow className="mt-2">
        <CollapseHeader
          title="Quality Matrics Summary"
          isVisible={qualityMatricVisible}
          toggleVisible={() => setQualityMatricVisible(!qualityMatricVisible)}
        />
        <CCollapse visible={qualityMatricVisible} className="mt-3">
          <CRow>
            <CCol md={12}>
              <StatusMetricCard
                val={15}
                attributesStatus2={[
                  { title: 'Delivery Completion Rate', value: 30 },
                  { title: 'Delivery Success Behaviors', value: 40 },
                  { title: 'Customer Delivery Feedback', value: 30 },
                  { title: 'Customer Escalations Defect', value: 30 },
                ]}
                attributesStatus3={[
                  { title: 'SWC - Photo On Delivery', value: 55 },
                  { title: 'SWC - Contact Compilance', value: 77 },
                  { title: 'Customer Star Rating', value: 70 },
                ]}
              />
            </CCol>
          </CRow>
        </CCollapse>
      </CRow>
    </CContainer>
  );
};
export default DAPerformanceTab;

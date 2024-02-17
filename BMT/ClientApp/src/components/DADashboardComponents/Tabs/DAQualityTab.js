import React, { useState } from 'react';

import { CCol, CCollapse, CContainer, CRow } from '@coreui/react';

import DateSelector from '../DateSelector';
import CollapseHeader from '../CollapseHeader';
import StatusMetricCard from '../../Cards/StatusMetricCard';
import QualityMatricTab from '../QualityMatricTab';

const DAQualityTab = () => {
  const [selectedDate, setSelectedDate] = useState('2023-01-01');

  const [matricVisible, setMatricVisible] = useState(true);
  const [matricDeepVisible, setMatricDeepVisible] = useState(true);

  return (
    <CContainer fluid className="mt-3">
      <DateSelector date={selectedDate} onDateChange={(e) => setSelectedDate(e)} />
      <CRow>
        <CollapseHeader
          title="Quality Metrics Summary"
          isVisible={matricVisible}
          toggleVisible={() => setMatricVisible(!matricVisible)}
        />
        <CCollapse visible={matricVisible} className="mt-3">
          <CRow>
            <CCol md={12}>
              <StatusMetricCard
                val={72}
                attributesStatus2={[
                  { title: 'Safe Driving Metrics', value: 45 },
                  { title: 'Seatbelt-Off Rate', value: 65 },
                  { title: 'Speeding Event Rate', value: 25 },
                ]}
                attributesStatus3={[
                  { title: 'Distraction Rate', value: 15 },
                  { title: 'Following Distance Rate', value: 95 },
                  { title: 'Sign/Signal Violation', value: 65 },
                ]}
              />
            </CCol>
          </CRow>
        </CCollapse>
      </CRow>
      <CRow></CRow>
      <CRow className="mt-3">
        <CollapseHeader
          title="Metrics Deep Dive"
          isVisible={matricDeepVisible}
          toggleVisible={() => setMatricDeepVisible(!matricDeepVisible)}
        />
        <QualityMatricTab isCollapse={matricDeepVisible} />
      </CRow>
    </CContainer>
  );
};
export default DAQualityTab;

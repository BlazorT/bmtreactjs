import React, { useState } from 'react';

import { CCollapse, CContainer, CRow } from '@coreui/react';

import OverAllData from '../OverAllData';
import SafetyDetailData from '../SafetyDetailData';
import QualityDetailData from '../QualityDetailData';
import DateSelector from '../DateSelector';
import CollapseHeader from '../CollapseHeader';

const DATrendTab = () => {
  const [selectedDate, setSelectedDate] = useState('2023-01-01');
  const [overallVisible, setOverallVisible] = useState(true);
  const [safetyVisible, setSafetyVisible] = useState(false);
  const [qualityVisible, setQualityVisible] = useState(false);
  const toggleVisibility = (section) => {
    setOverallVisible(false);
    setSafetyVisible(false);
    setQualityVisible(false);

    switch (section) {
      case 'overall':
        setOverallVisible(true);
        break;
      case 'safety':
        setSafetyVisible(true);
        break;
      case 'quality':
        setQualityVisible(true);
        break;
      default:
    }
  };
  return (
    <CContainer fluid className="dashboard-header overflow-hidden ">
      <DateSelector date={selectedDate} onDateChange={(e) => setSelectedDate(e)} />
      <CRow className="">
        <CollapseHeader
          title="Overall"
          isVisible={overallVisible}
          toggleVisible={() => toggleVisibility('overall')}
          isFilter={overallVisible}
        />
        <CCollapse visible={overallVisible} className="">
          {overallVisible && <OverAllData />}
        </CCollapse>
      </CRow>
      <CRow className="mt-4">
        <CollapseHeader
          title="Saftey Data"
          isVisible={safetyVisible}
          toggleVisible={() => toggleVisibility('safety')}
          isFilter={safetyVisible}
        />
        <CCollapse visible={safetyVisible} className="">
          {safetyVisible && <SafetyDetailData />}
        </CCollapse>
      </CRow>
      <CRow className="mt-4">
        <CollapseHeader
          title="Quality Data"
          isVisible={qualityVisible}
          toggleVisible={() => toggleVisibility('quality')}
          isFilter={qualityVisible}
        />
        <CCollapse visible={qualityVisible} className="">
          {qualityVisible && <QualityDetailData />}
        </CCollapse>
      </CRow>
    </CContainer>
  );
};
export default DATrendTab;

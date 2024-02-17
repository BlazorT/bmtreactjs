import React, { useState } from 'react';

import { CButtonGroup, CCol, CContainer, CFormCheck, CRow } from '@coreui/react';
import { cilThumbDown, cilThumbUp } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Trend from 'react-trend';

import DateSelector from '../DateSelector';
import DACelebrationCard from 'src/components/Cards/DACelebrationCard';
import DAStaticticsCard from 'src/components/Cards/DAStaticticsCard';
import DAFeedbackCard from 'src/components/Cards/DAFeedbackCard';
import ThumbDownAlt from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';

const DAOverviewTab = () => {
  const [selectedDate, setSelectedDate] = useState('2023-01-01');
  const [selectedOption, setSelectedOption] = useState('option1');
  const data = [0, 10, 5, 22, 3.6, 11];

  return (
    <CContainer fluid className="dashboard-header">
      <DateSelector date={selectedDate} onDateChange={(e) => setSelectedDate(e)} />
      <CRow>
        <CCol className="dashboard-header-input  mb-2" md={6}>
          <h1 className="dashboard-card-number">Performance Trends</h1>
        </CCol>
        <CCol className="dashboard-header-input  mb-2" md={6}>
          <CButtonGroup
            className="FloatRight"
            role="group"
            aria-label="Basic checkbox toggle button group"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <CFormCheck
              type="radio"
              button={{ color: 'primary', variant: 'outline' }}
              name="btnradio"
              id="btnradio1"
              checked={selectedOption === 'option1'}
              value="option1"
              onChange={(e) => setSelectedOption(e.target.value)}
              autoComplete="on"
              label="Overall"
            />
            <CFormCheck
              type="radio"
              button={{ color: 'primary', variant: 'outline' }}
              name="btnradio"
              value="option2"
              onChange={(e) => setSelectedOption(e.target.value)}
              checked={selectedOption === 'option2'}
              id="btnradio2"
              autoComplete="off"
              label="Safety"
            />
            <CFormCheck
              type="radio"
              button={{ color: 'primary', variant: 'outline' }}
              name="btnradio"
              value="option3"
              onChange={(e) => setSelectedOption(e.target.value)}
              checked={selectedOption === 'option3'}
              id="btnradio3"
              autoComplete="off"
              label="Quality"
            />
          </CButtonGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol className="dashboard-header-input border-bottom-1px mt-2" md={12}>
          <div style={{ justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
            <div>
              <p className="dashboard-header-light-text txt-FontWeight">Overall Standing</p>
              <strong className=" dashboard-header-light-text fontSizeWeight">Fantastic</strong>
            </div>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol className="dashboard-header-input border-bottom-1px mb-2" md={8}>
          <Trend
            autoDrawDuration={3000}
            autoDrawEasing="ease-in"
            data={data}
            autoDraw
            radius={20}
            smooth
            gradient={['#0FF', '#F0F', '#FF0']}
          />
        </CCol>
        <CCol md={4}>
          <DACelebrationCard
            title="Celebration"
            overAllStatus="March 8"
            workStatus="Aug 22 (2 years)"
            Awards="Awards"
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol className="dashboard-header-input border-bottom-1px mt-2" md={12}>
          <div style={{ justifyContent: 'center', gap: '50px', alignItems: 'center' }}>
            <div>
              <p className="dashboard-card-number txtWeight">Delivery Statistics</p>
            </div>
          </div>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <DAStaticticsCard RoutesOutput="No Data" workStatus="No Data" />
        </CCol>
      </CRow>
      <CRow>
        <p className="dashboard-card-number txtWeight">Customer Delivery Feedback</p>

        <CCol className="dashboard-header-input border-bottom-1px mt-2" md={6}>
          <CRow>
            <CCol md="1">
              <ThumbUpAlt className="stock-toggle-icon  dashboard-header-light-text greatlblColor" />
            </CCol>
            <CCol md="11">
              <span className="txtNmbr">17 positive response</span>
              <span className=""> on 900 deliveries</span>
            </CCol>
          </CRow>
        </CCol>
        <CCol className="dashboard-header-input border-bottom-1px mt-2" md={6}>
          <CRow>
            <CCol md="1">
              <ThumbDownAlt className="stock-toggle-icon  dashboard-header-light-text poorlblColor" />
            </CCol>
            <CCol md="11">
              <span className="txtNmbr">17 negative response</span>
              <span className=""> on 900 deliveries</span>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <DAFeedbackCard />
        </CCol>
      </CRow>
    </CContainer>
  );
};
export default DAOverviewTab;

import React from 'react';
import { CCard, CCardBody, CCol, CProgress, CRow, CProgressBar } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';

import { calculateColorStatus } from 'src/helpers/calculateColorStatus';
import { calculateLblColor } from 'src/helpers/calculateLblColor';
import { daTruncateAndCapitalize } from 'src/helpers/daTruncateAndCapitalize';
import { calculateProgressBarValues } from 'src/helpers/calculateProgressBarValues';

const StatusMetricCard = (prop) => {
  const { val, attributesStatus2, attributesStatus3 } = prop;

  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CRow>
          <CCol md={6}>
            <p className="dashboard-light-text txt-FontWeight">On Road Safety Score</p>
          </CCol>
          <CCol md={6}>
            <strong className="dashboard-light-text FloatRight">View All Safety Metric</strong>
          </CCol>
        </CRow>
        <CRow></CRow>
        <CRow className="pb-3 border-bottom-1px">
          <p className={calculateLblColor(val)}>
            {daTruncateAndCapitalize(calculateColorStatus(val))}
          </p>
          {[1, 2, 3, 4].map((data, index) => (
            <CCol key={index} md={3}>
              <CProgress height={15} value={calculateProgressBarValues(val)?.[index] * 4}>
                <CProgressBar className={calculateColorStatus(val)} />
              </CProgress>
            </CCol>
          ))}
        </CRow>

        <CRow className="mt-2 pb-2">
          {attributesStatus2?.map((item, index) => (
            <CCol className="mb-3 basic-drop-shadow" key={index} md={3}>
              <p className="DAdashboard-performance-title">
                {item.title} <CIcon icon={cilInfo} />
              </p>
              <CRow>
                <CCol className="" md={6}>
                  <p
                    className={
                      calculateLblColor(item.value) + ' dashboard-card-number txtFont-Weight '
                    }
                  >
                    {daTruncateAndCapitalize(calculateColorStatus(item.value))}
                  </p>
                </CCol>
                <CCol className="" md={6}>
                  <p className="dashboard-card-number fontsize FloatRight">{item.value}%</p>
                </CCol>
              </CRow>
            </CCol>
          ))}
          {attributesStatus3?.map((item, index) => (
            <CCol className="mb-3 basic-drop-shadow" key={index} md={4}>
              <p className="DAdashboard-performance-title">
                {item.title} <CIcon icon={cilInfo} />
              </p>
              <CRow>
                <CCol className="" md={6}>
                  <p
                    className={
                      calculateLblColor(item.value) + ' dashboard-card-number txtFont-Weight '
                    }
                  >
                    {daTruncateAndCapitalize(calculateColorStatus(item.value))}
                  </p>
                </CCol>
                <CCol className="" md={6}>
                  <p className="dashboard-card-number fontsize FloatRight">{item.value}%</p>
                </CCol>
              </CRow>
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default StatusMetricCard;

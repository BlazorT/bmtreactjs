import { CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { LineChart } from '@mui/x-charts';
import React from 'react';

const LineCharCard = (prop) => {
  const { attributesStatus2, attributesStatus3 } = prop;
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [
    'Jan',
    'Feb',
    'Mar',
    'April',
    'May',
    'June',
    'July',
  ];
  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CRow className="mt-2 pb-2">
      
            <CCol className="mb-3 basic-drop-shadow" md={12}>
              {/*<p className="DAdashboard-performance-title">{item.title}</p>*/}
              {/*<p className="dashboard-light-text ">{item.status}</p>*/}
              {/*<p className="dashboard-light-text ">{item.heading}</p>*/}
              {/*<p className="dashboard-light-text ">{item.heading2}</p>*/}
              
              <LineChart
                width={980}
                height={500}
                series={[
                  { data: pData, label: 'Notification' },
                  { data: uData, label: 'Funds' },

                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
              />
            </CCol>
        
         
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default LineCharCard;

import { CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { LineChart } from '@mui/x-charts';
import React from 'react';

const LineCharCard = (prop) => {
  const { attributesStatus2, attributesStatus3 } = prop;
  const uData = [1000, 1500, 2000, 2780, 1890, 3090, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = ['Nov 28', 'Nov 29', 'Nov 30', 'Dec 1', 'Dec 2', 'Dec 3', 'Dec 4'];
  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CRow className="mt-2 pb-2">
          {attributesStatus2?.map((item, index) => (
            <CCol className="mb-3 basic-drop-shadow" key={index} md={4}>
              <p className="DAdashboard-performance-title">{item.title}</p>
              <p className="dashboard-light-text ">{item.status}</p>
              <p className="dashboard-light-text ">{item.heading}</p>
              <p className="dashboard-light-text ">{item.heading2}</p>
              {/*<LineChart*/}
              {/*  xAxis={[*/}
              {/*    {*/}
              {/*      data: [12, 34, 23, 11, 1, 33],*/}

              {/*    },*/}
              {/*  ]}*/}
              {/*  series={[*/}
              {/*    {*/}
              {/*      data: [2, 5.5, 2, 8.5, 1.5, 5],*/}
              {/*    },*/}
              {/*  ]}*/}
              {/*  width={250}*/}
              {/*  height={200}*/}
              {/*/>*/}
              <LineChart
                width={250}
                height={200}
                series={[{ data: uData }]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
              />
            </CCol>
          ))}
          {attributesStatus3?.map((item, index) => (
            <CCol className="mb-3 basic-drop-shadow mt-2" key={index} md={4}>
              <p className="DAdashboard-performance-title">{item.title}</p>
              <p className="dashboard-light-text ">{item.status}</p>
              <p className="dashboard-light-text ">{item.heading}</p>
              <p className="dashboard-light-text ">{item.heading2}</p>
              <LineChart
                width={250}
                height={200}
                series={[{ data: pData }]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
              />
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default LineCharCard;

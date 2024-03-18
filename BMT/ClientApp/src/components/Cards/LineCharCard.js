import { CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { LineChart } from '@mui/x-charts';
import React from 'react';
import { CChart } from '@coreui/react-chartjs'
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
              width={1650}
              height={960}
              series={[
                { data: pData, label: 'Notifications' },
                { data: uData, label: 'Funds' },
              ]}
              xAxis={[{ scaleType: 'point', data: xLabels }]}
            />
            {/*<CChart*/}
            {/*  type="line"*/}
            {/*  data={{*/}
            {/*    labels: ["January", "February", "March", "April", "May", "June", "July"],*/}
            {/*    datasets: [*/}
            {/*      {*/}
            {/*        label: "Notifications",*/}
            {/*        backgroundColor: "rgba(220, 220, 220, 0.2)",*/}
            {/*        borderColor: "rgba(220, 220, 220, 1)",*/}
            {/*        pointBackgroundColor: "rgba(220, 220, 220, 1)",*/}
            {/*        pointBorderColor: "#fff",*/}
            {/*        color:"#f7fafd",*/}
            {/*        data: [40, 20, 12, 39, 10, 40, 39, 80, 40]*/}
            {/*      },*/}
            {/*      {*/}
            {/*        label: "Funds",*/}
            {/*        backgroundColor: "rgba(151, 187, 205, 0.2)",*/}
            {/*        borderColor: "rgba(151, 187, 205, 1)",*/}
            {/*        pointBackgroundColor: "rgba(151, 187, 205, 1)",*/}
            {/*        pointBorderColor: "#fff",*/}
            {/*        color: "#f7fafd",*/}
            {/*        data: [50, 12, 28, 29, 7, 25, 12, 70, 60]*/}
            {/*      },*/}
            {/*    ],*/}
            {/*  }}*/}
            {/*  options={{*/}
            {/*    plugins: {*/}
            {/*      legend: {*/}
            {/*        labels: {*/}
            {/*          color: "rgba(151, 187, 205, 0.2)",*/}
            {/*        }*/}
            {/*      }*/}
            {/*    },*/}
            {/*    scales: {*/}
            {/*      x: {*/}
            {/*        grid: {*/}
            {/*          color:"#f7fafd",*/}
            {/*        },*/}
            {/*        ticks: {*/}
            {/*          color: "#f7fafd",*/}
            {/*        },*/}
            {/*      },*/}
            {/*      y: {*/}
            {/*        grid: {*/}
            {/*          color: "#f7fafd",*/}
            {/*        },*/}
            {/*        ticks: {*/}
            {/*          color: "#f7fafd",*/}
            {/*        },*/}
            {/*      },*/}
            {/*    },*/}
            {/*  }}*/}
            {/*/>*/}
            </CCol>
        
         
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default LineCharCard;

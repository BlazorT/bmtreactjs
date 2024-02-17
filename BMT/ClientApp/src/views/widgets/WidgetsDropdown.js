// /* eslint-disable prettier/prettier */
// import React, { useState } from 'react';
// import { CRow, CCol, CWidgetStatsA } from '@coreui/react';

// import { CChartBar } from '@coreui/react-chartjs';

// const WidgetsDropdown = () => {
//   const [record, setrecord] = useState([]);

//   React.useEffect(() => {
//     fetchData();
//   }, []);
//   const fetchData = async () => {
//     const data = {
//       storeid: '1',
//       status: '1',
//     };
//     try {
//       const response = await fetch('/BlazorApi/posdashboard', {
//         method: 'POST',
//         headers: {
//           Authorization: `cVQ-h9G7QPCs3ErRdmsGNE:APA91bGlsWbE6ouc9jbIskdJOSF0SqwWq-9HXGGeewcs5ESpH-ryhoKYgcYIx19Iay_geMmufvWNb0M6woPo1jYNvIS0tiGZjXluSDuDbLeHyDeHJJ1ZGL_eq06EVb_0AyfsVeCjHND8`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
//       const jsonData = await response.json();
//       /*console.log(jsonData);*/
//       setrecord(jsonData.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   const totalOrdersData = record.map((item) => item.totalOrders);
//   const totalsum = totalOrdersData.reduce((sum, item) => (sum = sum + item), 0);
//   const newOrdersData = record.map((item) => item.newOrders);
//   const Newsum = newOrdersData.reduce((sum, item) => (sum = sum + item), 0);
//   const months = record.map((item) => item.dataOfMonth);
//   const funds = record.map((item) => item.fundsAmount);
//   const fundssum = funds.reduce((sum, item) => (sum = sum + item), 0);

//   return (
//     <CRow>
//       {/*<CCol sm={6} lg={3}>*/}
//       {/*  <CWidgetStatsA*/}
//       {/*    className="mb-4"*/}
//       {/*    color="primary"*/}
//       {/*    value={*/}
//       {/*      <>*/}
//       {/*        26K{' '}*/}
//       {/*        <span className="fs-6 fw-normal">*/}
//       {/*          (-12.4% <CIcon icon={cilArrowBottom} />)*/}
//       {/*        </span>*/}
//       {/*      </>*/}
//       {/*    }*/}
//       {/*    title="Users"*/}
//       {/*    action={*/}
//       {/*      <CDropdown alignment="end">*/}
//       {/*        <CDropdownToggle color="transparent" caret={false} className="p-0">*/}
//       {/*          <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />*/}
//       {/*        </CDropdownToggle>*/}
//       {/*        <CDropdownMenu>*/}
//       {/*          <CDropdownItem>Action</CDropdownItem>*/}
//       {/*          <CDropdownItem>Another action</CDropdownItem>*/}
//       {/*          <CDropdownItem>Something else here...</CDropdownItem>*/}
//       {/*          <CDropdownItem disabled>Disabled action</CDropdownItem>*/}
//       {/*        </CDropdownMenu>*/}
//       {/*      </CDropdown>*/}
//       {/*    }*/}
//       {/*    chart={*/}
//       {/*      <CChartLine*/}
//       {/*        className="mt-3 mx-3"*/}
//       {/*        style={{ height: '70px' }}*/}
//       {/*        data={{*/}
//       {/*          labels: months,*/}
//       {/*          datasets: [*/}
//       {/*            {*/}
//       {/*              label: 'My First dataset',*/}
//       {/*              backgroundColor: 'transparent',*/}
//       {/*              borderColor: 'rgba(255,255,255,.55)',*/}
//       {/*              pointBackgroundColor: getStyle('--cui-primary'),*/}
//       {/*              data: totalOrdersData ,*/}
//       {/*            },*/}
//       {/*          ],*/}
//       {/*        }}*/}
//       {/*        options={{*/}
//       {/*          plugins: {*/}
//       {/*            legend: {*/}
//       {/*              display: false,*/}
//       {/*            },*/}
//       {/*          },*/}
//       {/*          maintainAspectRatio: false,*/}
//       {/*          scales: {*/}
//       {/*            x: {*/}
//       {/*              grid: {*/}
//       {/*                display: false,*/}
//       {/*                drawBorder: false,*/}
//       {/*              },*/}
//       {/*              ticks: {*/}
//       {/*                display: false,*/}
//       {/*              },*/}
//       {/*            },*/}
//       {/*            y: {*/}
//       {/*              min: 30,*/}
//       {/*              max: 89,*/}
//       {/*              display: false,*/}
//       {/*              grid: {*/}
//       {/*                display: false,*/}
//       {/*              },*/}
//       {/*              ticks: {*/}
//       {/*                display: false,*/}
//       {/*              },*/}
//       {/*            },*/}
//       {/*          },*/}
//       {/*          elements: {*/}
//       {/*            line: {*/}
//       {/*              borderWidth: 1,*/}
//       {/*              tension: 0.4,*/}
//       {/*            },*/}
//       {/*            point: {*/}
//       {/*              radius: 4,*/}
//       {/*              hitRadius: 10,*/}
//       {/*              hoverRadius: 4,*/}
//       {/*            },*/}
//       {/*          },*/}
//       {/*        }}*/}
//       {/*      />*/}
//       {/*    }*/}
//       {/*  />*/}
//       {/*</CCol>*/}

//       <CCol sm={6} lg={4}>
//         <CWidgetStatsA
//           className="mb-3"
//           color="info"
//           value={totalsum}
//           title="Total Orders"
//           chart={
//             <CChartBar
//               className="mt-3 mx-3"
//               style={{ height: '60px' }}
//               data={{
//                 labels: months,
//                 datasets: [
//                   {
//                     label: 'Total Orders',
//                     backgroundColor: 'rgba(255,255,255,.2)',
//                     borderColor: 'rgba(255,255,255,.55)',
//                     data: totalOrdersData,
//                     barPercentage: 0.6,
//                   },
//                 ],
//               }}
//               options={{
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: {
//                     display: false,
//                   },
//                 },
//                 scales: {
//                   x: {
//                     grid: {
//                       display: false,
//                       drawTicks: false,
//                     },
//                     ticks: {
//                       display: false,
//                     },
//                   },
//                   y: {
//                     grid: {
//                       display: false,
//                       drawBorder: false,
//                       drawTicks: false,
//                     },
//                     ticks: {
//                       display: false,
//                     },
//                   },
//                 },
//               }}
//             />
//           }
//         />
//       </CCol>
//       <CCol sm={6} lg={4}>
//         <CWidgetStatsA
//           className="mb-3"
//           color="success"
//           value={Newsum}
//           title="New Orders"
//           chart={
//             <CChartBar
//               className="mt-3 mx-3"
//               style={{ height: '60px' }}
//               data={{
//                 labels: months,
//                 datasets: [
//                   {
//                     label: 'New Orders',
//                     backgroundColor: 'rgba(255,255,255,.2)',
//                     borderColor: 'rgba(255,255,255,.55)',
//                     data: newOrdersData,
//                     barPercentage: 0.6,
//                   },
//                 ],
//               }}
//               options={{
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: {
//                     display: false,
//                   },
//                 },
//                 scales: {
//                   x: {
//                     grid: {
//                       display: false,
//                       drawTicks: false,
//                     },
//                     ticks: {
//                       display: false,
//                     },
//                   },
//                   y: {
//                     grid: {
//                       display: false,
//                       drawBorder: false,
//                       drawTicks: false,
//                     },
//                     ticks: {
//                       display: false,
//                     },
//                   },
//                 },
//               }}
//             />
//           }
//         />
//       </CCol>
//       <CCol sm={6} lg={4}>
//         <CWidgetStatsA
//           className="mb-3"
//           color="warning"
//           value={<>Rs: {fundssum}</>}
//           title="Total Funds"
//           chart={
//             <CChartBar
//               className="mt-3 mx-3"
//               style={{ height: '60px' }}
//               data={{
//                 labels: months,
//                 datasets: [
//                   {
//                     label: 'Funds',
//                     backgroundColor: 'rgba(255,255,255,.2)',
//                     borderColor: 'rgba(255,255,255,.55)',
//                     data: funds,
//                     barPercentage: 0.6,
//                   },
//                 ],
//               }}
//               options={{
//                 maintainAspectRatio: false,
//                 plugins: {
//                   legend: {
//                     display: false,
//                   },
//                 },
//                 scales: {
//                   x: {
//                     grid: {
//                       display: false,
//                       drawTicks: false,
//                     },
//                     ticks: {
//                       display: false,
//                     },
//                   },
//                   y: {
//                     grid: {
//                       display: false,
//                       drawBorder: false,
//                       drawTicks: false,
//                     },
//                     ticks: {
//                       display: false,
//                     },
//                   },
//                 },
//               }}
//             />
//           }
//         />
//       </CCol>
//     </CRow>
//   );
// };

// export default WidgetsDropdown;

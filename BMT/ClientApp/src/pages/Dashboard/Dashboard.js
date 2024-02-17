import React, { useState } from 'react';

import { CCol, CRow, CContainer, CCollapse } from '@coreui/react';
import { cilBell, cilTruck, cilBarChart, cilFire, cilSpeedometer } from '@coreui/icons';

import DashBoardCard from '../../components/Cards/DashBoardCard';
import CollapseHeader from 'src/components/DADashboardComponents/CollapseHeader';
import { useSelector } from 'react-redux';
import AppContainer from 'src/components/UI/AppContainer';

const Dashboard = () => {
  const [operationsVisible, setOperationVisible] = useState(true);
  const [peopleVisible, setPeopleVisible] = useState(true);

  const user = useSelector((state) => state.user);

  return (
    <AppContainer>
      <CContainer fluid className="dashboard-header">
        <CRow>
          <CCol className="dashboard-header-input" md={2}>
            <p className="dashboard-header-dark-text">Hello, {user.userInfo.dspName} </p>
            <p className="dashboard-header-light-text">Week 46: Wednesday, November 15</p>
          </CCol>
          <CCol className="dashboard-header-input" md={8}>
            <div className="d-flex justify-content-center align-items-center gap-5">
              <div>
                <p className="dashboard-header-light-text">Ittenaries</p>
                <p className="dashboard-card-number">0</p>
              </div>
              <div>
                <p className="dashboard-header-light-text">In Progress</p>
                <p className="dashboard-card-number">0</p>
              </div>
              <div>
                <p className="dashboard-header-light-text">Work Hour Risk</p>
                <p className="dashboard-card-number">0</p>
              </div>
            </div>
          </CCol>
          <CCol className="dashboard-header-input" md={2}>
            <input
              type="number"
              className="form-control item dashboard-selection-field"
              id="work"
              name="work"
              placeholder="work"
            />
          </CCol>
        </CRow>
      </CContainer>
      <CContainer fluid className="mt-2">
        <CRow>
          <CollapseHeader
            title="Operations"
            isVisible={operationsVisible}
            toggleVisible={() => setOperationVisible((prev) => !prev)}
          />
          <CCollapse visible={operationsVisible} className="mt-3">
            <CRow>
              <CCol md={4}>
                <DashBoardCard
                  icon={cilBell}
                  size="xl"
                  title="Communication"
                  subHeading="Unread communications"
                  headerContent={[{ number: 136, title: '0 today' }]}
                  fotterTitle="Latest Unread Message"
                  fotterMessage=""
                  fotterContent={[
                    { title: 'Peak OverTime Support', number: null },
                    { title: 'Peak OverTime Support', number: null },
                    { title: 'Peak OverTime Support', number: null },
                  ]}
                />
              </CCol>
              <CCol md={4}>
                <DashBoardCard
                  icon={cilTruck}
                  title="Fleet"
                  subHeading="55 registered / 55 authorized"
                  headerContent={[
                    { number: 49, title: 'Acitve' },
                    { number: 49, title: 'Out of service' },
                  ]}
                  fotterTitle=""
                  fotterMessage="Address grounded vehicles"
                  fotterContent={[
                    { title: 'Grounded', number: 5 },
                    {
                      title: 'Due in next 3 days',
                      number: 0,
                      subInfo: [
                        { title: 'Low severity issue', number: 0 },
                        { title: 'Rental renewal', number: 0 },
                      ],
                    },
                  ]}
                />
              </CCol>
              <CCol md={4}>
                <DashBoardCard
                  icon={cilBarChart}
                  title="Work Summary"
                  subHeading="Tuesday, November 15"
                  headerContent={[
                    { number: 0, title: 'Routes Completed' },
                    { number: 49, title: 'Schedule' },
                  ]}
                  fotterTitle=""
                  fotterMessage="Submit change request"
                  fotterContent={[
                    { title: 'AMZL late cancel', number: 5 },
                    { title: 'Dsp late cancel', number: 0 },
                    { title: 'Training day', number: 5 },
                  ]}
                />
              </CCol>
            </CRow>
          </CCollapse>
        </CRow>
      </CContainer>
      <CContainer fluid className="mt-3">
        <CRow>
          <CollapseHeader
            title="People"
            isVisible={peopleVisible}
            toggleVisible={() => setPeopleVisible((prev) => !prev)}
          />
          <CCollapse visible={peopleVisible} className="mt-3">
            <CRow>
              <CCol md={4}>
                <DashBoardCard
                  icon={cilFire}
                  title="Celebrations"
                  subHeading="Work anniversaries"
                  headerContent={[
                    { number: 1, title: 'today' },
                    { number: 4, title: 'in next 7 days' },
                  ]}
                  fotterTitle=""
                  fotterMessage=""
                  fotterContent={[
                    { title: 'Maya Jane Smith', time: '5 month', day: 'Today' },
                    { title: 'Jordan Nicole', time: '2 year', day: 'Tuesday' },
                    { title: 'Bruce Wayne', time: '7 month', day: 'Wednesday' },
                    { title: 'Petter Parker', time: '1 year', day: 'Sunday' },
                  ]}
                />
              </CCol>
              <CCol md={4}>
                <DashBoardCard
                  val={90}
                  icon={cilSpeedometer}
                  title="Performance"
                  subHeading="Week 45"
                  attributesStatus={[
                    { title: 'Safety', status: 'Fantastic' },
                    { title: 'Quality', status: 'Great' },
                    { title: 'Compliance', status: 'Compliant' },
                    { title: 'Team', status: 'Great' },
                  ]}
                />
              </CCol>
              <CCol md={4}>
                <DashBoardCard
                  title="Performance Remains"
                  fotterMessage="Talk to your team about performance"
                  teamStatus={[
                    { name: 'Frank Park Pan', status: 'Fair' },
                    { name: 'Alice Shane James', status: 'Fair' },
                    { name: 'Peter Mark Law', status: 'Fair' },
                  ]}
                />
              </CCol>
            </CRow>
          </CCollapse>
        </CRow>
      </CContainer>
    </AppContainer>
  );
};

export default Dashboard;

import React from 'react';

import { CCard, CCardBody, CCol, CProgress, CRow, CProgressBar } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilAsteriskCircle, cilExternalLink } from '@coreui/icons';
import { calculateColorStatus } from 'src/helpers/calculateColorStatus';
import { calculateLblColor } from 'src/helpers/calculateLblColor';
import { daTruncateAndCapitalize } from 'src/helpers/daTruncateAndCapitalize';
import { calculateProgressBarValues } from 'src/helpers/calculateProgressBarValues';

import { useNavigate } from 'react-router-dom';

const DashBoardCard = (prop) => {
  const {
    title,
    overAllStatus,
    attributesStatus,
    teamStatus,
    icon,
    subHeading,
    fotterMessage,
    headerContent,
    fotterTitle,
    fotterContent,
  } = prop;

  const navigate = useNavigate();
  const navigateDashboard = () => {
    if (title === 'Fleet') navigate('/fleet-dashboard');
  };
  const { val, attributesStatus2, attributesStatus3 } = prop;

  const PerformanceRemainsCard = () => {
    return (
      <CCard className="dashboard-card-body" textColor="white">
        <CCardBody>
          <CRow className="mt-2">
            <div
              style={{
                color: 'white',
                display: 'flex',
                textAlign: 'center',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
              }}
            >
              <CIcon
                style={{ marginRight: '8px', color: '#3399FF' }}
                icon={cilAsteriskCircle}
                size="sm"
              />
              {fotterMessage}
            </div>
          </CRow>
          {teamStatus?.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItemsms: 'center',
                paddingLeft: '28px',
                paddingRight: '28px',
                marginTop: '10px',
              }}
            >
              <p style={{ margin: '0px', color: '#3399FF' }}>{item.name}</p>
              <p style={{ margin: '0px', color: 'orange' }}>{item.status}</p>
            </div>
          ))}
        </CCardBody>
      </CCard>
    );
  };

  const Performance = () => {
    return (
      <CCard className="dashboard-card-body" textColor="white">
        <CCardBody>
          {/*<CRow>*/}
          {/*  <p className="dashboard-card-status">{overAllStatus}</p>*/}
          {/*</CRow>*/}
          <CRow className="pb-3 ">
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
        </CCardBody>
      </CCard>
    );
  };

  const PerformanceCard = () => {
    return (
      <CCard className="dashboard-card-body" textColor="white">
        <CCardBody>
          <CRow className="pb-2 border-bottom-1px">
            <CCol xs="auto" className="me-auto">
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  flexDirection: 'row',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                <CIcon style={{ marginRight: '8px' }} icon={icon} size="sm" />
                {title}
              </div>
              <p className="dashboard-light-text">{subHeading}</p>
            </CCol>
            <CCol xs="auto">
              <CIcon icon={cilExternalLink} size="sm" />
            </CCol>
          </CRow>
          <CRow>
            <p className="dashboard-light-text">Overall Quality Score</p>
          </CRow>
          <CRow>
            <p className="dashboard-card-status">{overAllStatus}</p>
          </CRow>
          <CRow className="pb-3 border-bottom-1px">
            <CCol md={3}>
              <CProgress className="dashboard-card-progress-bar" height={15} value={100} />
            </CCol>
            <CCol md={3}>
              <CProgress className="dashboard-card-progress-bar" height={15} value={100} />
            </CCol>
            <CCol md={3}>
              <CProgress className="dashboard-card-progress-bar" height={15} value={100} />
            </CCol>
            <CCol md={3}>
              <CProgress className="dashboard-card-progress-bar" height={15} value={100} />
            </CCol>
          </CRow>
          <CRow className="mt-2 pb-2">
            {attributesStatus?.map((item, index) => (
              <CCol className="mb-3" key={index} md={6}>
                <CRow>
                  <CCol className="mb-3" md={6}>
                    <p className="DAdashboard-performance-title">{item.title}</p>
                  </CCol>
                  <CCol className="mb-3" md={6}>
                    <p className="dashboard-card-number">{item.status}</p>
                  </CCol>
                </CRow>
              </CCol>
            ))}
          </CRow>
        </CCardBody>
      </CCard>
    );
  };
  const RestCards = () => {
    return (
      <CCard className="dashboard-card-body" textColor="white">
        <CCardBody>
          <CRow className="mt-2">
            <CCol xs="auto" className="me-auto">
              <div
                style={{
                  display: 'flex',
                  textAlign: 'center',
                  flexDirection: 'row',
                  justifyContent: 'start',
                  alignItems: 'center',
                  fontSize: '20px',
                }}
              >
                <CIcon style={{ marginRight: '8px' }} icon={icon} size="sm" />
                {title}
              </div>
              <p className="dashboard-light-text">{subHeading}</p>
            </CCol>
            <CCol xs="auto">
              <CIcon
                icon={cilExternalLink}
                className="cursor-pointer"
                onClick={() => navigateDashboard()}
                size="sm"
              />
            </CCol>
          </CRow>
          <CRow className="border-bottom-1px pb-2">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px',
              }}
            >
              {/*{title === 'Fleet' &&
              <CProgress style={{ width: '100%' }} value={50} />
            }*/}
              {headerContent?.map((data, index) => (
                <div key={index}>
                  {title === 'Communication' || title === 'Celebrations' ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'start',
                        alignItems: 'center',
                      }}
                    >
                      <p style={{ margin: '0px' }} className="dashboard-card-number">
                        {data.number}
                      </p>
                      <p style={{ margin: '0px', color: '#DBDAC2', marginLeft: '10px' }}>
                        {data.title}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginTop: '5px' }}>
                        <p style={{ margin: '0px' }} className="dashboard-light-text">
                          {data.title}
                        </p>
                        <p style={{ margin: '0px' }} className="dashboard-card-number">
                          {data.number}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CRow>

          <CRow
            className={
              title === 'Fleet' || title === 'Work Summary' ? 'mt-2 pb-3 border-bottom-1px' : 'mt-2'
            }
          >
            <p className="dashboard-light-text">{fotterTitle}</p>
            {fotterContent?.map((data, index) => {
              return (
                <div key={index}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {title !== 'Celebrations' && (
                      <>
                        <p style={{ color: '#3399FF' }} className="communication-card-message-text">
                          {data.title}
                        </p>
                        <p className="communication-card-message-text">
                          {data.number ?? data.number}
                        </p>
                      </>
                    )}
                    {title === 'Celebrations' && (
                      <>
                        <p
                          style={{ width: '40%', textAlign: 'left', color: '#3399FF' }}
                          className="communication-card-message-text"
                        >
                          {data.title}
                        </p>
                        <p
                          style={{ width: '20%', textAlign: 'left' }}
                          className="communication-card-message-text"
                        >
                          {data.time ?? data.time}
                        </p>
                        <p
                          style={{ width: '40%', textAlign: 'end' }}
                          className="communication-card-message-text"
                        >
                          {data.day ?? data.day}
                        </p>
                      </>
                    )}
                  </div>
                  {data.subInfo?.map((info, index) => (
                    <div
                      key={index}
                      style={{
                        paddingTop: '8px',
                        paddingLeft: '50px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <p style={{ color: '#DBDAC2' }} className="communication-card-message-text">
                        {info.title}
                      </p>
                      <p style={{ color: '#DBDAC2' }} className="communication-card-message-text">
                        {info.number}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}
          </CRow>
          {fotterMessage !== '' && (
            <CRow className="mt-2">
              <div
                style={{
                  color: '#3399FF',
                  display: 'flex',
                  textAlign: 'center',
                  flexDirection: 'row',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                <CIcon style={{ marginRight: '8px' }} icon={cilAsteriskCircle} size="sm" />
                {fotterMessage}
              </div>
            </CRow>
          )}
        </CCardBody>
      </CCard>
    );
  };

  if (title === 'Performance') return <Performance />;
  if (title === 'PerformanceCard') return <PerformanceCard />;
  if (title === 'Performance Remains') return <PerformanceRemainsCard />;
  return <RestCards />;
};

export default DashBoardCard;

import React from 'react';
import {
  cilCamera,
  cilContact,
  cilFrown,
  cilLocationPin,
  cilPhone,
  cilResizeWidth,
  cilSignLanguage,
  cilSortAscending,
  cilSpeech,
  cilSpeedometer,
  cilStar,
  cilThumbDown,
  cilWarning,
  cilThumbUp,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import ThumbDownAlt from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react';

import DAFeedbackCard from './DAFeedbackCard';

const RoadSafetyCard = (prop) => {
  const { overAllStatus, workStatus } = prop;
  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CRow>
          <strong className=" dashboard-card-status">On-Road Safety</strong>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilContact} size="xl" />
            <strong className="dashboard-light-text">Seat belt-off</strong>
          </div>
          <p className="dashboard-light-text">{overAllStatus}</p>
        </CRow>
        <CRow className="pt-2">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilSpeedometer} size="xl" />
            <strong className="dashboard-light-text">Speeding</strong>
          </div>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <p className="dashboard-light-text">{workStatus}</p>
        </CRow>
        <CRow className=" border-bottom-1px">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilStar} size="lg" />
            <span className="txtNmbr">Perfect Score</span>
          </div>
        </CRow>

        <CRow className="pt-2">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilSpeedometer} size="xl" />
            <strong className="dashboard-light-text">Distractions</strong>
          </div>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <p className="dashboard-light-text">0 Events</p>
        </CRow>
        <CRow className=" border-bottom-1px">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilStar} size="lg" />
            <span className="txtNmbr">Perfect Score</span>
          </div>
        </CRow>

        <CRow className="pt-2">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilResizeWidth} size="xl" />
            <strong className="dashboard-light-text">Following Distance</strong>
          </div>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <p className="dashboard-light-text">0 Events</p>
        </CRow>
        <CRow className=" border-bottom-1px">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilStar} size="lg" />
            <span className="txtNmbr">Perfect Score</span>
          </div>
        </CRow>

        <CRow className="pt-2">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilSortAscending} size="xl" />
            <strong className="dashboard-light-text">Sign and signal violations</strong>
          </div>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <p className="dashboard-light-text">0 Events</p>
        </CRow>
        <CRow className=" border-bottom-1px">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilStar} size="lg" />
            <span className="txtNmbr">Perfect Score</span>
          </div>
        </CRow>

        <CRow className="pt-2">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilSpeedometer} size="xl" />
            <strong className="dashboard-light-text">Fico</strong>
          </div>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <p className="dashboard-light-text">0 Events</p>
        </CRow>
        <CRow className=" border-bottom-1px">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilStar} size="lg" />
            <span className="txtNmbr">Perfect Score</span>
          </div>
        </CRow>

        <CRow className="pb-2 border-bottom-1px">
          <CRow>
            <strong className="dashboard-card-status ">Delivery Quality</strong>
          </CRow>
        </CRow>
        <CRow className="pt-2">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilWarning} size="xl" />
            <strong className="dashboard-light-text">Delivered not recieved</strong>
          </div>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <p className="dashboard-light-text">0 / 788 Delivery</p>
        </CRow>
        <CRow className=" border-bottom-1px">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilStar} size="lg" />
            <span className="txtNmbr">Perfect Score</span>
          </div>
        </CRow>

        <CRow className="pt-2">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilCamera} size="xl" />
            <strong className="dashboard-light-text">Photo On Delivery</strong>
          </div>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <p className="dashboard-light-text">750 / 788 good quality pictures</p>
        </CRow>
        <CRow className=" border-bottom-1px">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilStar} size="lg" />
            <span className="txtNmbr">Perfect Score</span>
          </div>
        </CRow>

        <CRow className="pt-2">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilPhone} size="xl" />
            <strong className="dashboard-light-text">Contacts Completed</strong>
          </div>
        </CRow>
        <CRow className="pb-2 border-bottom-1px">
          <p className="dashboard-light-text">7 / 7 Prompts</p>
        </CRow>
        <CRow className=" border-bottom-1px">
          <div
            style={{
              display: 'flex',
              textAlign: 'center',
              flexDirection: 'row',
              justifyContent: 'start',
              alignItems: 'center',
            }}
          >
            <CIcon style={{ marginRight: '8px' }} icon={cilStar} size="lg" />
            <span className="txtNmbr">Perfect Score</span>
          </div>
        </CRow>
        <CRow>
          <p className="dashboard-card-number txtWeight">Customer Delivery Feedback</p>
          <CCol className="dashboard-header-input border-bottom-1px mt-2" md={6}>
            <CRow>
              <CCol md="1">
                <ThumbUpAlt
                  className="stock-toggle-icon  dashboard-header-light-text greatlblColor"
                
                />
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
                <ThumbDownAlt
                  className="stock-toggle-icon  dashboard-header-light-text poorlblColor"

                />
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
      </CCardBody>
    </CCard>
  );
};
export default RoadSafetyCard;

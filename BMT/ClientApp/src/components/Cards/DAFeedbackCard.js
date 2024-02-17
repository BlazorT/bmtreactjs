import React from 'react';
import { CCard, CCardBody, CCol, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import EmojiEmotions from '@mui/icons-material/EmojiEmotions';
import Home from '@mui/icons-material/Home';
import Favorite from '@mui/icons-material/Favorite';
import FmdGood from '@mui/icons-material/FmdGood';
import Sms from '@mui/icons-material/Sms';
import Star from '@mui/icons-material/Star';
import Outlet from '@mui/icons-material/Outlet';
import Warning from '@mui/icons-material/Warning';
import CleanHands from '@mui/icons-material/CleanHands';
import {
  cilFrown,
  cilHeart,
  cilHome,
  cilLocationPin,
  cilSignLanguage,
  cilSmile,
  cilSpeech,
  cilStar,
  cilWarning,
} from '@coreui/icons';

const DAFeedbackCard = () => {
  return (
    <CCard className="dashboard-card-body" textColor="white">
      <CCardBody>
        <CRow className="pb-2 ">
          <CCol md="6">
            <div className="pb-2 d-flex text-center justify-content-start align-items-center">
              <strong className="dashboard-card-number2">Positive Comments</strong>
            </div>
            <CRow className="pb-2 ">
              <CCol md="8">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center">
                  <Favorite
                    className="stock-toggle-icon dashboard-header-light-text greatlblColor mg-right"
                  />
                  <span className="">Delivered with care</span>
                </div>
              </CCol>
              <CCol md="4">
                <strong className="FloatRight">15</strong>
              </CCol>
            </CRow>
            <CRow className="pb-2 ">
              <CCol md="8">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center">
                  <Home
                    className="stock-toggle-icon dashboard-header-light-text greatlblColor mg-right"
                  />
                  <span className="">Respectful of property</span>
                </div>
              </CCol>
              <CCol md="4">
                <strong className="FloatRight">8</strong>
              </CCol>
            </CRow>
            <CRow className="pb-2 ">
              <CCol md="8">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center">
                  <EmojiEmotions
                    className="stock-toggle-icon dashboard-header-light-text greatlblColor mg-right"
                  />
                  <span className="">Friendly</span>
                </div>
              </CCol>
              <CCol md="4">
                <strong className="FloatRight">9</strong>
              </CCol>
            </CRow>
            <CRow className="pb-2 ">
              <CCol md="8">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center">
                  <Sms
                    className="stock-toggle-icon dashboard-header-light-text greatlblColor mg-right"
                  />
                  <span className="">Followed instructions</span>
                </div>
              </CCol>
              <CCol md="4">
                <strong className="FloatRight">1</strong>
              </CCol>
            </CRow>
            <CRow className="pb-2 ">
              <CCol md="8">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center">
                  <Star
                    className="stock-toggle-icon dashboard-header-light-text greatlblColor mg-right"
                  />
                  <span className="">Above and beyond</span>
                </div>
              </CCol>
              <CCol md="4">
                <strong className="FloatRight">5</strong>
              </CCol>
            </CRow>
          </CCol>
          <CCol md="6">
            <div className="pb-2 d-flex text-center justify-content-start align-items-center">
              <strong className="dashboard-card-number2">Negative Comments</strong>
            </div>
            <CRow className="pb-2 ">
              <CCol md="8">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center">
                  <CleanHands
                    className="stock-toggle-icon dashboard-header-light-text poorlblColor mg-right"
                  />
                  <span className="">Mishandled packeges</span>
                </div>
              </CCol>
              <CCol md="4">
                <strong className="FloatRight">10</strong>
              </CCol>
            </CRow>
            <CRow className="pb-2 ">
              <CCol md="10">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center ">
                  <Sms
                    className="stock-toggle-icon dashboard-header-light-text poorlblColor mg-right"
                  />
                  <span className="">Did not follow delivery instructions</span>
                </div>
              </CCol>
              <CCol md="2">
                <strong className="FloatRight">8</strong>
              </CCol>
            </CRow>
            <CRow className="pb-2 ">
              <CCol md="8">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center">
                  <Outlet
                    className="stock-toggle-icon dashboard-header-light-text poorlblColor mg-right"
                  />
                  <span className="">Unprofessional</span>
                </div>
              </CCol>
              <CCol md="4">
                <strong className="FloatRight">0</strong>
              </CCol>
            </CRow>
            <CRow className="pb-2 ">
              <CCol md="8">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center">
                  <FmdGood
                    className="stock-toggle-icon dashboard-header-light-text poorlblColor mg-right"
                  />
                  <span className="">Delivered wrong address</span>
                </div>
              </CCol>
              <CCol md="4">
                <strong className="FloatRight">0</strong>
              </CCol>
            </CRow>
            <CRow className="pb-2 ">
              <CCol md="8">
                <div className="pb-2 d-flex text-center justify-content-start align-items-center">
                  <Warning
                    className="stock-toggle-icon dashboard-header-light-text poorlblColor mg-right"
                  />
                  <span className="">Never recieved delivery</span>
                </div>
              </CCol>
              <CCol md="4">
                <strong className="FloatRight">0</strong>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};
export default DAFeedbackCard;

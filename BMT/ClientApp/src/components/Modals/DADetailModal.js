import React, { useEffect, useState } from 'react';

import CIcon from '@coreui/icons-react';
import { cilItalic, cilMinus, cilX } from '@coreui/icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { CCol, CFormCheck, CRow } from '@coreui/react';
import { formatDate } from 'src/helpers/formatDate';
import { cilEnvelopeClosed, cilPencil, cilPhone } from '@coreui/icons';
import CheckIcon from '@mui/icons-material/Check';
import HourglassFullTwoTone from '@mui/icons-material/HourglassFullTwoTone';
import Close from '@mui/icons-material/Close';

import CloseIcon from '@mui/icons-material/Close';

const DADetailModal = (prop) => {
  const { isOpen, toggle, user } = prop;
  const [data, setData] = useState([]);

  //useEffect(() => {
  //  if (user.length > 0) {
  //    setData([
  //      {
  //        label: 'Name',
  //        value: `${user ? user[0].firstName : ''} ${user ? user[0].lastName : ''}`,
  //      },

  //      {
  //        label: 'Email',
  //        value: user ? user[0].email : '',
  //      },

  //      {
  //        label: 'Code',
  //        value: user ? user[0].userId : '',
  //      },
  //      {
  //        label: 'Date of Joining',
  //        value: user ? formatDate(user[0].createdAt) : '',
  //      },
  //      {
  //        label: 'License No',
  //        value: user ? user[0].licenseNo : '',
  //      },
  //      {
  //        label: 'Address',
  //        value: user ? user[0].address : '',
  //      },
  //    ]);
  //  }
  //}, []);

  return (
    <Modal
      isOpen={isOpen}
      size="lg"
      fullscreen="lg"
      toggle={toggle}
      backdrop={false}
      className="field-mapping-modal"
      centered={true}
    >
      {/*<ModalHeader className="confirmation-modal-header">DA Detail Information</ModalHeader>*/}

      <ModalBody className="confirmation-modal-body">
        <CRow>
          <CCol md={3} className="text-left">
            <img
              className="user-profile-img"
              src={user.length > 0 ? (user[0].avatar != null ? user[0].avatar : 'nouser.jpg') : ''}
              alt="logo"
            />
          </CCol>
          <CCol md={7} className="text-left align-self-center">
            <h4 className="profile-user-name">{`${user.length > 0 ? user[0].firstName : ''} ${
              user.length > 0 ? user[0].lastName : '' 
              }, ${user.length > 0 ? user[0].userId : ''}`}</h4>
            <p className="profile-user-email">{user.length > 0 ? user[0].email : ''}</p>
            <p className="profile-user-role"> {user.length > 0 ? user[0].userRole : ''}</p>
            <p className="profile-user-role"> {user.length > 0 ? user[0].stateName : ''}</p>
            <p className="profile-user-role">
              {' '}
              <CIcon className="mglefticon " icon={cilPhone}></CIcon>{' '}
              {user.length > 0 ? user[0].primaryContact : ''}
            </p>
          </CCol>
          <CCol md={2}>
            <Close className="FloatRight" onClick={() => toggle()} fontSize="large" />
            {/*<CIcon  size="xxl" icon={cilX}></CIcon>*/}
          </CCol>
        </CRow>
        <CRow className="text-left mt-3 mb-3 border-bottom-custom"></CRow>
        {data.map((data, index) => (
          <CRow key={index} className="mb-3">
            <CCol md={3}>
              <label htmlFor="" className="profile-user-labels mt-2">
                {data.label}
              </label>
            </CCol>
            <CCol md={9}>
              <input className="form-control item user-profile-input" value={data.value} disabled />
            </CCol>
          </CRow>
        ))}
        <CRow>
          <CCol md={6} className="text-left">
            <h5>Complete Your Tasks</h5>
            <fieldset className="fieldset">
              <legend className="legend"></legend> 
            <div className=""><CheckIcon fontSize="medium" className="text-success " /><strong className="mg-left ">Associate settings</strong></div>
              <ul className="detaillist">
              <li>
                <p className="profile-user-role">enter associate delivery location and type of service</p>
                </li>
              </ul>
                <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Drug Test</strong></div>
              <ul className="detaillist">
                <li>
                  <p className="profile-user-role">confirm associate has passed the requird drug test</p>
                </li>
              </ul>
              <CRow className="text-left mt-3 mb-3 border-bottom-custom"></CRow>
              </fieldset>
            <h5 className="mt-3">Track Amazon Tasks</h5>
            <fieldset className="fieldset">
            <div>
              <legend></legend>
            <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Account Setup</strong></div>
                <ul className="detaillist">
                  <li>
                    <p className="profile-user-role">associate setup in amazon systems</p>
                  </li>
                </ul>
            <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Badge Printing</strong></div>
                <ul className="detaillist">
                  <li>
                    <p className="profile-user-role">print badge to access station</p>
                  </li>
                </ul>
            <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Background Check</strong></div>
            <ul className="detaillist">
              <li><CIcon className="mglefticon " icon={cilMinus}></CIcon><p className="mg-left ">Data submitted</p></li>
              <li><CIcon className="mglefticon " icon={cilMinus}></CIcon><p className="mg-left ">Order sent to vendor</p></li>
              <li><CIcon className="mglefticon " icon={cilMinus}></CIcon><p className="mg-left ">Approved</p></li>
            </ul>

            <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Drivers Record Verification</strong></div>
                <ul className="detaillist">
                  <li>
                    <p className="profile-user-role">check associate driving record</p>
                  </li>
                </ul>
            <div className="mt-2"><CheckIcon fontSize="medium" className="text-success " /><strong className="mg-left ">Drivers Licence Verification</strong></div>
                <ul className="detaillist">
                  <li>
                    <p className="profile-user-role">Drivers Licence Verification (Post onboarding)</p>
                  </li>
                </ul>
              </div>
            </fieldset>
              </CCol>
          <CCol md={6} className="text-left">
            <h5 >Track Associate Tasks</h5>
            <fieldset className="fieldset">
              <legend className="legend"></legend>
            <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Agreement</strong></div>
            <ul className="detaillist">
              <li><CIcon className="mglefticon " icon={cilMinus}></CIcon><p className="mg-left ">Arbitraction Agreement</p></li>
              <li><CIcon className="mglefticon " icon={cilMinus}></CIcon><p className="mg-left ">Privacy Notice</p></li>
            </ul>
            <div className="mt-2"><HourglassFullTwoTone fontSize="medium" /><strong className="mg-left ">Accept Invitation</strong></div>
              <ul className="detaillist">
                <li>
                  <p className="profile-user-role">recieve invitation and create amazon account</p>
                </li>
              </ul>
            <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Badge Photo</strong></div>
              <ul className="detaillist">
                <li>
                  <p className="profile-user-role">upload photo for badge</p>
                </li>
              </ul>
            <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Onboarding Videos</strong></div>
              <ul className="detaillist">
                <li>
                  <p className="profile-user-role">watch all onboarding videos</p>
                </li>
              </ul>
            <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Enter personal Information</strong></div>
              <ul className="detaillist">
                <li>
                  <p className="profile-user-role">profile</p>
                </li>
              </ul>
            <div className="mt-2"><CIcon className="mglefticon " icon={cilMinus}></CIcon><strong className="mg-left ">Drivers Licence</strong></div>
              <ul className="detaillist">
                <li>
                  <p className="profile-user-role">enter drivers licence details</p>
                </li>
              </ul>

            <div className="mt-2"><CheckIcon fontSize="medium" className="text-success " /><strong className="mg-left ">BGC Agreement Re-Acceptance</strong></div>
              <ul className="detaillist">
                <li>
                  <p className="profile-user-role">re-accepting background check</p>
                </li>
              </ul>
            </fieldset>
          </CCol>
        </CRow>
      </ModalBody>
      {/*<ModalFooter className="confirmation-modal-footer">*/}
      {/*  <button*/}
      {/*    onClick={() => toggle()}*/}
      {/*    type="button"*/}
      {/*    className="btn btn_Default m-2 sales-btn-style"*/}
      {/*  >*/}
      {/*    Cancel*/}
      {/*  </button>*/}
      {/*</ModalFooter>*/}
    </Modal>
  );
};
export default DADetailModal;

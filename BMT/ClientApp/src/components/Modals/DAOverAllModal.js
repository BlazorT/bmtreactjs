import React from 'react';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { CCol, CRow } from '@coreui/react';

const DAOverAllModal = (prop) => {
  const { isOpen, toggle } = prop;

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal">
      <ModalHeader>Delivery Contrast Map For Tracking ID : 7820HG72GF2</ModalHeader>
      <ModalBody className="paddingAllSide">
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Service Area / DSP
          </CCol>
          <CCol md={6}>
            <strong id="Nametext">WDE1 / 4DIM</strong>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Delivery Associate
          </CCol>
          <CCol md={6}>
            <strong>Destan e Foreman</strong>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Transporter ID
          </CCol>
          <CCol md={6}>
            <strong>2Gh2i28U98</strong>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Delivery Date
          </CCol>
          <CCol md={6}>
            <strong>31/10/2023 06:34:28</strong>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Concession Date
          </CCol>
          <CCol md={6}>
            <strong>23/11/2023 06:34:28</strong>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Delivery Details
          </CCol>
          <CCol md={6}>
            <strong>31891 DUANE DR, FRANKFORD DE, 19945 2828</strong>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Dropoff Location
          </CCol>
          <CCol md={6}>
            <strong>Delivered To Door Step</strong>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Distance Between Actual and Planned
          </CCol>
          <CCol md={6}>
            <strong>51.30 meter</strong>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Planned Location{' '}
          </CCol>
          <CCol md={6}>
            <strong>51.30373837 - 75.3789873</strong>
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol className="" md={6}>
            Actual Location{' '}
          </CCol>
          <CCol md={6}>
            <strong>51.30373837 - 75.3789873</strong>
          </CCol>
        </CRow>
        <CRow className="mt-4">
          <CCol md={12}>
            <strong>View More Detail On Cortex</strong>
          </CCol>
        </CRow>
      </ModalBody>
    </Modal>
  );
};
export default DAOverAllModal;

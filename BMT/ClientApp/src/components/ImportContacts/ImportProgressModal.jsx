/* eslint-disable react/prop-types */
// ============================================================================
// COMPONENT: ImportProgressModal.jsx
// ============================================================================
import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CProgress, CAlert } from '@coreui/react';
import Spinner from 'src/components/UI/Spinner';

const ImportProgressModal = ({ visible, progress, errors }) => {
  return (
    <CModal visible={visible} backdrop="static" alignment="center">
      <CModalHeader closeButton={false}>
        <CModalTitle>Importing Albums...</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="text-center mb-3">
          <Spinner title={`Importing... ${Math.round(progress)}%`} />
        </div>
        <CProgress value={progress} className="mb-3" />

        {errors.length > 0 && (
          <CAlert color="warning">
            <h6>Errors:</h6>
            <ul className="mb-0">
              {errors.map((error, idx) => (
                <li key={idx}>
                  <small>{error}</small>
                </li>
              ))}
            </ul>
          </CAlert>
        )}
      </CModalBody>
    </CModal>
  );
};

export default ImportProgressModal;

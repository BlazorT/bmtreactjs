/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
// ============================================================================
// COMPONENT: PreviewModal.jsx
// ============================================================================
import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CBadge,
} from '@coreui/react';
import Button from 'src/components/UI/Button';
import globalutil from 'src/util/globalutil';

const PreviewModal = ({
  visible,
  onClose,
  onConfirm,
  activeMode,
  sourceOrg,
  destinationOrg,
  albums,
  recipients,
  selectedRecipientIds,
  needsVerification,
}) => {
  const networks = globalutil.networks();

  return (
    <CModal visible={visible} onClose={onClose} size="lg" alignment="center">
      <CModalHeader>
        <CModalTitle>{activeMode === 'import' ? 'Import' : 'Transfer'} Preview</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAlert color="info">
          <h5>You are about to {activeMode} the following:</h5>
          <div className="mt-3">
            <p>
              <strong>From Organization:</strong> {sourceOrg?.name}
            </p>
            {activeMode === 'transfer' && destinationOrg && (
              <p>
                <strong>To Organization:</strong> {destinationOrg.name}
              </p>
            )}
            <p>
              <strong>Total Albums:</strong> {albums.length}
            </p>
            <p>
              <strong>Total Recipients:</strong>{' '}
              {recipients.filter((r) => selectedRecipientIds.includes(r.id)).length}
            </p>
          </div>
        </CAlert>

        {needsVerification && (
          <CAlert color="warning">
            <strong>Verification Required:</strong> After clicking "Proceed", you will need to
            complete the verification process before the import can begin.
          </CAlert>
        )}

        <div className="mt-3">
          <h6>Albums to {activeMode === 'import' ? 'Import' : 'Transfer'}:</h6>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {albums.map((album) => {
              const albumRecipients = recipients.filter(
                (r) => r.albumid === album.id && selectedRecipientIds.includes(r.id),
              );

              return (
                <div key={album.id} className="border rounded p-2 mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{album.name}</strong>
                      <div className="text-muted small">
                        Network: {networks.find((n) => n.id === album.networkid)?.name}
                      </div>
                    </div>
                    <CBadge color="primary">{albumRecipients.length} recipients</CBadge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <Button title="Cancel" onClick={onClose} />
        <Button
          title={
            needsVerification
              ? 'Proceed to Verification'
              : `Confirm ${activeMode === 'import' ? 'Import' : 'Transfer'}`
          }
          onClick={onConfirm}
          className="w-auto px-2"
        />
      </CModalFooter>
    </CModal>
  );
};

export default PreviewModal;

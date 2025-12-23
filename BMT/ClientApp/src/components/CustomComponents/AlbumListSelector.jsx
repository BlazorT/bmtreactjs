/* eslint-disable react/prop-types */
import React from 'react';
import { CRow, CCol } from '@coreui/react';
import Button from '../UI/Button';
import globalutil from 'src/util/globalutil';
import { useShowToast } from 'src/hooks/useShowToast';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilPlus, cilPencil } from '@coreui/icons';

const NETWORK_COLOR_MAP = {
  1: '#0d6efd', // SMS - blue
  2: '#25D366', // WhatsApp - green
  3: '#0dcaf0', // Email - cyan
  4: '#000000', // Twitter - black
  5: '#1877F2', // Facebook - blue
  6: '#E1306C', // Instagram - pink
  7: '#0A66C2', // LinkedIn - blue
  8: '#6c757d', // TikTok - dark gray
  9: '#FFFC00', // Snapchat - yellow
};

const AlbumListSelector = ({ selectedAlbumList, toggleIsShowAlbumList, selectedNetworks }) => {
  const showToast = useShowToast();
  const getNetworkName = (networkId) => {
    const networks = globalutil.networks();
    return networks?.find((n) => n.id === networkId)?.name || 'Unknown';
  };

  const getNetworkColorStyle = (networkId) => {
    const color = NETWORK_COLOR_MAP[networkId] || '#6c757d';

    return {
      color,
      background: `${color}1A`, // ~10% opacity
      borderColor: `${color}40`, // ~25% opacity
    };
  };

  const onSelectClick = () => {
    if (selectedNetworks?.length === 0) {
      showToast('Select at least one network first to select contact list', 'info');
      return;
    }
    toggleIsShowAlbumList();
  };
  return (
    <CRow>
      <CCol>
        <div className="border rounded p-3 position-relative">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1 pe-3">
              <label
                className="form-label text-uppercase fw-semibold text-muted mb-2 small"
                style={{ letterSpacing: '0.5px' }}
              >
                Contact Lists
              </label>

              {selectedAlbumList?.length === 0 ? (
                <div className="d-flex align-items-center py-2">
                  <i className="bi bi-info-circle text-muted me-2"></i>
                  <span className="text-muted">No contact lists selected</span>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {selectedAlbumList?.map((album) => {
                    const styles = getNetworkColorStyle(album.networkid);

                    return (
                      <div
                        key={album.id}
                        className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                        style={{
                          background: styles.background,
                          border: `1px solid ${styles.borderColor}`,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: styles.color,
                            marginRight: 8,
                            flexShrink: 0,
                          }}
                        />

                        <span className="fw-medium me-2" style={{ color: styles.color }}>
                          {album.name}
                        </span>

                        <span
                          className="badge rounded-pill small"
                          style={{
                            backgroundColor: styles.color,
                            color: '#fff',
                            opacity: 0.85,
                          }}
                        >
                          {getNetworkName(album.networkid)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              className="w-auto flex-shrink-0"
              onClick={onSelectClick}
              title={
                <span className="d-flex align-items-center">
                  <i
                    className={`bi ${selectedAlbumList?.length === 0 ? 'bi-plus-lg' : 'bi-pencil'}`}
                  ></i>
                  {selectedAlbumList?.length === 0 ? 'Select' : 'Edit'}
                </span>
              }
            />
          </div>

          {selectedAlbumList?.length > 0 && (
            <span className="badge bg-primary rounded-pill position-absolute top-0 end-0 mt-2 me-2 small">
              {selectedAlbumList.length}
            </span>
          )}
        </div>
      </CCol>
    </CRow>
  );
};

export default AlbumListSelector;

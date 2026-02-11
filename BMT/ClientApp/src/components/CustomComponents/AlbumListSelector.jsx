/* eslint-disable react/prop-types */
import React from 'react';
import { CRow, CCol } from '@coreui/react';
import Button from '../UI/Button';
import globalutil from 'src/util/globalutil';
import { useShowToast } from 'src/hooks/useShowToast';

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

const AlbumListSelector = ({
  selectedAlbumList,
  toggleIsShowAlbumList,
  selectedNetworks,
  recipients,
}) => {
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

  // Group albums by network
  const albumsByNetwork = React.useMemo(() => {
    const grouped = {};
    selectedAlbumList?.forEach((album) => {
      if (!grouped[album.networkid]) {
        grouped[album.networkid] = [];
      }
      grouped[album.networkid].push(album);
    });
    return grouped;
  }, [selectedAlbumList]);

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
                <div className="d-flex flex-column gap-3">
                  {Object.entries(albumsByNetwork).map(([networkId, albums]) => {
                    const styles = getNetworkColorStyle(parseInt(networkId));
                    const networkName = getNetworkName(parseInt(networkId));

                    return (
                      <div key={networkId} className="network-group">
                        <div
                          className="d-flex align-items-center mb-2 pb-2"
                          style={{ borderBottom: `2px solid ${styles.borderColor}` }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: styles.color,
                              marginRight: 8,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            className="fw-semibold small text-uppercase"
                            style={{ color: styles.color, letterSpacing: '0.5px' }}
                          >
                            {networkName}
                          </span>
                          <span
                            className="ms-2 badge rounded-pill small"
                            style={{
                              backgroundColor: styles.background,
                              color: styles.color,
                              border: `1px solid ${styles.borderColor}`,
                            }}
                          >
                            {albums.length} {albums.length === 1 ? 'list' : 'lists'}
                          </span>
                        </div>

                        <div className="d-flex flex-wrap gap-2 ms-3">
                          {albums.map((album) => (
                            <div
                              key={album.id}
                              className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                              style={{
                                background: styles.background,
                                border: `1px solid ${styles.borderColor}`,
                              }}
                            >
                              <i
                                className="bi bi-check-circle-fill me-2"
                                style={{ color: styles.color, fontSize: '0.85rem' }}
                              ></i>
                              <span className="fw-medium" style={{ color: styles.color }}>
                                {album.name} (
                                {recipients?.filter((r) => r?.albumid === album.id)?.length}{' '}
                                contacts)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              className="w-auto flex-shrink-0 px-4 py-0"
              onClick={onSelectClick}
              title={
                <span className="d-flex align-items-center">
                  <i
                    className={`bi ${selectedAlbumList?.length === 0 ? 'bi-plus-lg' : 'bi-pencil'}`}
                  ></i>
                  {selectedAlbumList?.length === 0 ? 'Select Contacts' : 'Edit'}
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

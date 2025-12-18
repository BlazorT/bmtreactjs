/* eslint-disable react/prop-types */
import React from 'react';
import { CRow, CCol } from '@coreui/react';
import Button from '../UI/Button';
import globalutil from 'src/util/globalutil';

const AlbumListSelector = ({ selectedAlbumList, toggleIsShowAlbumList }) => {
  const getNetworkName = (networkId) => {
    const networks = globalutil.networks();
    return networks?.find((n) => n.id === networkId)?.name || 'Unknown';
  };

  const getNetworkColorClass = (networkId) => {
    const colorMap = {
      1: 'primary',
      2: 'success',
      3: 'warning',
      4: 'danger',
    };
    return colorMap[networkId] || 'secondary';
  };

  return (
    <CRow className="mb-3">
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
                    const colorClass = getNetworkColorClass(album.networkid);
                    return (
                      <div
                        key={album.id}
                        className={`d-inline-flex align-items-center px-3 py-2 rounded-pill bg-${colorClass} bg-opacity-10 border border-${colorClass} border-opacity-25`}
                      >
                        <span
                          className={`bg-${colorClass} rounded-circle me-2`}
                          style={{ width: '8px', height: '8px', flexShrink: 0 }}
                        ></span>
                        <span className={`text-${colorClass} fw-medium me-2`}>{album.name}</span>
                        <span
                          className={`badge bg-${colorClass} bg-opacity-20 text-white rounded-pill small`}
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
              onClick={toggleIsShowAlbumList}
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

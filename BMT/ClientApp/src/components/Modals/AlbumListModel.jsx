/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';
import globalutil from 'src/util/globalutil';
import BlazorTabs from '../CustomComponents/BlazorTabs';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import AddAlbumModel from './AddAlbumModel';

export const AlbumListModel = ({
  isOpen,
  networkIds,
  toggle,
  selectedAlbumList,
  setSelectedAlbumList,
  disabled = false,
}) => {
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(null);
  const [isShowAlbumMdl, setIsShowAlbumMdl] = useState(false);
  const [selectedAlbums, setSelectedAlbums] = useState({});
  const [albumsByNetwork, setAlbumsByNetwork] = useState({});

  const { data: albums, loading: albumsLoading, fetchAlbums } = useFetchAlbums();
  const { data: recipients, loading: recipientsLoading, fetchRecipients } = useFetchRecipients();

  const toggleAlbumMdl = () => setIsShowAlbumMdl((prev) => !prev);

  const networks = useMemo(
    () =>
      globalutil
        .networks()
        .filter((n) => (networkIds?.length > 0 ? networkIds?.includes(n.name) : false)),
    [networkIds],
  );

  useEffect(() => {
    if (!isOpen || !Array.isArray(networkIds) || networkIds.length === 0) {
      return;
    }

    const activeNetworkId = globalutil.networks().find((n) => networkIds.includes(n.name))?.id ?? 0;

    setActiveTab(activeNetworkId);
  }, [isOpen, networkIds]);

  useEffect(() => {
    if (isOpen) {
      const body = {
        id: 0,
        orgId: user.orgId,
        contentId: '',
        rowVer: 0,
        networkId: 0,
        albumid: 0,
        status: 0,
        createdAt: dayjs().subtract(5, 'year').startOf('year').format(),
        lastUpdatedAt: dayjs().utc().endOf('day').format(),
      };
      fetchAlbums();
      fetchRecipients(body);

      // Initialize selected albums from selectedAlbumList
      const initial = {};
      if (selectedAlbumList?.length > 0) {
        selectedAlbumList.forEach((album) => {
          initial[album.networkid] = album.id;
        });
      }
      setSelectedAlbums(initial);
    }
  }, [isOpen]);

  useEffect(() => {
    if (albums?.length > 0 && networks?.length > 0) {
      // Group albums by networkId
      const grouped = {};
      networks.forEach((network) => {
        const networkId = network.id;
        grouped[networkId] = albums.filter((a) => a.networkid === networkId);
      });
      setAlbumsByNetwork(grouped);
    }
  }, [albums, networks]);

  const handleActiveTab = (i) => {
    setActiveTab(i);
  };

  const handleAlbumSelect = (networkId, albumId) => {
    setSelectedAlbums((prev) => ({
      ...prev,
      [networkId]: prev[networkId] === albumId ? null : albumId,
    }));
  };

  const handleSubmit = () => {
    const selectedIds = Object.values(selectedAlbums).filter((id) => id !== null);
    const selectedAlbumsList = albums?.filter((al) => selectedIds.includes(al.id));
    setSelectedAlbumList(selectedAlbumsList || []);
    toggle();
  };

  const toAddAlbum = () => {
    toggleAlbumMdl();
  };

  const isSubmitDisabled = Object.values(selectedAlbums).every((v) => v === null) || disabled;

  const currentNetworkId = networks?.find((n) => n.id === activeTab)?.id;
  const currentAlbums = albumsByNetwork[currentNetworkId] || [];
  const loading = albumsLoading || recipientsLoading;

  return (
    <>
      <CModal
        visible={isOpen}
        alignment="center"
        aria-labelledby="album-selection"
        aria-describedby="album-selection-modal"
        backdrop="static"
        className="payment-modal"
        size="lg"
      >
        <CModalHeader closeButton={false} onClose={toggle}>
          <CModalTitle>Select Contact List</CModalTitle>
        </CModalHeader>

        <CModalBody style={{ minHeight: '400px' }}>
          {loading && <Spinner title="Loading Contact List..." />}

          {!loading && (
            <>
              <BlazorTabs handleActiveTab={handleActiveTab} tabs={networks} activeTab={activeTab} />

              <div className="mt-3">
                {currentAlbums.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-3">No albums found for this network</p>
                    <Button title="Add Album" onClick={toAddAlbum} className="w-auto" />
                  </div>
                ) : (
                  <div className="album-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {currentAlbums.map((item) => {
                      const isSelected = selectedAlbums[currentNetworkId] === item.id;
                      const contactCount =
                        recipients?.data?.filter(
                          (r) => r?.albumid === item.id && r?.networkId === item.networkid,
                        )?.length || 0;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleAlbumSelect(currentNetworkId, item.id)}
                          className={`album-item mb-2 rounded-3 border position-relative ${
                            isSelected
                              ? 'border-primary bg-primary bg-opacity-10 shadow-sm'
                              : 'border-secondary'
                          }`}
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                          }}
                        >
                          {/* Left accent bar */}
                          <span
                            style={{
                              width: '4px',
                              alignSelf: 'stretch',
                              borderRadius: '999px',
                              backgroundColor: isSelected ? '#0d6efd' : '#dee2e6',
                            }}
                          />

                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2">
                              <div className="fw-semibold text-truncate">{item.name}</div>
                              {isSelected && (
                                <span className="badge bg-primary bg-opacity-75 text-white">
                                  Selected
                                </span>
                              )}
                            </div>
                            <small className="text-muted d-block mt-1">
                              {contactCount} contact{contactCount === 1 ? '' : 's'}
                            </small>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </CModalBody>

        <CModalFooter>
          <Button title="Cancel" onClick={toggle} />
          <Button
            title="Confirm Selection"
            onClick={handleSubmit}
            className="w-auto"
            disabled={isSubmitDisabled}
          />
        </CModalFooter>
      </CModal>
      <AddAlbumModel
        networkId={activeTab}
        isOpen={isShowAlbumMdl}
        toggle={toggleAlbumMdl}
        refreshRecipients={fetchAlbums}
      />
    </>
  );
};

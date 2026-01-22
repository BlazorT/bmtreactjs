/* eslint-disable react/prop-types */
// ============================================================================
// COMPONENT: AlbumSelectionSection.jsx
// ============================================================================
import React from 'react';
import { CAlert, CFormCheck, CBadge } from '@coreui/react';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import BlazorTabs from 'src/components/CustomComponents/BlazorTabs';
import Button from 'src/components/UI/Button';
import Spinner from 'src/components/UI/Spinner';
import globalutil from 'src/util/globalutil';

const AlbumSelectionSection = ({
  albums,
  recipients,
  disabledAlbumIds,
  disabledRecipientIds,
  selectedAlbums,
  setSelectedAlbums,
  selectedRecipients,
  setSelectedRecipients,
  expandedAlbums,
  setExpandedAlbums,
  albumSearch,
  setAlbumSearch,
  recipientSearch,
  setRecipientSearch,
  activeTab,
  setActiveTab,
  loading,
  onPreview,
}) => {
  const networks = globalutil.networks();

  const getAlbumRecipients = (albumId) => {
    return recipients.filter((r) => r.albumid === albumId);
  };

  const filteredRecipientsForAlbum = (albumId) => {
    const albumRecipients = getAlbumRecipients(albumId);
    if (!recipientSearch) return albumRecipients;
    return albumRecipients.filter((r) =>
      r.contentId?.toLowerCase().includes(recipientSearch.toLowerCase()),
    );
  };

  const handleAlbumToggle = (albumId) => {
    if (disabledAlbumIds.includes(albumId)) return;

    setSelectedAlbums((prev) => {
      if (prev.includes(albumId)) {
        const albumRecipients = getAlbumRecipients(albumId).map((r) => r.id);
        setSelectedRecipients((prevRec) => prevRec.filter((id) => !albumRecipients.includes(id)));
        return prev.filter((id) => id !== albumId);
      } else {
        const albumRecipients = getAlbumRecipients(albumId)
          .filter((r) => !disabledRecipientIds.includes(r.id))
          .map((r) => r.id);
        setSelectedRecipients((prevRec) => [...new Set([...prevRec, ...albumRecipients])]);
        return [...prev, albumId];
      }
    });
  };

  const handleSelectAllAlbums = () => {
    const selectableAlbumIds = albums
      .filter((a) => !disabledAlbumIds.includes(a.id))
      .filter((a) => {
        const albumRecipients = filteredRecipientsForAlbum(a.id);

        const allRecipientsDisabled =
          albumRecipients.length > 0 &&
          albumRecipients.every((r) => disabledRecipientIds.includes(r.id));

        return !(albumRecipients?.length === 0 || allRecipientsDisabled);
      })
      .map((a) => a.id);

    const allSelectableRecipientIds = recipients
      .filter(
        (r) => !disabledRecipientIds.includes(r.id) && selectableAlbumIds?.includes(r.albumid),
      )
      .map((r) => r.id);

    if (selectedAlbums.length === selectableAlbumIds.length) {
      setSelectedAlbums([]);
      setSelectedRecipients([]);
    } else {
      setSelectedAlbums(selectableAlbumIds);
      setSelectedRecipients(allSelectableRecipientIds);
    }
  };

  const handleRecipientToggle = (recipientId, albumId) => {
    if (disabledRecipientIds.includes(recipientId)) return;

    setSelectedRecipients((prev) => {
      const newSelection = prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId];

      const albumRecipients = getAlbumRecipients(albumId);
      const selectableRecipients = albumRecipients.filter(
        (r) => !disabledRecipientIds.includes(r.id),
      );
      const hasSelectedRecipients = selectableRecipients.some((r) => newSelection.includes(r.id));

      if (!hasSelectedRecipients) {
        setSelectedAlbums((prevAlbums) => prevAlbums.filter((id) => id !== albumId));
      } else if (!selectedAlbums.includes(albumId)) {
        setSelectedAlbums((prevAlbums) => [...prevAlbums, albumId]);
      }

      return newSelection;
    });
  };

  const toggleAlbumExpansion = (albumId) => {
    setExpandedAlbums((prev) => ({
      ...prev,
      [albumId]: !prev[albumId],
    }));
  };

  const selectableAlbumsCount = albums.filter((a) => !disabledAlbumIds.includes(a.id)).length;
  const selectedRecipientsCount = selectedRecipients.length;

  return (
    <>
      <div className="row g-3 mb-2">
        <div className="col-md-6">
          <CustomInput
            type="text"
            placeholder="Search albums..."
            value={albumSearch}
            onChange={(e) => setAlbumSearch(e.target.value)}
            width="w-100"
          />
        </div>
        <div className="col-md-6">
          <CustomInput
            type="text"
            placeholder="Search recipients..."
            value={recipientSearch}
            onChange={(e) => setRecipientSearch(e.target.value)}
            width="w-100"
          />
        </div>
      </div>

      <div className="px-3 mb-2">
        <BlazorTabs
          handleActiveTab={setActiveTab}
          tabs={[{ id: 0, name: 'All' }, ...networks]}
          activeTab={activeTab}
        />
      </div>

      {selectableAlbumsCount > 0 && (
        <div className="mb-2 px-1 bg-light rounded">
          <CFormCheck
            id="select-all"
            label={`Select All Albums (${selectedAlbums.length}/${selectableAlbumsCount})`}
            checked={selectedAlbums.length === selectableAlbumsCount && selectableAlbumsCount > 0}
            onChange={handleSelectAllAlbums}
          />
        </div>
      )}

      {loading ? (
        <Spinner title="Loading albums..." />
      ) : albums.length === 0 ? (
        <CAlert color="info">
          {`No albums found${activeTab ? ' for ' + networks[activeTab - 1]?.name : ''} for this organization.`}
        </CAlert>
      ) : (
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {albums.map((album) => {
            const albumRecipients = filteredRecipientsForAlbum(album.id);
            const allRecipientsDisabled =
              albumRecipients.length > 0 &&
              albumRecipients.every((r) => disabledRecipientIds.includes(r.id));
            const isDisabled =
              disabledAlbumIds.includes(album.id) ||
              albumRecipients?.length === 0 ||
              allRecipientsDisabled;
            const isSelected = selectedAlbums.includes(album.id);
            const isExpanded = expandedAlbums[album.id];
            const selectedCount = albumRecipients.filter((r) =>
              selectedRecipients.includes(r.id),
            ).length;

            return (
              <div
                key={album.id}
                className={`mb-2 border rounded p-3 ${
                  isDisabled
                    ? 'bg-secondary bg-opacity-10 border-secondary'
                    : isSelected
                      ? 'border-success bg-light'
                      : ''
                }`}
                style={{ opacity: isDisabled ? 0.6 : 1 }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center flex-grow-1">
                    <CFormCheck
                      id={`album-${album.id}`}
                      checked={isSelected}
                      onChange={() => handleAlbumToggle(album.id)}
                      disabled={isDisabled}
                    />
                    <div className="ms-2 flex-grow-1">
                      <h6 className="mb-1">
                        {album.name}
                        {isDisabled && (
                          <CBadge color="secondary" className="ms-2">
                            {albumRecipients?.length === 0
                              ? '0 Recipients'
                              : 'All contacts exist of this album'}
                          </CBadge>
                        )}
                      </h6>
                      <small className="text-muted">
                        Network: {networks.find((n) => n.id === album.networkid)?.name || 'N/A'} |
                        Recipients: {albumRecipients.length}
                        {isSelected && ` (${selectedCount} selected)`}
                      </small>
                    </div>
                  </div>
                  {albumRecipients?.length > 0 && (
                    <Button
                      title={isExpanded ? 'Hide Recipients' : 'Show Recipients'}
                      onClick={() => toggleAlbumExpansion(album.id)}
                      className="w-auto btn-sm px-2"
                    />
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-3 border-top pt-3">
                    {albumRecipients.length === 0 ? (
                      <small className="text-muted">No recipients in this album</small>
                    ) : (
                      <div
                        style={{ maxHeight: '200px', overflowY: 'auto' }}
                        className="d-flex flex-row column-gap-3 row-gap-3 flex-wrap"
                      >
                        {albumRecipients.map((recipient) => {
                          const isRecipientDisabled = disabledRecipientIds.includes(recipient.id);
                          return (
                            <CBadge
                              key={recipient.id}
                              className={`d-flex row-gap-2 align-items-center justify-content-center px-2 py-0 ${
                                isRecipientDisabled ? 'bg-secondary' : 'bg-btn'
                              }`}
                              style={{ opacity: isRecipientDisabled ? 0.6 : 1 }}
                            >
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`recipient-${recipient.id}`}
                                checked={selectedRecipients.includes(recipient.id)}
                                onChange={() => handleRecipientToggle(recipient.id, album.id)}
                                disabled={isRecipientDisabled}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`recipient-${recipient.id}`}
                              >
                                {recipient.contentId}
                              </label>
                            </CBadge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedAlbums.length > 0 && (
        <div className="mt-4 d-flex gap-2 justify-content-end">
          <Button
            title={`Preview Selection (${selectedAlbums.length} albums, ${selectedRecipientsCount} recipients)`}
            onClick={onPreview}
            className="w-auto px-2"
          />
        </div>
      )}
    </>
  );
};

export default AlbumSelectionSection;

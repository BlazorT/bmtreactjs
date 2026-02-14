/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import {
  CAlert,
  CBadge,
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
import { useEffect, useMemo, useState } from 'react';
import globalutil from 'src/util/globalutil';
import CustomInput from '../InputsComponent/CustomInput';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';

const RecipientSelectionModal = ({
  visible,
  onClose,
  albums = [],
  recipients = [],
  selectedRecipients = [],
  onSave,
  loading = false,
  networkId,
}) => {
  const networks = globalutil.networks();
  const [localSelectedRecipients, setLocalSelectedRecipients] = useState([]);
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [expandedAlbums, setExpandedAlbums] = useState({});
  const [albumSearch, setAlbumSearch] = useState('');
  const [recipientSearch, setRecipientSearch] = useState('');

  // Sync local state when modal opens or selectedRecipients changes
  useEffect(() => {
    if (visible) {
      // Convert recipient content IDs back to recipient IDs
      const recipientIds = recipients
        .filter((r) => selectedRecipients.includes(r.contentId))
        .map((r) => r.id);
      setLocalSelectedRecipients(recipientIds);

      // Auto-select albums that have all recipients selected
      const selectedAlbumIds = [];
      albums.forEach((album) => {
        const albumRecipients = recipients.filter((r) => r.albumid === album.id);
        if (albumRecipients.length > 0) {
          const allSelected = albumRecipients.every((r) => recipientIds.includes(r.id));
          if (allSelected) {
            selectedAlbumIds.push(album.id);
          }
        }
      });
      setSelectedAlbums(selectedAlbumIds);
    }
  }, [visible, selectedRecipients, recipients, albums]);

  // Filter albums by search and active tab
  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const matchesSearch = album.name?.toLowerCase().includes(albumSearch.toLowerCase());
      const matachedNetwork = album?.networkid === networkId;
      return matchesSearch && matachedNetwork;
    });
  }, [albums, albumSearch, networkId]);

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
    setSelectedAlbums((prev) => {
      if (prev.includes(albumId)) {
        // Deselect album and its recipients
        const albumRecipients = getAlbumRecipients(albumId).map((r) => r.id);
        setLocalSelectedRecipients((prevRec) =>
          prevRec.filter((id) => !albumRecipients.includes(id)),
        );
        return prev.filter((id) => id !== albumId);
      } else {
        // Select album and all its recipients
        const albumRecipients = getAlbumRecipients(albumId).map((r) => r.id);
        setLocalSelectedRecipients((prevRec) => [...new Set([...prevRec, ...albumRecipients])]);
        return [...prev, albumId];
      }
    });
  };

  const handleSelectAllAlbums = () => {
    const selectableAlbumIds = filteredAlbums
      .filter((a) => getAlbumRecipients(a.id).length > 0)
      .map((a) => a.id);

    const allSelectableRecipientIds = recipients
      .filter((r) => selectableAlbumIds.includes(r.albumid))
      .map((r) => r.id);

    if (selectedAlbums.length === selectableAlbumIds.length) {
      setSelectedAlbums([]);
      setLocalSelectedRecipients([]);
    } else {
      setSelectedAlbums(selectableAlbumIds);
      setLocalSelectedRecipients(allSelectableRecipientIds);
    }
  };

  const handleRecipientToggle = (recipientId, albumId) => {
    setLocalSelectedRecipients((prev) => {
      const newSelection = prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId];

      const albumRecipients = getAlbumRecipients(albumId);
      const hasSelectedRecipients = albumRecipients.some((r) => newSelection.includes(r.id));

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

  const handleSave = () => {
    // Convert recipient IDs to contentId strings for the API
    const recipientContentIds = recipients
      .filter((r) => localSelectedRecipients.includes(r.id))
      .map((r) => r.contentId);
    onSave(recipientContentIds);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <CModal visible={visible} onClose={handleCancel} size="lg" backdrop="static">
      <CModalHeader>
        <CModalTitle className="h6">Select Recipients</CModalTitle>
      </CModalHeader>

      <CModalBody className="py-2">
        {/* Search Inputs */}
        <div className="row g-2 mb-2">
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

        {/* Select All Checkbox */}
        {filteredAlbums.length > 0 && (
          <div className="mb-2 p-2 bg-light rounded">
            <CFormCheck
              id="select-all-albums"
              label={
                <small>{`Select All Albums (${selectedAlbums.length}/${filteredAlbums.length})`}</small>
              }
              checked={selectedAlbums.length === filteredAlbums.length && filteredAlbums.length > 0}
              onChange={handleSelectAllAlbums}
            />
          </div>
        )}

        {/* Albums List */}
        {loading ? (
          <Spinner title="Loading albums and recipients..." />
        ) : filteredAlbums.length === 0 ? (
          <CAlert color="info" className="py-2 mb-2">
            <small>{`No albums found for ${networks.find((n) => n.id === networkId)?.name || 'this network'}.`}</small>
          </CAlert>
        ) : (
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {filteredAlbums.map((album) => {
              const albumRecipients = filteredRecipientsForAlbum(album.id);
              const isSelected = selectedAlbums.includes(album.id);
              const isExpanded = expandedAlbums[album.id];
              const selectedCount = albumRecipients.filter((r) =>
                localSelectedRecipients.includes(r.id),
              ).length;
              const hasNoRecipients = albumRecipients.length === 0;

              return (
                <div
                  key={album.id}
                  className={`mb-2 border rounded p-2 ${
                    hasNoRecipients
                      ? 'bg-secondary bg-opacity-10 border-secondary'
                      : isSelected
                        ? 'border-success bg-light'
                        : ''
                  }`}
                  style={{ opacity: hasNoRecipients ? 0.6 : 1 }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-grow-1">
                      <CFormCheck
                        id={`album-${album.id}`}
                        checked={isSelected}
                        onChange={() => handleAlbumToggle(album.id)}
                        disabled={hasNoRecipients}
                      />
                      <div className="ms-2 flex-grow-1">
                        <h6 className="mb-0 small fw-bold">
                          {album.name}
                          {hasNoRecipients && (
                            <CBadge color="secondary" className="ms-2">
                              <small>No Recipients</small>
                            </CBadge>
                          )}
                        </h6>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Network: {networks.find((n) => n.id === album.networkid)?.name || 'N/A'} |
                          Recipients: {albumRecipients.length}
                          {isSelected && ` (${selectedCount} selected)`}
                        </small>
                      </div>
                    </div>
                    {albumRecipients.length > 0 && (
                      <Button
                        title={isExpanded ? 'Hide' : 'Show'}
                        onClick={() => toggleAlbumExpansion(album.id)}
                        className="w-auto btn-sm px-2"
                      />
                    )}
                  </div>

                  {isExpanded && albumRecipients.length > 0 && (
                    <div className="mt-2 border-top pt-2">
                      <div
                        style={{ maxHeight: '150px', overflowY: 'auto' }}
                        className="d-flex flex-row column-gap-2 row-gap-2 flex-wrap"
                      >
                        {albumRecipients.map((recipient) => (
                          <CBadge
                            key={recipient.id}
                            className="d-flex row-gap-1 align-items-center justify-content-center px-2 py-1 bg-btn"
                          >
                            <input
                              type="checkbox"
                              className="form-check-input me-1"
                              id={`recipient-${recipient.id}`}
                              checked={localSelectedRecipients.includes(recipient.id)}
                              onChange={() => handleRecipientToggle(recipient.id, album.id)}
                              style={{ fontSize: '0.75rem' }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`recipient-${recipient.id}`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {recipient.contentId}
                            </label>
                          </CBadge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Count */}
        {localSelectedRecipients.length > 0 && (
          <div className="mt-2 p-2 bg-success bg-opacity-10 border border-success rounded">
            <strong className="text-success small">
              {localSelectedRecipients.length} recipient(s) selected from {selectedAlbums.length}{' '}
              album(s)
            </strong>
          </div>
        )}
      </CModalBody>

      <CModalFooter className="py-2">
        <Button title="Cancel" onClick={handleCancel} className="btn-secondary btn-sm px-3" />
        <Button
          title={`Save (${localSelectedRecipients.length})`}
          onClick={handleSave}
          disabled={localSelectedRecipients.length === 0}
          className="px-3 w-auto btn-sm"
        />
      </CModalFooter>
    </CModal>
  );
};

export default RecipientSelectionModal;

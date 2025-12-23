/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CAlert,
  CPopover,
} from '@coreui/react';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';
import { useShowToast } from 'src/hooks/useShowToast';
import globalutil from 'src/util/globalutil';
import BlazorTabs from '../CustomComponents/BlazorTabs';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import AddAlbumModel from './AddAlbumModel';
import CustomInput from '../InputsComponent/CustomInput';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilPlus, cilTrash } from '@coreui/icons';

export const AlbumListModel = ({
  isOpen,
  networkIds,
  toggle,
  selectedAlbumList,
  setSelectedAlbumList,
  disabled = false,
  fetchRecipientList,
}) => {
  const user = useSelector((state) => state.user);
  const showToast = useShowToast();
  const [activeTab, setActiveTab] = useState(null);
  const [isShowAlbumMdl, setIsShowAlbumMdl] = useState(false);
  const [selectedAlbums, setSelectedAlbums] = useState({});
  const [albumsByNetwork, setAlbumsByNetwork] = useState({});
  const [showContactInput, setShowContactInput] = useState(false);
  const [contactInput, setContactInput] = useState('');
  const [newContacts, setNewContacts] = useState([]);
  const [isAddingContacts, setIsAddingContacts] = useState(false);

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

    // Reset contact input state when modal closes
    if (!isOpen) {
      setShowContactInput(false);
      setContactInput('');
      setNewContacts([]);
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
    setShowContactInput(false);
    setContactInput('');
    setNewContacts([]);
  };

  const handleAlbumSelect = (networkId, albumId) => {
    setSelectedAlbums((prev) => ({
      ...prev,
      [networkId]: prev[networkId] === albumId ? null : albumId,
    }));
    setShowContactInput(false);
    setContactInput('');
    setNewContacts([]);
  };

  const validateRecipient = (networkName, value) => {
    if (!value) return false;

    const phonePattern = /^\+?\d+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const idPattern = /^[a-zA-Z0-9_]+$/;

    const lowerNetwork = networkName.toLowerCase();

    if (lowerNetwork === 'sms' || lowerNetwork === 'whatsapp') {
      return phonePattern.test(value) && value.length >= 7 && value.length <= 15;
    }

    if (lowerNetwork === 'email') {
      return emailPattern.test(value);
    }

    return idPattern.test(value);
  };

  const getCurrentNetworkName = () => {
    return networks?.find((n) => n.id === activeTab)?.name || '';
  };

  const getExistingContacts = () => {
    const selectedAlbumId = selectedAlbums[currentNetworkId];
    if (!selectedAlbumId) return [];

    return (
      recipients?.data
        ?.filter((r) => r?.albumid === selectedAlbumId && r?.networkId === currentNetworkId)
        ?.map((r) => r.contentId) || []
    );
  };

  const addContact = (value) => {
    const networkName = getCurrentNetworkName();

    if (!validateRecipient(networkName, value)) {
      let label = 'ID';
      let correctFormatExample = 'e.g., 123456';

      const lowerNetwork = networkName.toLowerCase();
      if (lowerNetwork === 'email') {
        label = 'email address';
        correctFormatExample = 'e.g., user@example.com';
      } else if (lowerNetwork === 'sms' || lowerNetwork === 'whatsapp') {
        label = 'contact number (min 7 digits)';
        correctFormatExample = 'e.g., 03001234567';
      }

      showToast(
        `❌ "${value}" is not a valid ${label}. Correct format: ${correctFormatExample}`,
        'error',
      );
      return false;
    }

    // Check against existing contacts
    const existingContacts = getExistingContacts();
    if (existingContacts.includes(value)) {
      showToast(`"${value}" is already in this album.`, 'error');
      return false;
    }

    // Check against newly added contacts
    if (newContacts.includes(value)) {
      showToast(`"${value}" is already added.`, 'error');
      return false;
    }

    setNewContacts((prev) => [...prev, value]);
    return true;
  };

  const handleKeyDown = (e) => {
    let value = contactInput?.trim();

    if ((e.key === 'Enter' || e.key === ',') && value) {
      e.preventDefault();

      if (value.endsWith(',')) {
        value = value.slice(0, -1).trim();
      }
      if (!value) return;

      if (addContact(value)) {
        setContactInput('');
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');

    if (!pasteData) return;

    const values = pasteData
      .split(/[\s,;]+/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    values.forEach((val) => {
      addContact(val);
    });

    setContactInput('');
  };

  const handleDeleteNewContact = (index) => {
    const updated = [...newContacts];
    updated.splice(index, 1);
    setNewContacts(updated);
  };

  const handleSaveNewContacts = async () => {
    if (newContacts.length === 0) {
      showToast('No contacts to add.', 'error');
      return;
    }

    const selectedAlbumId = selectedAlbums[currentNetworkId];
    if (!selectedAlbumId) {
      showToast('Please select an album first.', 'error');
      return;
    }

    setIsAddingContacts(true);

    try {
      const payload = [
        {
          Id: 0,
          OrgId: user.orgId,
          NetworkId: currentNetworkId,
          Albumid: selectedAlbumId,
          Contentlst: newContacts,
          Desc: '',
          CreatedBy: user.userId,
          CreatedAt: new Date(),
          LastUpdatedAt: new Date(),
          RowVer: 1,
        },
      ];

      const response = await fetch('/Compaigns/postCompaignContactData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        showToast(errorResult.message || 'Server error occurred.', 'error');
        return;
      }

      const result = await response.json();

      if (result.status) {
        fetchRecipientList?.();
        showToast(`${newContacts.length} contact(s) added successfully!`, 'success');
        setNewContacts([]);
        setContactInput('');
        setShowContactInput(false);

        // Refresh recipients list
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
        const rec = await fetchRecipients(body);
        handleSubmit(false, rec);
      } else {
        showToast(result.message || 'Failed to add contacts.', 'error');
      }
    } catch (error) {
      console.error('Error adding contacts:', error);
      showToast('Error while adding contacts.', 'error');
    } finally {
      setIsAddingContacts(false);
    }
  };

  const handleSubmit = (isToogle = true, rec = null) => {
    const selectedIds = Object.values(selectedAlbums).filter((id) => id !== null);

    const selectedAlbumsList = Array.isArray(albums)
      ? albums.filter((al) => selectedIds.includes(al.id))
      : [];

    const contactCounts = selectedAlbumsList.map((al) => {
      const findContacts = Array.isArray(rec || recipients?.data)
        ? (rec || recipients.data).filter((r) => r?.albumid === al.id)
        : [];

      return {
        album: al,
        contacts: findContacts.length,
      };
    });

    // ❌ Validation: block submit if any album has 0 contacts
    const emptyAlbums = contactCounts
      .filter((c) => c.contacts === 0)
      .map((c) => c.album.name)
      .join(', ');

    if (emptyAlbums) {
      showToast(`Add at least one contact to: ${emptyAlbums}.`, 'warning');
      return;
    }

    // ✅ Proceed
    setSelectedAlbumList(selectedAlbumsList);
    if (isToogle) toggle();
  };

  const toAddAlbum = () => {
    toggleAlbumMdl();
  };

  const isSubmitDisabled = Object.values(selectedAlbums).every((v) => v === null) || disabled;

  const currentNetworkId = networks?.find((n) => n.id === activeTab)?.id;
  const currentAlbums = albumsByNetwork[currentNetworkId] || [];
  const loading = albumsLoading || recipientsLoading;
  const selectedAlbumId = selectedAlbums[currentNetworkId];
  const existingContacts = getExistingContacts();
  const networkName = getCurrentNetworkName();

  const getTooltipContent = () => {
    const lowerNetwork = networkName.toLowerCase();

    if (lowerNetwork === 'email') {
      return 'Valid email format like: user@example.com';
    } else if (lowerNetwork === 'tiktock') {
      return 'Enter your TikTok username or URL';
    } else if (lowerNetwork === 'linkedin') {
      return 'Enter your LinkedIn profile URL';
    } else if (lowerNetwork === 'facebook') {
      return 'Enter your Facebook profile or page URL';
    } else if (lowerNetwork === 'instagram') {
      return 'Enter your Instagram username or URL';
    } else if (lowerNetwork === 'twitter') {
      return 'Enter your Twitter handle or profile URL';
    } else if (lowerNetwork === 'sms' || lowerNetwork === 'whatsapp') {
      return 'Valid contact format like: 923331234567 (min 7 digits)';
    }
    return 'Enter valid contact information';
  };

  return (
    <>
      <CModal
        visible={isOpen}
        alignment="center"
        aria-labelledby="album-selection"
        aria-describedby="album-selection-modal"
        backdrop="static"
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
                  <>
                    <div className="album-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {currentAlbums.map((item) => {
                        const isSelected = selectedAlbums[currentNetworkId] === item.id;
                        const contactCount =
                          recipients?.data?.filter(
                            (r) => r?.albumid === item.id && r?.networkId === item.networkid,
                          )?.length || 0;

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              handleAlbumSelect(currentNetworkId, item.id);
                            }}
                            className={`album-item mb-2 rounded-3 border position-relative ${
                              isSelected
                                ? 'border-success bg-opacity-10 shadow-sm'
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
                            <span
                              style={{
                                width: '4px',
                                alignSelf: 'stretch',
                                borderRadius: '999px',
                                backgroundColor: isSelected ? '#198754' : '#dee2e6',
                              }}
                            />

                            <div className="flex-grow-1">
                              <div className="fw-semibold text-truncate">{item.name}</div>
                              <small className="text-muted d-block mt-1">
                                {contactCount} contact{contactCount === 1 ? '' : 's'}
                              </small>
                            </div>

                            {isSelected && (
                              <CIcon icon={cilCheckCircle} size="lg" className="text-success" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Contacts Section */}
                    {selectedAlbumId && (
                      <div className="mt-3 border-top pt-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">Manage Contacts</h6>
                          <Button
                            title={showContactInput ? 'Cancel' : 'Add Contacts'}
                            onClick={() => setShowContactInput(!showContactInput)}
                            className="w-auto btn-sm"
                          />
                        </div>

                        {showContactInput && (
                          <div className="mt-2">
                            <CAlert color="info" className="mb-2 py-2 small">
                              {getTooltipContent()}
                            </CAlert>

                            <div className="position-relative mb-2">
                              <CustomInput
                                type="text"
                                width={'w-100'}
                                value={contactInput}
                                placeholder="Enter contact and press Enter or Comma"
                                onChange={(e) => setContactInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                              />

                              {newContacts.length > 0 && (
                                <CPopover
                                  content={
                                    <div className="popover-recipient-list">
                                      {newContacts.map((contact, idx) => (
                                        <div key={idx} className="recipient-tag">
                                          {contact}
                                          <span
                                            className="delete-icon"
                                            onClick={() => handleDeleteNewContact(idx)}
                                          >
                                            &times;
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  }
                                  placement="left"
                                  trigger="click"
                                  className="recipient-popover"
                                >
                                  <span
                                    className="recipient-count"
                                    style={{
                                      position: 'absolute',
                                      right: '10px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                    }}
                                  >
                                    {newContacts.length}
                                  </span>
                                </CPopover>
                              )}
                            </div>

                            {newContacts.length > 0 && (
                              <Button
                                title={
                                  isAddingContacts
                                    ? 'Saving...'
                                    : `Save ${newContacts.length} Contact(s)`
                                }
                                onClick={handleSaveNewContacts}
                                disabled={isAddingContacts}
                                className="w-100"
                              />
                            )}
                          </div>
                        )}

                        {/* Existing Contacts Display */}
                        {existingContacts.length > 0 && (
                          <div className="mt-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <small className="text-muted">
                                Existing Contacts ({existingContacts.length})
                              </small>
                            </div>
                            <div
                              className="border rounded p-2 d-flex align-items-center gap-2 flex-wrap"
                              style={{
                                maxHeight: '150px',
                                overflowY: 'auto',
                                fontSize: '0.875rem',
                              }}
                            >
                              {existingContacts.map((contact, idx) => (
                                <div
                                  key={idx}
                                  className="py-1 px-2 mb-1 btn-bg rounded fit-content-width justify-content-between align-items-center"
                                >
                                  <span>{contact}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
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

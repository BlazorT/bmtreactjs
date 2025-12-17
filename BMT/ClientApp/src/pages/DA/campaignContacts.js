import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CCard, CTooltip, CCol, CRow, CFormSelect, CButton, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import DownloadContactsTemplate from 'src/components/InputsComponent/DownloadContactsTemplate ';
import ImportContactsListData from 'src/components/InputsComponent/ImportContactsList';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import AddAlbumModel from 'src/components/Modals/AddAlbumModel'; // Import your modal
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import { CContainer } from '@coreui/react';
import globalutil from 'src/util/globalutil';
import AppContainer from 'src/components/UI/AppContainer';
import { CFormCheck } from '@coreui/react';
import Form from 'src/components/UI/Form';
import Loading from 'src/components/UI/Loading';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useDispatch, useSelector } from 'react-redux';
import { useShowToast } from 'src/hooks/useShowToast';
import { CPopover } from '@coreui/react';
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';
import {
  cibFacebook,
  cibGmail,
  cibInstagram,
  cibLinkedin,
  cibSnapchat,
  cibTiktok,
  cibTwitter,
  cibWhatsapp,
  cilShortText,
} from '@coreui/icons';
import Button from 'src/components/UI/Button';

const campaignContacts = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const showToast = useShowToast();

  // Album management
  const { data: albums, loading: albumsLoading, fetchAlbums } = useFetchAlbums();
  const [networkAlbums, setNetworkAlbums] = useState({}); // { networkId: albumId }
  const [isShowAlbumMdl, setIsShowAlbumMdl] = useState(false);
  const [selectedNetworkForAlbum, setSelectedNetworkForAlbum] = useState(null);
  // Existing states
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const allNetworkNames = globalutil.networks().map((n) => n.name);
  const [selectedNetworks, setSelectedNetworks] = useState(allNetworkNames ?? []);
  const [importedData, setImportedData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [cityData, setCityData] = useState([]);
  const [groupedContacts, setGroupedContacts] = useState([]);
  const [showTableModal, setShowTableModal] = useState(false);
  const [recipientInput, setRecipientInput] = useState({});
  const [recipientsList, setRecipientsList] = useState({});

  const tableRef = useRef(null);

  // Fetch albums on mount
  useEffect(() => {
    fetchAlbums();
  }, []);

  // Filter albums per network
  const getAlbumsForNetwork = (networkId) => {
    return albums?.filter((album) => album.networkid === networkId) || [];
  };

  // Toggle album modal
  const toggleAlbumMdl = () => setIsShowAlbumMdl((prev) => !prev);

  // Handle album selection for a network
  const handleAlbumChange = (networkId, albumId) => {
    setNetworkAlbums((prev) => ({
      ...prev,
      [networkId]: parseInt(albumId),
    }));
  };

  // Open modal to add album for specific network
  const handleAddAlbumClick = (networkId) => {
    setSelectedNetworkForAlbum(networkId);
    setIsShowAlbumMdl(true);
  };

  // Handle network checkbox change
  const handleCheckboxChange = (network) => {
    const allNetworks = globalutil.networks();
    const networkObj = allNetworks.find((n) => n.name === network);

    if (selectedNetworks.includes(network)) {
      setSelectedNetworks(selectedNetworks.filter((n) => n !== network));
      // Remove album selection when network is unchecked
      if (networkObj) {
        setNetworkAlbums((prev) => {
          const updated = { ...prev };
          delete updated[networkObj.id];
          return updated;
        });
      }
    } else {
      setSelectedNetworks([...selectedNetworks, network]);

      // Auto-select first album if available
      if (networkObj) {
        const availableAlbums = getAlbumsForNetwork(networkObj.id);
        if (availableAlbums.length > 0) {
          setNetworkAlbums((prev) => ({
            ...prev,
            [networkObj.id]: availableAlbums[0].id,
          }));
        }
      }
    }
  };

  const handleInputChange = (network, value) => {
    setRecipientInput((prev) => ({ ...prev, [network]: value }));
  };

  const validateRecipient = (network, value) => {
    if (!value) return false;

    const phonePattern = /^\+?\d+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const idPattern = /^[a-zA-Z0-9_]+$/;

    const lowerNetwork = network.toLowerCase();

    if (lowerNetwork === 'sms' || lowerNetwork === 'whatsapp') {
      return phonePattern.test(value) && value.length >= 7 && value.length <= 15;
    }

    if (lowerNetwork === 'email') {
      return emailPattern.test(value);
    }

    return idPattern.test(value);
  };

  const addRecipient = (value, network) => {
    const lowerNetwork = network.toLowerCase();
    const currentList = recipientsList[network] || [];

    if (!validateRecipient(network, value)) {
      let label = 'ID';
      let correctFormatExample = 'e.g., 123456';

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

    if (currentList.includes(value)) {
      showToast(`"${value}" is already added to ${network}.`, 'error');
      return false;
    }

    setRecipientsList((prev) => ({
      ...prev,
      [network]: [...currentList, value],
    }));

    return true;
  };

  const handleKeyDown = (e, network) => {
    let value = recipientInput[network]?.trim();

    if ((e.key === 'Enter' || e.key === ',') && value) {
      e.preventDefault();

      if (value.endsWith(',')) {
        value = value.slice(0, -1).trim();
      }
      if (!value) return;

      addRecipient(value, network);

      setRecipientInput((prev) => ({
        ...prev,
        [network]: '',
      }));
    }
  };

  const handlePaste = (e, network) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');

    if (!pasteData) return;

    const values = pasteData
      .split(/[\s,;]+/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    values.forEach((val) => {
      addRecipient(val, network);
    });

    setRecipientInput((prev) => ({
      ...prev,
      [network]: '',
    }));
  };

  const handleDeleteRecipient = (network, index) => {
    const updated = [...recipientsList[network]];
    updated.splice(index, 1);

    setRecipientsList((prev) => ({ ...prev, [network]: updated }));

    if (updated.length === 0) {
      const dropdown = document.getElementById(`recipients-${network}`);
      if (dropdown) dropdown.style.display = 'none';
    }
  };

  const handleCampaignAddContacts = (e, networkId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const fileName = file.name.toLowerCase();
    const fileExt = fileName.split('.').pop();
    const allowedExtensions = ['csv', 'xls', 'xlsx'];

    const isValidType = allowedTypes.includes(file.type);
    const isValidExt = allowedExtensions.includes(fileExt);

    if (!isValidType || !isValidExt) {
      e.target.value = null;
      showToast('Only CSV or Excel (.csv, .xls, .xlsx) files are allowed.', 'error');
      return;
    }

    showToast(`File "${file.name}" selected successfully.`, 'success');

    setSelectedFiles((prev) => ({
      ...prev,
      [networkId]: file,
    }));
  };

  const handleImportClick = async (networkKey, networkId) => {
    const selectedFile = selectedFiles[networkId];

    if (!selectedFile) {
      showToast('Please select a file first.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('files', selectedFile);
    formData.append('netowrkid', networkId);

    try {
      const response = await fetch('/Compaigns/ImportFileData', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.status === true && result.data) {
        setImportedData((prev) => ({
          ...prev,
          [networkKey]: result.data,
        }));
        showToast('Contacts imported successfully.', 'success');
      } else {
        showToast(result.message || 'Import failed.', 'error');
      }
    } catch (err) {
      console.error('Import error', err);
      showToast('Error during import.', 'error');
    }
  };

  const buildCampaignPayload = () => {
    const payload = [];
    const allNetworks = globalutil.networks();

    const allNetworkKeys = new Set([
      ...Object.keys(recipientsList || {}),
      ...Object.keys(importedData || {}),
    ]);

    allNetworkKeys.forEach((networkKey) => {
      const networkObj = allNetworks.find((n) => n.name === networkKey);
      if (!networkObj) return;

      const networkId = parseInt(networkObj.id);
      const albumId = networkAlbums[networkId];

      // Validate album selection
      if (!albumId) {
        showToast(`Please select an album for ${networkKey}`, 'error');
        throw new Error(`Album not selected for ${networkKey}`);
      }

      const manualContacts = recipientsList?.[networkKey] || [];
      const importedContacts = importedData?.[networkKey] || [];
      const allContacts = [...manualContacts, ...importedContacts];

      if (allContacts.length === 0) {
        return;
      }

      payload.push({
        Id: 0,
        OrgId: user.orgId,
        NetworkId: networkId,
        Albumid: albumId, // Include album ID
        Contentlst: allContacts,
        Desc: '',
        CreatedBy: user.userId,
        CreatedAt: new Date(),
        LastUpdatedAt: new Date(),
        RowVer: 1,
      });
    });

    return payload;
  };

  const handleSubmitCampaignContacts = async () => {
    try {
      const payload = buildCampaignPayload();

      if (payload.length === 0) {
        showToast('No contacts to send.', 'error');
        return;
      }

      setIsLoading(true);
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
        showToast(result.message, 'success');

        const networksList = globalutil.networks();
        const flatPayload = [];

        payload.forEach((p) => {
          const contactArray = p.Contentlst || '[]';
          contactArray.forEach((contact) => {
            flatPayload.push({
              networkId: p.NetworkId,
              contact: contact,
            });
          });
        });

        const networkGroups = {};

        flatPayload.forEach((p) => {
          if (!networkGroups[p.networkId]) {
            const networkName = networksList.find((n) => n.id === p.networkId)?.name || 'Unknown';
            networkGroups[p.networkId] = {
              networkName,
              contacts: [],
            };
          }

          networkGroups[p.networkId].contacts.push({
            contact: p.contact,
            found: false,
          });
        });

        if (Array.isArray(result.data) && result.data.length > 0) {
          result.data.forEach((item) => {
            const contactId = item.contentId;
            if (networkGroups[item.networkId]) {
              networkGroups[item.networkId].contacts = networkGroups[item.networkId].contacts.map(
                (c) => ({
                  ...c,
                  found: c.contact === contactId || c.found,
                }),
              );
            }
          });
        }

        const groupedData = Object.values(networkGroups);
        setGroupedContacts(groupedData);
        setShowTableModal(true);

        setTimeout(() => {
          tableRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        showToast(result.message || 'Submission failed.', 'error');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast(error.message || 'Error while submitting contacts.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowTableModal(false);
    navigate('/recipientsGrid');
  };

  const TermsModal = () => {
    setTermsmodalOpen(!termsmodalOpen);
  };

  const confirmationModal = () => {
    setConfirmationModalOpen(!confirmationModalOpen);
  };

  const goToAnotherPage = () => {
    setConfirmationModalOpen(false);
    navigate('/Dashboard');
  };

  const icons = {
    Tiktock: cibTiktok,
    Snapchat: cibSnapchat,
    Facebook: cibFacebook,
    Sms: cilShortText,
    Linkedin: cibLinkedin,
    Twitter: cibTwitter,
    Instagram: cibInstagram,
    Whatsapp: cibWhatsapp,
    Email: cibGmail,
  };

  return (
    <Form name="dsp-reg-form">
      <CContainer fluid className="mt-4">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <DownloadContactsTemplate />

            <React.Fragment>
              <AppContainer>
                <DataGridHeader title="Networks" filterDisable />
              </AppContainer>

              {globalutil.networks().map((network, index) => {
                const networkKey = network.name;
                const networkId = network.id;
                const IconName =
                  networkKey.charAt(0).toUpperCase() + networkKey.slice(1).toLowerCase();
                const isChecked = selectedNetworks.includes(networkKey);
                const recipientCount = (recipientsList[networkKey] || []).length;
                const availableAlbums = getAlbumsForNetwork(networkId);
                const selectedAlbum = networkAlbums[networkId];

                return (
                  <CCol md={12} key={index}>
                    <ul className="inlinedisplay">
                      <li className="divCircle">
                        <CIcon className="BlazorIcon" icon={icons[IconName]} size="xl" />
                      </li>

                      <li className="network-checkbox-animate networksListWidth">
                        <CFormCheck
                          id={IconName}
                          name={IconName}
                          label={networkKey}
                          checked={!isChecked}
                          onChange={() => handleCheckboxChange(networkKey)}
                        />
                      </li>

                      <li style={{ position: 'relative' }}>
                        <CTooltip
                          content={
                            networkKey.toLowerCase() === 'email'
                              ? 'Valid email format like: user@example.com'
                              : networkKey.toLowerCase() === 'tiktock'
                                ? 'Enter your TikTok username or URL'
                                : networkKey.toLowerCase() === 'linkedin'
                                  ? 'Enter your LinkedIn profile URL'
                                  : networkKey.toLowerCase() === 'facebook'
                                    ? 'Enter your Facebook profile or page URL'
                                    : networkKey.toLowerCase() === 'instagram'
                                      ? 'Enter your Instagram username or URL'
                                      : networkKey.toLowerCase() === 'twitter'
                                        ? 'Enter your Twitter handle or profile URL'
                                        : 'Valid contact format like: 923331234567 (min 7 digits)'
                          }
                          placement="top"
                        >
                          <div>
                            <CustomInput
                              disabled={isChecked}
                              type="text"
                              value={recipientInput[networkKey] || ''}
                              placeholder="Enter recipient and press Enter, Comma, or Paste"
                              onChange={(e) => handleInputChange(networkKey, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, networkKey)}
                              onPaste={(e) => handlePaste(e, networkKey)}
                            />
                          </div>
                        </CTooltip>

                        {recipientCount > 0 && (
                          <CPopover
                            content={
                              <div className="popover-recipient-list">
                                {(recipientsList[networkKey] || []).map((rec, idx) => (
                                  <div key={idx} className="recipient-tag">
                                    {rec}
                                    <span
                                      className="delete-icon"
                                      onClick={() => handleDeleteRecipient(networkKey, idx)}
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
                            <span className="recipient-count">{recipientCount}</span>
                          </CPopover>
                        )}
                      </li>

                      <li>
                        <CustomInput
                          type="file"
                          accept=".csv, .xls, .xlsx"
                          disabled={isChecked}
                          onChange={(e) => handleCampaignAddContacts(e, networkId)}
                          className="form-control item"
                        />
                      </li>

                      {importedData[networkKey]?.length > 0 && (
                        <ImportContactsListData
                          networkKey={networkKey}
                          importedData={importedData}
                          setImportedData={setImportedData}
                        />
                      )}

                      <li>
                        <button
                          onClick={() => handleImportClick(networkKey, networkId)}
                          disabled={!selectedFiles[networkId]}
                        >
                          Import
                        </button>
                      </li>
                      {/* Album Selection Dropdown */}
                      <div style={{ minWidth: '200px' }}>
                        {!isChecked && (
                          <>
                            {availableAlbums.length > 0 ? (
                              <CFormSelect
                                value={selectedAlbum || ''}
                                onChange={(e) => handleAlbumChange(networkId, e.target.value)}
                                disabled={isChecked}
                              >
                                <option value="">Select Album</option>
                                {availableAlbums.map((album) => (
                                  <option key={album.id} value={album.id}>
                                    {album.name}
                                  </option>
                                ))}
                              </CFormSelect>
                            ) : (
                              <div className="d-flex align-items-center gap-2">
                                <CAlert color="warning" className="mb-0 py-1 px-2 small">
                                  No albums available
                                </CAlert>

                                <Button
                                  onClick={() => handleAddAlbumClick(networkId)}
                                  title=" Add Album"
                                  className="w-auto py-1 h-auto"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </ul>
                  </CCol>
                );
              })}

              <React.Fragment>
                <div className="CenterAlign pt-2">
                  <button
                    onClick={() => setConfirmationModalOpen(true)}
                    type="button"
                    className="btn btn_Default m-2 sales-btn-style"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSubmitCampaignContacts}
                    type="button"
                    className="btn btn_Default sales-btn-style m-2"
                  >
                    Save
                  </button>
                </div>

                {showTableModal && (
                  <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Contact Status</h5>
                        </div>
                        <div className="modal-body">
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead className="table-light">
                                <tr>
                                  <th className="text-center">#</th>
                                  <th className="text-center">Network</th>
                                  <th className="text-center">Contact</th>
                                  <th className="text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {groupedContacts.flatMap((group, groupIndex) =>
                                  group.contacts.map((contactObj, i) => (
                                    <tr
                                      key={`${groupIndex}-${i}`}
                                      style={{
                                        backgroundColor: contactObj.found ? '#d4edda' : '#f8d7da',
                                        color: contactObj.found ? '#155724' : '#721c24',
                                      }}
                                    >
                                      <td className="text-center">{i + 1}</td>
                                      <td className="text-center">{group.networkName}</td>
                                      <td className="text-center">{contactObj.contact}</td>
                                      <td className="text-center">
                                        {contactObj.found
                                          ? 'Inserted Recipients'
                                          : 'Duplicate Recipients'}
                                      </td>
                                    </tr>
                                  )),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCloseModal}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            </React.Fragment>
          </>
        )}
      </CContainer>

      {/* Add Album Modal */}
      <AddAlbumModel
        isOpen={isShowAlbumMdl}
        toggle={toggleAlbumMdl}
        refreshRecipients={fetchAlbums}
        networkId={selectedNetworkForAlbum}
      />

      <ConfirmationModal
        header="Confirmation!"
        body="Are you sure you want to cancel?"
        isOpen={confirmationModalOpen}
        onYes={goToAnotherPage}
        onNo={confirmationModal}
      />

      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </Form>
  );
};

export default campaignContacts;

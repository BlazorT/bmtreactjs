/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
import CIcon from '@coreui/icons-react';
import { CCol, CFormCheck, CPopover, CRow, CTooltip } from '@coreui/react';
import { useEffect, useRef, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import TermsAndConditionModal from 'src/components/Modals/TermsAndConditionModal';
import AppContainer from 'src/components/UI/AppContainer';
import useFetch from 'src/hooks/useFetch';
import { useShowToast } from 'src/hooks/useShowToast';
import globalutil from 'src/util/globalutil';

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
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomInput from 'src/components/InputsComponent/CustomInput';
const UnsubscribeModal = (prop) => {
  const { isOpen, toggle } = prop;

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const { fetchData } = useFetch();
  const TermsModal = () => setTermsmodalOpen((prev) => !prev);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const showToast = useShowToast();

  // Album management
  const [networkAlbums, setNetworkAlbums] = useState({}); // { networkId: albumId }
  const networks = globalutil.networks() || [];
  const allNetworkNames = networks.map((n) => n.name);

  const [selectedNetworks, setSelectedNetworks] = useState(() => allNetworkNames);

  // Existing states
  const [termsmodalOpen, setTermsmodalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  //const allNetworkNames = globalutil.networks().map((n) => n.name);
  //const [selectedNetworks, setSelectedNetworks] = useState(allNetworkNames ?? []);
  const [groupedContacts, setGroupedContacts] = useState([]);
  const [recipientInput, setRecipientInput] = useState({});
  const [recipientsList, setRecipientsList] = useState({});
  // Timer effect
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer]);

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
  const handleDeleteRecipient = (network, index) => {
    const updated = [...recipientsList[network]];
    updated.splice(index, 1);

    setRecipientsList((prev) => ({ ...prev, [network]: updated }));

    if (updated.length === 0) {
      const dropdown = document.getElementById(`recipients-${network}`);
      if (dropdown) dropdown.style.display = 'none';
    }
  };
  const buildCampaignPayload = () => {
    const payload = [];
    const allNetworks = globalutil.networks();
    const allNetworkKeys = new Set(Object.keys(recipientsList || {}));

    allNetworkKeys.forEach((networkKey) => {
      const networkObj = allNetworks.find((n) => n.name === networkKey);
      if (!networkObj) return;

      const networkId = parseInt(networkObj.id);
      const manualContacts = recipientsList?.[networkKey] || [];
      const allContacts = [...manualContacts];

      if (allContacts.length === 0) return;

      payload.push({
        Id: 0,
        OrgId: user.orgId,
        Networkid: networkId,
        Contactid: allContacts.join(','), // <-- fix here
        remarks: '',
        LastUpdatedBy: user.userId,
        LastUpdatedAt: new Date(),
        RowVer: 1,
        Status: 1,
      });
    });

    return payload;
  };

  const handleSubmitCampaignContacts = async () => {
    try {
      const payload = buildCampaignPayload();
      console.log('payload', payload);
      if (payload.length === 0) {
        showToast('No contacts to send.', 'error');
        return;
      }

      setIsLoading(true);
      const response = await fetch('/Common/unsubscriberrequest', {
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
        toggle();
      }
    } catch (error) {
      console.error('Submit error:', error);
      showToast(error.message || 'Error while submitting contacts.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  //const networks = globalutil.networks() || [];

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
        <ModalHeader toggle={toggle}>Unsubscribe Request</ModalHeader>

        <ModalBody className="">
          <AppContainer>
            <DataGridHeader title="Networks" filterDisable />
          </AppContainer>

          {networks.map((network, index) => {
            const networkKey = network.name;
            const networkId = network.id;
            const IconName = networkKey.charAt(0).toUpperCase() + networkKey.slice(1).toLowerCase();
            const isChecked = selectedNetworks.includes(networkKey);
            const recipientCount = (recipientsList[networkKey] || []).length;

            return (
              <CRow md={12} key={index}>
                <div className="d-flex align-items-center gap-4 mt-2">
                  <CCol className="divCircle" md={3}>
                    <CIcon className="BlazorIcon" icon={icons[IconName]} size="xl" />
                  </CCol>

                  <CCol md={3} className="network-checkbox">
                    <CFormCheck
                      id={IconName}
                      name={IconName}
                      label={networkKey}
                      checked={!isChecked}
                      onChange={() => handleCheckboxChange(networkKey)}
                    />
                  </CCol>

                  <CCol style={{ position: 'relative' }} md={6}>
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
                      <CustomInput
                        disabled={isChecked}
                        type="text"
                        value={recipientInput[networkKey] || ''}
                        placeholder="Enter recipient and press Enter, Comma, or Paste"
                        onChange={(e) => handleInputChange(networkKey, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, networkKey)}
                        onPaste={(e) => handlePaste(e, networkKey)}
                        width={'w-100'}
                        className={'d-flex'}
                      />
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
                  </CCol>
                </div>
              </CRow>
            );
          })}

          <div className="d-flex justify-content-center gap-3 mt-3">
            <button className="btn btn-secondary" onClick={toggle}>
              Cancel
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleSubmitCampaignContacts}
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </ModalBody>
      </Modal>

      <TermsAndConditionModal isOpen={termsmodalOpen} toggle={TermsModal} />
    </>
  );
};

export default UnsubscribeModal;

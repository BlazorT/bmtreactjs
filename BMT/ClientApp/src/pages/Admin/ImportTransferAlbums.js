// ============================================================================
// MAIN COMPONENT: ImportTransferAlbums.jsx
// ============================================================================
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CCard, CCardBody, CCardHeader } from '@coreui/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Loading from 'src/components/UI/Loading';
import { useShowToast } from 'src/hooks/useShowToast';
import useApi from 'src/hooks/useApi';
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';

import ModeSelector from 'src/components/ImportContacts/ModeSelector';
import FilterSection from 'src/components/ImportContacts/FilterSection';
import VerificationAlert from 'src/components/ImportContacts/VerificationAlert';
import AlbumSelectionSection from 'src/components/ImportContacts/AlbumSelectionSection';
import PreviewModal from 'src/components/ImportContacts/PreviewModal';
import ImportProgressModal from 'src/components/ImportContacts/ImportProgressModal';
import VerificationModal from 'src/components/ImportContacts/VerificationModal';
import PasswordModal from 'src/components/ImportContacts/PasswordModal';

import { useVerification } from 'src/hooks/useVerification';
import { useImportLogic } from 'src/hooks/useImportLogic';
import { filterDisabledItems } from 'src/util/filterUtils';

dayjs.extend(utc);

const ImportTransferAlbums = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const showToast = useShowToast();
  const isSuperAdmin = user.roleId === 1;

  // API Hooks
  const {
    postData: getOrgs,
    loading: orgsLoading,
    data: orgsData,
  } = useApi('/BlazorApi/orgsfulldata');
  const { postData: getCities, loading: citiesLoading, data: cityRes } = useApi('/Common/cities');
  const { fetchAlbums, loading: albumsLoading } = useFetchAlbums();
  const { fetchRecipients, loading: recipientsLoading } = useFetchRecipients();

  // Mode State
  const [activeMode, setActiveMode] = useState('import'); // 'import' or 'transfer'

  // Filter State
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [destinationOrg, setDestinationOrg] = useState(null); // For transfer mode
  const [activeTab, setActiveTab] = useState(0);
  const [albumSearch, setAlbumSearch] = useState('');
  const [recipientSearch, setRecipientSearch] = useState('');

  // Data State
  const [sourceAlbums, setSourceAlbums] = useState([]);
  const [sourceRecipients, setSourceRecipients] = useState([]);
  const [userAlbums, setUserAlbums] = useState([]); // Current user's albums
  const [userRecipients, setUserRecipients] = useState([]); // Current user's recipients

  // Selection State
  const [selectedAlbums, setSelectedAlbums] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [expandedAlbums, setExpandedAlbums] = useState({});

  // Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingImportData, setPendingImportData] = useState(null);

  // Custom Hooks
  const verification = useVerification(user, selectedOrg, showToast);
  const importLogic = useImportLogic(
    user,
    selectedOrg,
    destinationOrg,
    activeMode,
    showToast,
    navigate,
  );

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
    fetchUserData();
  }, []);

  // Check verification when org changes
  useEffect(() => {
    if (selectedOrg) {
      verification.checkStatus();
    } else {
      verification.reset();
    }
  }, [selectedOrg]);

  // Fetch source data when org is verified (import) or selected (transfer)
  useEffect(() => {
    const shouldFetch = selectedOrg;

    if (shouldFetch) {
      fetchSourceData();
    }
  }, [selectedOrg, verification.isVerified, activeMode]);

  useEffect(() => {
    if (activeMode === 'transfer') {
      fetchUserData();
    }
  }, [activeMode, destinationOrg]);

  const fetchInitialData = async () => {
    const orgsBody = {
      id: 0,
      roleId: 0,
      orgId: 0,
      email: '',
      name: '',
      contact: '',
      rowVer: 0,
      cityId: 0,
      status: 0,
      createdAt: dayjs().utc().subtract(5, 'year').format('YYYY-MM-DD'),
      lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
      createdBy: 0,
      lastUpdatedBy: 0,
    };
    await getOrgs(orgsBody);
    await getCities();
  };

  const fetchUserData = async () => {
    if (activeMode === 'transfer' && !destinationOrg) return;

    try {
      const albumsBody = {
        id: 0,
        orgId: activeMode === 'transfer' ? destinationOrg?.id : user.orgId,
        networkId: 0,
        name: '',
        code: '',
        desc: '',
        createdBy: 0,
        lastUpdatedBy: 0,
        createdAt: dayjs().subtract(5, 'year').format(),
        lastUpdatedAt: dayjs().utc().format(),
        rowVer: 0,
        status: 1,
      };

      const recipientsBody = {
        id: 0,
        orgId: activeMode === 'transfer' ? destinationOrg?.id : user.orgId,
        contentId: '',
        rowVer: 0,
        networkId: 0,
        albumid: 0,
        status: 0,
        createdAt: dayjs().subtract(5, 'year').startOf('year').format(),
        lastUpdatedAt: dayjs().utc().endOf('day').format(),
      };

      const [albumsData, recipientsData] = await Promise.all([
        fetchAlbums(albumsBody),
        fetchRecipients(recipientsBody),
      ]);

      setUserAlbums(albumsData || []);
      setUserRecipients(recipientsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchSourceData = async () => {
    if (!selectedOrg) return;

    try {
      const albumsBody = {
        id: 0,
        orgId: activeMode === 'transfer' ? user?.orgId : selectedOrg.id,
        networkId: 0,
        name: '',
        code: '',
        desc: '',
        createdBy: 0,
        lastUpdatedBy: 0,
        createdAt: dayjs().subtract(5, 'year').format(),
        lastUpdatedAt: dayjs().utc().format(),
        rowVer: 0,
        status: 1,
      };

      const recipientsBody = {
        id: 0,
        orgId: activeMode === 'transfer' ? user?.orgId : selectedOrg.id,
        contentId: '',
        rowVer: 0,
        networkId: 0,
        albumid: 0,
        status: 0,
        createdAt: dayjs().subtract(5, 'year').startOf('year').format(),
        lastUpdatedAt: dayjs().utc().endOf('day').format(),
      };

      const [albumsData, recipientsData] = await Promise.all([
        fetchAlbums(albumsBody),
        fetchRecipients(recipientsBody),
      ]);

      setSourceAlbums(albumsData || []);
      setSourceRecipients(recipientsData || []);
    } catch (error) {
      console.error('Error fetching source data:', error);
      showToast('Failed to fetch albums and recipients', 'error');
    }
  };

  const resetSelection = () => {
    setSelectedCity('');
    if (activeMode === 'import') {
      setSelectedOrg(null);
      setSourceAlbums([]);
      setSourceRecipients([]);
    }
    setDestinationOrg(null);
    setAlbumSearch('');
    setRecipientSearch('');
    setSelectedAlbums([]);
    setSelectedRecipients([]);
    setExpandedAlbums({});
    setActiveTab(0);
    verification.reset();
  };

  const handlePreview = () => {
    if (selectedAlbums.length === 0) {
      showToast('Please select at least one album', 'warning');
      return;
    }

    // For transfer mode, check if destination org is selected
    if (activeMode === 'transfer' && !destinationOrg) {
      showToast('Please select a destination organization', 'warning');
      return;
    }

    // Store pending import data
    setPendingImportData({
      albums: sourceAlbums.filter((a) => selectedAlbums.includes(a.id)),
      recipients: sourceRecipients.filter((r) => selectedRecipients.includes(r.id)),
      albumIds: selectedAlbums,
      recipientIds: selectedRecipients,
    });

    setShowPreviewModal(true);
  };

  const handleConfirmPreview = async () => {
    // For import mode, verification is required
    if (activeMode === 'import' && !verification.isVerified) {
      if (verification.isCodeActive()) {
        setShowPreviewModal(false);
        setShowVerificationModal(true);
        return;
      }
      const status = await verification.sendVerificationEmail();
      if (status) {
        setShowPreviewModal(false);
        setShowVerificationModal(true);
      }
    } else {
      // For transfer mode, proceed directly
      handleFinalSubmit();
    }
  };

  const handleVerificationComplete = () => {
    setShowVerificationModal(false);
    handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    if (!pendingImportData) return;

    const targetOrgId = activeMode === 'import' ? user.orgId : destinationOrg.id;
    const targetOrgName = activeMode === 'import' ? user.orgInfo?.name : destinationOrg.name;

    await importLogic.executeImport(
      pendingImportData.albums,
      pendingImportData.recipients,
      selectedRecipients,
      userAlbums,
      targetOrgId,
      targetOrgName,
    );

    // Clear pending data
    setPendingImportData(null);
  };

  // Filter albums and recipients based on ownership
  const { filteredAlbums, disabledAlbumIds, disabledRecipientIds } = filterDisabledItems(
    sourceAlbums,
    sourceRecipients,
    userAlbums,
    userRecipients,
    activeTab,
    albumSearch,
    recipientSearch,
    activeMode,
    destinationOrg,
  );

  const loading = orgsLoading || citiesLoading || verification.loading;
  const dataLoading = albumsLoading || recipientsLoading;

  return (
    <>
      {loading && <Loading />}
      <CCard>
        <CCardHeader>
          <h4 className="mb-0">Import / Transfer Albums</h4>
        </CCardHeader>
        <CCardBody>
          <ModeSelector
            activeMode={activeMode}
            setActiveMode={(mode) => {
              if (mode === 'transfer') {
                setSelectedOrg(user?.orgInfo);
                setActiveMode(mode);
              } else {
                setActiveMode(mode);
                setSelectedOrg('');
              }
            }}
            isSuperAdmin={isSuperAdmin}
          />

          <FilterSection
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedOrg={selectedOrg}
            setSelectedOrg={setSelectedOrg}
            destinationOrg={destinationOrg}
            setDestinationOrg={setDestinationOrg}
            activeMode={activeMode}
            cities={cityRes?.data || []}
            orgs={orgsData?.data || []}
            user={user}
            resetSelection={resetSelection}
          />

          {/* {activeMode === 'import' && selectedOrg && !verification.isVerified && (
            <VerificationAlert
              onSendVerification={verification.sendVerificationEmail}
              loading={verification.loading}
            />
          )} */}

          {selectedOrg && (
            <AlbumSelectionSection
              albums={filteredAlbums}
              sourceAlbums={sourceAlbums}
              recipients={sourceRecipients}
              disabledAlbumIds={disabledAlbumIds}
              disabledRecipientIds={disabledRecipientIds}
              selectedAlbums={selectedAlbums}
              setSelectedAlbums={setSelectedAlbums}
              selectedRecipients={selectedRecipients}
              setSelectedRecipients={setSelectedRecipients}
              expandedAlbums={expandedAlbums}
              setExpandedAlbums={setExpandedAlbums}
              albumSearch={albumSearch}
              setAlbumSearch={setAlbumSearch}
              recipientSearch={recipientSearch}
              setRecipientSearch={setRecipientSearch}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              loading={dataLoading}
              onPreview={handlePreview}
            />
          )}
        </CCardBody>
      </CCard>

      <PreviewModal
        visible={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onConfirm={handleConfirmPreview}
        activeMode={activeMode}
        sourceOrg={selectedOrg}
        destinationOrg={activeMode === 'transfer' ? destinationOrg : null}
        albums={pendingImportData?.albums || []}
        recipients={pendingImportData?.recipients || []}
        selectedRecipientIds={pendingImportData?.recipientIds || []}
        needsVerification={activeMode === 'import' && !verification.isVerified}
      />

      <VerificationModal
        visible={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={handleVerificationComplete}
        verification={verification}
      />

      <ImportProgressModal
        visible={importLogic.isImporting}
        progress={importLogic.progress}
        errors={importLogic.errors}
      />

      <PasswordModal
        visible={verification.showPasswordModal}
        onClose={() => verification.setShowPasswordModal(false)}
        onSubmit={verification.handlePasswordSubmit}
        loading={verification.passwordLoading}
      />
    </>
  );
};

export default ImportTransferAlbums;

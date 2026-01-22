// ============================================================================
// HOOK: useImportLogic.js
// ============================================================================
import { useState } from 'react';
import dayjs from 'dayjs';

export const useImportLogic = (
  user,
  selectedOrg,
  destinationOrg,
  activeMode,
  showToast,
  navigate,
) => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState([]);

  const findExistingAlbum = (album, existingAlbums) => {
    return existingAlbums.find(
      (existing) => existing.name === album.name && existing.networkid === album.networkid,
    );
  };

  const executeImport = async (
    albums,
    recipients,
    selectedRecipientIds,
    userAlbums,
    targetOrgId,
    targetOrgName,
  ) => {
    setIsImporting(true);
    setProgress(0);
    setErrors([]);

    try {
      const totalSteps = albums.length * 2;
      let currentStep = 0;
      const albumMapping = {};
      const errorsList = [];

      // Step 1: Create or Reuse Albums
      for (const album of albums) {
        try {
          // Check if album already exists
          const existingAlbum = findExistingAlbum(album, userAlbums);

          if (existingAlbum) {
            // Reuse existing album
            albumMapping[album.id] = existingAlbum.id;
            console.log(`Reusing existing album: ${album.name}`);
          } else {
            // Create new album
            const albumBody = {
              id: 0,
              networkid: album.networkid,
              name: album.name,
              code: dayjs().local().format('DDMMYYYY'),
              desc: album.desc || `Imported from ${selectedOrg.name}`,
              lastUpdatedBy: user.userId,
              orgid: targetOrgId,
              lastUpdatedAt: dayjs().utc().format(),
              rowVer: 1,
              status: 1,
            };

            const response = await fetch('/Compaigns/submitalbumlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(albumBody),
            });

            if (!response.ok) {
              throw new Error(`Failed to create album: ${album.name}`);
            }

            const result = await response.json();

            if (result.status && result.data?.id) {
              albumMapping[album.id] = result.data.id;
            } else {
              throw new Error(`Failed to create album: ${album.name}`);
            }
          }

          currentStep++;
          setProgress((currentStep / totalSteps) * 100);
        } catch (error) {
          errorsList.push(`Album "${album.name}": ${error.message}`);
          currentStep++;
          setProgress((currentStep / totalSteps) * 100);
        }
      }

      // Step 2: Create Recipients
      for (const album of albums) {
        if (!albumMapping[album.id]) {
          currentStep++;
          setProgress((currentStep / totalSteps) * 100);
          continue;
        }

        const albumRecipients = recipients.filter(
          (r) => r.albumid === album.id && selectedRecipientIds.includes(r.id),
        );

        if (albumRecipients.length === 0) {
          currentStep++;
          setProgress((currentStep / totalSteps) * 100);
          continue;
        }

        try {
          const payload = [
            {
              Id: 0,
              OrgId: targetOrgId,
              NetworkId: album.networkid,
              Albumid: albumMapping[album.id],
              Contentlst: albumRecipients.map((r) => r.contentId),
              Desc: `Imported from ${selectedOrg.name}`,
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
            throw new Error(`Failed to import recipients for album: ${album.name}`);
          }

          const result = await response.json();

          if (!result.status) {
            throw new Error(
              result.message || `Failed to import recipients for album: ${album.name}`,
            );
          }

          currentStep++;
          setProgress((currentStep / totalSteps) * 100);
        } catch (error) {
          errorsList.push(`Recipients for "${album.name}": ${error.message}`);
          currentStep++;
          setProgress((currentStep / totalSteps) * 100);
        }
      }

      setErrors(errorsList);

      if (errorsList.length === 0) {
        const recipientCount = recipients.filter((r) => selectedRecipientIds.includes(r.id)).length;
        showToast(
          `Successfully ${activeMode === 'import' ? 'imported' : 'transferred'} ${albums.length} albums with ${recipientCount} recipients!`,
          'success',
        );
        setTimeout(() => {
          navigate('/recipientsGrid');
        }, 2000);
      } else {
        showToast(
          `${activeMode === 'import' ? 'Import' : 'Transfer'} completed with ${errorsList.length} errors. Check the error report.`,
          'warning',
        );
      }
    } catch (error) {
      console.error('Import error:', error);
      showToast(
        `${activeMode === 'import' ? 'Import' : 'Transfer'} failed. Please try again.`,
        'error',
      );
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    progress,
    errors,
    executeImport,
  };
};

// ============================================================================
// UTILITY: filterUtils.js
// ============================================================================
export const filterDisabledItems = (
  sourceAlbums,
  sourceRecipients,
  userAlbums,
  userRecipients,
  activeTab,
  albumSearch,
  recipientSearch,
  activeMode,
  destinationOrg,
) => {
  // Filter albums by network tab and search
  let filteredAlbums = sourceAlbums;

  if (activeTab) {
    filteredAlbums = filteredAlbums.filter((album) => album.networkid === activeTab);
  }

  if (albumSearch) {
    filteredAlbums = filteredAlbums.filter((album) =>
      album.name.toLowerCase().includes(albumSearch.toLowerCase()),
    );
  }

  // Find disabled albums (user already owns same name + network)
  const disabledAlbumIds = [];
  //   filteredAlbums.forEach((album) => {
  //     const exists = userAlbums.find(
  //       (userAlbum) => userAlbum.name === album.name && userAlbum.networkid === album.networkid,
  //     );
  //     if (exists) {
  //       disabledAlbumIds.push(album.id);
  //     }
  //   });

  // Find disabled recipients (user already owns same contentId + network)
  const disabledRecipientIds = [];
  if (activeMode === 'import' || (activeMode === 'transfer' && destinationOrg)) {
    sourceRecipients.forEach((recipient) => {
      const exists = userRecipients.find(
        (userRecipient) =>
          userRecipient.contentId === recipient.contentId &&
          userRecipient.networkId === recipient.networkId,
      );
      if (exists) {
        disabledRecipientIds.push(recipient.id);
      }
    });
  }

  return {
    filteredAlbums,
    disabledAlbumIds,
    disabledRecipientIds,
  };
};

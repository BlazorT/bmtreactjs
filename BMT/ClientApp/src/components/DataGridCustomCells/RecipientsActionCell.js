// src/components/DataGridCustomCells/RecipientsActionCell.jsx
/* eslint-disable react/prop-types */

import React from 'react';
import { cilReload, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import { useSelector } from 'react-redux';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import { useToggleRecipientsStatus } from 'src/hooks/api/useToggleRecipientsStatus';
import Spinner from '../UI/Spinner';

const RecipientsActionCell = ({ row, pageRoles, getRecipientsList }) => {
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { updateStatus, loading } = useToggleRecipientsStatus();
  const loginUser = useSelector((state) => state.user);

  const canDelete = pageRoles?.canDelete === 1;

  const handleToggleStatus = (newStatus) => {
    const isReactivate = newStatus === 5;
    const action = isReactivate ? 'reactivate' : 'delete';
    const successMsg = isReactivate ? 'reactivated' : 'deleted';

    showConfirmation({
      header: 'Confirmation',
      body: `Are you sure you want to ${action} this recipient (${row.contentId || 'unknown'})?`,
      isOpen: true,
      onYes: async () => {
        try {
          const response = await updateStatus(row, newStatus);

          // Close dialog in both cases
          showConfirmation({ isOpen: false });

          if (response?.status) {
            showToast(`Recipient ${successMsg} successfully`, 'success');
            await getRecipientsList();
            // Force refresh the whole page (simple but effective)
        
          } else {
            showToast(response?.message || 'Failed to update status', 'error');
          }
        } catch (err) {
          // Close dialog on error too
          showConfirmation({ isOpen: false });
          console.error('Toggle status error:', err);
          showToast('Something went wrong', 'error');
        }
      },
      onNo: () => {
        showConfirmation({ isOpen: false });
      },
    });
  };

  // Show spinner while any status update is in progress (global to this hook)
  if (loading) {
    return <Spinner size="sm" />;
  }

  return (
    <CRow className="gap-2 justify-content-center">
      {row.status === 4 ? (
        // Deleted/Inactive → show Reactivate
        <CCol xs="auto">
          <CTooltip content="Re-activate Recipient">
            <CIcon
              icon={cilReload}
              size="lg"
              className="stock-toggle-icon text-success pointer"
              onClick={() => handleToggleStatus(5)}
            />
          </CTooltip>
        </CCol>
      ) : (
        // Active → show Delete (if allowed)
        canDelete && (
          <CCol xs="auto">
            <CTooltip content="Delete Recipient">
              <CIcon
                icon={cilTrash}
                size="lg"
                className="stock-toggle-icon text-danger pointer"
                onClick={() => handleToggleStatus(4)}
              />
            </CTooltip>
          </CCol>
        )
      )}
    </CRow>
  );
};

export default RecipientsActionCell;

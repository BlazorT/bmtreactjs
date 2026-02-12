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
  console.log({ row });
  const handleToggleStatus = (newStatus) => {
    const isReactivate = newStatus === 1;
    const action = isReactivate ? 'reactivate' : 'delete';
    const successMsg = isReactivate ? 'reactivated' : 'deleted';

    showConfirmation({
      header: 'Confirmation',
      body: `Are you sure you want to ${action} this recipient (${row.contentId || 'unknown'})?`,
      isOpen: true,
      onYes: async () => {
        try {
          const response = await updateStatus(row?.recipient, newStatus);

          showConfirmation({ isOpen: false });
          if (response?.status === true) {
            showToast(`Recipient ${successMsg} successfully`, 'success');
            if (getRecipientsList) {
              await getRecipientsList(); // refresh grid
            }
          } else {
            showToast(response?.message || 'Failed to update status', 'error');
          }
        } catch (err) {
          showConfirmation({ isOpen: false });
          console.error('Toggle status error:', err);
          showToast('Something went wrong', 'error');
        }
      },
      onNo: () => showConfirmation({ isOpen: false }),
    });
  };

  if (loading) {
    return <Spinner size="sm" />;
  }

  return (
    <CRow className="gap-2 justify-content-center">
      {row.status === 2 ? (
        // Inactive (status = 2) → show Reactivate icon
        <CCol xs="auto">
          <CTooltip content="Re-activate Recipient">
            <CIcon
              icon={cilReload}
              size="lg"
              className="stock-toggle-icon text-success pointer"
              onClick={() => handleToggleStatus(1)} // ← reactivate sets to 1
            />
          </CTooltip>
        </CCol>
      ) : (
        // Active (status = 1) → show Delete icon (if permitted)
        canDelete && (
          <CCol xs="auto">
            <CTooltip content="Delete Recipient">
              <CIcon
                icon={cilTrash}
                size="lg"
                className="stock-toggle-icon text-danger pointer"
                onClick={() => handleToggleStatus(2)} // ← delete sets to 2
              />
            </CTooltip>
          </CCol>
        )
      )}
    </CRow>
  );
};

export default RecipientsActionCell;

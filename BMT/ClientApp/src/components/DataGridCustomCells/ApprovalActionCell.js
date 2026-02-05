import React from 'react';
import { cilCheck, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CRow, CTooltip, CBadge } from '@coreui/react';
import { useSelector } from 'react-redux';
import { useToggleOrgStatus } from 'src/hooks/api/useToggleOrgStatus';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from '../UI/Spinner';

export const approvalStatus = [
  {
    id: 1,
    name: 'Pending',
    color: 'warning',
    textColor: 'text-warning',
  },
  {
    id: 2,
    name: 'Approved',
    color: 'success',
    textColor: 'text-success',
  },
  {
    id: 3,
    name: 'Rejected',
    color: 'danger',
    textColor: 'text-danger',
  },
];

const ApprovalActionCell = (prop) => {
  const { value, org } = prop;
  const user = useSelector((state) => state.user);

  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { loading, updateStatus } = useToggleOrgStatus();

  const toggleStatus = (status) => {
    const action = status === 2 ? 'approve' : 'reject';
    showConfirmation({
      header: 'Confirmation Required',
      body: `Are you sure you want to ${action} the request for "${org?.name}"?`,
      isOpen: true,
      onYes: () => onYesToggle(status),
      onNo: () => onNoConfirm(),
    });
  };

  const onYesToggle = async (status) => {
    // const response = await updateStatus(org, status);
    // if (response.status) {
    //   const statusName = approvalStatus.find((s) => s.id === status)?.name || '';
    //   showToast(`Request for ${org?.name} has been ${statusName.toLowerCase()} successfully`);
    // } else {
    //   showToast(response.message, 'error');
    // }
    onNoConfirm();
  };

  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };

  if (loading) {
    return (
      <div className="approval-action-cell__loading">
        <Spinner />
      </div>
    );
  }

  const currentStatus = approvalStatus.find((s) => s.id === value.row.status);

  return (
    <div className="approval-action-cell">
      {value.row.status === 1 ? (
        <CRow className="g-2 justify-content-center align-items-center">
          <div className="col-auto">
            <CTooltip content="Reject Request" placement="top">
              <button
                onClick={() => toggleStatus(3)}
                className="approval-action-cell__btn approval-action-cell__btn--reject"
                aria-label="Reject request"
              >
                <CIcon icon={cilX} size="lg" />
              </button>
            </CTooltip>
          </div>
          <div className="col-auto">
            <CTooltip content="Approve Request" placement="top">
              <button
                onClick={() => toggleStatus(2)}
                className="approval-action-cell__btn approval-action-cell__btn--approve"
                aria-label="Approve request"
              >
                <CIcon icon={cilCheck} size="lg" />
              </button>
            </CTooltip>
          </div>
        </CRow>
      ) : (
        <CBadge
          color={currentStatus?.color}
          shape="rounded-pill"
          className="approval-action-cell__badge"
        >
          {currentStatus?.name || 'Unknown'}
        </CBadge>
      )}
    </div>
  );
};

export default ApprovalActionCell;

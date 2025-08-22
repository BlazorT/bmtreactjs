/* eslint-disable react/prop-types */
import CIcon from '@coreui/icons-react';
import { CCol, CTooltip } from '@coreui/react';

import React from 'react';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';

const ActionButton = ({ title, status, updateFn, name, icon }) => {
  const showConfirmation = useShowConfirmation();

  const toggleStatus = (status) => {
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${name}?`,
      isOpen: true,
      onYes: () => updateFn(status),
      onNo: () => onNoConfirm(),
    });
  };
  const onNoConfirm = () => {
    showConfirmation({
      isOpen: false,
    });
  };
  return (
    <CCol>
      <CTooltip content={title}>
        <CIcon className="stock-toggle-icon" onClick={() => toggleStatus(status)} icon={icon} />
      </CTooltip>
    </CCol>
  );
};
export default ActionButton;

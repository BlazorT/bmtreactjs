/* eslint-disable react/prop-types */
import React from 'react';

import { CCol, CRow } from '@coreui/react';
import { Tooltip } from '@material-ui/core';
import CIcon from '@coreui/icons-react';

const ActionCell = ({ actions, productData }) => (
  <CRow>
    {actions.map((action, index) => (
      <CCol key={index}>
        <Tooltip title={action.tooltip}>
          <CIcon
            onClick={() => action.onClick()}
            className="stock-toggle-icon"
            icon={action.icon}
          />
        </Tooltip>
      </CCol>
    ))}
  </CRow>
);
export default ActionCell;

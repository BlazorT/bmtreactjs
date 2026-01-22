/* eslint-disable react/prop-types */
// ============================================================================
// COMPONENT: ModeSelector.jsx
// ============================================================================
import React from 'react';
import { CNav, CNavItem, CNavLink } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

const ModeSelector = ({ activeMode, setActiveMode, isSuperAdmin }) => {
  return (
    <div className="mb-2">
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink
            active={activeMode === 'import'}
            onClick={() => setActiveMode('import')}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faFileImport} className="me-2" />
            Import Albums
          </CNavLink>
        </CNavItem>
        {isSuperAdmin && (
          <CNavItem>
            <CNavLink
              active={activeMode === 'transfer'}
              onClick={() => setActiveMode('transfer')}
              style={{ cursor: 'pointer' }}
            >
              <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
              Transfer Albums
            </CNavLink>
          </CNavItem>
        )}
      </CNav>
    </div>
  );
};

export default ModeSelector;

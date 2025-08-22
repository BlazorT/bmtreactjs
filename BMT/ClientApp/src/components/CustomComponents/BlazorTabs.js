import React, { useState } from 'react';
import {
  CNavItem,
  CNav,
  CNavLink,
  CContainer,
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMenu } from '@coreui/icons';

const BlazorTabs = (prop) => {
  const { title, tabs, handleActiveTab, activeTab, onAddVehicle } = prop;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleTab = (i) => {
    handleActiveTab(i);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <CContainer fluid>
      <CRow className="p-0">
        <CCol className="p-0">
          <div className="mobile-tabs-view">
            <CDropdown>
              <CDropdownToggle caret>
                <CIcon icon={cilMenu} />
              </CDropdownToggle>
              <CDropdownMenu className="cDropdown">
                {tabs?.map((tab, index) => (
                  <CDropdownItem
                    key={tab.id}
                    className="cDropdown"
                    active={activeTab === tab.id}
                    onClick={() => handleTab(tab.id)}
                  >
                    {tab.name}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
          </div>
          <CNav className="dashboard-links">
            {tabs?.map((tab, index) => (
              <CNavItem key={tab.id}>
                <CNavLink
                  onClick={() => handleTab(tab.id)}
                  active={activeTab === tab.id}
                  className={activeTab === tab.id ? 'dashboard-link-active' : 'dashboard-link'}
                >
                  {tab.name}
                </CNavLink>
              </CNavItem>
            ))}
          </CNav>
        </CCol>
        {onAddVehicle && (
          <CCol className="text-right p-0" sm="2">
            {title !== 'DA' && (
              <button
                type="button"
                className="btn_Default w-auto mt-0 ps-4 pe-4 h-auto"
                onClick={onAddVehicle}
              >
                Add Vehicles
              </button>
            )}
          </CCol>
        )}
      </CRow>
    </CContainer>
  );
};

export default BlazorTabs;

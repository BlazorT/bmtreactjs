import React, { useState } from 'react';

import { CNavItem, CNav, CNavLink, CContainer, CRow, CCol } from '@coreui/react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const FleetDashboardTabs = (prop) => {
  const { title, fleetTabs, handleActiveTab, activeTab, onAddVehicle } = prop;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleTab = (i) => {
    handleActiveTab(i);
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <CContainer fluid>
      <CRow className="p-0">
        <CCol className="p-0">
          <div className="mobile-tabs-view">
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={(e) => handleClick(e)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {fleetTabs.map((option, index) => (
                <MenuItem
                  key={index}
                  selected={activeTab === index}
                  onClick={() => handleTab(index)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <CNav className="dashboard-links">
            {fleetTabs?.map((link, index) => (
              <CNavItem key={index}>
                <CNavLink
                  onClick={() => handleTab(index)}
                  active={activeTab === index}
                  className={activeTab === index ? 'dashboard-link-active' : 'dashboard-link'}
                >
                  {link}
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

export default FleetDashboardTabs;

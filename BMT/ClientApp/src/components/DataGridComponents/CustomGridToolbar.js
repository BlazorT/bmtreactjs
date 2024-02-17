/* eslint-disable react/prop-types */
import React from 'react';

import {
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import CIcon from '@coreui/icons-react';

import { cilFilter } from '@coreui/icons';

import { useSelector, useDispatch } from 'react-redux';

import {
  toggleFilterMenu,
  setFilterMenuAnchorEvent,
  selectFilterMenu,
  selectFilterMenuAnchorEvent,
} from '../../redux/filter/filterSlice';
import { CCol, CRow } from '@coreui/react';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Tooltip } from '@mui/material';

function CustomGridToolbar({
  canPrint,
  canExport,
  search,

  headerProps,
  isHeader,
}) {
  const dispatch = useDispatch();
  const filterMenu = useSelector(selectFilterMenu);
  const filterMenuAnchorEvent = useSelector(selectFilterMenuAnchorEvent);

  const handleClick = (event) => {
    dispatch(toggleFilterMenu());
    dispatch(setFilterMenuAnchorEvent(event.currentTarget));
  };

  const handleClose = () => {
    dispatch(toggleFilterMenu());
    dispatch(setFilterMenuAnchorEvent(null));
  };
  const {
    title,
    addButton,
    addBtnClick,
    otherControls,
    addSecButton,
    addSecBtnClick,
    filterDisable,
    exportFn,
    addBtnContent,
    popOverId,
  } = headerProps || {};

  return (
    <React.Fragment>
      {isHeader && (
        <div className="d-flex flex-column w-100">
          <CRow className="w-100 p-0 align-self-center">
            <CCol className="d-flex justify-content-start align-items-center p-0">
              <div className="pointer">{title}</div>
            </CCol>
            <CCol className="d-flex justify-content-end align-items-center gap-3 p-0">
              {addButton && (
                <span
                  className="lblAddPartner labelName heading-font-weight"
                  onClick={addBtnClick}
                  aria-describedby={popOverId}
                >
                  {addButton} {addButton ? `${addBtnContent ? addBtnContent : '(+)'}` : ''}
                </span>
              )}
              {addSecButton && (
                <span
                  className="lblAddPartner labelName heading-font-weight"
                  onClick={() => addSecBtnClick()}
                >
                  {addSecButton} (+)
                </span>
              )}
              {exportFn && (
                <Tooltip title="Download Report">
                  <FileDownloadOutlinedIcon
                    fontSize="medium"
                    className="stock-toggle-icon"
                    // icon={cilCloudDownload}
                    onClick={() => exportFn()}
                  />
                </Tooltip>
              )}
              {filterDisable ? (
                ''
              ) : (
                <div
                  className="bg-transparent"
                  id="basic-button"
                  aria-controls={filterMenu ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={filterMenu ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <CIcon style={{ color: 'white' }} icon={cilFilter} />
                </div>
              )}
              {otherControls &&
                otherControls.map(({ icon, fn }, index) => (
                  <CIcon key={index} className="stock-toggle-icon" onClick={fn} icon={icon} />
                ))}
            </CCol>
          </CRow>
        </div>
      )}
      <div className="w-100 h-auto d-flex justify-content-start align-items-center ">
        {/* <DataGridHeader
        title="Dispatchment"
        // addButton={pageRoles.canAdd === 1 ? 'Add Dispatchment' : ''}
        // addBtnClick={toggleDispMdl}
      /> */}
        {search && (
          <GridToolbarQuickFilter
            className="bg-secondary-color p-1 rounded"
            quickFilterParser={(searchInput) =>
              searchInput
                .split(',')
                .map((value) => value.trim())
                .filter((value) => value !== '')
            }
          />
        )}

        <Button
          className="d-none"
          id="basic-button"
          aria-controls={filterMenu ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={filterMenu ? 'true' : undefined}
          onClick={handleClick}
        >
          <CIcon style={{ color: 'white' }} icon={cilFilter} />
        </Button>
        <GridToolbarContainer>
          <Menu
            id="basic-menu"
            anchorEl={filterMenuAnchorEvent}
            open={filterMenu}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>
              <GridToolbarColumnsButton />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <GridToolbarFilterButton />
            </MenuItem>
            <div onClick={handleClose}>
              {canExport === 1 && <GridCsvExportMenuItem />}
              {canPrint === 1 && <GridPrintExportMenuItem />}
            </div>
          </Menu>
        </GridToolbarContainer>
      </div>
    </React.Fragment>
  );
}

export default CustomGridToolbar;

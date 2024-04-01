import React, { ReactNode, MouseEvent } from 'react';

import { CCol, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';

import FilterIconMenu from './FilterIconMenu';
//import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Tooltip } from '@mui/material';

interface OtherControl {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // Replace with the actual type of your icon
  fn: () => void;
}

interface DataGridHeaderProps {
  title: string;
  addButton?: string;
  addBtnClick?: () => void;
  otherControls?: OtherControl[];
  addSecButton?: string;
  addSecBtnClick?: () => void;
  filterDisable?: boolean;
  exportFn?: () => void;
  onClick?: () => void;
  addBtnContent?: ReactNode;
  popOverId?: string;
  actionCell?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions?: any[];
}

const DataGridHeader: React.FC<DataGridHeaderProps> = ({
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
  actionCell,
  actions,
  onClick
}) => {
  return (
    <div className="d-flex flex-column w-100">
      <CRow className="w-100 p-0 align-self-center">
        <CCol className="d-flex justify-content-start align-items-center p-0">
          <div className="pointer" onClick={onClick}>{title}</div>
        </CCol>
        <CCol className="d-flex justify-content-end align-items-center gap-3 p-0">
          {actionCell && actionCell}
          {actions &&
            actions.map((action, index) => (
              <span
                key={index}
                className="lblAddPartner labelName heading-font-weight text-truncate"
                onClick={action.onClick}
              >
                {action.title}
              </span>
            ))}
          {addButton && (
            <span
              className="lblAddPartner labelName heading-font-weight text-truncate"
              onClick={addBtnClick}
              aria-describedby={popOverId}
            >
              {addButton} {addButton ? `${addBtnContent ? addBtnContent : '(+)'}` : ''}
            </span>
          )}
          {addSecButton && (
            <span
              className="lblAddPartner labelName heading-font-weight text-truncate"
              onClick={addSecBtnClick}
            >
              {addSecButton}
            </span>
          )}
          {/*{exportFn && (*/}
          {/*  <Tooltip title="Download Report">*/}
          {/*    <FileDownloadOutlinedIcon*/}
          {/*      fontSize="medium"*/}
          {/*      className="stock-toggle-icon"*/}
          {/*      onClick={exportFn}*/}
          {/*    />*/}
          {/*  </Tooltip>*/}
          {/*)}*/}
          {filterDisable ? null : <FilterIconMenu />}
          {otherControls &&
            otherControls.map(({ icon, fn }, index) => (
              <CIcon key={index} className="stock-toggle-icon" onClick={fn} icon={icon} />
            ))}
        </CCol>
      </CRow>
    </div>
  );
};

export default DataGridHeader;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from 'react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import FilterIconMenu from './FilterIconMenu';
import { cilCloudDownload } from '@coreui/icons';

interface OtherControl {
  icon: any; // Replace with the actual type of your icon
  fn: () => void;
}

interface Action {
  title: string;
  onClick: () => void;
}

interface DataGridHeaderProps {
  title?: string;
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
  actions?: Action[];
  className?: string;
}

const DataGridHeader: React.FC<DataGridHeaderProps> = ({
  title = '',
  addButton,
  addBtnClick,
  otherControls = [],
  addSecButton,
  addSecBtnClick,
  filterDisable = false,
  exportFn,
  addBtnContent,
  popOverId,
  actionCell,
  actions = [],
  onClick,
  className = '',
}) => {
  return (
    <div className={`d-flex flex-column w-100 ${className}`}>
      <CRow className="w-100 align-self-center">
        <CCol className="d-flex justify-content-start align-items-center p-0">
          <div
            className={`pointer ${onClick ? 'text-primary' : ''}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
              onClick
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onClick();
                    }
                  }
                : undefined
            }
          >
            {title}
          </div>
        </CCol>
        <CCol className="d-flex justify-content-end align-items-center gap-3 p-0">
          {/* Action Cell - Custom component */}
          {actionCell && actionCell}

          {/* Dynamic Actions */}
          {actions &&
            actions.length > 0 &&
            actions.map((action, index) => (
              <span
                key={index}
                className="lblAddPartner labelName heading-font-weight text-truncate cursor-pointer"
                onClick={action.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    action.onClick();
                  }
                }}
              >
                {action.title}
              </span>
            ))}

          {/* Primary Add Button */}
          {addButton && (
            <span
              className="lblAddPartner labelName heading-font-weight text-truncate cursor-pointer"
              onClick={addBtnClick}
              aria-describedby={popOverId}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  addBtnClick?.();
                }
              }}
            >
              {addButton} {addButton && `${addBtnContent ? addBtnContent : '(+)'}`}
            </span>
          )}

          {/* Secondary Add Button */}
          {addSecButton && (
            <span
              className="lblAddPartner labelName heading-font-weight text-truncate cursor-pointer"
              onClick={addSecBtnClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  addSecBtnClick?.();
                }
              }}
            >
              {addSecButton} (+)
            </span>
          )}

          {/* Export Function */}
          {exportFn && (
            <CTooltip content="Download Report">
              <CIcon
                icon={cilCloudDownload}
                className="stock-toggle-icon cursor-pointer"
                onClick={exportFn}
                role="button"
                tabIndex={0}
                onKeyDown={(e: { key: string }) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    exportFn();
                  }
                }}
              />
            </CTooltip>
          )}

          {/* Filter Menu Icon */}
          {!filterDisable && <FilterIconMenu onClick={undefined} />}

          {/* Other Controls */}
          {otherControls &&
            otherControls.length > 0 &&
            otherControls.map(({ icon, fn }, index) => (
              <CIcon
                key={index}
                className="stock-toggle-icon cursor-pointer"
                onClick={fn}
                icon={icon}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fn();
                  }
                }}
              />
            ))}
        </CCol>
      </CRow>
    </div>
  );
};

export default DataGridHeader;

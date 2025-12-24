/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactNode } from 'react';
import {
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CTooltip,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilArrowBottom,
  cilArrowThickToBottom,
  cilCloudDownload,
  cilFile,
  cilPrint,
} from '@coreui/icons';
import FilterIconMenu from './FilterIconMenu';
import dayjs from 'dayjs';
import { DataGridHandle } from 'react-data-grid';
import { exportToCsv, exportToPdf } from 'src/helpers/gridHelper';

const CDropdownAny = CDropdown as any;
const CDropdownMenuAny = CDropdownMenu as any;
const CDropdownItemAny = CDropdownItem as any;
const CDropdownToggleAny = CDropdownToggle as any;

interface OtherControl {
  icon: any;
  fn: () => void;
}

interface Action {
  title: string;
  onClick: () => void;
}

export interface DataGridHeaderProps {
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
  canPrint?: boolean;
  canExport?: boolean;
  fileName?: string;
  gridRef?: React.Ref<DataGridHandle>;
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
  canExport = false,
  canPrint = false,
  fileName,
  gridRef,
}) => {
  const showExportDropdown = (canExport || canPrint) && gridRef;
  const timestamp = dayjs().format('YYYYMMDDHHmmss');

  function handleExportToCsv() {
    if (!gridRef || typeof gridRef === 'function' || !gridRef.current?.element) {
      console.warn('gridRef or its element is not available for CSV export.');
      return;
    }
    exportToCsv(
      gridRef.current.element,
      fileName ? `${fileName}_${timestamp}.csv` : `${timestamp}.csv`,
    );
  }

  async function handleExportToPdf() {
    if (!gridRef || typeof gridRef === 'function' || !gridRef.current?.element) {
      console.warn('gridRef or its element is not available for PDF export.');
      return;
    }
    await exportToPdf(
      gridRef.current.element,
      fileName ? `${fileName}_${timestamp}.pdf` : `${timestamp}.pdf`,
    );
  }

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
          {/* Action Cell */}
          {actionCell && actionCell}

          {/* Dynamic Actions */}
          {actions.map((action, index) => (
            <span
              key={index}
              className="lblAddPartner labelName heading-font-weight text-truncate cursor-pointer"
              onClick={action.onClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') action.onClick();
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
                if (e.key === 'Enter' || e.key === ' ') addBtnClick?.();
              }}
            >
              {addButton} {addBtnContent ? addBtnContent : '(+)'}
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
                if (e.key === 'Enter' || e.key === ' ') addSecBtnClick?.();
              }}
            >
              {addSecButton} (+)
            </span>
          )}

          {/* Export Dropdown */}
          {showExportDropdown && (
            <CDropdownAny variant="input-group" alignment="end">
              <CDropdownToggleAny caret={false} className="p-0 bg-transparent border-0 shadow-none">
                <CTooltip content="Export options">
                  <CIcon
                    icon={cilArrowThickToBottom}
                    className="stock-toggle-icon cursor-pointer"
                    size="lg"
                  />
                </CTooltip>
              </CDropdownToggleAny>

              <CDropdownMenuAny className="bg-input">
                {canExport && (
                  <CDropdownItemAny onClick={handleExportToCsv}>
                    <CIcon icon={cilFile} className="me-2" />
                    Export as CSV
                  </CDropdownItemAny>
                )}
                {canPrint && (
                  <CDropdownItemAny onClick={handleExportToPdf}>
                    <CIcon icon={cilPrint} className="me-2" />
                    Export as PDF
                  </CDropdownItemAny>
                )}
              </CDropdownMenuAny>
            </CDropdownAny>
          )}

          {/* Filter Menu */}
          {!filterDisable && <FilterIconMenu onClick={undefined} />}

          {/* Other Controls */}
          {otherControls.map(({ icon, fn }, index) => (
            <CIcon
              key={index}
              className="stock-toggle-icon cursor-pointer"
              onClick={fn}
              icon={icon}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fn();
              }}
            />
          ))}
        </CCol>
      </CRow>
    </div>
  );
};

export default DataGridHeader;

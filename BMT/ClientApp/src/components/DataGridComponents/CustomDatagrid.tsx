/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { DataGrid } from 'react-data-grid';
import {
  Column,
  SortColumn,
  SelectColumn,
  Row,
  RowsChangeData,
  SortDirection,
} from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

import CustomSummary from './DataGridSummary';
import DataGridHeader from './DataGridHeader';
import DatagridSkeleton from './DatagridSkeleton';
import CIcon from '@coreui/icons-react';
import {
  cilChevronDoubleLeft,
  cilChevronDoubleRight,
  cilChevronLeft,
  cilChevronRight,
  cilInbox,
} from '@coreui/icons';
import { CTooltip } from '@coreui/react';

interface CustomDatagridProps {
  rows: any[];
  columns: Column<any>[];
  rowHeight?: number;
  pagination?: boolean;
  summary?: any;
  loading?: boolean;
  rowSelection?: boolean;
  onRowsChange?: (rows: any[], data: RowsChangeData<any>) => void;
  pageSize?: number;
  sorting?: SortColumn[];
  canExport?: boolean;
  canPrint?: boolean;
  noRowsMessage?: string;
  enableSearch?: boolean;
  footer?: React.ReactNode;
  cellBorder?: boolean;
  isZeroMargin?: boolean;
  headerProps?: {
    title?: string;
    addButton?: string;
    addBtnClick?: () => void;
    otherControls?: Array<{ icon: any; fn: () => void }>;
    addSecButton?: string;
    addSecBtnClick?: () => void;
    filterDisable?: boolean;
    exportFn?: () => void;
    onClick?: () => void;
    addBtnContent?: React.ReactNode;
    popOverId?: string;
    actionCell?: React.ReactNode;
    actions?: Array<{ title: string; onClick: () => void }>;
  };
  isHeader?: boolean;
  onRowClick?: (rowIdx: number, row: any, column: Column<any>) => void;
  selectedRows?: Set<React.Key>;
  onSelectedRowsChange?: (selectedRows: Set<React.Key>) => void;
}

const CustomDatagrid: React.FC<CustomDatagridProps> = ({
  rows = [],
  columns = [],
  rowHeight = 35,
  pagination = true,
  summary,
  loading = false,
  rowSelection = false,
  onRowsChange,
  pageSize = 10,
  sorting = [],
  canExport = false,
  canPrint = false,
  noRowsMessage = 'No data available',
  enableSearch = false,
  footer,
  cellBorder = false,
  isZeroMargin = false,
  headerProps,
  isHeader = true,
  onRowClick,
  selectedRows = new Set(),
  onSelectedRowsChange,
}) => {
  const [sortColumns, setSortColumns] = useState<SortColumn[]>(sorting);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Filter rows based on search term
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [rows, searchTerm]);

  // Sort rows
  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      for (const sort of sortColumns) {
        const { columnKey, direction } = sort;
        const aValue = a[columnKey];
        const bValue = b[columnKey];

        if (aValue < bValue) {
          return direction === 'ASC' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'ASC' ? 1 : -1;
        }
      }
      return 0;
    });
  }, [filteredRows, sortColumns]);

  // Paginate rows
  const paginatedRows = useMemo(() => {
    if (!pagination) return sortedRows;

    const start = currentPage * pageSize;
    const end = start + pageSize;
    return sortedRows.slice(start, end);
  }, [sortedRows, pagination, currentPage, pageSize]);

  // Add row selection column if needed
  const finalColumns = useMemo(() => {
    const cols = [...columns];
    if (rowSelection) {
      cols.unshift(SelectColumn);
    }
    return cols;
  }, [columns, rowSelection]);

  // Row class name function
  const getRowClassName = (row: any, idx: number): string => {
    let classNames = 'rdg-row-even';

    if (idx % 2 !== 0) {
      classNames = 'rdg-row-odd';
    }

    if (
      Number.isInteger(row.status) &&
      (row.status === 4 || row.status === 6 || row.status === 2)
    ) {
      classNames += ' deleted-row-red';
    }

    if (row.group) {
      classNames += ' row-roles-group';
    }

    if (row.inventoryOf === 2) {
      classNames += ' vehicle-da-inventory';
    }

    return classNames;
  };

  // Custom styles for React Data Grid
  const gridStyles = {
    height: 'auto',
    '--rdg-color-scheme': 'dark',
    '--rdg-header-background-color': '#0A1A2C',
    '--rdg-header-text-color': 'white',
    '--rdg-color': 'white',
    '--rdg-selection-width': '0px',
    '--rdg-background-color': 'transparent',
    '--rdg-border-color': cellBorder ? '#495d73' : 'transparent',
    '--rdg-selection-color': '#1976d2',
    '--rdg-font-size': '14px',
    ...(isZeroMargin && {
      '--rdg-cell-padding-inline': '0px',
      '--rdg-cell-padding-block': '0px',
    }),
  } as React.CSSProperties;

  // Handle sort change
  const handleSortColumnsChange = (sortColumns: SortColumn[]) => {
    setSortColumns(sortColumns);
  };

  // Handle rows change (for editing)
  const handleRowsChange = (rows: any[], data: RowsChangeData<any>) => {
    if (onRowsChange) {
      onRowsChange(rows, data);
    }
  };

  // Handle cell click
  const handleCellClick = (args: any) => {
    if (onRowClick) {
      onRowClick(args.rowIdx, args.row, args.column);
    }
  };

  // Pagination component
  const PaginationComponent = () => {
    if (!pagination) return null;

    const totalPages = Math.ceil(sortedRows.length / pageSize);
    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, sortedRows.length);

    return (
      <div className="d-flex justify-content-between align-items-center p-1 bg-dark-color text-white">
        <div>
          Showing {startItem} to {endItem} of {sortedRows.length} entries
        </div>
        <div className="d-flex align-items-center gap-2">
          <CTooltip content="First">
            <span
              style={{
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 0 ? 0.5 : 1,
              }}
              onClick={() => currentPage > 0 && setCurrentPage(0)}
            >
              <CIcon icon={cilChevronDoubleLeft} />
            </span>
          </CTooltip>

          <CTooltip content="Previous">
            <span
              style={{
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 0 ? 0.5 : 1,
              }}
              onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
            >
              <CIcon icon={cilChevronLeft} />
            </span>
          </CTooltip>

          <span className="mx-2">
            Page {currentPage + 1} of {totalPages}
          </span>

          <CTooltip content="Next">
            <span
              style={{
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages - 1 ? 0.5 : 1,
              }}
              onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
            >
              <CIcon icon={cilChevronRight} />
            </span>
          </CTooltip>

          <CTooltip content="Last">
            <span
              style={{
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages - 1 ? 0.5 : 1,
              }}
              onClick={() => currentPage < totalPages - 1 && setCurrentPage(totalPages - 1)}
            >
              <CIcon icon={cilChevronDoubleRight} />
            </span>
          </CTooltip>
        </div>
      </div>
    );
  };

  // Search component
  const SearchComponent = () => {
    if (!enableSearch) return null;

    return (
      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-secondary-color text-white"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    );
  };

  // No rows overlay
  const NoRowsOverlay = () => (
    <div
      className="d-flex flex-column justify-content-center align-items-center w-100"
      style={{
        height: '250px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px dashed rgba(255,255,255,0.2)',
        borderRadius: '8px',
      }}
    >
      <CIcon icon={cilInbox} size="xl" className="mb-3 text-secondary" />
      <h6 className="mb-1">{noRowsMessage}</h6>
      <small className="text-secondary">Try adjusting your filters or search.</small>
    </div>
  );

  if (loading) {
    return <DatagridSkeleton />;
  }
  return (
    <div className="custom-datagrid-container">
      {/* Header */}
      {isHeader && headerProps && (
        <DataGridHeader
          title={headerProps.title || ''}
          addButton={headerProps.addButton}
          addBtnClick={headerProps.addBtnClick}
          otherControls={headerProps.otherControls}
          addSecButton={headerProps.addSecButton}
          addSecBtnClick={headerProps.addSecBtnClick}
          filterDisable={headerProps.filterDisable}
          exportFn={headerProps.exportFn}
          addBtnContent={headerProps.addBtnContent}
          popOverId={headerProps.popOverId}
          actionCell={headerProps.actionCell}
          actions={headerProps.actions}
          onClick={headerProps.onClick}
        />
      )}

      {/* Search */}
      <SearchComponent />
      {rows.length === 0 ? (
        <NoRowsOverlay />
      ) : (
        <>
          {/* Data Grid */}
          <div style={gridStyles}>
            <DataGrid
              columns={finalColumns}
              rows={paginatedRows}
              sortColumns={sortColumns}
              onSortColumnsChange={handleSortColumnsChange}
              onRowsChange={handleRowsChange}
              selectedRows={selectedRows}
              onSelectedRowsChange={onSelectedRowsChange}
              rowClass={getRowClassName}
              className="rdg-dark"
              rowHeight={rowHeight}
              renderers={{
                noRowsFallback: <NoRowsOverlay />,
              }}
            />
          </div>

          {/* Footer */}
          <div>
            {footer}
            {summary && <CustomSummary rows={sortedRows} columns={columns} summary={summary} />}
            <PaginationComponent />
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDatagrid;

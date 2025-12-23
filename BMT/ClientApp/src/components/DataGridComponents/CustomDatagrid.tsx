/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, Key } from 'react';
import {
  DataGrid,
  TreeDataGrid,
  Column,
  SortColumn,
  SelectColumn,
  RowsChangeData,
} from 'react-data-grid';

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
  maxHeight?: number | string;
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
  pageSizeOptions?: number[];
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

  /** ✅ NEW – GROUPING */
  enableGrouping?: boolean;
  groupBy: string[];
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
  maxHeight = 500,

  /** GROUPING */
  enableGrouping = false,
  groupBy = [],
}) => {
  const [sortColumns, setSortColumns] = useState<SortColumn[]>(sorting);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<React.Key>>(new Set());

  /* ----------------------------------
     FILTER
  ---------------------------------- */
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [rows, searchTerm]);

  /* ----------------------------------
     SORT (disabled for grouping)
  ---------------------------------- */
  const sortedRows = useMemo(() => {
    if (enableGrouping || sortColumns.length === 0) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      for (const { columnKey, direction } of sortColumns) {
        if (a[columnKey] < b[columnKey]) return direction === 'ASC' ? -1 : 1;
        if (a[columnKey] > b[columnKey]) return direction === 'ASC' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredRows, sortColumns, enableGrouping]);

  /* ----------------------------------
     PAGINATION (disabled for grouping)
  ---------------------------------- */
  const paginatedRows = useMemo(() => {
    if (!pagination || enableGrouping) return sortedRows;
    const start = currentPage * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, pagination, currentPage, pageSize, enableGrouping]);

  /* ----------------------------------
     COLUMNS
  ---------------------------------- */
  const finalColumns = useMemo(() => {
    const cols = [...columns];
    if (rowSelection) cols.unshift(SelectColumn);
    return cols;
  }, [columns, rowSelection]);

  /* ----------------------------------
     GROUPER
  ---------------------------------- */
  const rowGrouper = (rows: readonly any[], columnKey: string): Record<string, readonly any[]> => {
    return rows.reduce<Record<string, any[]>>((acc, row) => {
      const key = String(row[columnKey] ?? '—');
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(row);
      return acc;
    }, {});
  };

  /* ----------------------------------
     STYLES
  ---------------------------------- */
  // TypeScript doesn't support custom CSS vars directly in React.CSSProperties.
  // Cast as any to suppress type error for custom CSS properties.

  /* ----------------------------------
     EMPTY
  ---------------------------------- */
  const NoRowsOverlay = () => (
    <div
      className="d-flex flex-column justify-content-center align-items-center w-100"
      style={{ height: 250 }}
    >
      <CIcon icon={cilInbox} size="xl" />
      <h6 className="mt-2">{noRowsMessage}</h6>
    </div>
  );

  const getRowClassName = (row: any, idx: number): string => {
    const isRowSelected = selectedRows.has(row.content);

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

    if (row.disabled === true) {
      classNames += ' disabled-row-red';
    }

    if (isRowSelected) {
      classNames += ' selected-row';
    }

    return classNames;
  };

  // Determine grid height based on pagination
  const gridHeight = useMemo(() => {
    if (pagination) {
      return undefined; // Let it auto-size
    }
    // When pagination is off, set explicit height for scrolling
    return typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
  }, [pagination, maxHeight]);

  // Custom styles for React Data Grid
  const gridStyles = {
    '--rdg-color-scheme': 'dark !important',
    '--rdg-header-background-color': '#0A1A2C !important',
    '--rdg-header-text-color': 'white !important',
    '--rdg-color': 'white !important',
    '--rdg-selection-width': '0px !important',
    '--rdg-background-color': 'transparent !important',
    '--rdg-border-color': cellBorder ? '#495d73 !important' : 'transparent !important',
    '--rdg-selection-color': '#1976d2 !important',
    '--rdg-font-size': '14px !important',
    ...(isZeroMargin && {
      '--rdg-cell-padding-inline': '0px !important',
      '--rdg-cell-padding-block': '0px !important',
    }),
  } as React.CSSProperties;

  const handleSortColumnsChange = (sortColumns: SortColumn[]) => {
    setSortColumns(sortColumns);
  };

  // Handle rows change (for editing)
  const handleRowsChange = (rows: any[], data: RowsChangeData<any>) => {
    if (onRowsChange) {
      onRowsChange(rows, data);
    }
  };

  if (loading) return <DatagridSkeleton />;

  return (
    <div className="custom-datagrid-container">
      {isHeader && headerProps && <DataGridHeader {...headerProps} />}

      {enableSearch && (
        <input
          className="form-control mb-2"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}

      {rows.length === 0 ? (
        <NoRowsOverlay />
      ) : (
        <>
          <div style={gridStyles as React.CSSProperties}>
            {enableGrouping ? (
              <TreeDataGrid
                columns={finalColumns}
                rows={sortedRows} // Grouping usually doesn't use simple pagination
                rowHeight={rowHeight}
                groupBy={groupBy}
                rowGrouper={rowGrouper}
                expandedGroupIds={expandedGroupIds}
                onExpandedGroupIdsChange={(ids: Set<unknown>) =>
                  setExpandedGroupIds(ids as Set<Key>)
                }
                onSortColumnsChange={setSortColumns}
                onRowsChange={onRowsChange}
                selectedRows={selectedRows}
                onSelectedRowsChange={onSelectedRowsChange}
                rowKeyGetter={(row) => row?.content}
                className="rdg-dark fill-grid"
                onCellClick={onRowClick as any}
              />
            ) : (
              <DataGrid
                columns={finalColumns}
                rows={pagination ? paginatedRows : sortedRows}
                sortColumns={sortColumns}
                onSortColumnsChange={handleSortColumnsChange}
                onRowsChange={handleRowsChange}
                selectedRows={selectedRows}
                onSelectedRowsChange={onSelectedRowsChange}
                rowClass={getRowClassName}
                rowKeyGetter={(row) => row?.content}
                className="rdg-dark fill-grid"
                rowHeight={rowHeight}
                isRowSelectionDisabled={(row) => row?.disabled === true}
                renderers={{
                  noRowsFallback: <NoRowsOverlay />,
                }}
                style={gridHeight ? { height: gridHeight } : undefined}
              />
            )}
          </div>

          {footer}
          {summary && <CustomSummary rows={sortedRows} columns={columns} summary={summary} />}
        </>
      )}
    </div>
  );
};

export default CustomDatagrid;

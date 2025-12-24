/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, Key, ReactNode, useEffect, useRef } from 'react';
import {
  DataGrid,
  TreeDataGrid,
  Column,
  SortColumn,
  SelectColumn,
  RowsChangeData,
  DataGridHandle,
} from 'react-data-grid';
import CustomSummary from './DataGridSummary';
import DataGridHeader, { DataGridHeaderProps } from './DataGridHeader';
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
  columns: Column<any, any>[];
  rowHeight?: number;
  pagination?: boolean;
  maxHeight?: number | string;
  summary?: any;
  loading?: boolean;
  rowSelection?: boolean;
  onRowsChange?: (rows: any[], data: RowsChangeData<any, any>) => void;
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
  headerProps?: DataGridHeaderProps;
  isHeader?: boolean;
  showGrid?: boolean;
  onRowClick?: (rowIdx: number, row: any, column: Column<any, any>) => void;
  selectedRows?: Set<Key>;
  onSelectedRowsChange?: (selectedRows: Set<Key>) => void;
  enableGrouping?: boolean;
  groupBy: string[];
  summaryRows?: any[];
  defaultExpandedGroups?: boolean; // new prop
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
  enableGrouping = false,
  groupBy = [],
  pageSizeOptions,
  showGrid = true,
  defaultExpandedGroups,
  summaryRows,
}) => {
  const [sortColumns, setSortColumns] = useState<SortColumn[]>(sorting);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<unknown>>(new Set());

  const gridRef = useRef<DataGridHandle>(null);

  useEffect(() => {
    if (!enableGrouping || !defaultExpandedGroups || groupBy.length === 0 || rows.length === 0) {
      return;
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const expanded = new Set<unknown>();
      const level1Key = groupBy[0];
      const level2Key = groupBy[1];

      // Build grouped data structure to get actual group keys
      const firstLevelGroups = rowGrouper(rows, level1Key);
      const firstLevelKeys = Object.keys(firstLevelGroups);

      // Expand all first-level groups
      firstLevelKeys.forEach((key) => expanded.add(key));

      // Expand second-level groups ONLY under the FIRST first-level group
      if (level2Key && firstLevelKeys.length > 0) {
        const firstGroupKey = firstLevelKeys[0];
        const firstGroupRows = firstLevelGroups[firstGroupKey];

        // Get second-level groups under the first parent
        const secondLevelGroups = rowGrouper(firstGroupRows, level2Key);
        const secondLevelKeys = Object.keys(secondLevelGroups);

        // Add composite keys for nested groups
        secondLevelKeys.forEach((secondKey) => {
          // TreeDataGrid needs BOTH formats:
          // 1. Array format
          expanded.add([firstGroupKey, secondKey]);
          // 2. String format with double underscore separator
          expanded.add(`${firstGroupKey}__${secondKey}`);
        });
      }

      console.log('Expanded groups:', Array.from(expanded));
      setExpandedGroupIds(expanded);
    });
  }, [rows, enableGrouping, defaultExpandedGroups, groupBy]);
  /* ---------------------------------- FILTER ---------------------------------- */
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [rows, searchTerm]);

  /* ---------------------------------- SORT ---------------------------------- */
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

  /* ---------------------------------- PAGINATION ---------------------------------- */
  const paginatedRows = useMemo(() => {
    if (!pagination || enableGrouping) return sortedRows;
    const start = currentPage * currentPageSize;
    return sortedRows.slice(start, start + currentPageSize);
  }, [sortedRows, pagination, currentPage, currentPageSize, enableGrouping]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedRows.length / currentPageSize);
  }, [sortedRows, currentPageSize]);

  /* ---------------------------------- COLUMNS ---------------------------------- */
  const finalColumns = useMemo(() => {
    const cols = [...columns];
    if (rowSelection) cols.unshift(SelectColumn as any);
    return cols;
  }, [columns, rowSelection]);

  /* ---------------------------------- GROUPER ---------------------------------- */
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

  /* ---------------------------------- EMPTY ---------------------------------- */
  const NoRowsOverlay = () => (
    <div className="rdg-no-rows" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
      <CIcon icon={cilInbox} size="xxl" />
      <div>{noRowsMessage}</div>
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

  // ✅ FIX: Calculate dynamic height based on content
  const gridContainerHeight = useMemo(() => {
    if (pagination) {
      // With pagination, calculate height based on pageSize
      const headerHeight = 35;
      const calculatedHeight = headerHeight + rowHeight * currentPageSize;
      const maxHeightNum = typeof maxHeight === 'number' ? maxHeight : 500;
      return Math.min(calculatedHeight, maxHeightNum);
    }
    // Without pagination, use maxHeight
    return typeof maxHeight === 'number' ? maxHeight : 500;
  }, [pagination, maxHeight, rowHeight, currentPageSize]);

  // Custom styles for React Data Grid
  const gridStyles = {
    '--rdg-color-scheme': 'dark',
    '--rdg-header-background-color': '#0A1A2C',
    '--rdg-header-text-color': 'white',
    '--rdg-color': 'white',
    '--rdg-selection-width': '0px',
    '--rdg-border-color': cellBorder ? '#495d73' : 'transparent',
    '--rdg-selection-color': '#1976d2',
    '--rdg-background-color': '#031c34',
    '--rdg-font-size': '14px',
    ...(isZeroMargin && {
      '--rdg-cell-padding-inline': '0px',
      '--rdg-cell-padding-block': '0px',
    }),
  } as React.CSSProperties;

  const handleSortColumnsChange = (sortColumns: SortColumn[]) => {
    setSortColumns(sortColumns);
  };

  const handleRowsChange = (rows: any[], data: RowsChangeData<any, any>) => {
    if (onRowsChange) {
      onRowsChange(rows, data);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setCurrentPageSize(newPageSize);
    setCurrentPage(0); // Reset to first page when page size changes
  };

  if (loading) return <DatagridSkeleton />;

  return (
    <>
      {isHeader && headerProps && <DataGridHeader {...headerProps} gridRef={gridRef} />}
      {showGrid && (
        <>
          {enableSearch && (
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
            />
          )}

          {rows.length === 0 ? (
            <NoRowsOverlay />
          ) : (
            <div>
              {/* ✅ FIX: Use specific height instead of maxHeight */}
              <div
                className="rdg-scroll-container"
                style={{
                  ...gridStyles,

                  position: 'relative',
                }}
              >
                {enableGrouping ? (
                  <TreeDataGrid
                    ref={gridRef}
                    columns={finalColumns}
                    rows={paginatedRows}
                    rowKeyGetter={(row) => row?.content}
                    className="rdg-dark fill-grid"
                    rowHeight={rowHeight}
                    groupBy={groupBy}
                    rowGrouper={rowGrouper}
                    expandedGroupIds={expandedGroupIds}
                    onSortColumnsChange={setSortColumns}
                    onRowsChange={onRowsChange}
                    selectedRows={selectedRows}
                    onSelectedRowsChange={onSelectedRowsChange}
                    onCellClick={onRowClick as any}
                    onExpandedGroupIdsChange={(ids) => {
                      console.log('Expanded IDs:', Array.from(ids));
                      setExpandedGroupIds(ids as Set<unknown>);
                    }}
                    bottomSummaryRows={summaryRows}
                    summaryRowHeight={50}
                    topSummaryRows={summaryRows}
                    style={{
                      height: '100%',
                      maxHeight: `${gridContainerHeight}px`,
                      overflow: 'auto',
                    }}
                  />
                ) : (
                  <DataGrid
                    ref={gridRef}
                    columns={finalColumns}
                    rows={paginatedRows}
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
                    style={{
                      height: '100%',
                      maxHeight: `${gridContainerHeight}px`,
                      overflow: 'auto',
                    }}
                  />
                )}
              </div>

              {footer}
              {summary && <CustomSummary rows={rows} columns={columns} summary={summary} />}

              {pagination && !enableGrouping && sortedRows.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                    backgroundColor: '#0A1A2C',
                    // borderTop: '1px solid #495d73',
                    color: 'white',
                  }}
                >
                  {/* Left: Page size selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#888' }}>
                      Showing {currentPage * currentPageSize + 1}-
                      {Math.min((currentPage + 1) * currentPageSize, sortedRows.length)} of{' '}
                      {sortedRows.length}
                    </span>
                    <select
                      value={currentPageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      style={{
                        height: '30px',
                        padding: '1px 1px',
                        backgroundColor: '#031c34',
                        color: 'white',
                        border: '1px solid #495d73',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      className="fs-6"
                    >
                      {(pageSizeOptions || [10, 25, 50, 100]).map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Right: Pagination controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CTooltip content="First Page">
                      <button
                        onClick={() => handlePageChange(0)}
                        disabled={currentPage === 0}
                        style={{
                          padding: '2px 5px',
                          backgroundColor: currentPage === 0 ? '#1a2332' : '#031c34',
                          color: currentPage === 0 ? '#666' : 'white',
                          border: '1px solid #495d73',
                          borderRadius: '4px',
                          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <CIcon icon={cilChevronDoubleLeft} size="sm" />
                      </button>
                    </CTooltip>

                    <CTooltip content="Previous Page">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        style={{
                          padding: '2px 5px',
                          backgroundColor: currentPage === 0 ? '#1a2332' : '#031c34',
                          color: currentPage === 0 ? '#666' : 'white',
                          border: '1px solid #495d73',
                          borderRadius: '4px',
                          cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <CIcon icon={cilChevronLeft} size="sm" />
                      </button>
                    </CTooltip>

                    <span style={{ padding: '0 15px', fontSize: '14px' }}>
                      Page {currentPage + 1} of {totalPages}
                    </span>

                    <CTooltip content="Next Page">
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        style={{
                          padding: '2px 5px',
                          backgroundColor: currentPage >= totalPages - 1 ? '#1a2332' : '#031c34',
                          color: currentPage >= totalPages - 1 ? '#666' : 'white',
                          border: '1px solid #495d73',
                          borderRadius: '4px',
                          cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <CIcon icon={cilChevronRight} size="sm" />
                      </button>
                    </CTooltip>

                    <CTooltip content="Last Page">
                      <button
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={currentPage >= totalPages - 1}
                        style={{
                          padding: '2px 5px',
                          backgroundColor: currentPage >= totalPages - 1 ? '#1a2332' : '#031c34',
                          color: currentPage >= totalPages - 1 ? '#666' : 'white',
                          border: '1px solid #495d73',
                          borderRadius: '4px',
                          cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <CIcon icon={cilChevronDoubleRight} size="sm" />
                      </button>
                    </CTooltip>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CustomDatagrid;

import React from 'react';
import { MutableRefObject } from 'react';
import {
  DataGrid,
  GridPagination,
  GridOverlay,
  GridSortModel,
  GridColDef,
  GridRowsProp,
  GridRowParams, useGridApiRef,
  GridValidRowModel,
  GridRowId,
  GridApiCommon,
} from '@mui/x-data-grid';

import { SxProps, Theme } from '@mui/material/styles';
import CustomSummary from './DataGridSummary';
import CustomGridToolbar from './CustomGridToolbar';

interface CustomDatagridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  rowHeight?: number | 'auto';
  pagination?: boolean;
  summary?: unknown;
  hiddenCols?: null;
  toolbar?: React.ReactNode;
  loading?: boolean;
  rowSelection?: boolean;
  processRowUpdate?: (
    newRow: GridValidRowModel,
    oldRow: GridValidRowModel,
    params: { rowId: GridRowId }
  ) => GridValidRowModel | Promise<GridValidRowModel>;
  pageNumber?: number;
  sorting?: GridSortModel;
  canExport?: boolean;
  canPrint?: boolean;
  noRowsMessage?: string;
  search?: unknown;
  footer?: React.ReactNode;
  cellBorder?: boolean;
  isZeroMargin?: boolean;
  headerProps?: Record<string, unknown>;
  isHeader?: boolean;
  onRowClick?: (params: GridRowParams) => void;
  apiRef?: MutableRefObject<GridApiCommon>;// React.MutableRefObject<GridApiCommon> | null;
}

const CustomDatagrid: React.FC<CustomDatagridProps> = ({
  rows,
  columns,
  rowHeight,
  pagination,
  summary,
  hiddenCols,
  loading,
  rowSelection,
  processRowUpdate,
  pageNumber,
  sorting,
  canExport,
  canPrint,
  noRowsMessage,
  search,
  footer,
  cellBorder,
  isZeroMargin,
  headerProps,
  isHeader,
  onRowClick,
  apiRef,
}) => {
 // apiRef = useGridApiRef();

  const getRowHeight = (): number | 'auto' => rowHeight || 'auto';

  const getRowClassName = (params: GridRowParams): string => {
    let classNames = 'rdg-row-even';
      //apiRef.current.indexRelativeToCurrentPage % 2 === 0 ? 'rdg-row-even' : 'rdg-row-odd';

    classNames += ` ${Number.isInteger(params.row.status) && (params.row.status === 4 || params.row.status === 6)
        ? 'deleted-row-red'
        : ''
      } ${params.row.group ? 'row-roles-group' : ''} ${params.row.inventoryOf === 2 ? 'vehicle-da-inventory' : ''
      }`;

    return classNames;
  };

  const slotProps: Record<string, unknown> = {
    panel: { sx: { top: '-120px !important' } },
    toolbar: { sx: { marginBottom: '20px !important' } },
  };

  const sx: SxProps<Theme> = {
    '& .MuiDataGrid-columnHeaderDraggableContainer': { all: 'unset !important' },
    '& .MuiDataGrid-columnSeparator': { display: 'none !important' },
    '& .MuiButtonBase-root': { backgroundColor: '#0A1A2C' },
    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell, &.MuiDataGrid-root--densityStandard .MuiDataGrid-cell, &.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
      py: isZeroMargin ? '0' : rowHeight === 'auto' ? '15px' : '0.4rem',
      px: isZeroMargin ? '0' : rowHeight === 'auto' ? '15px' : '0.4rem',
      borderRadius: isZeroMargin ? '0.3rem' : '0',
    },
    '& .MuiDataGrid-cell': {
      borderBottom: 'none',
      ...(cellBorder && {
        border: 2,
        borderColor: '#495d73',
        borderRight: 0,
        borderTop: 0,
      }),
    },
    '.css-ltf0zy-MuiDataGrid-iconButtonContainer': {
      visibility: 'hidden !important',
    },
  };

  return (
    <DataGrid
      style={{ color: 'white', borderStyle: 'none' }}
      getRowClassName={getRowClassName}
      rows={rows.map((item, index) => ({ id: index + 1, ...item }))}
      getRowHeight={getRowHeight}
      processRowUpdate={processRowUpdate}
      columns={columns}
      autoHeight
      checkboxSelection={false}
      disableColumnMenu
      disableRowSelectionOnClick={false}
      //apiRef={apiRef ?? undefined}
      rowSelection={!!rowSelection}
      onRowClick={onRowClick}
      getRowId={(row: GridValidRowModel) => row.id as GridRowId}
      pageSizeOptions={pageNumber ? [pageNumber] : [10]}
      loading={loading}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: pageNumber ?? 10,
          },
        },
        //columns: hiddenCols,
        sorting: { sortModel: sorting },
      }}
      slots={{
        footer: () => (
          <>
            {footer}
            {summary && <CustomSummary rows={rows} columns={columns} summary={summary} />}
            {pagination && <GridPagination />}
          </>
        ),
        toolbar: () => (
          <CustomGridToolbar
            canExport={canExport}
            canPrint={canPrint}
            search={search}
            headerProps={headerProps}
            isHeader={isHeader}
          />
        ),
        noRowsOverlay: () => (
          <GridOverlay>{noRowsMessage ?? 'No Rows'}</GridOverlay>
        ),
      }}
      slotProps={slotProps}
      sx={sx}
    />
  );
};

export default CustomDatagrid;

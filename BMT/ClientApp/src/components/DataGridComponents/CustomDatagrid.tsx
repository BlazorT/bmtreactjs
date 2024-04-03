/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import React from 'react';
import { DataGrid, GridPagination, GridOverlay, GridSortModel } from '@mui/x-data-grid';

import CustomSummary from './DataGridSummary';
import CustomGridToolbar from './CustomGridToolbar';

import { Theme } from '@material-ui/core';
import { SxProps } from '@mui/material';
//import DatagridSkeleton from './DatagridSkeleton';

interface CustomDatagridProps {
  rows: any[];
  columns: any[];
  rowHeight?: number | 'auto';
  pagination?: boolean;
  summary?: any;
  hiddenCols?: any;
  toolbar?: any;
  loading?: boolean;
  rowSelection?: boolean;
  onEditCellChange?: (params: any) => void;
  pageNumber?: number;
  sorting?: GridSortModel;
  canExport?: boolean;
  canPrint?: boolean;
  noRowsMessage?: string;
  search?: any;
  footer?: React.ReactNode;
  cellBorder?: boolean;
  isZeroMargin?: boolean;
  headerProps?: any;
  isHeader?: boolean;
  onRowClick?: (params: any) => void;
  apiRef?: any;
}

const CustomDatagrid: React.FC<CustomDatagridProps> = ({
  rows,
  columns,
  rowHeight,
  pagination,
  summary,
  hiddenCols,
  toolbar,
  loading,
  rowSelection,
  onEditCellChange,
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
}: CustomDatagridProps) => {
  const getRowHeight = (): number | 'auto' => rowHeight || 'auto';

  const getRowClassName = (params: any): string => {
    let classNames = params.indexRelativeToCurrentPage % 2 === 0 ? 'rdg-row-even' : 'rdg-row-odd';

    classNames += ` ${
      Number.isInteger(params.row.status) && (params.row.status === 4 || params.row.status === 6)
        ? 'deleted-row-red'
        : ''
    } ${params.row.group ? 'row-roles-group' : ''} ${
      params.row.inventoryOf === 2 ? 'vehicle-da-inventory' : ''
    }`;

    return classNames;
  };

  const slotProps: any = {
    panel: {
      sx: {
        top: '-120px !important',
      },
    },
    toolbar: {
      sx: {
        marginBottom: '20px !important',
      },
    },
  };

  const sx: SxProps<Theme> = {
    '& .MuiDataGrid-columnHeaderDraggableContainer': {
      all: 'unset !important',
    },
    '& .MuiDataGrid-columnSeparator': {
      display: 'none !important',
    },
    '& .MuiButtonBase-root': {
      backgroundColor: '#0A1A2C',
    },
    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell, &.MuiDataGrid-root--densityStandard .MuiDataGrid-cell, &.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell':
      {
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
      // classes={{ columnHeaderDraggableContainer: classes.columnHeaderDraggableContainer }}
      getRowClassName={getRowClassName}
      rows={rows.map((item, index) => ({ id: index + 1, ...item }))}
      getRowHeight={getRowHeight}
      processRowUpdate={onEditCellChange}
      columns={columns}
      autoHeight
      checkboxSelection={false}
      disableColumnMenu={true}
      disableRowSelectionOnClick={false}
      apiRef={apiRef}
      rowSelection={rowSelection}
      onRowClick={onRowClick}
      getRowId={(rows) => rows.id}
      pageSizeOptions={pageNumber ? [pageNumber] : [10]}
      loading={loading}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: pageNumber ? pageNumber : 10,
          },
        },
        columns: hiddenCols,
        sorting: {
          sortModel: sorting,
        },
      }}
      slots={{
        footer: () => (
          <React.Fragment>
            {footer && footer}
            {summary && <CustomSummary rows={rows} columns={columns} summary={summary} />}
            {pagination && <GridPagination />}
          </React.Fragment>
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
        noRowsOverlay: () => <GridOverlay>{noRowsMessage ? noRowsMessage : 'No Rows'}</GridOverlay>,
        // loadingOverlay:()=><GridOverlay><DatagridSkeleton/></GridOverlay>
      }}
      slotProps={slotProps}
      sx={sx}
    />
  );
};

export default CustomDatagrid;

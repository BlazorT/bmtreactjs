import VariableActionCell from 'src/components/DataGridCustomCells/VariableActionCell';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import globalutil from 'src/util/globalutil';

/* eslint-disable react/react-in-jsx-scope */
export const getVariableCols = (canDelete, fetching) => [
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Network',
    key: 'networkId',
    editable: false,
    renderCell: (params) => {
      return (
        <div>{globalutil?.networks()?.find((n) => n.id === params.row.networkId)?.name || ''}</div>
      );
    },
  },
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Name',
    key: 'name',
    editable: false,
  },
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Title',
    key: 'title',
    editable: false,
  },

  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Template',
    key: 'template',
    editable: false,
    renderCell: (params) => {
      return <div title={params.row?.template}>{params.row?.template?.slice(0, 20)}...</div>;
    },
  },
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Last Update Time',
    key: 'lastUpdatedAt',
    editable: false,
    renderCell: (params) => {
      return <div>{formatDateTime(params.row?.lastUpdatedAt)}</div>;
    },
  },
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Action',
    key: 'action',
    editable: false,
    renderCell: (params) => {
      return <VariableActionCell canDelete={canDelete} template={params.row} fetching={fetching} />;
    },
  },
];

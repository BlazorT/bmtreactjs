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
    key: 'networkid',
    editable: false,
    renderCell: (params) => {
      return (
        <div>{globalutil?.networks()?.find((n) => n.id === params.row.networkid)?.name || ''}</div>
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
    name: 'Expression',
    key: 'expression',
    editable: false,
  },
  
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Default Value',
    key: 'defaultValue',
    editable: false,
    renderCell: (params) => (
      params?.value ? params.value : '---'
    ),
  },

  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Last Update Time',
    key: 'createdAt',
    editable: false,
    renderCell: (params) => {
      return <div>{formatDateTime(params.row?.createdAt)}</div>;
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

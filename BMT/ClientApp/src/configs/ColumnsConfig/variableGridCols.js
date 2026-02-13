import VariableActionCell from 'src/components/DataGridCustomCells/VariableActionCell';
import { formatDateTime } from 'src/helpers/formatDate';
import globalutil from 'src/util/globalutil';

/* eslint-disable react/react-in-jsx-scope */
export const getVariableCols = (canDelete, fetching) => [
  {
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
    filterable: true,
    disableColumnMenu: false,
    name: 'Variable Name',
    key: 'name',
    editable: false,
  },
  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Expression',
    key: 'expression',
    editable: false,
  },

  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Default Value',
    key: 'defaultValue',
    editable: false,
    renderCell: (params) => (params?.row?.defaultValue ? params.row.defaultValue : '---'),
  },

  {
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

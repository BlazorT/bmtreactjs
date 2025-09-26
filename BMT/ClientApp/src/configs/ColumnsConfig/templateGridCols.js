import TemplateActionCell from 'src/components/DataGridCustomCells/TemplateActionCell';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import globalutil from 'src/util/globalutil';

/* eslint-disable react/react-in-jsx-scope */
export const getTemplateCols = (canDelete, fetching) => [
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
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
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Name',
    key: 'name',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Title',
    key: 'title',
    editable: false,
  },

  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Template',
    key: 'template',
    editable: false,
    renderCell: (params) => {
      return <div title={params.row?.template}>{params.row?.template?.slice(0, 20)}...</div>;
    },
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Last Update Time',
    key: 'lastUpdatedAt',
    editable: false,
    renderCell: (params) => {
      return <div>{formatDateTime(params.row?.lastUpdatedAt)}</div>;
    },
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Action',
    key: 'action',
    editable: false,
    renderCell: (params) => {
      return <TemplateActionCell canDelete={canDelete} template={params.row} fetching={fetching} />;
    },
  },
];

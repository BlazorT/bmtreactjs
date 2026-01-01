import TemplateActionCell from 'src/components/DataGridCustomCells/TemplateActionCell';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import globalutil from 'src/util/globalutil';

/* eslint-disable react/react-in-jsx-scope */
export const getTemplateCols = (canDelete, fetching, whatsappNetworkSettings) => [
  {
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
    filterable: true,
    disableColumnMenu: false,
    name: 'Name',
    key: 'name',
    editable: false,
  },
  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Title',
    key: 'title',
    editable: false,
  },

  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Template',
    key: 'template',
    editable: false,
    renderCell: (params) => {
      const networkTemplate =
        params.row.networkId == 2
          ? params.row?.templateJson
            ? JSON.parse(params.row?.templateJson)
            : ''
          : params.row?.template;
      const template =
        typeof networkTemplate === 'string'
          ? networkTemplate
          : networkTemplate?.components?.find((c) => c.type === 'BODY')?.text || '--';
      return <div title={params.row?.template}>{template?.slice(0, 20)}...</div>;
    },
  },
  {
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
    filterable: true,
    disableColumnMenu: false,
    name: 'Action',
    key: 'action',
    editable: false,
    renderCell: (params) => {
      return (
        <TemplateActionCell
          canDelete={canDelete}
          template={params.row}
          fetching={fetching}
          whatsappNetworkSettings={whatsappNetworkSettings}
        />
      );
    },
  },
];

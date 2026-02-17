/* eslint-disable react/react-in-jsx-scope */
import CampaignResultActionCell from 'src/components/DataGridCustomCells/CampaignResultActionCell';
import globalutil from 'src/util/globalutil';

export const campaignResultCols = (getDasList, daRes, pageRoles) => [
  
  {
    key: 'networkId',
    name: 'Network',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'recipient',
    name: 'Contact',
    // Width: 100,
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  
  {
    key: 'deliveryStatus',
    name: 'Current Status',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    renderCell: (params) =>
      globalutil.deliverstatus().find((item) => item.id === params.row.deliveryStatus)
        ? globalutil.deliverstatus().find((item) => item.id === params.row.deliveryStatus).name
        : '',
  },
  {
    key: 'createdAt',  
    name: 'Date From',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },


  {
    key: 'imageUrl',
    name: 'Action',
    // maxWidth: 100,
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <CampaignResultActionCell
        value={params}
        fetching={getDasList}
        user={daRes.filter((item) => item.id == params.row.id)}
        canUpdate={pageRoles.canUpdate}
        canDelete={pageRoles.canDelete}
      />
    ),
  },
];

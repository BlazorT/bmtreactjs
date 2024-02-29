/* eslint-disable react/react-in-jsx-scope */
import DaActionCell from 'src/components/DataGridCustomCells/DaActionCell';

export const getdaAssociatesCols = (getDasList, daRes, pageRoles) => [
  {
    field: 'name',
    headerName: 'Organization Name',
    flex: 1,
    minWidth: 160,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'cityId',
    headerName: 'City',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'compaignsCount',
    headerName: 'Campaigns # ',
    flex: 1,
    minWidth: 60,
    // Width: 100,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'currencyName',
    headerName: 'Currency',
    flex: 1,
    minWidth: 70,
    // Width: 80,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'createdAt',
    headerName: 'Register Date',
    flex: 1,
    minWidth: 70,
    // Width: 80,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'expiryTime',
    headerName: 'Expiry Time',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    hide: true,
    hideable: false,
    headerClassName: 'custom-header-data-grid',
  },
 
  {
    field: 'imageUrl',
    headerName: 'Action',
    flex: 1,
    minWidth: 50,
    // maxWidth: 100,
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
    renderCell: (params) => (
      <DaActionCell
        value={params}
        fetching={getDasList}
        user={daRes.filter((item) => item.id === params.row.id)}
        canUpdate={pageRoles.canUpdate}
        canDelete={pageRoles.canDelete}
      />
    ),
  },
];

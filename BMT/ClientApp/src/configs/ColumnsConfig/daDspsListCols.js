/* eslint-disable react/react-in-jsx-scope */
import OrgActionCell from 'src/components/DataGridCustomCells/OrgActionCell';

export const getOrgListCols = (fetchOrgList, orgsList, pageRoles) => [
  {
    key: 'name',
    name: 'Organization Name',
    flex: 1,
    minWidth: 160,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerClassName: 'custom-header-data-grid',
  },
  {
    key: 'cityId',
    name: 'City',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    key: 'compaignsCount',
    name: 'Campaigns # ',
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
    key: 'currencyName',
    name: 'Currency',
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
    key: 'createdAt',
    name: 'Register Date',
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
    key: 'expiryTime',
    name: 'Expiry Time',
    flex: 1,
    minWidth: 170,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    hide: true,
    hideable: false,
    headerClassName: 'custom-header-data-grid',
  },

  {
    key: 'imageUrl',
    name: 'Action',
    flex: 1,
    minWidth: 50,
    // maxWidth: 100,
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
    renderCell: (params) => (
      <OrgActionCell
        value={params}
        fetching={orgsList}
        user={orgsList.filter((item) => item.id === params.row.id)}
        canUpdate={pageRoles.canUpdate}
        canDelete={pageRoles.canDelete}
      />
    ),
  },
];

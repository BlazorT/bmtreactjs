/* eslint-disable react/react-in-jsx-scope */
import OrgActionCell from 'src/components/DataGridCustomCells/OrgActionCell';

export const getOrgListCols = (fetchOrgList, orgsList, pageRoles) => [
  {
    key: 'name',
    name: 'Organization Name',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'cityId',
    name: 'City',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'compaignsCount',
    name: 'Campaigns # ',
    // Width: 100,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'currencyName',
    name: 'Currency',
    // Width: 80,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'createdAt',
    name: 'Register Date',
    // Width: 80,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'expiryTime',
    name: 'Expiry Time',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    hide: true,
    hideable: false,
    headerCellClass: 'custom-header-data-grid',
  },

  {
    key: 'imageUrl',
    name: 'Action',
    // maxWidth: 100,
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
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

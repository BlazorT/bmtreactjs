/* eslint-disable react/react-in-jsx-scope */
import OrgActionCell from 'src/components/DataGridCustomCells/OrgActionCell';

export const getOrgListCols = (fetchOrgList, orgsList, pageRoles) => [
  {
    key: 'name',
    name: 'Organization Name',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'cityId',
    name: 'City',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'compaignsCount',
    name: 'Campaigns # ',
    // Width: 100,
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'currencyName',
    name: 'Currency',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'createdAt',
    name: 'Register Date',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'expiryTime',
    name: 'Expiry Time',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    hide: true,
    hideable: false,
  },

  {
    key: 'action',
    width: 150,
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    name: 'Action',
    headerAlign: 'center',
    align: 'center',
    cellClassName: 'centered-cell',
    renderCell: (params) => (
      <OrgActionCell
        value={params}
        fetching={orgsList}
        org={orgsList.filter((item) => item.id === params.row.id)}
        canUpdate={pageRoles.canUpdate}
        canDelete={pageRoles.canDelete}
      />
    ),
  },
];

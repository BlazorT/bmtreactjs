/* eslint-disable react/react-in-jsx-scope */
import BmtRolesCustomCell from 'src/components/DataGridCustomCells/BmtRolesCustomCell';

export const getRolesCols = (pageRoles) => [
  {
    key: 'id',
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    name: 'id',
    hidable: false,
  },
  {
    key: 'roleName',
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 150,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'RoleName',
  },
  {
    key: 'status',
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 150,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Status',
  },
  {
    key: 'lastUpdate',
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 150,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Last Update Time',
  },
  {
    key: 'imageUrl',
    width: 150,
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 150,
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    name: 'Action',
    renderCell: (params) => (
      <BmtRolesCustomCell
        value={params}
        // canUpdate={pageRoles.canUpdate}
        canUpdate={1}
      />
    ),
  },
];

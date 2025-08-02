/* eslint-disable react/react-in-jsx-scope */
import BmtRolesCustomCell from 'src/components/DataGridCustomCells/BmtRolesCustomCell';

export const getRolesCols = (pageRoles) => [
  {
    field: 'id',
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    headerName: 'id',
    hidable: false,
  },
  {
    field: 'roleName',
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 150,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'RoleName',
  },
  {
    field: 'status',
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 150,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Status',
  },
  {
    field: 'lastUpdate',
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 150,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Last Update Time',
  },
  {
    field: 'imageUrl',
    width: 150,
    headerClassName: 'custom-header-data-grid',
    flex: 1,
    minWidth: 150,
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    headerName: 'Action',
    renderCell: (params) => <BmtRolesCustomCell value={params}
     // canUpdate={pageRoles.canUpdate}
      canUpdate={1}
    />,
  },
];

/* eslint-disable react/react-in-jsx-scope */
import BmtRolesCustomCell from 'src/components/DataGridCustomCells/BmtRolesCustomCell';
export const getRolesCols = (pageRoles) => [
  //{
  //  key: 'id',
  //  editable: false,
  //  filterable: false,
  //  disableColumnMenu: true,
  //  name: 'id',
  //  hidable: true,
  //  headerAlign: 'center',
  //  align: 'center',
  //  cellClassName: 'centered-cell',
  //  width: 60,
  //},
  {
    key: 'roleName',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    name: 'RoleName',
    headerAlign: 'center',
    align: 'center',
    cellClassName: 'centered-cell',
  },
  {
    key: 'status',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    name: 'Status',
    headerAlign: 'center',
    align: 'center',
    cellClassName: 'centered-cell',
  },
  {
    key: 'lastUpdate',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    name: 'Last Update Time',
    headerAlign: 'center',
    align: 'center',
    cellClassName: 'centered-cell',
  },
  {
    key: 'imageUrl',
    width: 150,
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    name: 'Action',
    headerAlign: 'center',
    align: 'center',
    cellClassName: 'centered-cell',
    renderCell: (params) => (
      <BmtRolesCustomCell
        value={params}
        canUpdate={pageRoles.canUpdate}
        //canUpdate={1}
      />
    ),
  },
];

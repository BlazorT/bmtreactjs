/* eslint-disable react/react-in-jsx-scope */
import UsersActionCell from 'src/components/DataGridCustomCells/UsersActionCell';

export const getUsersListCols = (fetching, usersData, pageRoles) => [
  {
    field: 'avatar',
    headerName: 'Picture',
    // flex: 1,
    width: 100,
    editable: false,
    filterable: false,
    headerClassName: 'custom-header-data-grid',
    renderCell: (params) => (
      <img
        className="Edit_Add_SettingIcon profileImg ms-2"
        src={params.row.picture}
        // src={params.row.picture ? params.row.picture : 'Profile-pic.jpg'}
      />
    ),
  },
  {
    field: 'Name',
    headerName: 'Name',
    flex: 1,
    minWidth: 80,
    editable: false,
    filterable: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 100,
    editable: false,
    filterable: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'contact',
    headerName: 'Contact',
    flex: 1,
    minWidth: 100,
    editable: false,
    filterable: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'regDate',
    headerName: 'Registration Date',
    flex: 1,
    minWidth: 100,
    editable: false,
    filterable: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'lastUpdatedAt',
    headerName: 'Registration Date',
    flex: 1,
    minWidth: 100,
    editable: false,
    filterable: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'status',
    headerName: 'Action',
    flex: 1,
    minWidth: 120,
    headerClassName: 'custom-header-data-grid',
    editable: false,
    filterable: false,
    sortable: true,
    renderCell: (params) => (
      <UsersActionCell
        params={params}
        fetching={fetching}
        canDelete={pageRoles.canDelete}
        canEdit={pageRoles.canUpdate}
        user={usersData.filter((item) => item.id === params.row.id)}
      />
    ),
  },
];

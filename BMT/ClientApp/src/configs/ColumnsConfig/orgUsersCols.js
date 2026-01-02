/* eslint-disable react/react-in-jsx-scope */
import OrgUserActionCell from 'src/components/DataGridCustomCells/OrgUserActionCell';
import globalutil from 'src/util/globalutil';

export const getorgUsersCols = (getDasList, daRes, pageRoles) => [
  {
    key: 'completeName',
    name: ' Name',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'orgName',
    name: 'Organization Name',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'roleName',
    name: 'Role Name',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'contact',
    name: 'Contact',
    // Width: 100,
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },

  {
    key: 'createdAt',
    name: 'Registration Time',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'status',
    name: 'Status',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    renderCell: (params) =>
      globalutil.statuses().find((item) => item.id === params.row.status)
        ? globalutil.statuses().find((item) => item.id === params.row.status).name
        : '',
  },

  {
    key: 'imageUrl',
    name: 'Action',
    // maxWidth: 100,
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <OrgUserActionCell
        value={params}
        fetching={getDasList}
        user={daRes.filter((item) => item.id == params.row.id)}
        canUpdate={pageRoles.canUpdate}
        canDelete={pageRoles.canDelete}
      />
    ),
  },
];

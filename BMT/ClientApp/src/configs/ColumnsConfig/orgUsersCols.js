/* eslint-disable react/react-in-jsx-scope */
import OrgUserActionCell from 'src/components/DataGridCustomCells/OrgUserActionCell';

export const getorgUsersCols = (getDasList, daRes, pageRoles) => [
  {
    field: 'completeName',
    headerName: ' Name',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'orgName',
    headerName: 'Organization Name',
    flex: 1,
    minWidth: 140,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'roleName',
    headerName: 'Role Name',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'contact',
    headerName: 'Contact',
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
    field: 'createdAt',
    headerName: 'Registration Time',
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
    field: 'status',
    headerName: 'Status',
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
      <OrgUserActionCell
        value={params}
        fetching={getDasList}
        user={daRes.filter((item) => item.id === params.row.id)}
        canUpdate={pageRoles.canUpdate}
        canDelete={pageRoles.canDelete}
      />
    ),
  },
];

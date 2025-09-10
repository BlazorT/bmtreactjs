/* eslint-disable react/react-in-jsx-scope */
import RecipientsActionCell from 'src/components/DataGridCustomCells/RecipientsActionCell';

export const getrecipietslistingCols = (getDasList, daRes, pageRoles) => [
  {
    key: 'networkId',
    name: 'Network Name',
    flex: 1,
    minWidth: 160,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerClassName: 'custom-header-data-grid',
  },
  {
    key: 'contentId',
    name: 'Recipients ',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },

  {
    key: 'createdAt',
    name: 'Created At',
    flex: 1,
    minWidth: 70,
    // Width: 80,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },

  //{
  //  key: 'imageUrl',
  //  name: 'Action',
  //  flex: 1,
  //  minWidth: 50,
  //  // maxWidth: 100,
  //  editable: false,
  //  filterable: false,
  //  sortable: false,
  //  disableColumnMenu: true,
  //  headerClassName: 'custom-header-data-grid',
  //  renderCell: (params) => (
  //    <RecipientsActionCell
  //      value={params}
  //      fetching={daRes}
  //      user={daRes.filter((item) => item.id === params.row.id)}
  //      //  canUpdate={pageRoles.canUpdate}
  //      //  canDelete={pageRoles.canDelete}
  //    />
  //  ),
  //},
];

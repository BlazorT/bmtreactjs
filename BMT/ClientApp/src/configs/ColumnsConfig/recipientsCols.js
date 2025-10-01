/* eslint-disable react/react-in-jsx-scope */
import RecipientsActionCell from 'src/components/DataGridCustomCells/RecipientsActionCell';

export const getrecipietslistingCols = (getDasList, daRes, pageRoles) => [
  {
    key: 'networkId',
    name: 'Network Name',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'contentId',
    name: 'Recipients ',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },

  {
    key: 'createdAt',
    name: 'Created At',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },
];

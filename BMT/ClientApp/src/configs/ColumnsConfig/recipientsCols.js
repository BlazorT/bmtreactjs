/* eslint-disable react/react-in-jsx-scope */
// src/configs/ColumnsConfig/recipientsCols.js
import RecipientsActionCell from 'src/components/DataGridCustomCells/RecipientsActionCell';

export const getrecipietslistingCols = (pageRoles) => [
  {
    key: 'networkId',
    name: 'Network Name',
    editable: false,
    filterable: true,
    flex: 1,
    disableColumnMenu: false,
  },
  {
    key: 'albumid',
    name: 'Album',
    editable: false,
    filterable: true,
    flex: 1,
    disableColumnMenu: false,
  },
  {
    key: 'contentId',
    name: 'Recipients',
    editable: false,
    filterable: true,
    flex: 1,
    disableColumnMenu: true,
  },
  {
    key: 'createdAt',
    name: 'Created At',
    editable: false,
    flex: 1,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'action',
    name: 'Action',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    width: 120,
    renderCell: (params) => <RecipientsActionCell row={params.row} pageRoles={pageRoles} />,
  },
];

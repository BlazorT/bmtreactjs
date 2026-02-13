/* eslint-disable react/react-in-jsx-scope */
// src/configs/ColumnsConfig/recipientsCols.js
import RecipientsActionCell from 'src/components/DataGridCustomCells/RecipientsActionCell';

export const getrecipietslistingCols = (pageRoles, getRecipientsList) => [
  {
    key: 'networkId',
    name: 'Network Name',
    editable: false,
    filterable: false,
    minWidth: 120, // ✅ Changed from flex: 1
    disableColumnMenu: false,
  },
  {
    key: 'albumid',
    name: 'Album',
    editable: false,
    filterable: false,
    minWidth: 140, // ✅ Changed from flex: 1
    disableColumnMenu: false,
  },
  {
    key: 'contentId',
    name: 'Recipients',
    editable: false,
    filterable: false,
    minWidth: 180, // ✅ Changed from flex: 1
    disableColumnMenu: true,
  },
  {
    key: 'createdAt',
    name: 'Created At',
    editable: false,
    minWidth: 150, // ✅ Changed from flex: 1 - flexible to fill remaining space
    filterable: false,
    disableColumnMenu: true,
  },
  {
    key: 'action',
    name: 'Action',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    minWidth: 120, // ✅ Already fixed width
    renderCell: (params) => (
      <RecipientsActionCell
        row={params.row}
        pageRoles={pageRoles}
        getRecipientsList={getRecipientsList}
      />
    ),
  },
];

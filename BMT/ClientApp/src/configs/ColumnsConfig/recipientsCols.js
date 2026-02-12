// src/configs/ColumnsConfig/recipientsCols.js
import React from 'react';
import RecipientsActionCell from 'src/components/DataGridCustomCells/RecipientsActionCell';

export const getrecipietslistingCols = (pageRoles) => [
  {
    key: 'networkId',
    name: 'Network Name',
<<<<<<< HEAD
=======
    editable: false,
    filterable: true,
    flex: 1,
    disableColumnMenu: false,
>>>>>>> 0879477860104145becebbb26176bac821469060
  },
  {
    key: 'albumid',
    name: 'Album',
<<<<<<< HEAD
=======
    editable: false,
    filterable: true,
    flex: 1,
    disableColumnMenu: false,
>>>>>>> 0879477860104145becebbb26176bac821469060
  },
  {
    key: 'contentId',
    name: 'Recipients',
<<<<<<< HEAD
=======
    editable: false,
    filterable: true,
    flex: 1,
    disableColumnMenu: true,
>>>>>>> 0879477860104145becebbb26176bac821469060
  },
  {
    key: 'createdAt',
    name: 'Created At',
<<<<<<< HEAD
=======
    editable: false,
    flex: 1,
    filterable: true,
    disableColumnMenu: true,
>>>>>>> 0879477860104145becebbb26176bac821469060
  },
  {
    key: 'action',
    name: 'Action',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    width: 120,
    renderCell: (params) => (
      <RecipientsActionCell
        row={params.row}
        pageRoles={pageRoles}
      />
    ),
  },
];

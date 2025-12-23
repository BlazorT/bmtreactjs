/* eslint-disable react/react-in-jsx-scope */

import globalutil from 'src/util/globalutil';

export const getrecipietslistingCols = (albums) => [
  {
    key: 'networkId',
    name: 'Network Name',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'albumid',
    name: 'Album',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'contentId',
    name: 'Recipients',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'createdAt',
    name: 'Created At',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },
];

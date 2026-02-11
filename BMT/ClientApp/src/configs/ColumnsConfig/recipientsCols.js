export const getrecipietslistingCols = () => [
  {
    key: 'networkId',
    name: 'Network Name',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'albumid',
    name: 'Album',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'contentId',
    name: 'Recipients',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'createdAt',
    name: 'Created At',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
];

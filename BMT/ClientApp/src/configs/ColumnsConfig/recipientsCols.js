/* eslint-disable react/react-in-jsx-scope */

export const getrecipietslistingCols = () => [
  {
    key: 'networkId',
    name: 'Network Name',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    headerCellClass: 'custom-header-data-grid',
    renderCell: ({ row }) => {
      if (row.level === 0) {
        return <strong style={{ paddingLeft: '0px' }}>{row.networkId}</strong>;
      }
      return row.networkId;
    },
  },
  {
    key: 'albumid',
    name: 'Album',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    headerCellClass: 'custom-header-data-grid',
    renderCell: ({ row }) => {
      if (row.level === 1) {
        return <strong style={{ paddingLeft: '20px' }}>{row.albumid}</strong>;
      }
      return row.albumid;
    },
  },
  {
    key: 'contentId',
    name: 'Recipients',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
    renderCell: ({ row }) => {
      if (row.level === 2) {
        return <span>{row.contentId}</span>;
      }
      return row.contentId;
    },
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

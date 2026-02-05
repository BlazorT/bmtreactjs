/* eslint-disable react/react-in-jsx-scope */

import dayjs from 'dayjs';
import ApprovalActionCell from 'src/components/DataGridCustomCells/ApprovalActionCell';
import globalutil from 'src/util/globalutil';

export const getApprovalCols = (orgs) => [
  {
    key: 'requestedBy',
    name: 'Requested By',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    renderCell: (params) => orgs?.find((o) => o?.id === params.row.requestedBy)?.name || '',
  },
  {
    key: 'code',
    name: 'Code',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'expiryDate',
    name: 'Expiry',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    renderCell: (params) => dayjs(params.row.expiryDate).local().format('MMM d, YYYY hh:ss A'),
  },
  {
    key: 'action',
    name: 'Action',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    renderCell: (params) => (
      <ApprovalActionCell
        value={params}
        org={orgs?.find((o) => o?.id === params.row.requestedBy) || null}
      />
    ),
  },
];

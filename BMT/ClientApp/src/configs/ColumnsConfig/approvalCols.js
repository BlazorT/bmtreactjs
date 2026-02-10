/* eslint-disable react/react-in-jsx-scope */

import dayjs from 'dayjs';
import ApprovalActionCell from 'src/components/DataGridCustomCells/ApprovalActionCell';

export const getApprovalCols = (orgs, fetchApprovalReq, user) => [
  {
    key: 'targetorgid',
    name: 'Requested By',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    renderCell: (params) => orgs?.find((o) => o?.id === params.row.targetorgid)?.name || '',
  },
  {
    key: 'reqcode',
    name: 'Code',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    renderCell: (params) => (params.row.orgId === user?.orgId ? params.row.reqcode : '******'),
  },
  {
    key: 'authexpiry',
    name: 'Expiry',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    renderCell: (params) => dayjs(params.row.authexpiry).local().format('MMM DD, YYYY hh:ss A'),
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
        org={orgs?.find((o) => o?.id === params.row.targetorgid) || null}
        fetchApprovalReq={fetchApprovalReq}
        allOrgs={orgs}
      />
    ),
  },
];

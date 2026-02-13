/* eslint-disable react/react-in-jsx-scope */
import CampaignActionCell from 'src/components/DataGridCustomCells/CampaignActionCell';

export const getcampaignslistingCols = (
  getCampaignsList,
  daRes,
  pageRoles,
  filters,
  currencyName,
) => [
  {
    key: 'month',
    name: 'Month',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    minWidth: 120, // ✅ Added - short content
  },
  {
    key: 'name',
    name: 'Campaign Name',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
    minWidth: 200, // ✅ Added - longer names
  },
  {
    key: 'totalBudget',
    name: `Budget (${currencyName})`,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    minWidth: 150, // ✅ Added - numeric with currency
  },
  {
    key: 'createdBy',
    name: 'Created By',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    minWidth: 150, // ✅ Added - user names
  },
  {
    key: 'createdAt',
    name: 'Setup Time',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    minWidth: 160, // ✅ Added - timestamps
  },
  {
    key: 'startTime',
    name: 'Start Time',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    type: 'timestamp',
    minWidth: 160, // ✅ Added - flexible to fill remaining space
  },
  {
    key: 'finishTime',
    name: 'End Time',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    hide: true,
    hideable: false,
    type: 'timestamp',
    minWidth: 160, // ✅ Added - for when it's shown
  },
  {
    key: 'imageUrl',
    name: 'Action',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    minWidth: 100, // ✅ Added - action buttons
    renderCell: (params) => {
      if (params.row.isGroupRow) return null;

      return (
        <CampaignActionCell
          value={params}
          fetching={() => getCampaignsList(filters)}
          campaign={daRes.filter((item) => item.id === params.row?.id)}
          canUpdate={pageRoles.canUpdate}
          canDelete={pageRoles.canDelete}
        />
      );
    },
  },
];

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
  },
  {
    key: 'name',
    name: 'Campaign Name',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'totalBudget',
    name: `Budget (${currencyName})`,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'createdBy',
    name: 'Created By',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'createdAt',
    name: 'Setup Time',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  // {
  //   key: 'orgName',
  //   name: 'Organization Name',
  //   editable: false,
  //   filterable: true,
  //   disableColumnMenu: true,
  // },
  {
    key: 'startTime',
    name: 'Start Time',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    type: 'timestamp',
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
  },
  {
    key: 'imageUrl',
    name: 'Action',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      // ✅ Prevent rendering for group rows
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

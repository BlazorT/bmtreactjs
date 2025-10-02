/* eslint-disable react/react-in-jsx-scope */
import CampaignActionCell from 'src/components/DataGridCustomCells/CampaignActionCell';

export const getcampaignslistingCols = (getDasList, daRes, pageRoles) => [
  {
    key: 'name',
    name: 'Campaign Name',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'orgName',
    name: 'Organization Name',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'startTime',
    name: 'Start Time',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'finishTime',
    name: 'End Time',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    hide: true,
    hideable: false,
    headerCellClass: 'custom-header-data-grid',
  },
  {
    key: 'imageUrl',
    name: 'Action',
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    headerCellClass: 'custom-header-data-grid',
    renderCell: (params) => {
      // ✅ Prevent rendering for group rows
      if (params.row.isGroupRow) return null;

      return (
        <CampaignActionCell
          value={params}
          fetching={daRes}
          user={daRes.filter((item) => item.id === params.row.id)}
          canUpdate={pageRoles.canUpdate}
          canDelete={pageRoles.canDelete}
        />
      );
    },
  },
];

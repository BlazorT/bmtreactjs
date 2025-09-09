/* eslint-disable react/react-in-jsx-scope */
import CampaignActionCell from 'src/components/DataGridCustomCells/CampaignActionCell';

export const getcampaignslistingCols = (getDasList, daRes, pageRoles) => [
  {
    key: 'name',
    name: 'Campaign Name',
   // flex: 1,
    minWidth: 160,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerClassName: 'custom-header-data-grid',
  },
  {
    key: 'orgName',
    name: 'Organization Name',
   // flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },

  {
    key: 'startTime',
    name: 'Start Time',
    //flex: 1,
    minWidth: 70,
    // Width: 80,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    key: 'finishTime',
    name: 'End Time',
   // flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    hide: true,
    hideable: false,
    headerClassName: 'custom-header-data-grid',
  },

  {
    key: 'imageUrl',
    name: 'Action',
   // flex: 1,
    minWidth: 120,
    Width: 120,
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
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

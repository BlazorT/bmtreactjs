/* eslint-disable react/react-in-jsx-scope */
import CampaignActionCell from 'src/components/DataGridCustomCells/CampaignActionCell';

export const getcampaignslistingCols = (getDasList, daRes, pageRoles) => [
  {
    field: 'name',
    headerName: 'Campaign Name',
    flex: 1,
    minWidth: 160,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'orgName',
    headerName: 'Organization Name',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },
 
 
  {
    field: 'startTime',
    headerName: 'Start Time',
    flex: 1,
    minWidth: 70,
    // Width: 80,
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: true,
    headerClassName: 'custom-header-data-grid',
  },
  {
    field: 'finishTime',
    headerName: 'End Time',
    flex: 1,
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
    field: 'imageUrl',
    headerName: 'Action',
    flex: 1,
    minWidth: 50,
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
  }

];

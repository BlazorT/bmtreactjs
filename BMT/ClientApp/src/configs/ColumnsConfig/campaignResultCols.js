/* eslint-disable react/react-in-jsx-scope */
import CampaignResultActionCell from 'src/components/DataGridCustomCells/CampaignResultActionCell';
import globalutil from 'src/util/globalutil';
const statusIcons = {
  SENT: "📤",
  DELIVERED: "✅",
  FAILED: "❌",
  DELETED: "🗑️",
  READ: "📖",
  SEEN: "👁️",
  UNDELIVERED: "📭",
  PENDING: "⏳",
  DROPPED: "⚠️"
};
export const campaignResultCols = (getDasList, daRes, pageRoles) => [
  
  {
    key: 'networkId',
    name: 'Network',
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  {
    key: 'recipient',
    name: 'Recipients',
    // Width: 100,
    editable: false,
    filterable: true,
    disableColumnMenu: false,
  },
  
 
  {
    key: 'isFailed',  
    name: 'Failed',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'isDelivered',  
    name: 'Delivered',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'isSent',  
    name: 'Sent',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'isRead',  
    name: 'Read',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'isPending',  
    name: 'Pending',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'id',  
    name: 'Total Recipients',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },
  {
    key: 'lastUpdatedAt',  
    name: 'Sent Time',
    // Width: 80,
    editable: false,
    filterable: true,
    disableColumnMenu: true,
  },

  {
    key: 'deliveryStatus',
    name: 'Status',
    editable: false,
    filterable: true,
    disableColumnMenu: true,
    renderCell: (params) => {

      const statusObj = globalutil
        .deliverstatus()
        .find((item) => item.id === params.row.deliveryStatus);

      if (!statusObj) return '';

      const icon = statusIcons[statusObj.name] || '';

      return (
        <span style={{ fontWeight: 600 }}>
          {statusObj.name}
          <span
            style={{
              fontSize: '20px',   // increase icon size
              marginLeft: '6px',  // space between text and icon
              verticalAlign: 'middle'
            }}
          >
            {icon}
          </span>
        </span>
      );
    },
  },
  {
    key: 'imageUrl',
    name: '',
    editable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => {

      // show only if deliveryStatus is 8 (FAILED)
      if (params.row?.deliveryStatus !== 8) {
        return null; // hide for other statuses
      }

      return (
        <CampaignResultActionCell
          value={params}
          fetching={getDasList}
          user={daRes.filter((item) => item.id == params.row.id)}
          canUpdate={pageRoles.canUpdate}
          canDelete={pageRoles.canDelete}
        />
      );
    },
  }
];

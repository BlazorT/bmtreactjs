/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import UsersActionCell from 'src/components/DataGridCustomCells/UsersActionCell';

// Profile Image Renderer Component
const ProfileImageRenderer = ({ row }) => (
  <img
    className="Edit_Add_SettingIcon profileImg ms-2"
    src={row.picture}
    alt={`${row.completeName || 'User'} avatar`}
    style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
    }}
    onError={(e) => {
      e.currentTarget.onerror = null; // prevents infinite loop if fallback also fails
      e.currentTarget.src = 'nouser.jpg';
    }}
  />
);

// Users Action Cell Renderer Component
const UsersActionRenderer = ({ row, fetching, usersData, pageRoles }) => (
  <UsersActionCell
    params={{ row }}
    fetching={fetching}
    canDelete={pageRoles.canDelete}
    canEdit={pageRoles.canUpdate}
    user={usersData.filter((item) => item.id === row.id)}
  />
);

export const getUsersListCols = (fetching, usersData, pageRoles) => [
  {
    key: 'avatar',
    name: 'Picture',
    width: 100,
    resizable: false,
    sortable: false,
    renderCell: (props) => <ProfileImageRenderer row={props.row} />,
    cellClass: 'custom-header-data-grid',
  },
  {
    key: 'completeName',
    name: 'Name',
    minWidth: 80,
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
  },
  {
    key: 'email',
    name: 'Email',
    minWidth: 220,
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
  },
  {
    key: 'contact',
    name: 'Contact',
    minWidth: 100,
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
  },
  {
    key: 'regDate',
    name: 'Registration Date',
    minWidth: 100,
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
    renderCell: (props) => {
      // Format date if needed
      const date = props.row.regDate;
      if (!date) return '-';

      try {
        return new Date(date).toLocaleDateString();
      } catch (error) {
        return date;
      }
    },
  },
  {
    key: 'lastUpdatedAt',
    name: 'Last Updated',
    minWidth: 100,
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
    renderCell: (props) => {
      // Format date if needed
      const date = props.row.lastUpdatedAt;
      if (!date) return '-';

      try {
        return new Date(date).toLocaleDateString();
      } catch (error) {
        return date;
      }
    },
  },
  {
    key: 'status',
    name: 'Action',
    minWidth: 120,
    resizable: true,
    sortable: false,
    renderCell: (props) => (
      <UsersActionRenderer
        row={props.row}
        fetching={fetching}
        usersData={usersData}
        pageRoles={pageRoles}
      />
    ),
    cellClass: 'custom-header-data-grid',
  },
];

// Alternative version with flex-like behavior using width calculation
export const getUsersListColsFlexible = (
  fetching,
  usersData,
  pageRoles,
  containerWidth = 1200, // Default container width, can be passed dynamically
) => [
  {
    key: 'avatar',
    name: 'Picture',
    width: 100, // Fixed width for image
    resizable: false,
    sortable: false,
    renderCell: (props) => <ProfileImageRenderer row={props.row} />,
    cellClass: 'custom-header-data-grid',
  },
  {
    key: 'completeName',
    name: 'Name',
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
  },
  {
    key: 'email',
    name: 'Email',
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
  },
  {
    key: 'contact',
    name: 'Contact',
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
  },
  {
    key: 'regDate',
    name: 'Registration Date',
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
    renderCell: (props) => {
      const date = props.row.regDate;
      if (!date) return '-';

      try {
        return new Date(date).toLocaleDateString();
      } catch (error) {
        return date;
      }
    },
  },
  {
    key: 'lastUpdatedAt',
    name: 'Last Updated',
    resizable: true,
    sortable: true,
    cellClass: 'custom-header-data-grid',
    renderCell: (props) => {
      const date = props.row.lastUpdatedAt;
      if (!date) return '-';

      try {
        return new Date(date).toLocaleDateString();
      } catch (error) {
        return date;
      }
    },
  },
  {
    key: 'status',
    name: 'Action',
    resizable: true,
    sortable: false,
    renderCell: (props) => (
      <UsersActionRenderer
        row={props.row}
        fetching={fetching}
        usersData={usersData}
        pageRoles={pageRoles}
      />
    ),
    cellClass: 'custom-header-data-grid',
  },
];

// Usage example:
// const containerWidth = useContainerWidth();
// const columns = getUsersListColsFlexible(fetching, usersData, pageRoles, containerWidth);

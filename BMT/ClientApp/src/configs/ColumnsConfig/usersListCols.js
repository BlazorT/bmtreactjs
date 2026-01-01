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
    resizable: false,
    renderCell: (props) => <ProfileImageRenderer row={props.row} />,
  },
  {
    key: 'completeName',
    name: 'Name',
    resizable: true,
  },
  {
    key: 'email',
    name: 'Email',
    resizable: true,
  },
  {
    key: 'contact',
    name: 'Contact',
    resizable: true,
  },
  {
    key: 'regDate',
    name: 'Registration Date',
    resizable: true,
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
    resizable: true,
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
    resizable: true,
    renderCell: (props) => (
      <UsersActionRenderer
        row={props.row}
        fetching={fetching}
        usersData={usersData}
        pageRoles={pageRoles}
      />
    ),
  },
];

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
    renderCell: (props) => <ProfileImageRenderer row={props.row} />,
  },
  {
    key: 'completeName',
    name: 'Name',
  },
  {
    key: 'email',
    name: 'Email',
  },
  {
    key: 'contact',
    name: 'Contact',
  },
  {
    key: 'regDate',
    name: 'Registration Date',
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
    renderCell: (props) => (
      <UsersActionRenderer
        row={props.row}
        fetching={fetching}
        usersData={usersData}
        pageRoles={pageRoles}
      />
    ),
  },
];

// Usage example:
// const containerWidth = useContainerWidth();
// const columns = getUsersListColsFlexible(fetching, usersData, pageRoles, containerWidth);

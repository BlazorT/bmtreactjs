/* eslint-disable react/react-in-jsx-scope */
import DspsAddPartnerCell from 'src/components/DataGridCustomCells/DspsAddPartnerCell';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import { formatDate } from 'src/helpers/formatDate';

export const getDspPartnersCols = (setRows, rows) => [
  {
    field: 'id',
    headerName: 'Sr#',
    // flex: 1,
    width: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    editable: false,
  },
  {
    field: 'fullName',
    headerName: 'Service Name',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    editable: false,
  },
  {
    field: 'primaryContact',
    headerName: 'Contact',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    editable: false,
  },
  {
    field: 'dob',
    headerName: 'DOB / Registration',
    flex: 1,
    minWidth: 100,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    editable: false,
    renderCell: (params) => formatDate(params.row.dob),
  },
  {
    field: 'decisionMakingAuthority',
    headerName: 'Decision Making',
   // flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    editable: false,
    renderCell: (params) => (params.row.decisionMakingAuthority === 1 ? 'Yes' : 'No'),
  },
  {
    field: 'imageUrl',
    headerName: 'Action',
    flex: 1,
    minWidth: 100,
    headerClassName: 'custom-header-data-grid',
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    editable: false,
    renderCell: (params) => (
      <DspsAddPartnerCell
        params={params}
        partner={params.row}
        allPartners={rows}
        setRows={setRows}
      />
    ),
  },
];

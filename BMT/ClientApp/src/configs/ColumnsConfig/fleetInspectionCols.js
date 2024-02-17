/* eslint-disable react/react-in-jsx-scope */
import { cilCheckAlt, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import InspectionReportCell from 'src/components/DataGridCustomCells/InspectionReportCell';
import globalutil from 'src/util/globalutil';

export const getFleetInspectionCols = (fetchVehicleInspection, vehicleInspRes, rows) => [
  {
    field: 'vin',
    headerName: 'VIN',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    editable: false,
  },
  {
    field: 'type',
    headerName: 'Type',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: false,
    disableColumnMenu: false,
    editable: false,
    renderCell: (params) =>
      params.row.type !== 0
        ? globalutil.inspectionstatuses().find((item) => item.id == params.row.type).name
        : '',
  },
  {
    field: 'inspector',
    headerName: 'Inspector',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    editable: false,
    // renderCell: (params) => inspectors.find((item) => item.id == params.row.inspector).firstName,
  },
  {
    field: 'result',
    headerName: 'Results',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    editable: false,
    renderCell: (params) => (
      <>
        <CIcon
          className={params.row.result == 2 ? 'text-danger ' : 'text-success '}
          icon={params.row.result == 2 ? cilX : cilCheckAlt}
        />
        <p className="m-0 ps-2">{params.row.result == 2 ? 'Failed' : 'Passed'}</p>
      </>
    ),
  },
  {
    field: 'defectCategory',
    headerName: 'Defect Category',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    editable: false,
  },
  {
    field: 'lastUpdatedAt',
    headerName: 'lastUpdatedAt',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    editable: false,
  },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    editable: false,
  },
  {
    field: 'action',
    headerName: 'Report',
    flex: 1,
    minWidth: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    editable: false,
    renderCell: (params) => (
      <InspectionReportCell
        value={params}
        reportField={vehicleInspRes.current?.data?.data.filter((rep) => rep.id === params.row.id)}
        fetchInspection={fetchVehicleInspection}
        rows={rows}
      />
    ),
  },
];

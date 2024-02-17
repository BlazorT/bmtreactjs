/* eslint-disable react/react-in-jsx-scope */
import DispatchAssignCell from 'src/components/DataGridCustomCells/DispatchAssignCell';
import DispatchCheckCell from 'src/components/DataGridCustomCells/DispatchCheckCell';
import DispatchQtyCell from 'src/components/DataGridCustomCells/DispatchQtyCell';
import { formatDate, formatDateTime, formatTime } from 'src/helpers/formatDate';

export const getDispatchmentCols = (
  setSubmitAssignment,
  vehicleRes,
  setRows,
  daRes,
  pageRoles,
  rows,
) => [
  // {
  //   field: 'date',
  //   headerClassName: 'custom-header-data-grid',
  //   width: 100,
  //   //   flex: 1,
  //   headerName: 'Date',
  //   filterable: false,
  //   sortable: false,
  //   renderCell: (params) => <h6 className="m-0 p-0 fw-bold">{params.row.date}</h6>,
  // },
  {
    field: 'assign',
    headerClassName: 'custom-header-data-grid',
    width: 100,
    //   flex: 1,
    headerName: 'Assign',
    filterable: false,
    renderCell: (params) =>
      !params.row.date && (
        <DispatchCheckCell
          value={params}
          disable={pageRoles.canDelete === 0 || params.row.maxValue < 1}
          setRows={setRows}
          setSubmitAssignment={setSubmitAssignment}
          daList={daRes ? daRes : []}
          vehicleList={
            vehicleRes.current?.data
              ? vehicleRes.current?.data.filter((item) => item.name !== null)
              : []
          }
        />
      ),
  },
  {
    field: 'product',
    headerClassName: 'custom-header-data-grid',
    width: 150,
    // flex: 1,
    headerName: 'Product',
    editable: false,
    filterable: true,
    sortable: false,
  },
  {
    field: 'assignment',
    headerClassName: 'custom-header-data-grid',
    minWidth: 220,
    flex: 1,
    headerName: 'Assignment',
    headerAlign: 'center',
    sortable: false,
    filterable: false,
    editable: false,
    renderCell: (params) =>
      !params.row.date && (
        <DispatchAssignCell
          value={params}
          disable={pageRoles.canUpdate === 0}
          setRows={setRows}
          setSubmitAssignment={setSubmitAssignment}
          daList={daRes ? daRes : []}
          vehicleList={
            vehicleRes.current?.data
              ? vehicleRes.current?.data.filter((item) => item.name !== null)
              : []
          }
          rows={rows}
        />
      ),
  },
  {
    // flex: 1,
    width: 120,
    headerClassName: 'custom-header-data-grid',
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    headerName: 'Quantity',
    // type: 'number',
    align: 'left',
    headerAlign: 'left',
    field: 'quantity',
    editable: false,
    renderCell: (params) =>
      !params.row.date &&
      params.row.inventoryOf !== 2 && (
        <DispatchQtyCell
          disable={pageRoles.canUpdate === 0}
          value={params}
          setRows={setRows}
          setSubmitAssignment={setSubmitAssignment}
          daList={daRes ? daRes : []}
          vehicleList={
            vehicleRes.current?.data
              ? vehicleRes.current?.data.filter((item) => item.name !== null)
              : []
          }
        />
      ),
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    headerName: 'Available Qty',
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    field: 'availableStock',
    editable: false,
    renderCell: (params) =>
      !params.row.date && params.row.inventoryOf !== 2 && params.row.availableStock,
  },

  {
    field: 'lastUpdated',
    headerClassName: 'custom-header-data-grid',
    minWidth: 180,
    flex: 1,
    headerName: 'Updated Time',
    sortable: false,
    filterable: false,
    type: 'timestamp',
    renderCell: (params) => !params.row.date && formatTime(params.row.lastUpdated),
  },
];

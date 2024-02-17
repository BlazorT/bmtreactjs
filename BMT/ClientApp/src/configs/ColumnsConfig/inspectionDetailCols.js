/* eslint-disable react/react-in-jsx-scope */
import InspectionActionCell from 'src/components/DataGridCustomCells/InspectionActionCell';
import InspectionDefectsCell from 'src/components/DataGridCustomCells/InspectionDefectsCell';

export const getInspectionDetailCols = (setRows, rows) => [
  {
    field: 'group',
    headerName: 'Vehicle Side',
    //   flex: 1,
    width: 145,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: false,
    disableColumnMenu: false,
    editable: false,
    // renderCell: (params) =>
    //   params.row.group && <InspectionGroupCell params={params} setRows={setRows} rows={rows} />,
  },
  {
    field: 'itemName',
    headerName: 'Part and Accessories',
    flex: 1,
    minWidth: 180,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: false,
    disableColumnMenu: false,
    editable: false,
    // renderCell: (params) =>
    //   !params.row.group &&
    //   params.row.parts && (
    //     <InspectionPartAccessCell params={params} setRows={setRows} rows={rows} />
    //   ),
  },
  {
    field: 'remarks',
    headerName: 'Defects',
    flex: 1,
    minWidth: 100,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: false,
    disableColumnMenu: false,
    editable: false,
    renderCell: (params) =>
      !params.row.group && <InspectionDefectsCell params={params} setRows={setRows} rows={rows} />,
  },

  {
    field: 'checkStatus',
    headerName: 'Action',
    //   flex: 1,
    width: 110,
    headerClassName: 'custom-header-data-grid',
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    editable: false,
    renderCell: (params) => <InspectionActionCell params={params} setRows={setRows} rows={rows} />,
  },
];

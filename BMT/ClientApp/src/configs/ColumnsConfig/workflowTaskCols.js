/* eslint-disable react/react-in-jsx-scope */
import WorkFlowActionCell from 'src/components/DataGridCustomCells/WorkFlowActionCell';
import globalutil from 'src/util/globalutil';

export const getWorkFlowCols = (fetchTaskData, fetchWorkflowTask) => [
  {
    field: 'workFlowName',
    flex: 1,
    minWidth: 120,
    headerClassName: 'custom-header-data-grid',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'WorkFlow Name',
  },
  {
    field: 'taskName',
    flex: 1,
    minWidth: 120,
    headerClassName: 'custom-header-data-grid',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Task Name',
  },
  {
    field: 'ancestor',
    flex: 1,
    minWidth: 120,
    headerClassName: 'custom-header-data-grid',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Ancestor',
    renderCell: (params) =>
      params.row.ancestor === 0
        ? 'Root Task'
        : fetchTaskData?.current?.data.find((item) => item.id === params.row.ancestor)?.name || '',
  },
  {
    field: 'predecesor',
    flex: 1,
    minWidth: 120,
    headerClassName: 'custom-header-data-grid',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Predecesor',
    renderCell: (params) =>
      params.row.predecesor === 0 || params.row.predecesor === null
        ? '-'
        : fetchTaskData?.current?.data.find((item) => item.id === params.row.predecesor)?.name ||
          '-',
  },
  {
    field: 'status',
    flex: 1,
    minWidth: 120,
    headerClassName: 'custom-header-data-grid',
    editable: false,
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Status',
    renderCell: (params) =>
      globalutil.commonstatuses().find((item) => item.id === params.row.status)?.name || '-',
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Last Updated Time',
    field: 'lastUpdatedAt',
    editable: false,
  },
  {
    field: 'imageUrl',
    flex: 1,
    minWidth: 120,
    headerClassName: 'custom-header-data-grid',
    editable: false,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    headerName: 'Action',
    renderCell: (params) => (
      <WorkFlowActionCell
        params={params}
        tasksData={fetchTaskData?.current?.data}
        fetchWorkflowTask={fetchWorkflowTask}
      />
    ),
  },
];

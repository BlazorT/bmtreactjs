/* eslint-disable react/react-in-jsx-scope */
import FieldMappingActionCell from 'src/components/DataGridCustomCells/FieldMappingActionCell';
import globalutil from 'src/util/globalutil';

export const getFieldMappingCols = (pageRoles, fetchFeildMapping, fields) => [
  {
    field: 'fieldName',
    headerClassName: 'custom-header-data-grid',
    headerName: 'Field Name',
    flex: 1,
    minWidth: 120,
    editable: false,
    filterable: true,
    cellClassName: (params) => (params.row.fieldType == 20 ? 'text-orange ' : 'text-white '),
  },
  {
    field: 'service',
    headerClassName: 'custom-header-data-grid',
    headerName: 'Service',
    flex: 1,
    minWidth: 110,
    editable: false,
    filterable: true,
    renderCell: (params) =>
      globalutil.servicetypes().find((type) => type.id === params.row.service)?.name || '-',
    cellClassName: (params) => (params.row.fieldType == 20 ? 'text-orange ' : 'text-white '),
  },
  // {
  //   field: 'entity',
  //   headerClassName: 'custom-header-data-grid',
  //   headerName: 'Entity',
  //   flex: 1,
  //   minWidth: 120,
  //   editable: false,
  //   filterable: true,
  //   cellClassName: (params) => (params.row.fieldType == 20 ? 'text-danger ' : 'text-orange '),
  //   renderCell: (params) =>
  //     params.row.service !== null &&
  //     params.row.service !== 0 &&
  //     globalutil.dsP_TABLES().find((type) => type.id === params.row.entity)?.name,
  // },
  // {
  //   field: 'fieldType',
  //   headerClassName: 'custom-header-data-grid',
  //   headerName: 'Field Type',
  //   flex: 1,
  //   minWidth: 120,
  //   editable: false,
  //   filterable: true,
  //   cellClassName: (params) => (params.row.fieldType == 20 ? 'text-danger ' : 'text-orange '),
  //   renderCell: (params) => (
  //     <div>{globalutil.fieldtypes().find((type) => type.id === params.row.fieldType).name}</div>
  //   ),
  // },
  {
    field: 'dataType',
    headerClassName: 'custom-header-data-grid',
    headerName: 'Data Type',
    flex: 1,
    minWidth: 100,
    editable: false,
    filterable: true,
    cellClassName: (params) => (params.row.fieldType == 20 ? 'text-orange ' : 'text-white '),
    renderCell: (params) =>
      globalutil.datatypes().find((type) => type.id === params.row.dataType).name,
  },

  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Last Update Time',
    field: 'lastUpdatedAt',
    editable: false,
    cellClassName: (params) => (params.row.fieldType == 20 ? 'text-orange ' : 'text-white '),
  },
  //{
  //  field: 'serviceField',
  //  headerClassName: 'custom-header-data-grid',
  //  headerName: 'Service Field',
  //  flex: 1,
  //  minWidth: 150,
  //  editable: false,
  //  filterable: true,
  //},
  // {
  //   field: 'action',
  //   headerClassName: 'custom-header-data-grid',
  //   headerName: 'Action',
  //   // flex: 1,
  //   width: 80,
  //   editable: false,
  //   filterable: false,
  //   sortable: false,
  //   disableColumnMenu: true,
  //   cellClassName: (params) => (params.row.fieldType == 20 ? 'text-danger ' : 'text-orange '),
  //   renderCell: (params) => (
  //     <FieldMappingActionCell
  //       value={params}
  //       canUpdate={pageRoles.canUpdate}
  //       canDelete={pageRoles.canDelete}
  //       fetchFeildMapping={fetchFeildMapping}
  //       fieldData={fields?.find((item) => item.id === params.row.id)}
  //       fields={fields}
  //     />
  //   ),
  // },
];

/* eslint-disable react/react-in-jsx-scope */
import ProductActionCell from 'src/components/DataGridCustomCells/ProductActionCell';

export const getPricingCols = (pageRoles, getProducts, products) => [
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Network Name',
    field: 'name',
    editable: false,
  },

  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Pricing Unit',
    field: 'unitName',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Unit Price',
    field: 'unitPrice',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Discount',
    field: 'discount',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Free Quota',
    field: 'freeAllowed',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Applicable Date',
    field: 'startTime',
    editable: false,
  },
  //{
  //  flex: 1,
  //  minWidth: 130,
  //  headerClassName: 'custom-header-data-grid',
  //  filterable: true,
  //  sortable: true,
  //  disableColumnMenu: false,
  //  headerName: 'Action',
  //  field: 'status',
  //  editable: false,
  //  renderCell: (params) => (
  //    <ProductActionCell
  //      value={params}
  //      getProducts={getProducts}
  //      productData={products.find((item) => item.id === params.row.id)}
  //      canUpdate={pageRoles.canUpdate}
  //      canDelete={pageRoles.canDelete}
  //    />
  //  ),
  //},
];

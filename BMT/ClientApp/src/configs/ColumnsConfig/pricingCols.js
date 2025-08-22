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
    name: 'Network Name',
    key: 'name',
    editable: false,
  },

  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Pricing Unit',
    key: 'unitName',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Unit Price',
    key: 'unitPrice',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Discount',
    key: 'discount',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Free Quota',
    key: 'freeAllowed',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Applicable Date',
    key: 'startTime',
    editable: false,
  },
  //{
  //  flex: 1,
  //  minWidth: 130,
  //  headerClassName: 'custom-header-data-grid',
  //  filterable: true,
  //  sortable: true,
  //  disableColumnMenu: false,
  //  name: 'Action',
  //  key: 'status',
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

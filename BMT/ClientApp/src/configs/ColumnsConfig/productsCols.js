/* eslint-disable react/react-in-jsx-scope */
import ProductActionCell from 'src/components/DataGridCustomCells/ProductActionCell';

export const getProductsCols = (pageRoles, getProducts, products) => [
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: ' Name',
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
    headerName: 'Fee',
    field: 'fee',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Early Bird Dis(%)',
    field: 'earlyBirdDiscount',
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
    headerName: 'Package in days',
    field: 'packageInDays',
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

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
    name: ' Name',
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
    name: 'Fee',
    key: 'fee',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    name: 'Early Bird Disc(%)',
    key: 'earlyBirdDiscount',
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
    name: 'Validity Time (Days)',
    key: 'packageInDays',
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

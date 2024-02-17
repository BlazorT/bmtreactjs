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
    headerName: 'Product Name',
    field: 'productName',
    editable: false,
  },

  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Manufacture',
    field: 'manufactured',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Product For',
    field: 'productFor',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Category',
    field: 'category',
    editable: false,
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
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Action',
    field: 'status',
    editable: false,
    renderCell: (params) => (
      <ProductActionCell
        value={params}
        getProducts={getProducts}
        productData={products.find((item) => item.id === params.row.id)}
        canUpdate={pageRoles.canUpdate}
        canDelete={pageRoles.canDelete}
      />
    ),
  },
];

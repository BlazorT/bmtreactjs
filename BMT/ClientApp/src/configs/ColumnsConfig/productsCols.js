export const getProductsCols = (pageRoles, getProducts, products) => [
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: ' Name',
    key: 'name',
    editable: false,
  },

  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Fee',
    key: 'fee',
    editable: false,
  },
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Early Bird Disc(%)',
    key: 'earlyBirdDiscount',
    editable: false,
  },
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Discount',
    key: 'discount',
    editable: false,
  },
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Validity Time (Days)',
    key: 'packageInDays',
    editable: false,
  },
];

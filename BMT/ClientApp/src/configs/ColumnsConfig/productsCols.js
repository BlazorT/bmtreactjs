export const getPackagesCols = () => [
  {
    filterable: true,
    disableColumnMenu: false,
    name: ' Name',
    key: 'name',
    editable: false,
  },

  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Fee',
    key: 'fee',
    editable: false,
  },
  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Early Bird Disc(%)',
    key: 'earlyBirdDiscount',
    editable: false,
  },
  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Discount',
    key: 'discount',
    editable: false,
  },
  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Validity Time (Days)',
    key: 'packageInDays',
    editable: false,
  },
];

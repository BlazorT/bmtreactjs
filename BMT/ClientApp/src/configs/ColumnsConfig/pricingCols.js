/* eslint-disable react/react-in-jsx-scope */
import PricingActionCell from 'src/components/DataGridCustomCells/PricingActionCell';

export const getPricingCols = (user, getPricing) => [
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Network Name',
    key: 'name',
    editable: false,
  },

  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Pricing Unit',
    key: 'unitName',
    editable: false,
  },
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Unit Price',
    key: 'unitPrice',
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
    name: 'Free Quota',
    key: 'freeAllowed',
    editable: false,
  },
  {
    headerCellClass: 'custom-header-data-grid',
    filterable: true,
    disableColumnMenu: false,
    name: 'Applicable Date',
    key: 'startTime',
    editable: false,
  },
  ...(user?.roleId === 1
    ? [
        {
          headerCellClass: 'custom-header-data-grid',
          filterable: true,
          disableColumnMenu: false,
          name: 'Action',
          key: 'action',
          editable: false,
          renderCell: (params) =>
            params?.row?.name ? null : <PricingActionCell value={params} getPricing={getPricing} />,
        },
      ]
    : []),
];

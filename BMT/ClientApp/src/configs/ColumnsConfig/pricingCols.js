/* eslint-disable react/react-in-jsx-scope */
import PricingActionCell from 'src/components/DataGridCustomCells/PricingActionCell';
import { ROLES } from 'src/util/constants';

export const getPricingCols = (user, getPricing) => [
  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Network Name',
    key: 'name',
    editable: false,
  },

  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Pricing Unit',
    key: 'unitName',
    editable: false,
  },
  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Unit Price',
    key: 'unitPrice',
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
    name: 'Free Quota',
    key: 'freeAllowed',
    editable: false,
  },
  {
    filterable: true,
    disableColumnMenu: false,
    name: 'Applicable Date',
    key: 'startTime',
    editable: false,
  },
  ...(user?.roleId === ROLES.SUPERADMIN
    ? [
        {
          filterable: true,
          disableColumnMenu: false,
          name: 'Action',
          key: 'action',
          editable: false,
          renderCell: (params) => <PricingActionCell value={params} getPricing={getPricing} />,
        },
      ]
    : []),
];

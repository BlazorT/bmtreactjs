/* eslint-disable react/react-in-jsx-scope */
import PricingActionCell from 'src/components/DataGridCustomCells/PricingActionCell';
import { ROLES } from 'src/util/constants';

export const getPricingCols = (user, getPricing) => [
  {
    name: 'Network Name',
    key: 'name',
  },

  {
    name: 'Pricing Unit',
    key: 'unitName',
  },
  {
    name: 'Unit Price',
    key: 'unitPrice',
  },
  {
    name: 'Discount',
    key: 'discount',
  },
  {
    name: 'Free Quota',
    key: 'freeAllowed',
  },
  {
    name: 'Applicable Date',
    key: 'startTime',
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

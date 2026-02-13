/* eslint-disable react/react-in-jsx-scope */
import PricingActionCell from 'src/components/DataGridCustomCells/PricingActionCell';
import { ROLES } from 'src/util/constants';

export const getPricingCols = (user, getPricing) => [
  {
    name: 'Network Name',
    key: 'name',
    minWidth: 120,
    editable: false,
  },
  {
    name: 'Pricing Unit',
    key: 'unitName',
    minWidth: 120,
    editable: false,
  },
  {
    name: 'Unit Price',
    key: 'unitPrice',
    minWidth: 100,
    editable: false,
  },
  {
    name: 'Discount',
    key: 'discount',
    minWidth: 100,
    editable: false,
  },
  {
    name: 'Free Quota',
    minWidth: 100,
    key: 'freeAllowed',
    editable: false,
  },
  {
    name: 'Applicable Date',
    key: 'startTime',
    // ✅ Make this column flexible to fill remaining space
    minWidth: 100,
    editable: false,
  },
  ...(user?.roleId === ROLES.SUPERADMIN
    ? [
        {
          filterable: true,
          disableColumnMenu: false,
          name: 'Action',
          key: 'action',
          width: 100,
          editable: false,
          renderCell: (params) => <PricingActionCell value={params} getPricing={getPricing} />,
        },
      ]
    : []),
];

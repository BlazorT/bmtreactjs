/* eslint-disable react/react-in-jsx-scope */
import PricingActionCell from 'src/components/DataGridCustomCells/PricingActionCell';
import { ROLES } from 'src/util/constants';

export const getPricingCols = (user, getPricing) => [
  {
    name: 'Network Name',
    key: 'name',
    minWidth: 120,
    editable: false,
    flex: 1
  },
  {
    name: 'Pricing Unit',
    key: 'unitName',
    minWidth: 120,
    editable: false,
    flex: 1
  },
  {
    name: 'Unit Price',
    key: 'unitPrice',
    minWidth: 100,
    editable: false,
    flex: 1
  },
  {
    name: 'Discount',
    key: 'discount',
    minWidth: 100,
    editable: false,
    flex: 1
  },
  {
    name: 'Free Quota',
    minWidth: 100,
    key: 'freeAllowed',
    editable: false,
    flex: 1
  },
  {
    name: 'Applicable Date',
    key: 'startTime',
    // ✅ Make this column flexible to fill remaining space
    minWidth: 100,
    editable: false,
    flex: 1
  },
  ...(user?.roleId === ROLES.SUPERADMIN
    ? [
        {
          filterable: true,
          disableColumnMenu: false,
          name: 'Action',
        key: 'action',
        flex: 1,
          width: 100,
          editable: false,
          renderCell: (params) => <PricingActionCell value={params} getPricing={getPricing} />,
        },
      ]
    : []),
];

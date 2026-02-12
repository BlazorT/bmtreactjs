/* eslint-disable react/react-in-jsx-scope */
import PricingActionCell from 'src/components/DataGridCustomCells/PricingActionCell';
import { ROLES } from 'src/util/constants';

export const getPricingCols = (user, getPricing) => [
  {
    name: 'Network Name',
    key: 'name',
    flex: 1,
    editable: false,
  },

  {
    name: 'Pricing Unit',
    key: 'unitName',
    flex: 1,
    editable: false,
  },
  {
    name: 'Unit Price',
    key: 'unitPrice',
    flex: 1,
    editable: false,
  },
  {
    name: 'Discount',
    key: 'discount',
    flex: 1,
    editable: false,
  },
  {
    name: 'Free Quota',
    flex: 1,
    key: 'freeAllowed',
  },
  {
    name: 'Applicable Date',
    key: 'startTime',
    flex: 1,
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

/* eslint-disable react/react-in-jsx-scope */
import PricingActionCell from 'src/components/DataGridCustomCells/PricingActionCell';
import { ROLES } from 'src/util/constants';

export const getPricingCols = (user, getPricing) => [
  {
    name: 'Network Name',
    key: 'name',
<<<<<<< HEAD
=======
    flex: 1,
    editable: false,
>>>>>>> 0879477860104145becebbb26176bac821469060
  },

  {
    name: 'Pricing Unit',
    key: 'unitName',
<<<<<<< HEAD
=======
    flex: 1,
    editable: false,
>>>>>>> 0879477860104145becebbb26176bac821469060
  },
  {
    name: 'Unit Price',
    key: 'unitPrice',
<<<<<<< HEAD
=======
    flex: 1,
    editable: false,
>>>>>>> 0879477860104145becebbb26176bac821469060
  },
  {
    name: 'Discount',
    key: 'discount',
<<<<<<< HEAD
=======
    flex: 1,
    editable: false,
>>>>>>> 0879477860104145becebbb26176bac821469060
  },
  {
    name: 'Free Quota',
    flex: 1,
    key: 'freeAllowed',
  },
  {
    name: 'Applicable Date',
    key: 'startTime',
<<<<<<< HEAD
=======
    flex: 1,
    editable: false,
>>>>>>> 0879477860104145becebbb26176bac821469060
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

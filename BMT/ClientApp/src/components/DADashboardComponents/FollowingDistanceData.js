import React from 'react';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';

function FollowingDistanceData() {
  const brandedColumns = [
    {
      field: 'Date',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Date',
      width: 370,
    },

    {
      field: 'distance',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Following Distance Rate (per trip)',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 370,
    },
  ];
  const brandedRows = [
    { id: 1, Date: '11-10-2023', distance: '0.0' },
    { id: 2, Date: '11-10-2023', distance: '0.0' },
    { id: 3, Date: '11-10-2023', distance: '0.0' },
  ];
  return <CustomDatagrid rowHeight={50} rows={brandedRows} columns={brandedColumns} />;
}

export default FollowingDistanceData;

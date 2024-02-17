import React from 'react';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';

function FicoData() {
  const brandedColumns = [
    {
      field: 'Date',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Date',
      width: 270,
    },

    {
      field: 'fico',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'FICO',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 270,
    },
  ];
  const brandedRows = [
    { id: 1, Date: '11-10-2023', fico: 'Fantastic' },
    { id: 2, Date: '11-10-2023', fico: 'Fantastic' },
    { id: 3, Date: '11-10-2023', fico: 'Fantastic' },
  ];
  return <CustomDatagrid rowHeight={50} rows={brandedRows} columns={brandedColumns} />;
}

export default FicoData;

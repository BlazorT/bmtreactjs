import React from 'react';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import DataGridHeader from '../DataGridComponents/DataGridHeader';

function FleetRecordTab() {
  const recordColumns = [
    {
      field: 'Reservation',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Reservation',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'Provider',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Provider',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'SDate',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Start Date',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'EDate',
      headerClassName: 'custom-header-data-grid',
      headerName: 'End Date',
      description: 'This column has a value getter and is not sortable.',
      // sortable: false,
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'Received',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Received Vehicle',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      minWidth: 150,
    },
  ];
  const recordRows = [
    {
      id: 1,
      Reservation: 'P70232',
      Provider: 'Fluid',
      SDate: '2023-11-05',
      EDate: '2023-01-20',
      Received: '1/1',
    },
    {
      id: 2,
      Reservation: 'P90756',
      Provider: 'U Haul',
      SDate: '2023-11-05',
      EDate: '2023-01-20',
      Received: '1/2',
    },
    {
      id: 3,
      Reservation: 'P70232',
      Provider: 'Fluid',
      SDate: '2023-11-05',
      EDate: '2023-01-20',
      Received: '1/1',
    },
  ];
  return (
    <div className="mt-2 bg_Div d-flex flex-column">
      <DataGridHeader title="Records" />
      <CustomDatagrid rowHeight={40} rows={recordRows} columns={recordColumns} pagination={true} />
    </div>
  );
}

export default FleetRecordTab;

import React from 'react';
import CustomDatagrid from '../DataGridComponents/CustomDatagrid';

function DriverTripHistory() {
  const brandedColumns = [
    {
      field: 'Date',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Date',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'safetyScore',
      headerClassName: 'custom-header-data-grid',
      headerName: 'On Road Safety Score',
      minWidth: 180,
      flex: 1,
    },
    {
      field: 'FICO',
      headerClassName: 'custom-header-data-grid',
      headerName: 'FICO',
      minWidth: 80,
      flex: 1,
    },
    {
      field: 'seatbelt',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Seatbelt-off Rate',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      minWidth: 140,
      flex: 1,
    },
    {
      field: 'speeding',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Speeding Event Rate',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      field: 'distraction',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Distraction Rate',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'sign',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Sign/Signal Violation',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      minWidth: 180,
      flex: 1,
    },
    {
      field: 'followingDistance',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Following Distance',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      minWidth: 170,
      flex: 1,
    },
  ];
  const brandedRows = [
    {
      id: 1,
      Date: '11-10-2023',
      safetyScore: 'Fantastic',
      FICO: 'No Data',
      seatbelt: '0.0',
      speeding: '0.0',
      distraction: '0.0',
      sign: '0.0',
      followingDistance: '0.0',
    },
    {
      id: 2,
      Date: '11-10-2023',
      safetyScore: 'Fantastic',
      FICO: 'No Data',
      seatbelt: '0.0',
      speeding: '0.0',
      distraction: '0.0',
      sign: '0.0',
      followingDistance: '0.0',
    },
    {
      id: 3,
      Date: '11-10-2023',
      safetyScore: 'Fantastic',
      FICO: 'No Data',
      seatbelt: '0.0',
      speeding: '0.0',
      distraction: '0.0',
      sign: '0.0',
      followingDistance: '0.0',
    },
  ];
  return <CustomDatagrid rowHeight={50} rows={brandedRows} columns={brandedColumns} />;
}

export default DriverTripHistory;

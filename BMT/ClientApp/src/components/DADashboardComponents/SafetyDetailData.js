import React from 'react';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';

function SafetyDetailData() {
  const SafetyColumns = [
    {
      field: 'date',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Date',
      minWidth: 130,
    },
    {
      field: 'safetyDriving',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Safety Driving Metrics',
      minWidth: 200,
    },
    {
      field: 'seatBelt',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Seatbelt-off Rate',
      minWidth: 200,
    },
    {
      field: 'speeding',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Speeding Event Rate',
      sortable: false,
      minWidth: 200,
    },
    {
      field: 'distraction',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Distractions Rate',
      sortable: false,
      minWidth: 200,
    },
    {
      field: 'distance',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Following Distance Rate ',
      sortable: false,
      minWidth: 200,
    },
    {
      field: 'sign',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Sign/Signal Violations',
      sortable: false,
      minWidth: 200,
    },
  ];
  const SafetyRows = [
    {
      id: 1,
      date: '2023-11-05',
      safetyDriving: 'Fantastic',
      seatBelt: 'Fantastic',
      speeding: 'Fantastic',
      distraction: 'Fantastic',
      distance: 'Fantastic',
      sign: 'Fantastic',
    },
    {
      id: 2,
      date: '2023-11-05',
      safetyDriving: 'Fantastic',
      seatBelt: 'Fantastic',
      speeding: 'Fantastic',
      distraction: 'Fantastic',
      distance: 'Fantastic',
      sign: 'Fantastic',
    },
    {
      id: 3,
      date: '2023-11-05',
      safetyDriving: 'Fantastic',
      seatBelt: 'Fantastic',
      speeding: 'Fantastic',
      distraction: 'Fantastic',
      distance: 'Fantastic',
      sign: 'Fantastic',
    },
  ];
  return <CustomDatagrid rowHeight={50} rows={SafetyRows} columns={SafetyColumns} />;
}

export default SafetyDetailData;

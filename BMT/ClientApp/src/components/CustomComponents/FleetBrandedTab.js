import React from 'react';
import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import DataGridHeader from '../DataGridComponents/DataGridHeader';

function FleetBrandedTab() {
  const brandedColumns = [
    {
      field: 'VIN',
      headerClassName: 'custom-header-data-grid',
      headerName: 'VIN',
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
      field: 'Make',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Make & Model',
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'Status',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Status',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      flex: 1,
      minWidth: 150,
    },
  ];
  const brandedRows = [
    { id: 1, VIN: 'P70232', Provider: 'Fluid', Make: '2023-11-05', Status: '2023-01-20' },
    { id: 2, VIN: 'P70232', Provider: 'Fluid', Make: '2023-11-05', Status: '2023-01-20' },
    { id: 3, VIN: 'P70232', Provider: 'Fluid', Make: '2023-11-05', Status: '2023-01-20' },
  ];
  return (
    <div className="mt-2 bg_Div d-flex flex-column">
      <DataGridHeader title="Branded Vehicle" />
      <CustomDatagrid
        rowHeight={40}
        rows={brandedRows}
        columns={brandedColumns}
        pagination={true}
      />
    </div>
  );
}

export default FleetBrandedTab;

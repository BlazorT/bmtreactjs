import React from 'react';

import VehicleCustomeCell from '../DataGridCustomCells/VehicleCustomCell';
import CategoryCustomCell from '../DataGridCustomCells/CategoryCustomCell';
import CategoryStatusCell from '../DataGridCustomCells/CategoryStatusCell';
import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import DataGridHeader from '../DataGridComponents/DataGridHeader';

function FleetServiceHistoryTab() {
  const serviceColumns = [
    {
      field: 'Vehicle',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Service date and mileage',
     /* flex: 1,*/
      minWidth: 240,
      renderCell: (params) => <VehicleCustomeCell value={params} />,
    },
    //{
    //  field: 'Issue',
    //  headerClassName: 'custom-header-data-grid',
    //  headerName: 'Issue Date & Time',
    //  flex: 1,
    //  minWidth: 220,
    //},
    {
      field: 'Category',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Category & Description',
      flex: 1,
      minWidth: 230,
      renderCell: (params) => <CategoryCustomCell value={params} />,
    },
    {
      field: 'Status',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Source',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <CategoryStatusCell value={params} />,
    },
    {
      field: 'workOrder',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Work order number',
     /* flex: 1,*/
      minWidth: 200,
      renderCell: (params) => <CategoryStatusCell value={params} />,
    },
    {
      field: 'vendorCost',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Vendor and cost',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <CategoryStatusCell value={params} />,
    },
  ];
  const serviceRows = [
    {
      id: 1,
      Vehicle: 'Ram Promaster',
      VehicleId: '4D 03 | U882991',
      VIN: '3CAD98565SD4FW45',
      Issue: '11/12/2022 11:25 AM',
      Category: 'Preventative maintainance',
      Description: 'Semisynthetic oil change',
      Status: 'Due Now',
    },
    {
      id: 2,
      Vehicle: 'Ram Pro main',
      VehicleId: '4D 19 | U882561',
      VIN: '3CAD98565SD4FW45',
      Issue: '11/12/2023 11:25 AM',
      Category: 'Preventative maintainance',
      Description: 'Semisynthetic oil change',
      Status: 'Due Soon',
    },
  ];
  return (
    <div className="mt-2 bg_Div d-flex flex-column">
      <DataGridHeader title="Services" />
      <CustomDatagrid
        rows={serviceRows}
        columns={serviceColumns}
        pagination={true}
        rowHeight={100}
      />
    </div>
  );
}

export default FleetServiceHistoryTab;

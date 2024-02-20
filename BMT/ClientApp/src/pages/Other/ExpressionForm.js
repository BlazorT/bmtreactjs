// MyDataGrid.js

import React, { useState } from 'react';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import FilterIconMenu from 'src/components/DataGridComponents/FilterIconMenu';

const MyDataGrid = () => {
  const [rowData, setRowData] = useState([
    {
      id: 1,
      partName: 'Exterior',
      code: 25,
      manufacturer: 'USA',
      newStock: '12',
      availableStock: '22',
      totalStock: '112',
      damaged: '42',
      expired: '22',
      remarks: '32',
    },
    {
      id: 2,
      partName: 'Tyres',
      code: 25,
      manufacturer: 'Canada',
      newStock: '12',
      availableStock: '22',
      totalStock: '112',
      damaged: '42',
      expired: '22',
      remarks: '32',
    },
    {
      id: 3,
      partName: 'Tyres',
      code: 25,
      manufacturer: 'Canada',
      newStock: '12',
      availableStock: '22',
      totalStock: '112',
      damaged: '42',
      expired: '22',
      remarks: '32',
    },
    {
      id: 4,
      partName: 'Tyres',
      code: 25,
      manufacturer: 'Canada',
      newStock: '12',
      availableStock: '22',
      totalStock: '112',
      damaged: '42',
      expired: '22',
      remarks: '32',
    },
    {
      id: 5,
      partName: 'Tyres',
      code: 25,
      manufacturer: 'Canada',
      newStock: '12',
      availableStock: '22',
      totalStock: '112',
      damaged: '42',
      expired: '22',
      remarks: '32',
    },
    {
      id: 6,
      partName: 'Tyres',
      code: 25,
      manufacturer: 'Canada',
      newStock: '12',
      availableStock: '22',
      totalStock: '112',
      damaged: '42',
      expired: '22',
      remarks: '32',
    },
    // Add more rows as needed
  ]);
  const columnDefs = [
    // {
    //      headerName: ' Image', field: 'image', editable: true, width: 120, cellRendererFramework: (params) => (
    //        <img src={params.value} alt={`Image for ${params.data.name}`} style={{ width: '50px', height: '50px' }} />
    //      ),
    //},

    {
      flex: 1,
      minWidth: 130,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Product Name',
      field: 'partName',
      editable: true,
    },
    {
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'UPC Code',
      field: 'code',
      editable: true,
    },
    {
      flex: 1,
      minWidth: 140,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Manufacturer',
      field: 'manufacturer',
      editable: true,
    },
    {
      flex: 1,
      minWidth: 100,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'New Stock ',
      field: 'newStock',
      editable: true,
    },
    {
      flex: 1,
      minWidth: 140,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Available Stock ',
      field: 'availableStock',
      editable: true,
    },
    {
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Total Stock ',
      field: 'totalStock',
      editable: false,
    },
    {
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Damaged',
      field: 'damaged',
      editable: true,
    },
    {
      flex: 1,
      minWidth: 100,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Expired',
      field: 'expired',
      editable: true,
    },
  ];

  return (
    <div className="job-application-form ">
      <div className="bg_Div">
        <div className="dashboard-stock-header dashboard-drop mb-2">
          <div className="col-md-9 pointer">BMT Expression</div>
          <div className="col-md-2">
            <span className="lblAddPartner labelName heading-font-weight">Add Expression (+)</span>
          </div>
          <FilterIconMenu />
        </div>
        <div className="show-stock">
          <div className="row pt-2">
            <div className="col-md-12 col-xl-12">
              <CustomDatagrid
                rows={rowData}
                columns={columnDefs}
                pagination={false}
                rowHeight={40}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDataGrid;

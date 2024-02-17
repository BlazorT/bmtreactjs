import React from 'react';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';

function QualityDetailData() {
  const CustomsColumns = [
    {
      field: 'Date',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Date',
      width: 140,
    },
    {
      field: 'dcr',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'DCR',
      width: 140,
    },
    {
      field: 'dar',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'DAR',
      width: 140,
    },
    {
      field: 'cdf',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'CDF',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 140,
    },
    {
      field: 'swc',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'SWC-POD',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 170,
    },
    {
      field: 'swcCc',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'SWC-CC',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 170,
    },
    {
      field: 'starRating',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      headerName: 'Star Rating',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 170,
    },
  ];
  const CustomsRows = [
    {
      id: 1,
      Date: '11-10-2023',
      dcr: 'Fantastic',
      dar: 'Fantastic',
      cdf: 'Fantastic',
      swc: 'Fantastic',
      swcCc: 'Fantastic',
      starRating: 'Fantastic',
    },
    {
      id: 2,
      Date: '11-11-2023',
      dcr: 'Fantastic',
      dar: 'Fantastic',
      cdf: 'Fantastic',
      swc: 'Fantastic',
      swcCc: 'Fantastic',
      starRating: 'Fantastic',
    },
    {
      id: 3,
      Date: '11-12-2023',
      dcr: 'Fantastic',
      dar: 'Fantastic',
      cdf: 'Fantastic',
      swc: 'Fantastic',
      swcCc: 'Fantastic',
      starRating: 'Fantastic',
    },
  ];
  return <CustomDatagrid rowHeight={50} rows={CustomsRows} columns={CustomsColumns} />;
}

export default QualityDetailData;

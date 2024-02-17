/* eslint-disable react/react-in-jsx-scope */
import InventoryStockCell from 'src/components/DataGridCustomCells/InventoryStockCell';

export const getInventoryCols = (isEdit, pageRoles, setRowData, setSubmtiData) => [
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Product Name',
    field: 'partName',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 120,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Manufacturer',
    field: 'manufacturer',
    editable: false,
  },
  {
    flex: 1,
    maxWidth: 170,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    // type: 'number',
    align: 'center',
    //  headerAlign: 'center',
    headerName: 'Purchased Stock',
    field: 'newStock',
    editable: false,
    renderCell: (params) => {
      return (
        <InventoryStockCell
          params={params}
          isEdit={isEdit}
          setRowData={setRowData}
          setSubmtiData={setSubmtiData}
          canUpdate={pageRoles.canUpdate === 1}
        />
      );
    },
  },
  {
    flex: 1,
    maxWidth: 170,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    // type: 'number',
    align: 'center',
    //  headerAlign: 'center',
    headerName: 'Consumed Stock',
    field: 'stockOut',

    renderCell: (params) => (
      <InventoryStockCell
        params={params}
        isEdit={isEdit}
        canUpdate={pageRoles.canUpdate === 1}
        setRowData={setRowData}
        setSubmtiData={setSubmtiData}
      />
    ),
  },
  {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    headerName: 'Available Stock ',
    type: 'number',
    align: 'center',
    headerAlign: 'center',
    field: 'availableStock',
    editable: false,
  },
  {
    flex: 1,
    minWidth: 120,
    headerClassName: 'custom-header-data-grid',
    filterable: false,
    sortable: false,
    disableColumnMenu: false,
    headerName: 'Total Stock ',
    // type: 'number',
    align: 'center',
    headerAlign: 'center',
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
    align: 'left',
    headerAlign: 'left',
    headerName: 'Last Updated Time',
    field: 'lastUpdated',
    editable: false,
  },
  // {
  //   flex: 1,
  //   minWidth: 80,
  //   headerClassName: 'custom-header-data-grid',
  //   filterable: true,
  //   sortable: true,
  //   disableColumnMenu: false,
  //   headerName: 'Action',
  //   field: 'action',
  //   // editable: true,
  // renderCell: (params) => {
  //   return (
  //     <CRow>
  //       <CCol>
  //         <CIcon
  //           onClick={() => {
  //             params.api.startCellEditMode({ id: params.id, field: 'newStock' });
  //           }}
  //           className="stock-toggle-icon"
  //           icon={params.api.getRowMode(params.id) === 'view' ? cilPencil : cilSave}
  //         />
  //       </CCol>
  //     </CRow>
  //   );
  //   },
  // },
];

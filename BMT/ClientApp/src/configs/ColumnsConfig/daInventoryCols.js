/* eslint-disable react/react-in-jsx-scope */
import CustomInput from 'src/components/InputsComponent/CustomInput';

export const getDaInventoryCols = (setRows, showToast, canAssign, pageRoles) => [
  {
    field: 'assign',
    headerClassName: 'custom-header-data-grid',
    width: 80,
    // flex: 1,
    align: 'left',
    headerName: 'Select',
    filterable: false,
    renderCell: (params) => (
      <div className="d-flex justify-content-start align-items-center h-100 w-100">
        <label className="custom-checkbox">
          <input
            // className="w-50 h-50 "
            type="checkbox"
            name="assigned"
            onChange={(e) =>
              setRows((prev) => {
                const updatedRows = prev.map((row) =>
                  row.id === params.id ? { ...row, assign: e.target.checked } : row,
                );
                return updatedRows;
              })
            }
            id="assigned"
            defaultChecked={params.row.assign === true ? true : false}
          />
          <span className="checkmark"></span>
        </label>
      </div>
    ),
  },
  {
    field: 'newAssign',
    headerClassName: 'custom-header-data-grid',
    width: 60,
    // flex: 1,

    headerName: 'Select',
    align: 'left',
    filterable: false,
    renderCell: (params) => (
      <div className="d-flex justify-content-start align-items-center h-100 w-100">
        <label className="custom-checkbox">
          <input
            // className="w-50 h-50 "
            type="checkbox"
            name="assigned"
            disabled={!canAssign || params.row.availQuantity < 1}
            onChange={(e) => {
              setRows((prev) => {
                if (params.row.inventoryOf == 2) {
                  const hasAssignedVehicle = prev.some(
                    (row) => row.newAssign && row.inventoryOf == 2,
                  );
                  if (hasAssignedVehicle && e.target.checked) {
                    showToast('Only one vehicle can be assigned', 'warning');
                  } else {
                    const updatedRows = prev.map((row) =>
                      row.id === params.id
                        ? {
                            ...row,
                            newAssign: e.target.checked,
                            quantity: e.target.checked ? 1 : 0,
                          }
                        : row,
                    );

                    return updatedRows;
                  }
                  return prev;
                } else {
                  const updatedRows = prev.map((row) =>
                    row.id === params.id
                      ? { ...row, newAssign: e.target.checked, quantity: e.target.checked ? 1 : 0 }
                      : row,
                  );

                  return updatedRows;
                }
              });
            }}
            id="assigned"
            checked={params.row.newAssign}
          />
          <span className="checkmark"></span>
        </label>
      </div>
    ),
  },
  {
    field: 'assignedItem',
    headerClassName: 'custom-header-data-grid',
    minWidth: 170,
    flex: 1,
    headerName: 'Products',
    editable: true,
    filterable: true,
  },
  {
    field: 'assignedQty',
    headerClassName: 'custom-header-data-grid',
    minWidth: 100,
    flex: 1,
    headerName: 'Qty',
    filterable: true,
    renderCell: (params) => params.row.inventoryOf == 1 && params.row.assignedQty,
  },
  {
    field: 'quantity',
    headerClassName: 'custom-header-data-grid',
    minWidth: 105,
    flex: 1,
    headerName: 'Assign Qty',
    // align: 'center',
    filterable: true,
    renderCell: (params) =>
      params.row.inventoryOf == 1 && params.row.quantity === '' ? (
        <div className="ps-4">-</div>
      ) : (
        <CustomInput
          value={params.row.quantity}
          type="number"
          id="quantity"
          name="quantity"
          placeholder="Quantity"
          disabled={!canAssign}
          className={`form-control item lh-sm text-center w-100 ${
            params.row.index % 2 === 0 ? 'even-inspection-part' : 'odd-inspection-part'
          }`}
          message="Enter quantity plz"
          onChange={(e) => {
            setRows((prev) => {
              const limitedQuantity = e.target.value;
              const enteredQuantity = parseInt(limitedQuantity, 10) || 0;
              const newQuantity = Math.max(
                enteredQuantity > 9999 || enteredQuantity > params.row.availQuantity
                  ? 0
                  : Number(enteredQuantity),
                0,
              );
              if (limitedQuantity > params.row.availQuantity) {
                showToast('Quantity should not exceed Available Quantity', 'warning');
              }
              const indexToUpdate = prev.findIndex((row) => row.id === params.id);

              if (indexToUpdate !== -1) {
                const updatedRows = [...prev];
                updatedRows[indexToUpdate] = {
                  ...prev[indexToUpdate],
                  quantity: newQuantity,
                  newAssign: newQuantity > 0,
                };

                return updatedRows;
              }

              // If the item with the specified id is not found, return the previous state
              return prev;
            });
          }}
        />
      ),
  },
  {
    field: 'availQuantity',
    headerClassName: 'custom-header-data-grid',
    minWidth: 100,
    flex: 1,
    headerName: 'Avail. Qty',
    align: 'left',
    filterable: true,
    renderCell: (params) => params.row.inventoryOf == 1 && params.row.availQuantity,
  },
  {
    field: 'remarks',
    headerClassName: 'custom-header-data-grid',
    minWidth: 110,
    flex: 1,
    headerName: 'Remarks',
    sortable: false,
    filterable: false,
    renderCell: (params) =>
      params.row.inventoryOf == 2 && (
        <CustomInput
          value={params.row.remarks}
          type="text"
          id="remarks"
          name="remarks"
          placeholder="Enter Remarks"
          className={`form-control item lh-sm text-start w-100 ${
            params.row.index % 2 === 0 ? ' even-inspection-part' : ' odd-inspection-part'
          }${params.row.inventoryOf == 2 ? ' vehicle-da-inventory' : ''}`}
          message="Enter remarks plz"
          width={'w-100'}
          maxLength={20}
          onKeyDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            setRows((prev) => {
              const rowIndexToUpdate = prev.findIndex((row) => row.id === params.id);
              if (rowIndexToUpdate !== -1) {
                const updatedRows = [...prev];
                updatedRows[rowIndexToUpdate] = {
                  ...updatedRows[rowIndexToUpdate],
                  remarks: e.target.value,
                };
                return updatedRows;
              }
              return prev;
            });
          }}
        />
      ),
  },
];

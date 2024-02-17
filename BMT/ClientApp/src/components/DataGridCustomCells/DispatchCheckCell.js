import React from 'react';

const DispatchCheckCell = (prop) => {
  const { value, setRows, setSubmitAssignment, daList, vehicleList, disable } = prop;

  return (
    <div className="w-100 h-100 d-flex justify-content-start align-items-center">
      <label className="custom-checkbox">
        <input
          type="checkbox"
          className={' mt-0'}
          disabled={disable}
          name={value.row.product + value.id}
          checked={value.row.isAssigned}
          onChange={(e) => {
            setSubmitAssignment((prev) => {
              const index = prev.findIndex((submitRow) => submitRow.id === value.id);

              if (index !== -1) {
                // If the row with the matching ID exists, update the assignment
                return prev.map((submitRow) =>
                  submitRow.id === value.id
                    ? {
                        ...submitRow,
                        isAssigned: e.target.checked,
                        assignment:
                          value.row.assignment === ''
                            ? e.target.checked
                              ? value.row.businessEntityId === 1
                                ? daList[0].id
                                : vehicleList[0].id
                              : ''
                            : '',
                        quantity:
                          value.row.quantity === 0 || value.row.quantity === 1
                            ? e.target.checked
                              ? 1
                              : 0
                            : 0,
                      }
                    : submitRow,
                );
              } else {
                // If the row with the matching ID doesn't exist, add a new row
                return [
                  ...prev,
                  {
                    ...value.row,
                    isAssigned: e.target.checked,
                    assignment:
                      value.row.assignment === ''
                        ? e.target.checked
                          ? value.row.businessEntityId === 1
                            ? daList[0].id
                            : vehicleList[0].id
                          : ''
                        : '',
                    quantity:
                      value.row.quantity === 0 || value.row.quantity === 1
                        ? e.target.checked
                          ? 1
                          : 0
                        : 0,
                  },
                ];
              }
            });
            setRows((prev) => {
              return prev.map((row) => {
                if (row.id === value.id) {
                  return {
                    ...row,
                    isAssigned: e.target.checked,
                    assignment:
                      value.row.assignment === ''
                        ? e.target.checked
                          ? value.row.businessEntityId === 1
                            ? daList[0].id
                            : vehicleList[0].id
                          : ''
                        : '',
                    quantity:
                      value.row.quantity === 0 || value.row.quantity === 1
                        ? e.target.checked
                          ? 1
                          : 0
                        : 0,
                  };
                }
                return row;
              });
            });
          }}
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};
export default DispatchCheckCell;

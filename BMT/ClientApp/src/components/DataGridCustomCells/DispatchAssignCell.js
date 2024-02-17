import React, { useState } from 'react';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';

const DispatchAssignCell = (prop) => {
  const { value, setRows, setSubmitAssignment, daList, vehicleList, disable, rows } = prop;

  const hashUserId = (userId) => `ID # ${userId.toString().slice(-6)}`;

  // const [das, setDas] = useState(daList);

  return (
    <CustomSelectInput
      optionsList={(option) =>
        option.firstName + ' ' + option.lastName + ', ' + hashUserId(option.userId)
      }
      value={value.row.assignment}
      defaultValue={value.row.assignment}
      className={`${value.row.id % 2 === 0 ? 'even-inspection-part ' : 'odd-inspection-part'} ${
        value.row.inventoryOf === 2 ? 'vehicle-da-inventory' : ''
      }`}
      // className="form-control position-relative"
      onChange={(e) => {
        // setDas(
        //   daList.filter((da) => {
        //     if (da.id === e.target.value) {
        //       return true; // include the item with the specific id
        //     } else {
        //       return !rows.some((row) => row.assignedTo === da.id);
        //     }
        //   }),
        // );
        setRows((prev) => {
          return prev.map((row) => {
            if (row.id === value.id) {
              return {
                ...row,
                assignment: e.target.value,
                isAssigned: e.target.value === '' ? false : true,
                quantity:
                  e.target.value === '' ? 0 : value.row.quantity < 1 ? 1 : value.row.quantity,
              };
            }
            return row;
          });
        });
        setSubmitAssignment((prev) => {
          const index = prev.findIndex((submitRow) => submitRow.id === value.id);

          if (index !== -1) {
            // If the row with the matching ID exists, update the assignment
            return prev.map((submitRow) =>
              submitRow.id === value.id
                ? {
                    ...submitRow,
                    assignment: e.target.value,
                    isAssigned: e.target.value === '' ? false : true,
                    quantity:
                      e.target.value === '' ? 0 : value.row.quantity < 1 ? 1 : value.row.quantity,
                  }
                : submitRow,
            );
          } else {
            // If the row with the matching ID doesn't exist, add a new row
            return [
              ...prev,
              {
                ...value.row,
                assignment: e.target.value,
                isAssigned: e.target.value === '' ? false : true,
                quantity:
                  e.target.value === '' ? 0 : value.row.quantity < 1 ? 1 : value.row.quantity,
              },
            ];
          }
        });
      }}
      id="dispatchAssign"
      name={'dispatchAssign'}
      options={
        daList.length > 0
          ? daList.filter((da) => {
              if (da.id === value.row.assignedTo) {
                return true; // include the item with the specific id
              } else {
                return !rows.some((row) => row.assignedTo === da.id);
              }
            })
          : [{ id: 0, name: 'Select Vehicle', firstName: 'Select DA' }]
      }
      width="w-100"
      isRequired={true}
      disabled={disable}
      disableOption={'Select DA'}
    />
  );
};
export default DispatchAssignCell;

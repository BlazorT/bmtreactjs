import React, { useRef } from 'react';
import CustomInput from '../InputsComponent/CustomInput';
import { useShowToast } from 'src/hooks/useShowToast';

const DispatchQtyCell = (prop) => {
  const { value, setRows, setSubmitAssignment, disable, daList, vehicleList } = prop;
  const maxValue = value.row.maxValue;

  const showToast = useShowToast();
  return (
    <input
      value={value.row.quantity}
      disabled={disable}
      onChange={(e) => {
        const enteredValue = e.target.value;
        const newQuantity = Math.max(
          enteredValue > 9999 || enteredValue > maxValue ? 0 : Number(enteredValue),
          0,
        );
        console.log({ newQuantity, maxValue }, enteredValue > maxValue);
        setRows((prev) => {
          return prev.map((row) => {
            if (row.id === value.id) {
              return {
                ...row,
                isAssigned: newQuantity > 0 ? true : false,
                // assignment:
                //   newQuantity !== '' && newQuantity > 0
                //     ? value.row.assignment === ''
                //       ? value.row.businessEntityId === 1
                //         ? daList[0].id
                //         : vehicleList[0].id
                //       : value.row.assignment
                //     : '',
                quantity: newQuantity, // Ensure the quantity is not less than 0
              };
            }
            return row;
          });
        });
        if (e.target.value !== '' && Number(e.target.value) > value.row.maxValue) {
          showToast('Quantity should not exceed Available Quantity', 'warning');
          e.target.value = ''; // Set the quantity to empty
        }
        setSubmitAssignment((prev) => {
          const index = prev.findIndex((submitRow) => submitRow.id === value.id);

          if (index !== -1) {
            // If the row with the matching ID exists, update the assignment
            return prev.map((submitRow) =>
              submitRow.id === value.id
                ? {
                    ...submitRow,
                    isAssigned: newQuantity > 0 ? true : false,
                    quantity: newQuantity,
                  }
                : submitRow,
            );
          } else {
            // If the row with the matching ID doesn't exist, add a new row
            return [
              ...prev,
              {
                ...value.row,
                isAssigned: newQuantity > 0 ? true : false,
                quantity: newQuantity,
              },
            ];
          }
        });
      }}
      type="number"
      id="quantity"
      name="quantity"
      placeholder="enter quantity"
      className={`form-control item lh-sm text-center ${
        value.row.id % 2 === 0 ? 'even-inspection-part' : 'odd-inspection-part'
      }`}
      // isRequired={value.row.isAssigned}
      // message="Enter quantity plz"
    />
  );
};
export default DispatchQtyCell;

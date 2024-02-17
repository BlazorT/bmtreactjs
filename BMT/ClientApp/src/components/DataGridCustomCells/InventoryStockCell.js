import React, { useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import CustomInput from '../InputsComponent/CustomInput';
import { useShowToast } from 'src/hooks/useShowToast';

const InventoryStockCell = (prop) => {
  const { params, isEdit, setRowData, setSubmtiData, canUpdate } = prop;

  const showToast = useShowToast();

  const handleChange = (event) => {
    const enteredValue = event.target.value;
    const numberValue = Number(enteredValue);

    if (!isNaN(numberValue) && numberValue >= 0 && numberValue <= 999) {
      // Enforce constraints only if it's a valid number
      let validatedValue = enteredValue >= 0 && enteredValue <= 999 ? enteredValue : 0;

      if (
        params.field === 'stockOut' &&
        numberValue > params.row.availableStock - params.row.totalStock
      ) {
        showToast('Not enough available stock', 'warning');
        validatedValue =
          enteredValue >= 0 &&
          enteredValue <= 999 &&
          enteredValue <= params.row.availableStock - params.row.totalStock
            ? enteredValue
            : 0;
        // return;
      }

      setRowData((prevRowData) =>
        prevRowData.map((row) =>
          row.id === params.id ? { ...row, [params.field]: validatedValue } : row,
        ),
      );

      setSubmtiData((prevSubmitData) => {
        const existingIndex = prevSubmitData.findIndex((item) => item.id === params.id);

        if (existingIndex !== -1) {
          // Update existing row
          const updatedData = [...prevSubmitData];
          updatedData[existingIndex] = {
            ...prevSubmitData[existingIndex],
            [params.field]: validatedValue,
          };
          return updatedData;
        } else {
          // Add new row
          return [...prevSubmitData, { ...params.row, [params.field]: validatedValue }];
        }
      });
    }
  };

  return (
    <CustomInput
      value={params.row[params.field]}
      type="number"
      id={params.field}
      name={params.field}
      placeholder="Enter Stock"
      className={`form-control item lh-sm text-start w-100 ${
        params.row.id % 2 === 0 ? 'even-inspection-part' : 'odd-inspection-part'
      }`}
      // message="Enter remarks plz"
      width={'w-100'}
      disabled={!canUpdate}
      maxLength={20}
      onKeyDown={(e) => e.stopPropagation()}
      onChange={(e) => handleChange(e)}
    />
  );
};
export default InventoryStockCell;

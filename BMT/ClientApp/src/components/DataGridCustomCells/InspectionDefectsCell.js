/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import CustomInput from '../InputsComponent/CustomInput';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton } from '@mui/material';

const InspectionDefectsCell = ({ params, setRows }) => {
  const handledefectsName = (e) => {
    setRows((prev) => {
      const indexToUpdate = prev.findIndex((item) => item.id === params.row.id);

      if (indexToUpdate !== -1) {
        const updatedItem = { ...prev[indexToUpdate], remarks: e.target.value };
        const updatedRows = [...prev];
        updatedRows[indexToUpdate] = updatedItem;
        return updatedRows;
      }
    });
  };
  return (
    <React.Fragment>
      <CustomInput
        value={params.row.remarks}
        onChange={handledefectsName}
        type="text"
        id="productName"
        name="productName"
        placeholder="Enter Defects"
        isRequired={false}
        message="Enter defects and Accessories"
        className={params.row.index % 2 === 0 ? 'even-inspection-part' : 'odd-inspection-part'}
        width={params.row.found === 1 ? 'w-50' : 'w-100'}
        onKeyDown={(e) => e.stopPropagation()}
      />
      {params.row.found === 1 && (
        <React.Fragment>
          <input
            accept="image/*"
            className="d-none "
            id={`${params.id}`}
            onChange={(e) => {
              setRows((prev) => {
                const indexToUpdate = prev.findIndex((item) => item.id === params.row.id);

                if (indexToUpdate !== -1) {
                  const updatedItem = {
                    ...prev[indexToUpdate],
                    file: e.target.value.split('\\').pop(),
                  };
                  const updatedRows = [...prev];
                  updatedRows[indexToUpdate] = updatedItem;
                  return updatedRows;
                }
              });
            }}
            type="file"
          />
          <label htmlFor={`${params.id}`}>
            <IconButton
              color="success"
              component="span"
              className={
                params.row.index % 2 === 0 ? 'even-inspection-part' : 'odd-inspection-part'
              }
            >
              <AttachFileIcon />
            </IconButton>
            <span className="ps-1">{params.row.file}</span>
          </label>
        </React.Fragment>
        // <CustomInput
        //   type="file"
        //   id="licenceImageFront"
        //   name="licenceImageFront"
        //   placeholder="Licence copy upload"
        //   isRequired={false}
        //   className={params.row.index % 2 === 0 ? 'even-inspection-part' : 'odd-inspection-part'}
        //   width="w-50"
        //   title="Attach licence front side picture"
        //   message="enter valid email address"
        // />
      )}
    </React.Fragment>
  );
};
export default InspectionDefectsCell;

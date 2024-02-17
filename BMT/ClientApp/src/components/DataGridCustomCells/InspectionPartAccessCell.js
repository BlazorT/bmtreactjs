/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import CustomInput from '../InputsComponent/CustomInput';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';

const InspectionPartAccessCell = ({ params, setRows, rows }) => {
  const [parts, setparts] = useState(params.row.parts);
  const handlepartsName = (e) => {
    setparts(e.target.value);
    if (parts.length > 1) {
      setRows((prev) => {
        const indexToUpdate = prev.findIndex((item) => item.id === params.row.id);

        if (indexToUpdate !== -1) {
          const updatedItem = { ...prev[indexToUpdate], parts: e.target.value };
          const updatedRows = [...prev];
          updatedRows[indexToUpdate] = updatedItem;
          return updatedRows;
        }
      });
    }
  };
  return (
    <React.Fragment>
      {params.row.parts && (
        <CIcon
          icon={cilPlus}
          onClick={() =>
            setRows((prev) => {
              const newId = params.row.id + 1;

              // Create a new row with an updated ID
              const newRow = {
                id: newId,
                parts: 'Vehicle Part',
                defects: '',
              };

              // Update the IDs of the subsequent rows
              const updatedRows = prev.map((item) => {
                if (item.id > params.row.id) {
                  return { ...item, id: item.id + 1 };
                }
                return item;
              });

              // Insert the new row at the appropriate position
              const insertIndex = prev.findIndex((item) => item.id === params.row.id) + 1;
              updatedRows.splice(insertIndex, 0, newRow);

              return updatedRows;
            })
          }
        ></CIcon>
      )}
      <CustomInput
        value={parts}
        onChange={handlepartsName}
        type="text"
        id="productName"
        name="productName"
        placeholder="Enter Parts and Accessories"
        isRequired={false}
        message="Enter Parts and Accessories"
        className={params.id % 2 !== 0 ? 'even-inspection-part' : 'odd-inspection-part'}
        width="w-100"
        onKeyDown={(e) => e.stopPropagation()}
      />
    </React.Fragment>
  );
};
export default InspectionPartAccessCell;

/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import CustomInput from '../InputsComponent/CustomInput';
import { cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const InspectionGroupCell = ({ params, setRows, rows }) => {
  const [group, setGroup] = useState(params.row.group);
  const handleGroupName = (e) => {
    setGroup(e.target.value);
    if (group.length > 1) {
      setRows((prev) => {
        const indexToUpdate = prev.findIndex((item) => item.id === params.row.id);

        if (indexToUpdate !== -1) {
          const updatedItem = { ...prev[indexToUpdate], group: e.target.value };
          const updatedRows = [...prev];
          updatedRows[indexToUpdate] = updatedItem;
          return updatedRows;
        }

        // If the item with the specified id is not found, return the original array
        return prev;
      });
    }
  };
  return (
    <React.Fragment>
      {params.row.group && (
        <CIcon
          icon={cilPlus}
          onClick={() =>
            setRows((prev) => [
              ...prev,
              {
                id: rows.length + 1,
                group: 'Vehicle Side',
              },
              {
                id: rows.length + 2,
                parts: 'Vehicle Part',
                defects: '',
              },
            ])
          }
        ></CIcon>
      )}
      <CustomInput
        value={group}
        onChange={handleGroupName}
        type="text"
        id="group"
        name="group"
        placeholder="Vehicle Side"
        isRequired={true}
        message="enter product name"
        className="row-roles-group"
        width="w-100"
        onKeyDown={(e) => e.stopPropagation()}
      />
    </React.Fragment>
  );
};
export default InspectionGroupCell;

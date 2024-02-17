/* eslint-disable react/prop-types */
import { cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import React from 'react';

const InspectionActionCell = ({ params, setRows, rows }) => {
  const handleCheckRep = (e) => {
    setRows((prev) => {
      const indexToUpdate = prev.findIndex((item) => item.id === params.row.id);

      if (indexToUpdate !== -1) {
        const updatedItem = { ...prev[indexToUpdate], found: e.target.checked ? 1 : 0 };
        const updatedRows = [...prev];
        updatedRows[indexToUpdate] = updatedItem;
        return updatedRows;
      }
    });
  };
  return (
    <React.Fragment>
      {!params.row.group && (
        <label className="custom-checkbox">
          <input type="checkbox" checked={params.row.found === 1} onChange={handleCheckRep} />
          <span className="checkmark"></span>
        </label>
      )}
    </React.Fragment>
  );
};
export default InspectionActionCell;

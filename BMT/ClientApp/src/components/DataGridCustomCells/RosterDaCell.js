/* eslint-disable react/prop-types */
import React from 'react';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';

const RosterDaCell = ({ params, daList, setRows }) => {
  return (
    <CustomSelectInput
      value={params.row.associate}
      className={`${params.row.index % 2 === 0 ? 'even-inspection-part' : 'odd-inspection-part'}`}
      onChange={(e) => {
        setRows((prev) => {
          return prev.map((row) => {
            if (row.id === params.id) {
              return {
                ...row,
                associate: e.target.value,
              };
            }
            return row;
          });
        });
      }}
      options={daList}
      name="associate"
      width="w-100"
      id={params.id}
      disableOption="Select Associate"
    />
  );
};
export default RosterDaCell;

/* eslint-disable react/prop-types */
import React from 'react';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';

const RosterModelDaCell = ({ daList, rows, params, setRows }) => {
  //   const [list, setList] = React.useState(
  //     daList.filter((item) => params.row.rosteredDaid == item.id),
  //   );
  //
  return (
    <CustomSelectInput
      value={params.row.rosteredDaid}
      className={`${params.row.index % 2 === 0 ? 'even-inspection-part' : 'odd-inspection-part'}`}
      onChange={(e) => {
        // setList(daList.filter((item) => e.target.value == item.id));
        setRows((prev) => {
          return prev.map((row) => {
            if (row.id === params.id) {
              return {
                ...row,
                rosteredDaid: e.target.value,
                assign: e.target.value !== '' ? true : false,
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
export default RosterModelDaCell;

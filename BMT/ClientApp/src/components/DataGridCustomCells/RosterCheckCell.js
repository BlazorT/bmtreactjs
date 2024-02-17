/* eslint-disable react/prop-types */
import React from 'react';

const RosterCheckCell = ({ params }) => {
  return (
    <div className="w-100 h-100 d-flex justify-content-start align-items-center">
      <label className="custom-checkbox">
        <input
          type="checkbox"
          className={' mt-0'}
          //   disabled={disable}
          name={params.id}
          defaultChecked={true}
        />
        <span className="checkmark"></span>
      </label>
      <span className="ps-1">{params.row.transportId}</span>
    </div>
  );
};
export default RosterCheckCell;

import React from 'react';
import PropTypes from 'prop-types';

const VehicleCustomeCell = ({ value }) => {
  VehicleCustomeCell.propTypes = {
    value: PropTypes.any,
  };
  return (
    <div className="d-flex flex-column ">
      <p className="m-0 mb-1">{value.row.VehicleId}</p>
      <p className="m-0 text-dim">{value.row.Vehicle}</p>
      <p className="m-0 text-dim">VIN: {value.row.VIN}</p>
    </div>
  );
};
export default VehicleCustomeCell;

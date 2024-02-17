import React from 'react';
import PropTypes from 'prop-types';

function CategoryCustomeCell({ value }) {
  CategoryCustomeCell.propTypes = {
    value: PropTypes.any,
  };
  return (
    <div className="d-flex flex-column ">
      <p className="m-0 mb-2">{value.row.Category}</p>
      <p className="m-0 text-dim">{value.row.Description}</p>
    </div>
  );
}

export default CategoryCustomeCell;

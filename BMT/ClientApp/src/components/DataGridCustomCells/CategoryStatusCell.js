import React from 'react';
import PropTypes from 'prop-types';

function CategoryStatusCell({ value }) {
  CategoryStatusCell.propTypes = {
    value: PropTypes.any,
  };
  return (
    <div className="d-flex justify-content-start align-items-center">
      <div
        className={
          value.row.Status === 'Due Now'
            ? 'bg-warning grid-cell-status-circle'
            : 'bg-success grid-cell-status-circle'
        }
      />
      <p className="m-0 ps-1">{value.row.Status}</p>
    </div>
  );
}

export default CategoryStatusCell;

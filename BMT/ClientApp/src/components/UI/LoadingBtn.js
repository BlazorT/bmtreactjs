/* eslint-disable react/prop-types */
import React from 'react';

const LoadingBtn = ({ title, className }) => {
  return (
    <button
      className={`${className} btn_Default sales-btn-style w-auto ps-3 pe-3`}
      type="button"
      disabled
    >
      <span
        className="spinner-border spinner-border-sm me-2 "
        role="status"
        aria-hidden="true"
      ></span>
      {title}
    </button>
  );
};
export default LoadingBtn;

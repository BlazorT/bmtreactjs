/* eslint-disable react/prop-types */
import React from 'react';

const Form = ({ name, onSubmit, children }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };
  return (
    <form className={`needs-validation ${name}`} onSubmit={handleSubmit} noValidate>
      {children}
    </form>
  );
};
export default Form;

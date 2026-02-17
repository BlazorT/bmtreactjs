/* eslint-disable react/react-in-jsx-scope */
// src/components/InputsComponent/CustomMultiSelect.jsx
import React from 'react';
import PropTypes from 'prop-types';          // ← ADD THIS LINE
import Select from 'react-select';
import CIcon from '@coreui/icons-react';     // Required for icons

const CustomMultiSelect = ({
  label,
  value,
  onChange,
  options,
  icon,
  id,
  name,
  placeholder = 'Select...',
  className = '',
  title,
  isDisabled = false,
  ...rest
}) => {
  const selected = Array.isArray(value)
    ? options.filter((opt) => value.includes(opt.value))
    : [];

  const handleChange = (selectedOptions) => {
    const newValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    onChange({ target: { name, value: newValues } });
  };

  return (
    <div className={className} title={title}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="input-group">
        {icon && (
          <span className="input-group-text">
            <CIcon icon={icon} />
          </span>
        )}
        <Select
          isMulti
          name={name}
          inputId={id}
          options={options}
          value={selected}
          onChange={handleChange}
          placeholder={placeholder}
          className="basic-multi-select flex-grow-1"
          classNamePrefix="select"
          isDisabled={isDisabled}
          {...rest}
        />
      </div>
    </div>
  );
};

// ADD PROP TYPES VALIDATION HERE
CustomMultiSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  icon: PropTypes.object, // CoreUI icon object
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  isDisabled: PropTypes.bool,
  // ...rest can include any other react-select props
};

CustomMultiSelect.defaultProps = {
  placeholder: 'Select...',
  className: '',
  isDisabled: false,
};

export default CustomMultiSelect;

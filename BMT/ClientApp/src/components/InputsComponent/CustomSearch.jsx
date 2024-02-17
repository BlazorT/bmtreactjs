import React from 'react';
import { TextField } from '@material-ui/core';

import { Autocomplete } from '@mui/material';
import CIcon from '@coreui/icons-react';

const CustomSearch = (prop) => {
  const {
    data,
    id,
    label,
    isRequired,
    icon,
    onChange,
    message,
    name,
    value,
    title,
    placeholder,
    disabled,
    className,
    textAlign,
    getOptionLabel,
  } = prop;

  const hashUserId = (userId) =>
    `ID # ${'*'.repeat(Math.max(0, userId.toString().length - 6))}${userId.toString().slice(-6)}`;

  return (
    <Autocomplete
      disableClearable
      className={`search-bar-product ${className}`}
      options={data}
      getOptionLabel={(option) => {
        return getOptionLabel
          ? getOptionLabel(option)
          : name === 'driverName'
          ? `${option.firstName} ${option.lastName}`
          : name === 'dispatchDa'
          ? `${option.firstName.toUpperCase()} ${option.lastName.toUpperCase()}, ${option.issuingstate.toUpperCase()} ${hashUserId(
              option.userId,
              )}`
              : name === 'vehicleName'
                ? `${option.name}, ${option.numberPlate}`
          : name === 'fieldName'
          ? `${option.columnName}, ${option.tableName}`
          : `${option.name || option.productName}, ${option.shortCode || option.shortcode}`;
      }}
      // getOptionSelected={(option, value) => option.id === value} // specify the ID comparison
      isOptionEqualToValue={(option, value) => option.id === value.id || value === ''} // specify the ID comparison
      onChange={(e, value) => {
        onChange(value, name);
      }}
      value={value === '' ? null : value}
      noOptionsText="No Result Found"
      autoFocus
      renderInput={(params) => (
        <div ref={params.InputProps.ref} className="form-outline text-start mt-2">
          <label htmlFor={id} className="login_label labelName ">
            {label}
          </label>
          <div className="form-outline text-start">
            <div className="input-group position-relative">
              {icon && (
                <span className="input-group-addon" title={title }>
                  <CIcon
                    className={isRequired ? 'mandatory-control' : 'stock-toggle-icon '}
                    icon={icon}
                  ></CIcon>
                </span>
              )}
              <input
                {...params.inputProps}
                // autoFocus
                type={'text'}
                className={`form-control item text-${textAlign}`}
                id={id}
                name={name}
                placeholder={placeholder}
                required={isRequired}
                disabled={disabled}
              />
              {isRequired && <div className="invalid-tooltip">{message}</div>}
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default CustomSearch;

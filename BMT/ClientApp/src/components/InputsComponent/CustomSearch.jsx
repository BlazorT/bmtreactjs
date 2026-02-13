import React from 'react';
import Select from 'react-select';
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
    textAlign,
    getOptionLabel,
  } = prop;

  const hashUserId = (userId) =>
    `ID # ${'*'.repeat(Math.max(0, userId.toString().length - 6))}${userId.toString().slice(-6)}`;

  // Custom styles for react-select to align with CoreUI
  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #d8dbe0',
      borderRadius: '0.25rem',
      backgroundColor: disabled ? '#e9ecef' : '#0a1a2c',
      textAlign: textAlign || 'left',
      fontSize: '1rem',
      lineHeight: '1.5',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#8a93a2',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      backgroundColor: '#0a1a2c',
      border: '1px solid #d8dbe0',
      borderRadius: '0.25rem',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#321fdb' : state.isFocused ? '#0e4979' : '#0a1a2c',
      color: state.isSelected ? '#fff' : '#fff',
      '&:hover': {
        backgroundColor: '#0e4979',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#ffffff',
    }),
    input: (provided) => ({
      ...provided,
      color: '#ffffff',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#adb5bd',
    }),
  };

  return (
    <div className="form-outline text-start mt-2">
      <label htmlFor={id} className="login_label labelName">
        {label}
      </label>
      <div className="form-outline text-start">
        <div className="input-group position-relative">
          {icon && (
            <span className="input-group-addon" title={title}>
              <CIcon
                className={isRequired ? 'mandatory-control' : 'stock-toggle-icon'}
                icon={icon}
              />
            </span>
          )}
          <Select
            options={data}
            getOptionLabel={(option) =>
              getOptionLabel
                ? getOptionLabel(option)
                : name === 'driverName'
                  ? `${option.firstName} ${option.lastName}`
                  : name === 'dispatchDa'
                    ? `${option.firstName.toUpperCase()} ${option.lastName.toUpperCase()}, ${option.issuingstate.toUpperCase()} ${hashUserId(option.userId)}`
                    : name === 'vehicleName'
                      ? `${option.name}, ${option.numberPlate}`
                      : name === 'name'
                        ? `${option.name}`
                        : name === 'fieldName'
                          ? `${option.columnName}, ${option.tableName}`
                          : `${option.name || option.productName}, ${option.shortCode || option.shortcode}`
            }
            getOptionValue={(option) => option.id}
            onChange={(selectedOption) => onChange(selectedOption, name)}
            value={value === '' ? null : value}
            placeholder={placeholder}
            isDisabled={disabled}
            isClearable={false}
            styles={customStyles}
            noOptionsMessage={() => 'No Result Found'}
            autoFocus
            classNames={'react-select-container'}
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {isRequired && <div className="invalid-tooltip">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default CustomSearch;

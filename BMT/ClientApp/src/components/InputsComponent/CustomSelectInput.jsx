import CIcon from '@coreui/icons-react';
import React from 'react';
import { formatDate } from 'src/helpers/formatDate';

const CustomSelectInput = (prop) => {
  const {
    icon,
    id,
    name,
    isRequired,
    disabled,
    className,
    options,
    title,
    onChange,
    message,
    label,
    value,
    disableOption,
    width,
    optionsList,
    showDisableOption = true,
    multiple = false,
  } = prop;

  // Normalize value to array of strings for multi, string for single
  const selectValue = multiple
    ? (Array.isArray(value) ? value.map(String) : [])   // ← .map(String) important!
    : String(value ?? '');

  const handleChange = (e) => {
    if (multiple) {
      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
      console.log('Multi-select selected:', selected); // ← debug
      onChange({
        target: {
          name,
          value: selected,              // already strings
        },
      });
    } else {
      onChange(e);
    }
  };

  return (
    <div className={`form-outline text-start ${icon ? 'mt-2' : width ? width : 'w-75'}`}>
      {label && (
        <label htmlFor={id} className="login_label labelName">
          {label}
        </label>
      )}
      <div className="form-outline text-start">
        <div className={`position-relative ${icon ? 'input-group' : ''}`}>
          {icon && (
            <span className="input-group-addon" title={title}>
              <CIcon
                className={isRequired ? 'mandatory-control' : 'stock-toggle-icon '}
                icon={icon}
              />
            </span>
          )}
          <select
            id={id}
            className={`${className} form-control position-relative p-2 ${disabled ? 'text-dim ' : ''}`}
            onChange={handleChange}
            name={name}
            required={isRequired}
            value={selectValue}
            disabled={disabled}
            multiple={multiple}
            size={multiple ? 6 : undefined}
          >
            {!multiple && showDisableOption && (
              <option className="text-dim" value="">
                {disableOption || 'Please select an option'}
              </option>
            )}

            {Array.isArray(options) &&
              options.map((option, index) => {
                const optValue = String(option.id ?? index); // ← force string!
                const optLabel =
                  optionsList
                    ? optionsList(option)
                    : name === 'productName'
                      ? `${option.name} ,${option.shortCode}`
                      : name.includes('driverName') || name.includes('assistantDriver') || name.includes('associate') || name.includes('createdBy') || name === 'dispatchAssign'
                        ? `${option.firstName || ''} ${option.lastName || ''}`
                        : name === 'currRosterId'
                          ? `${index + 1}. From ${formatDate(option.rosterDate)} To ${formatDate(option.rosterEndDate)}`
                          : option.name || option.label || 'Unnamed';

                return (
                  <React.Fragment key={optValue}>
                    <option value={optValue}>{optLabel}</option>
                    {/* You probably don't need <optgroup> after every option – remove if not intentional */}
                    {/* <optgroup className="option-border"></optgroup> */}
                  </React.Fragment>
                );
              })}
          </select>

          {isRequired && <span className="invalid-tooltip">{message}</span>}
        </div>
      </div>
    </div>
  );
};

export default CustomSelectInput;

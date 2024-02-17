import React from 'react';
import CIcon from '@coreui/icons-react';
import Select from 'react-select';
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
    onClick,
    width,
    optionsList,
  } = prop;
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
              ></CIcon>
            </span>
          )}
          <select
            id={id}
            className={`${className} form-control position-relative p-2 ${
              disabled ? 'text-dim ' : ''
            }`}
            onChange={(e) => onChange(e)}
            name={name}
            required={isRequired}
            value={value}
            disabled={disabled}
            // autoFocus
          >
            <option className="text-dim" value="">
              {disableOption ? disableOption : 'Please select an option'}
            </option>
            <optgroup className="option-border"></optgroup>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                {/* <optgroup className="padding-options"></optgroup> */}
                <option value={option.id ? option.id : index}>
                  {optionsList
                    ? optionsList(option)
                    : name === 'productName'
                    ? option.name + ' ,' + option.shortCode
                    : name === 'dispatchAssign' ||
                      name === 'driverName' ||
                      name == 'assistantDriver' ||
                      name == 'associate' ||
                      name == 'createdBy'
                    ? option.firstName + ' ' + option.lastName
                    : name === 'currRosterId'
                    ? index +
                      1 +
                      '. ' +
                      ' From ' +
                      formatDate(option.rosterDate) +
                      ' To ' +
                      formatDate(option.rosterEndDate)
                    : option.name}
                </option>
                {/* <optgroup className="padding-options"></optgroup> */}
                <optgroup className="option-border"></optgroup>
              </React.Fragment>
            ))}
          </select>
          {isRequired && <span className="invalid-tooltip">{message}</span>}
        </div>
      </div>
    </div>
  );
};
export default CustomSelectInput;

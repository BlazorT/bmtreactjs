/* eslint-disable react/prop-types */
import React from 'react';
import CIcon from '@coreui/icons-react';

const CustomInput = ({
  icon,
  type,
  label,
  title,
  id,
  name,
  placeholder,
  value,
  isRequired,
  disabled,
  onChange,
  className,
  onClick,
  readOnly,
  message,
  pattern,
  maxLength,
  defaultValue,
  inputRef,
  width,
  onKeyDown,
  autoFocus,
  onBlur,
  accept,
}) => {
  return (
    <div
      className={`form-outline text-start ${label ? 'mt-2' : icon ? '' : width ? width : 'w-30'} `}
    >
      {label && (
        <label htmlFor={id} className="login_label labelName ">
          {label}
        </label>
      )}
      <div className="form-outline text-start">
        <div className={`${label ? 'input-group' : ''}  position-relative`}>
          {icon && (
            <span className="input-group-addon" title={title}>
              <CIcon
                className={isRequired ? 'mandatory-control' : 'stock-toggle-icon '}
                icon={icon}
              ></CIcon>
            </span>
          )}
          <input
            ref={inputRef ?? undefined}
            type={type}
            className={`${className} form-control item`}
            id={id}
            name={name}
            value={value ?? ""}
            placeholder={placeholder}
            required={isRequired}
            disabled={!!disabled}
            autoComplete="off"
            onChange={(e) => onChange?.(e)}
            autoFocus={!!autoFocus}
            onClick={() => onClick?.()}
            accept={accept}
            readOnly={!!readOnly}
            pattern={pattern}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            defaultValue={defaultValue}
            onBlur={onBlur}
          />

          {isRequired && <span className="invalid-tooltip">{message}</span>}
        </div>
      </div>
    </div>
  );
};
export default CustomInput;

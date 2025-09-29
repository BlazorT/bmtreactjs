/* eslint-disable react/prop-types */
import React from 'react';
import CIcon from '@coreui/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
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
  helperText,
  minLength,
  src,
  onPaste,
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
            value={value ?? ''}
            placeholder={placeholder}
            required={isRequired}
            disabled={!!disabled}
            autoComplete="new-password"
            onChange={(e) => onChange?.(e)}
            autoFocus={!!autoFocus}
            onClick={() => onClick?.()}
            accept={accept}
            readOnly={!!readOnly}
            pattern={pattern}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            maxLength={maxLength}
            defaultValue={defaultValue}
            onBlur={onBlur}
          />

          {isRequired && <span className="invalid-tooltip">{message}</span>}

          {type === 'file' && (
            <div className="form-control row me-0 ">
              <div className="col-8 text-truncate ps-0 ">{helperText}</div>
            </div>
          )}
          {type === 'file' && src && src !== '' && src !== 'pdf' && (
            <img src={`${src}`} className="input-file-image-preview" />
          )}
          {type === 'file' && src && src !== '' && src == 'pdf' && (
            <FontAwesomeIcon icon={faFilePdf} size="lg" className="input-file-image-preview" />
          )}
        </div>
      </div>
    </div>
  );
};
export default CustomInput;

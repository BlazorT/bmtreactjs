/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import CIcon from '@coreui/icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { cilLockLocked } from '@coreui/icons';
import { faFileWord } from '@fortawesome/free-solid-svg-icons';

const getFileCategory = (src) => {
  if (typeof src !== 'string') return null;
  if (src?.includes('pdf-placeholder')) return 'pdf';
  if (src.startsWith('data:')) {
    // BASE64
    const mime = src.slice(5, src.indexOf(';')); // image/png, application/pdf
    if (mime === 'application/pdf') return 'pdf';
    if (mime.includes('image/')) return 'image';
    if (mime.includes('word')) return 'word';
    return 'unknown';
  }

  // FILE NAME / URL
  const ext = src.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
  if (['xlxs', 'csv', 'xlx'].includes(ext)) return 'excel';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'doc' || ext === 'docx') return 'word';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image';

  return 'unknown';
};

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
  onIconClick,
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
  labelClass,
  labelNote,
  mfa,
  onMfaClick,
  containerClass,
}) => {
  const [fileError, setFileError] = useState('');
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(e);
    }
  };

  // Drag and drop handlers for file input only
  const handleDragEnter = (e) => {
    if (type !== 'file' || disabled || readOnly) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    if (type !== 'file' || disabled || readOnly) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    if (type !== 'file' || disabled || readOnly) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    if (type !== 'file' || disabled || readOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    console.log({ files });
    if (files && files.length > 0) {
      // Create a synthetic event to pass to handleFileChange
      const syntheticEvent = {
        target: {
          files: files,
          type,
          name: name,
          id: id,
        },
      };
      handleFileChange(syntheticEvent);

      // Also update the actual input element if ref exists
      if (inputRef && inputRef.current) {
        const dataTransfer = new DataTransfer();
        Array.from(files).forEach((file) => dataTransfer.items.add(file));
        inputRef.current.files = dataTransfer.files;
      }
    }
  };

  const ext = src?.split('.').pop()?.toLowerCase();

  return (
    <div
      className={`form-outline text-start ${label ? 'mt-2' : icon ? '' : width ? width : 'w-30'} ${containerClass || ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {label && (
        <label htmlFor={id} className={`login_label labelName mb-2 ${labelClass}`}>
          {label} {labelNote && <span className="label-note-warning">{labelNote}</span>}
        </label>
      )}

      <div className={`${label ? 'input-group' : ''} position-relative d-flex`}>
        {icon && (
          <span
            className="input-group-addon pointer"
            title={title || label || ''}
            onClick={() => onIconClick && onIconClick()}
          >
            <CIcon
              className={isRequired ? 'mandatory-control' : 'stock-toggle-icon '}
              icon={icon}
              size="lg"
            />
          </span>
        )}

        <input
          ref={inputRef ?? inputRef}
          type={type}
          className={`${className} ${helperText ? 'w-10 ' : ''} form-control item`}
          id={id}
          name={name}
          value={type === 'file' ? undefined : (value ?? '')}
          placeholder={placeholder}
          required={isRequired && type !== 'file'}
          disabled={disabled || false}
          autoComplete="new-password"
          onChange={type === 'file' ? handleFileChange : (e) => onChange && onChange(e)}
          autoFocus={autoFocus ?? false}
          onClick={() => onClick && onClick()}
          minLength={minLength}
          accept={accept}
          readOnly={readOnly || false}
          pattern={pattern}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          defaultValue={defaultValue}
          onBlur={onBlur}
        />

        {mfa && (
          <span
            className="input-group-addon-mfa pointer"
            onClick={() => onMfaClick && onMfaClick()}
            title="Two Factor Authentication"
          >
            <CIcon className={'stock-toggle-icon'} icon={cilLockLocked} />
          </span>
        )}
        {/* Inline error for text inputs */}
        {isRequired && type !== 'file' && <span className="invalid-tooltip">{message}</span>}

        {/* Inline error for file inputs */}
        {/* File preview */}
        {type === 'file' && helperText && (
          <div className="form-control item row me-0 helper-src">
            <div className="text-truncate helper-text">{helperText}</div>
          </div>
        )}

        {/* Image Preview */}
        {type === 'file' &&
          (() => {
            const fileType = getFileCategory(src);
            if (!fileType) return null;

            if (fileType === 'excel') {
              return (
                <FontAwesomeIcon
                  icon={faFileExcel}
                  size="lg"
                  className="input-file-image-preview"
                />
              );
            }

            if (fileType === 'pdf') {
              return (
                <FontAwesomeIcon icon={faFilePdf} size="lg" className="input-file-image-preview" />
              );
            }

            if (fileType === 'word') {
              return (
                <FontAwesomeIcon icon={faFileWord} size="lg" className="input-file-image-preview" />
              );
            }

            if (fileType === 'video') {
              return (
                <video
                  className="input-file-image-preview"
                  controls
                  src={src}
                  width="150"
                  height="100"
                >
                  Your browser does not support the video tag.
                </video>
              );
            }

            // IMAGE (base64 or filename/url)
            return <img src={src} className="input-file-image-preview" alt="preview" />;
          })()}
      </div>
    </div>
  );
};

export default CustomInput;

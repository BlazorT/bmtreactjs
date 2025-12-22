/* eslint-disable react/prop-types */
import React from 'react';
import { CFormLabel } from '@coreui/react';
import CustomInput from '../InputsComponent/CustomInput';
import { cilUser } from '@coreui/icons';

const HashtagInput = ({
  label,
  value = [],
  onChange,
  placeholder = 'Enter hashtag and press Enter or comma',
  name,
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleAddTag = (tag) => {
    if (!tag.trim()) return;

    // Remove # if user included it, and trim whitespace
    let cleanTag = tag.trim().replace(/^#+/, '');

    // Don't add duplicates
    if (value.includes(cleanTag)) {
      return;
    }

    // Call parent onChange with updated array
    const event = {
      target: {
        name: name,
        value: [...value, cleanTag],
      },
    };
    onChange(event);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    // Handle Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(inputValue);
    }
    // Handle Backspace to remove last tag when input is empty
    else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      e.preventDefault();
      const event = {
        target: {
          name: name,
          value: value.slice(0, -1),
        },
      };
      onChange(event);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;

    // Check if comma was entered
    if (newValue.includes(',')) {
      // Split by comma and add all non-empty tags
      const tags = newValue.split(',').filter((t) => t.trim());
      tags.forEach((tag) => handleAddTag(tag));
      setInputValue('');
      return;
    }

    setInputValue(newValue);
  };

  const handleRemoveTag = (indexToRemove) => {
    const event = {
      target: {
        name: name,
        value: value.filter((_, i) => i !== indexToRemove),
      },
    };
    onChange(event);
  };

  return (
    <div className="item">
      <CustomInput
        label={label}
        icon={cilUser}
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {/* Display hashtags as chips */}
      {value.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {value.map((tag, index) => (
            <span
              key={index}
              className="badge d-inline-flex align-items-center gap-1"
              style={{
                backgroundColor: '#1b486d',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '0',
                  marginLeft: '4px',
                  fontSize: '16px',
                  lineHeight: '1',
                  fontWeight: 'bold',
                }}
                aria-label="Remove hashtag"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default HashtagInput;

/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { CPopover } from '@coreui/react';

const ImportedContactDropdown = ({ networkKey, importedData, setImportedData }) => {
  const [visible, setVisible] = useState(false);
  const items = importedData[networkKey] || [];

  const handleDeleteAll = () => {
    setImportedData((prev) => ({
      ...prev,
      [networkKey]: [],
    }));
    setVisible(false);
  };

  if (!items.length) return null;

  const popoverContent = (
    <div
      style={{
        backgroundColor: '#002b5b',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        width: '280px',
        maxHeight: '560px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Scrollable List */}
      <div
        style={{
          maxHeight: '500px', // same height as before
          overflowY: 'auto',
          border: '1px solid #1c4b82',
          borderRadius: '4px',
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '6px 10px',
              borderBottom: '1px solid #1c4b82',
              backgroundColor: index % 2 === 0 ? '#003366' : '#002b5b',
            }}
          >
            <strong>{index + 1}:</strong> {item}
          </div>
        ))}
      </div>

      {/* Delete All Button */}
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <button
          onClick={handleDeleteAll}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Delete All
        </button>
      </div>
    </div>
  );

  return (
    <CPopover
      content={popoverContent}
      visible={visible}
      onShow={() => setVisible(true)}
      onHide={() => setVisible(false)}
      placement="bottom"
      trigger="click"
    >
      <li>
        <button
          onClick={() => setVisible(!visible)}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '6px 10px',
            cursor: 'pointer',
          }}
        >
          Imported ({items.length})
        </button>
      </li>
    </CPopover>
  );
};

export default ImportedContactDropdown;

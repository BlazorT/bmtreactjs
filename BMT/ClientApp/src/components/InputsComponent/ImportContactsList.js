import React, { useState } from "react";
import { CPopover } from "@coreui/react";
//import "bootstrap/dist/css/bootstrap.min.css"; // CoreUI requires Bootstrap CSS

const ImportedContactDropdown = (prop) => {
  const { networkKey, importedData, setImportedData } = prop;
  const [visible, setVisible] = useState(false);
  const items = importedData[networkKey] || [];

  const handleDeleteAll = () => {
    setImportedData(prev => ({
      ...prev,
      [networkKey]: []
    }));
    setVisible(false);
  };

  if (!items.length) return null;

  const popoverContent = (
    <div
      style={{
        backgroundColor: "#002b5b",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        width: "260px",
        maxHeight: "240px",
        overflowY: "auto"
      }}
    >
      {/* List Items */}
      <ul style={{ padding: 0, margin: 0 }}>
        {items.map((item, idx) => (
          <li
            key={idx}
            style={{
              listStyle: "none",
              padding: "6px 0",
              borderBottom: "1px solid #1c4b82"
            }}
          >
            <strong>{idx + 1}:</strong> {item}
          </li>
        ))}
      </ul>

      {/* Delete All Button */}
      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <button
          onClick={handleDeleteAll}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer"
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
      <button
        onClick={() => setVisible(!visible)}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "6px 10px",
          cursor: "pointer"
        }}
      >
        Imported ({items.length})
      </button>
    </CPopover>
  );
};

export default ImportedContactDropdown;

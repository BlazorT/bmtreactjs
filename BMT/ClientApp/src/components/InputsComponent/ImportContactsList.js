import { useState } from "react";

const ImportedContactDropdown = ({ networkKey, importedData, setImportedData }) => {
  const [showList, setShowList] = useState(false);

  const items = importedData[networkKey] || [];

  const handleDeleteAll = () => {
    setImportedData(prev => ({
      ...prev,
      [networkKey]: []
    }));
    setShowList(false);
  };

  if (!items.length) return null; // Don't show anything if no contacts

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Toggle Button */}
      <button
        onClick={() => setShowList(!showList)}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "6px 10px",
          position: "relative"
        }}
      >
        Imported ({items.length})
      </button>

      {/* Dropdown List */}
      {showList && (
        <ul
          className="imported-dropdown"
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            zIndex: 999,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            width: "200px",
            maxHeight: "200px",
            overflowY: "auto",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
          }}
        >
          {items.map((item, idx) => (
            <li
              key={idx}
              style={{
                listStyleType: "none",
                padding: "5px 0",
                borderBottom: "1px solid #eee"
              }}
            >
              <strong>{idx + 1}:</strong> {item}
            </li>
          ))}
          {/* Delete All Button */}
          <li style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              onClick={handleDeleteAll}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Delete All
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
export default ImportedContactDropdown;

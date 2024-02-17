/* eslint-disable react/prop-types */
import React from 'react';
import globalutil from 'src/util/globalutil';

function AddRuleButton({ prop, entity, setEntity, entities }) {
  return (
    <div className="d-flex flex-grow-1 p-0 gap-2">
      <button className="m-0 p-2" onClick={(e) => prop.handleOnClick(e)}>
        Add Rule
      </button>
      <select value={entity} className="rule-fields" onChange={(e) => setEntity(e.target.value)}>
        {entities.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
export default AddRuleButton;

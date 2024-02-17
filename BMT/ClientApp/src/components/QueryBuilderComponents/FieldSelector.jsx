/* eslint-disable react/prop-types */
import React, { useState } from 'react';

function FieldSelector({ prop, entity }) {
  return (
    <select
      value={prop.value}
      className="rule-fields"
      onChange={(e) => prop.handleOnChange(e.target.value)}
    >
      {prop.options
        // .filter((item) => item.entityId == entity)
        .map((field) => (
          <option key={field.id} value={field.name}>
            {field.name}
          </option>
        ))}
    </select>
  );
}
export default FieldSelector;

import React from 'react';
import { CCol, CRow } from '@coreui/react';

function CustomCombinator(prop) {
  const min = Math.pow(10, 4 - 1);
  const max = Math.pow(10, 4) - 1;
  const id = Math.floor(Math.random() * (max - min + 1)) + min;
  return (
    <div className="d-flex w-100 justify-content-center mt-1 mb-1">
      <CRow className="combinator-container">
        {prop.prop.options?.map((combinator, index) => (
          <CCol key={combinator.name} className="d-flex justify-content-center align-items-center ">
            <input
              id={prop.prop.level}
              type="radio"
              name={`combinator-${prop.prop.level}-${id}`}
              value={combinator.name}
              checked={prop.prop.value === combinator.name}
              onChange={() => prop.prop.handleOnChange(combinator.name)}
            />
            <label className="m-0">
              {combinator.label}
              <span>{combinator.label === 'AND' ? ' ( & )' : ' ( | )'}</span>
            </label>
          </CCol>
        ))}
      </CRow>
    </div>
  );
}
export default CustomCombinator;

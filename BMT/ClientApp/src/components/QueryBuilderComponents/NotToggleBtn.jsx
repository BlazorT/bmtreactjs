import React from 'react';

function NotToggleBtn(prop) {
  return (
    <>
      <input
        id={prop.prop.level}
        className="custom-checkbox"
        type="checkbox"
        name={`nottoggle-${prop.prop.level}`}
        value={prop.prop.name}
        checked={prop.prop.checked}
        onChange={(e) => prop.prop.handleOnChange(e.target.checked)}
      />
      <label className="m-0">Is Not</label>
    </>
  );
}
export default NotToggleBtn;

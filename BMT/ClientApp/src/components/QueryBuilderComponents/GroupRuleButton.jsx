/* eslint-disable react/prop-types */
import React from 'react';

function GroupRuleButton({ prop }) {
  return (
    <button className="m-0 p-2" onClick={(e) => prop.handleOnClick(e)}>
      Add Group
    </button>
  );
}
export default GroupRuleButton;

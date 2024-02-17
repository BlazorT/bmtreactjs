import React from 'react';

const RolesCheckBox = (prop) => {
  const {
    name,
    handleRoleChange,
    value,
    rolesSetting,
    handleParentAllRightsChange,
    className,
    disable,
  } = prop;

  const getCheckboxState = (parentName, pageName, right) => {
    const parent = rolesSetting.find((parent) => parent.parent === parentName);

    if (!parent) return false;

    if (right === 'parentAllRights') return parent?.parentAllRights || false;

    const child = parent.childs.find((child) => child.page === pageName);

    if (child && right === 'allRights') return child.allRights || false;

    if (child && right !== 'allRights') return child.privileges[right] || false;

    return false;
  };

  return (
    <div className="w-100 h-100 d-flex justify-content-start align-items-center">
      <label className="custom-checkbox">
        <input
          type="checkbox"
          disabled={disable}
          className={className ? className : name === 'allRights' ? ' mt-0' : ' mt-0 me-5'}
          name={name}
          checked={getCheckboxState(
            name === 'parentAllRights' ? value.row.group : value.row.select,
            name === 'parentAllRights' ? '' : value.row.screen,
            name,
          )}
          onChange={(e) =>
            name == 'parentAllRights'
              ? handleParentAllRightsChange(value.row.group, e.target.checked)
              : handleRoleChange(value.row.select, value.row.screen, name, e.target.checked)
          }
        />
        <span className="checkmark"></span>
      </label>
    </div>
  );
};
export default RolesCheckBox;

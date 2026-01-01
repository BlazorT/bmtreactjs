import React, { useState } from 'react';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import RolesCheckBox from '../DataGridCustomCells/RolesCheckBox';

import { organizeData } from 'src/helpers/organize_menus';

const DARoles = (prop) => {
  const { handleRoleChange, rolesSetting, handleParentAllRightsChange, rolesData, canUpdate } =
    prop;

  const sortedData = rolesData !== undefined ? rolesData.sort((a, b) => a.id - b.id) : [];
  const menus = organizeData(sortedData);
  console.table('sortedData', sortedData);
  console.log('menus', menus);
  const [rolesRow, setRolesRow] = useState(() =>
    menus.flatMap((parent) => [
      {
        group: parent.name,
        screen: '',
      },
      ...(parent.children.length > 0
        ? parent.children.map((child) => ({
            group: '',
            screen: child.name,
            select: parent.name,
          }))
        : [{ group: '', screen: 'Dashboard', select: 'Dashboard' }]),
    ]),
  );
  console.log('rolesRow', rolesRow);
  const roles_grid_cols = [
    {
      key: 'group',
      name: 'Group',
      headerCellClass: 'custom-header-data-grid',
      width: 130,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.group !== '' && (
          <div className="d-flex justify-content-start align-items-center w-auto h-100">
            <RolesCheckBox
              name="parentAllRights"
              rolesSetting={rolesSetting}
              handleRoleChange={handleRoleChange}
              handleParentAllRightsChange={handleParentAllRightsChange}
              value={params}
              className="me-2 mt-0 checkbox"
              disable={canUpdate === 0}
            />
            <p className="roles-group-title">{params.row.group}</p>
          </div>
        ),
    },
    {
      key: 'select',
      name: 'Full',
      headerCellClass: 'custom-header-data-grid',
      width: 40,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.group === '' && (
          <RolesCheckBox
            name="allRights"
            rolesSetting={rolesSetting}
            handleRoleChange={handleRoleChange}
            value={params}
            disable={canUpdate === 0}
          />
        ),
    },
    {
      key: 'screen',
      name: 'Screen / Right',
      // headerCellClass: 'custom-header-data-grid',
      width: 180,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      key: 'view',
      name: 'View',
      headerCellClass: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.group === '' && (
          <RolesCheckBox
            name="view"
            rolesSetting={rolesSetting}
            handleRoleChange={handleRoleChange}
            value={params}
            disable={canUpdate === 0}
          />
        ),
    },
    {
      key: 'add',
      name: 'Add',
      headerCellClass: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.group === '' && (
          <RolesCheckBox
            name="add"
            rolesSetting={rolesSetting}
            handleRoleChange={handleRoleChange}
            value={params}
            disable={canUpdate === 0}
          />
        ),
    },
    {
      key: 'edit',
      name: 'Edit',
      headerCellClass: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.group === '' && (
          <RolesCheckBox
            name="edit"
            rolesSetting={rolesSetting}
            handleRoleChange={handleRoleChange}
            value={params}
            disable={canUpdate === 0}
          />
        ),
    },
    {
      key: 'delete',
      name: 'Delete',
      headerCellClass: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.group === '' && (
          <RolesCheckBox
            name="delete"
            rolesSetting={rolesSetting}
            handleRoleChange={handleRoleChange}
            value={params}
            disable={canUpdate === 0}
          />
        ),
    },
    {
      key: 'print',
      name: 'Print',
      headerCellClass: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.group === '' && (
          <RolesCheckBox
            name="print"
            rolesSetting={rolesSetting}
            handleRoleChange={handleRoleChange}
            value={params}
            disable={canUpdate === 0}
          />
        ),
    },
    {
      key: 'export',
      name: 'Export',
      headerCellClass: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.group === '' && (
          <RolesCheckBox
            name="export"
            rolesSetting={rolesSetting}
            handleRoleChange={handleRoleChange}
            value={params}
            disable={canUpdate === 0}
          />
        ),
    },
  ];

  return (
    <CustomDatagrid
      rows={rolesRow}
      columns={roles_grid_cols}
      pagination={false}
      rowHeight={50}
      rowSelection={false}
    />
  );
};
export default DARoles;

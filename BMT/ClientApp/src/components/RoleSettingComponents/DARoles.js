import React, { useState } from 'react';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import RolesCheckBox from '../DataGridCustomCells/RolesCheckBox';

import { organizeData } from 'src/helpers/organize_menus';

const DARoles = (prop) => {
  const { handleRoleChange, rolesSetting, handleParentAllRightsChange, rolesData, canUpdate } =
    prop;

  const sortedData = rolesData !== undefined ? rolesData.sort((a, b) => a.id - b.id) : [];
  const menus = organizeData(sortedData);
  console.table("sortedData", sortedData);
  console.log("menus", menus);
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
  console.log("rolesRow", rolesRow);
  const roles_grid_cols = [
    {
      field: 'group',
      headerName: 'Group',
      headerClassName: 'custom-header-data-grid',
      width: 130,
      editable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.row.group !== '' && (
          <div className="d-flex justify-content-center align-items-center w-auto h-100">
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
      field: 'select',
      headerName: 'Full',
      headerClassName: 'custom-header-data-grid',
      width: 40,
      editable: false,
      filterable: false,
      sortable: false,
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
      field: 'screen',
      headerName: 'Screen / Right',
      headerClassName: 'custom-header-data-grid',
      width: 180,
      editable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'view',
      headerName: 'View',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      sortable: false,
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
      field: 'add',
      headerName: 'Add',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      sortable: false,
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
      field: 'edit',
      headerName: 'Edit',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      sortable: false,
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
      field: 'delete',
      headerName: 'Delete',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      sortable: false,
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
      field: 'print',
      headerName: 'Print',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      sortable: false,
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
      field: 'export',
      headerName: 'Export',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 100,
      editable: false,
      filterable: false,
      sortable: false,
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
      pagination={true}
      rowHeight={50}
      rowSelection={false}
    />
  );
};
export default DARoles;

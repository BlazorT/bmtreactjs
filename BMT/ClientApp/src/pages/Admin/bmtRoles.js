import React, { useState } from 'react';

import { cilChevronBottom } from '@coreui/icons';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import globalutil from 'src/util/globalutil';

import { formatDate } from 'src/helpers/formatDate';

import usePageRoles from 'src/hooks/usePageRoles';
import AppContainer from 'src/components/UI/AppContainer';
import { getRolesCols } from 'src/configs/ColumnsConfig/rolesCols';
import dayjs from 'dayjs';

const BmtRoles = () => {
  //const pageRoles = usePageRoles('Roles Settings');
  const pageRoles = usePageRoles('Users');

  const roles = globalutil.userroles();

  const [showGrid, setShowGrid] = useState(true);

  const [rows] = useState(
    roles.map((role) => ({
      id: role.id,
      roleName: role.name,
      status: 'Active',
      lastUpdate: formatDate(dayjs()),
      // imageUrl: 'Edit',
    })),
  );

  const toggleGrid = () => {
    setShowGrid((prev) => !prev);
  };

  const rolesCols = getRolesCols(pageRoles);
  return (
    <AppContainer>
      <DataGridHeader
        title="BMT Roles"
        otherControls={[{ icon: cilChevronBottom, fn: toggleGrid }]}
        filterDisable
      />

      {showGrid === true && (
        <CustomDatagrid
          rows={rows}
          columns={rolesCols}
          pagination={true}
          rowHeight={50}
          canExport={pageRoles.canExport}
          canPrint={pageRoles.canPrint}
          isHeader
        />
      )}
    </AppContainer>
  );
};

export default BmtRoles;

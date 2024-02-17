/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import { useShowToast } from 'src/hooks/useShowToast';
import { getDaInventoryCols } from 'src/configs/ColumnsConfig/daInventoryCols';
import CustomSearch from '../InputsComponent/CustomSearch';

const DaNewAssignment = ({
  rows,
  setRows,
  isLoading,
  canAssign,
  vehicle,
  setVehicle,
  vehicleList,
  isSingleDis,
}) => {
  const showToast = useShowToast();
  const daInventoryCols = getDaInventoryCols(setRows, showToast, canAssign);

  return (
    <React.Fragment>
      <CustomDatagrid
        rows={rows}
        columns={daInventoryCols}
        rowHeight={45}
        pagination={true}
        pageNumber={6}
        loading={isLoading}
        search={true}
        noRowsMessage="No Products"
        footer={
          !isSingleDis && (
            <React.Fragment>
              <CustomSearch
                value={vehicle}
                onChange={(e) => setVehicle(e)}
                type="text"
                id="productName"
                name="productName"
                disabled={!canAssign}
                data={vehicleList}
                isRequired={true}
                placeholder="Search Vehicle..."
                message="please select a product"
              />
            </React.Fragment>
          )
        }
        hiddenCols={{
          columnVisibilityModel: {
            assign: false,
            remarks: false,
            assignedQty: false,
          },
        }}
      />
    </React.Fragment>
  );
};
export default DaNewAssignment;

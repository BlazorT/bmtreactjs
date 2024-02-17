/* eslint-disable react/prop-types */
import { cilCarAlt } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow } from '@coreui/react';
import React from 'react';
import globalutil from 'src/util/globalutil';

const RosterVehicleCell = ({ params }) => {
  return (
    <CRow className="d-flex flex-row justify-content-center align-items-center w-100">
      <span>{params.row.search}</span>
      <div className="text-dim text-small">
        <CIcon icon={cilCarAlt} />
        <span className="ps-2">{' ' + params.row.vehicleName + ', ' + params.row.wincode}</span>
      </div>
    </CRow>
  );
};
export default RosterVehicleCell;

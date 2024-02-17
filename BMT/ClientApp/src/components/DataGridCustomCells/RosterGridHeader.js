/* eslint-disable react/prop-types */
import { CFormSwitch } from '@coreui/react';
import React from 'react';
import { getWeekRange } from 'src/helpers/getWeekDate';

const RosterGridHeader = ({ startDate, endDate, day }) => {
  const weeks = getWeekRange(startDate, endDate);

  return (
    <div className="d-flex flex-row w-100 justify-content-center align-items-center ">
      <div>{weeks[day]}</div>
    </div>
  );
};
export default RosterGridHeader;

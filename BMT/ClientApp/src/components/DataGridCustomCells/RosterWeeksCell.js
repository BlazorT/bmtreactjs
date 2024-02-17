/* eslint-disable react/prop-types */
import { CFormSwitch } from '@coreui/react';
import React from 'react';
import { getWeekRange, matchDateFormat } from 'src/helpers/getWeekDate';
import CheckIcon from '@mui/icons-material/Check';
import ScheduleCellPopOver from '../Component/ScheduleCellPopOver';
import moment from 'moment';
const RosterWeeksCell = ({
  params,
  setRows,
  rows,
  startDate,
  endDate,
  day,
  daList,
  vehicleList,
  getRoster,
  setSubmitData,
}) => {
  const weeks = getWeekRange(startDate, endDate);

  const toggleFieldName = params.field.slice(0, 3) + 'Toggle';

  function isValidDate(str) {
    // Try parsing the string using Moment.js
    const parsedDate = moment.utc(str, moment.ISO_8601, true);

    // Check if the parsed date is valid
    return parsedDate.isValid();
  }

  function isDateString(inputString) {
    const dateRegex =
      /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat), (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{1,2}$/;

    return dateRegex.test(inputString);
  }

  return (
    <div className="w-100 h-100 text-center d-flex justify-content-center align-items-center ">
      {params.row[params.field] === 'toggle' ? (
        <CFormSwitch
          className="m-0"
          size="lg"
          id={toggleFieldName}
          checked={params.row[toggleFieldName]}
          onChange={(e) => {
            setRows((prev) => {
              if (prev.length > 0) {
                const updatedRow = { ...prev[0] };
                updatedRow[toggleFieldName] = !updatedRow[toggleFieldName];
                const updatedRows = [...prev];
                updatedRows[0] = updatedRow;

                return updatedRows;
              }
              return prev;
            });
          }}
        />
      ) : params.row.weeklyPlan ? (
        <ScheduleCellPopOver
          date={params.row[params.field]}
          params={params}
          rows={rows}
          daList={daList}
          vehicleList={vehicleList}
          isDull={!rows[0]?.[params.field.slice(0, 3) + 'Toggle']}
          setRows={setRows}
          getRoster={getRoster}
          setSubmitData={setSubmitData}
        />
      ) : (
        params.row[params.field]
      )}
    </div>
  );
};
export default RosterWeeksCell;

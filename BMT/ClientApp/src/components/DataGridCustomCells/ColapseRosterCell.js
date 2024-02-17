/* eslint-disable react/prop-types */
import { cilChevronBottom } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import React, { useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ColapseRosterCell = ({ params, setRows }) => {
  const [isCollapse, setIsCollapse] = useState(false);
  return (
    <React.Fragment>
      {(params.row.search === 'Work Block Restoreds' ||
        params.row.search === 'Scheduled associates') && (
        <div className="d-flex flex-row justify-content-center align-items-center ">
          {isCollapse ? (
            <KeyboardArrowDownIcon
              fontSize="small"
              onClick={() => {
                setIsCollapse(!isCollapse);
                // setRows((prev) => [prev[0], prev[1], prev[2]]);
              }}
            />
          ) : (
            <KeyboardArrowRightIcon
              fontSize="small"
              onClick={() => {
                setIsCollapse(!isCollapse);
                // setRows((prev) => [
                //   ...prev,
                //   {
                //     id: Math.random(),
                //     index: 0,
                //     search: '',
                //     vehicle: '',
                //     associate: '',
                //     sunday: '15',
                //     monday: '35',
                //     tuesday: '17',
                //     wednesday: '25',
                //     thursday: '10',
                //     friday: '5',
                //     saturday: '22',
                //   },
                // ]);
              }}
            />
          )}
          <strong>{params.row[params.field]}</strong>
        </div>
      )}
    </React.Fragment>
  );
};
export default ColapseRosterCell;

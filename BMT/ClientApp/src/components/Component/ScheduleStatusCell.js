/* eslint-disable react/prop-types */
import React from 'react';
import globalutil from 'src/util/globalutil';
import WarningIcon from '@mui/icons-material/Warning';
import LaunchIcon from '@mui/icons-material/Launch';
import CachedIcon from '@mui/icons-material/Cached';

const ScheduleStatusCell = ({ status, type, params, isDull, vehicleList }) => {
  const mapStatus = {
    1: 'success',
    2: 'warning',
    3: 'danger',
  };
  const vehicle =
    vehicleList.find((vehicle) => vehicle.id == params.row.weeklyPlan[params.field]?.vehicleId) ||
    undefined;

  return (
    <React.Fragment>
      {vehicle && (
        <React.Fragment>
          {type === 1 ? (
            <div
              //border-1 border-${mapStatus[status]} border
              className={`w-100 h-100 d-flex align-items-center position-relative p-2`}
            >
              {globalutil.makes().find((item) => item.id === vehicle.makeDetailId)?.name || ''}
              {globalutil.vehicletypes().find((item) => item.id === vehicle.categoryId)?.name || ''}
              {/* <div className="">{time.replace(/:\d{2} /, ' ')}</div> */}
              <div className="position-absolute top-0 end-0 m-0 p-1">
                <WarningIcon fontSize="small" className="fs-6" />
              </div>
            </div>
          ) : (
            <div
              // border-2 border-${mapStatus[status]} border
              className={`w-100 h-100 align-items-start d-flex justify-content-center flex-column ${
                isDull ? 'bg-opacity-50' : 'bg-opacity-100'
              }  bg-${mapStatus[status]} position-relative p-2 `}
            >
              <div>{vehicle?.name?.toUpperCase() + ', ' + vehicle.code}</div>
              <div className="">
                {(globalutil.makes().find((item) => item.id === vehicle.makeDetailId)?.name || '') +
                  ' ' +
                  globalutil.vehicletypes().find((item) => item.id === vehicle.categoryId)?.name +
                  ' ' +
                  vehicle.numberPlate}
              </div>
              <div className="position-absolute top-0 end-0 m-0 p-1">
                {status !== 1 ? (
                  <WarningIcon fontSize="small" className="fs-6" />
                ) : (
                  //   <CachedIcon fontSize="small" className="fs-6" />
                  <LaunchIcon fontSize="small" className="fs-6" />
                )}
              </div>
              {/* <div className="w-75 roster-popover-cell">
              {time} - {time}
              <br />
              <div className="text-ellipsis">Standard Parcel - Extra Large Van</div>
            </div> */}
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default ScheduleStatusCell;

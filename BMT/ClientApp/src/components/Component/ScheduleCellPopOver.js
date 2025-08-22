/* eslint-disable react/prop-types */
import React from 'react';
import Popover from '@mui/material/Popover';
import CIcon from '@coreui/icons-react';
import { cilReload, cilTrash } from '@coreui/icons';
import { CFormCheck, CRow } from '@coreui/react';
import CustomInput from '../InputsComponent/CustomInput';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import ScheduleStatusCell from './ScheduleStatusCell';
import { useShowToast } from 'src/hooks/useShowToast';
import Button from '../InputsComponent/Button';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isBefore from 'dayjs/plugin/isBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSelector } from 'react-redux';
import CustomSearch from '../InputsComponent/CustomSearch';

export default function ScheduleCellPopOver({
  date,
  params,
  daList,
  isDull,
  vehicleList,
  setRows,
  rows,
  getRoster,
  setSubmitData,
}) {
  dayjs.extend(weekday);
  dayjs.extend(isBefore);
  dayjs.extend(customParseFormat);
  const user = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [da, setDa] = React.useState('');
  const [vehicleSearch, setVehicleSearch] = React.useState('');

  const showToast = useShowToast();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const time = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  function isDateBeforeToday(dateString) {
    // Define months for conversion
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Split the input date string into day, month, and year
    const [, monthStr, day] = dateString.split(' ');

    // Map the month abbreviation to its numeric representation
    const month = months.indexOf(monthStr);

    // Get the current date
    const currentDate = new Date();

    // Set the time part of the current date to midnight
    currentDate.setHours(0, 0, 0, 0);

    // Create a new date object with the input date's year, month, and day
    const inputDate = new Date(currentDate.getFullYear(), month, day);

    // Compare the input date with the current date
    return inputDate < currentDate;
  }

  const onFleetChange = (e) => {
    const available = !rows.some(
      (row) => row.weeklyPlan && row.weeklyPlan[params.field].vehicleId == e.id,
    );

    if (!available) {
      showToast('This Vehilce not available on this day', 'warning');
      return;
    }
    setRows((prev) => {
      return prev.map((row) => {
        if (row.id === params.id) {
          return {
            ...row,
            weeklyPlan: {
              ...row.weeklyPlan,
              [params.field]: {
                ...row.weeklyPlan[params.field],
                // vehicleId: e.id,
                vehicleMake: e,
              },
            },
          };
        }
        return row;
      });
    });
  };

  const onDaChange = (e) => {
    const { firstName, lastName, userId } = daList.find((da) => da.id == e.target.value) || {};

    setRows((prev) => {
      return prev.map((row) => {
        if (row.id === params.id) {
          return {
            ...row,
            search: firstName + ' ' + lastName + ' ' + userId,
            rosteredDaid: parseInt(e.target.value),
            weeklyPlan: {
              ...row.weeklyPlan,
              sunday: {
                ...row.weeklyPlan.sunday,
                rosteredDaid: parseInt(e.target.value),
              },
              monday: {
                ...row.weeklyPlan.monday,
                rosteredDaid: parseInt(e.target.value),
              },
              tuesday: {
                ...row.weeklyPlan.tuesday,
                rosteredDaid: parseInt(e.target.value),
              },
              wednesday: {
                ...row.weeklyPlan.wednesday,
                rosteredDaid: parseInt(e.target.value),
              },
              thursday: {
                ...row.weeklyPlan.thursday,
                rosteredDaid: parseInt(e.target.value),
              },
              friday: {
                ...row.weeklyPlan.friday,
                rosteredDaid: parseInt(e.target.value),
              },
              saturday: {
                ...row.weeklyPlan.saturday,
                rosteredDaid: parseInt(e.target.value),
              },
            },
          };
        }
        return row;
      });
    });
  };

  function getMergedMomentFromWeekRange(weekStartDate, weekEndDate, targetDay) {
    const startDayjs = dayjs(weekStartDate);
    const endDayjs = dayjs(weekEndDate);

    // Find the first occurrence of the target day within the week range
    let currentDayjs = startDayjs.startOf('week');

    while (currentDayjs.isBefore(endDayjs)) {
      if (currentDayjs.format('ddd, MMM DD') === targetDay) {
        const extractedYear = currentDayjs.year();
        const mergedDayjs = dayjs(`${targetDay} ${extractedYear}`, 'ddd, MMM DD YYYY');
        return mergedDayjs;
      }
      currentDayjs = currentDayjs.add(1, 'day');
    }

    // If no match found, return undefined or handle as needed
    return undefined;
  }

  const onAdd = async () => {
    if (!params.row.weeklyPlan[params.field].vehicleMake) {
      showToast('Select Vehicle', 'warning');
      return;
    }

    handleClose();
    const roster = rows.find((row) => row.id === params.id);
    const vehicle =
      vehicleList.find(
        (vehicle) => vehicle.id == params.row.weeklyPlan[params.field].vehicleMake.id,
      ) || [];

    setRows((prev) => {
      return prev.map((row) => {
        if (row.id === params.id) {
          return {
            ...row,
            weeklyPlan: {
              ...row.weeklyPlan,
              [params.field]: {
                ...row.weeklyPlan[params.field],
                vehicleId: vehicle.id,
              },
            },
          };
        }
        return row;
      });
    });
    const { vehicleMake, ...rest } = roster.weeklyPlan[params.field];
    const fleetPlans = [
      {
        ...rest,
        vehicleId: vehicle.id,
        lastUpdatedBy: user.userId,
        lastUpdatedAt: dayjs().utc().format()
      },
    ];
    const rosterPlanBody = {
      id: roster.rosterId,
      rosterTypeId: 1,
      dspId: roster.dspId,
      rosterEndDate: roster.rosterEndDate,
      rosterDate: roster.rosterDate,
      rosterPlanDate: roster.rosterPlanDate,
      status: roster.status,
      rosterRemarks: roster.rosterRemarks,
      week: roster.week,
      lastUpdatedBy: user.userId,
      createdBy: roster.createdBy,
      createdAt: roster.createdAt,
      lastUpdatedAt: dayjs().utc().format(),
      rowVer: 1,
      // fleetPlans: fleetPlans,
    };

    setSubmitData((prev) => {
      // Ensure prev and prev.rosterPlanBody are defined
      if (!prev || !prev.rosterPlanBody) {
        return { ...prev, rosterPlanBody: { ...rosterPlanBody, fleetPlans } };
      }

      const updatedFleetPlans = prev?.rosterPlanBody?.fleetPlans?.map((fleetPlan) =>
        fleetPlan.id === fleetPlans[0].id ? { ...fleetPlan, ...fleetPlans[0] } : fleetPlan,
      );

      // Check if the fleetPlan with the given ID exists
      const fleetPlanExists = updatedFleetPlans?.some((fp) => fp.id === fleetPlans[0].id);

      return {
        rosterPlanBody: {
          ...rosterPlanBody,
          fleetPlans: fleetPlanExists
            ? updatedFleetPlans
            : [...prev.rosterPlanBody.fleetPlans, ...fleetPlans],
        },
      };
    });
    console.log({ rosterPlanBody, rows });
  };

  const onCancel = () => {
    handleClose();
    // setRows((prev) => {
    //   return prev.map((row) => {
    //     if (row.id === params.id) {
    //       return {
    //         ...row,
    //         weeklyPlan: {
    //           ...row.weeklyPlan,
    //           [params.field]: {
    //             ...row.weeklyPlan[params.field],
    //             vehicleMake: '',
    //             vehicleId: 0,
    //           },
    //         },
    //       };
    //     }
    //     return row;
    //   });
    // });
  };

  const excludedIds = rows
    .filter((row) => row.rosteredDaid !== params.row.rosteredDaid)
    .map((row) => row.rosteredDaid);

  return (
    <React.Fragment>
      <div
        className="w-100 h-100 text-start d-flex justify-content-center align-items-center"
        onClick={handleClick}
        role="button"
        aria-describedby={id}
      >
        {params.row.weeklyPlan[params.field]?.vehicleId === 0 ? (
          ''
        ) : (
          <ScheduleStatusCell
            status={!isDateBeforeToday(date) ? 1 : 3}
            type={2}
            params={params}
            isDull={isDull}
            vehicleList={vehicleList}
          />
        )}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="popover-roster">
          <div className="d-flex justify-content-between align-items-center border-bottom-1px pb-2">
            <span>
              <CIcon icon={cilReload} className="me-2" />
              Repeat Every Week
            </span>
            <CIcon icon={cilTrash} />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-start  border-bottom-1px pb-3 mt-2">
            <strong> {isDateBeforeToday(date) && '[Outdated] '} Auto-roster preference</strong>
            <CFormCheck
              type="radio"
              className="w-100 mt-2"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              label="Standard"
              disabled={isDateBeforeToday(date)}
              defaultChecked
            />
            <CFormCheck
              type="radio"
              className="w-100"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              label="Set as backup"
              disabled={isDateBeforeToday(date)}
            />
            <CustomSearch
              getOptionLabel={(option) => option.name?.toUpperCase() + ', ' + option.code}
              value={params.row.weeklyPlan[params.field]?.vehicleMake}
              onChange={onFleetChange}
              type="text"
              id="vehicle"
              name="vehicle"
              data={vehicleList.filter((vehicle) => vehicle.status === 16)}
              // isRequired={true}
              placeholder="Search vehicles..."
              className="w-100"
              // message="please select a product"
            />
            {/* <CustomSelectInput
              optionsList={(option) => option.name?.toUpperCase() + ', ' + option.code}
              options={vehicleList.filter((vehicle) => vehicle.status === 16)}
              value={params.row.weeklyPlan[params.field]?.vehicleId}
              onChange={onFleetChange}
              name="vehicle"
              id="vehicle"
              className="mt-2"
              width="w-100"
              disabled={isDateBeforeToday(date)}
              disableOption={'Assign Vehicle'}
            /> */}
            <CustomSelectInput
              options={daList.filter((da) => da.status !== 4 && !excludedIds.includes(da.id))}
              optionsList={(option) =>
                option.firstName?.toUpperCase() +
                ' ' +
                option.lastName?.toUpperCase() +
                ', ' +
                option.userId?.slice(-6)
              }
              value={params.row.rosteredDaid}
              onChange={onDaChange}
              name="associate"
              id="associate"
              className="mt-2"
              width="w-100"
              disabled={isDateBeforeToday(date)}
              disableOption={'Change Associate'}
            />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-start pb-2 mt-2">
            <CustomInput
              value=""
              onChange={(e) => ''}
              placeholder="Add a commment"
              className="w-100"
              width="w-100"
              disabled={isDateBeforeToday(date)}
            />
          </div>
          <div className="d-flex justify-content-evenly  align-items-center mt-2">
            <Button title="Cancel" onClick={onCancel} />
            <Button title="Add" onClick={onAdd} />
          </div>
        </div>
      </Popover>
    </React.Fragment>
  );
}

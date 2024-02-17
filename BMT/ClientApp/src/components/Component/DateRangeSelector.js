/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CIcon from '@coreui/icons-react';

// Custom hook to manage date ranges (consider using a date library like Moment.js or Luxon for more advanced date manipulation)
function useDateRange(startDate, endDate, setStartDate, setEndDate, prevDisable) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

  // Determine previous Sunday to start the week
  const sundayThisWeek = new Date(
    today.getTime() - (dayOfWeek === 0 ? 0 : dayOfWeek) * 24 * 60 * 60 * 1000,
  );

  // Set end date to next Saturday from previous Sunday
  const saturdayNextWeek = new Date(sundayThisWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

  const startOfWeek = new Date(
    startDate.getTime() -
      (startDate.getDay() === 0 ? 0 : startDate.getDay() - 1) * 24 * 60 * 60 * 1000,
  ); // Monday of the current week
  const endOfWeek = new Date(startOfWeek.getTime() + 5 * 24 * 60 * 60 * 1000); // Friday of the current week

  useEffect(() => {
    // Ensure initial `startDate` and `endDate` are always Sunday and Saturday of the current week
    // console.log({ sundayThisWeek, saturdayNextWeek, startDate, endDate });
    // setStartDate(sundayThisWeek);
    // setEndDate(saturdayNextWeek);
  }, []);

  const navigateWeek = (direction) => {
    // Adjust week navigation to shift by 7 days (including Sunday)
    if (direction === 'left') {
      const newStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      if (prevDisable && newStartDate < sundayThisWeek) {
        return; // don't update state if navigating before current week
      }
      setStartDate(newStartDate);
      setEndDate(new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else if (direction === 'right') {
      setStartDate(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000));
      setEndDate(new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  return { startDate, endDate, navigateWeek };
}

function DateRangeSelector({
  title,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  prevDisable,
  icon,
  disable,
}) {
  const { navigateWeek } = useDateRange(startDate, endDate, setStartDate, setEndDate, prevDisable);

  const formattedDateDisplay = (
    <React.Fragment>
      <span className="ps-1">Week {getWeekNumber(startDate)} : </span>
      <strong>
        {formatDate(startDate)} - {formatDate(endDate)}, {startDate.getFullYear()}
      </strong>
    </React.Fragment>
  );
  return (
    <div className="date-range-selector d-flex w-100 p-0 m-0 ps-2 pe-2">
      {icon && (
        <span className="input-group-addon mgleft" title={title}>
          <CIcon className={'stock-toggle-icon '} icon={icon}></CIcon>
        </span>
      )}
      {/* <span className="d-flex align-items-center justify-content-start">Go to this week</span> */}
      <div className="d-flex align-items-center justify-content-center w-100 ">
        {!disable && (
          <KeyboardArrowLeftIcon
            onClick={() => navigateWeek('left')}
            fontSize="small"
            className="me-2"
          />
        )}
        <CalendarMonthIcon />
        <DateDisplay>{formattedDateDisplay}</DateDisplay>
        {!disable && (
          <KeyboardArrowRightIcon
            onClick={() => navigateWeek('right')}
            fontSize="small"
            className="ms-2"
          />
        )}
      </div>
      {/* <span className="d-flex align-items-center justify-content-end">Week</span> */}
    </div>
  );
}

// DateDisplay subcomponent for formatted date rendering
function DateDisplay({ children }) {
  return <span className="date-display">{children}</span>;
}

// Helper functions for formatting dates and getting week numbers (adapt to your requirements)
function formatDate(date) {
  // Return your desired date format (e.g., 'YY-MM-DD', 'MMM DD, YYYY')
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getWeekNumber(date) {
  // Assuming week starts on Sunday and year starts on January 1st
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const weekNumber = Math.ceil((dayOfYear + 1) / 7); // ISO 8601 week numbering
  return `${weekNumber}`; // Show week number within the same year
}

export default DateRangeSelector;

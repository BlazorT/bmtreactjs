/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import 'react-datepicker/dist/react-datepicker.css';
import * as React from 'react';
import DatePicker from 'react-datepicker';
import CIcon from '@coreui/icons-react';
import dayjs from 'dayjs';

// Month names
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Years list (1990 → current year)
const currentYear = dayjs().year();
const years = Array.from({ length: 200 }, (_, i) => currentYear - 100 + i);

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const d = dayjs(date);

  return (
    <div
      style={{
        // margin: 2,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="btn_Default w-auto px-3 rounded-0"
      >
        {'<'}
      </button>

      {/* Year dropdown */}
      <div className="d-flex rounded-2 calender-header-select p-1">
        {/* Month dropdown */}
        <select
          value={MONTHS[d.month()]}
          className={`calender-header-select px-1`}
          onChange={({ target: { value } }) => changeMonth(MONTHS.indexOf(value))}
        >
          {MONTHS.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          className={`calender-header-select px-1`}
          value={d.year()}
          onChange={({ target: { value } }) => changeYear(Number(value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="btn_Default w-auto px-3 rounded-0"
      >
        {'>'}
      </button>
    </div>
  );
};

export default function CustomDatePicker(prop) {
  const {
    icon,
    label,
    title,
    id,
    name,
    value,
    onChange,
    isRequired,
    message,
    maxDate,
    minDate,
    disablePast = false,
    disabled,
  } = prop;

  const [error, setError] = React.useState(null);

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case 'maxDate':
      case 'minDate': {
        return message;
      }
      default: {
        return '';
      }
    }
  }, [error]);

  const handleChange = (date) => {
    // Validate date against minDate and maxDate
    if (isRequired && !date) {
      setError('required');
    } else if (minDate && date < minDate) {
      setError('minDate');
    } else if (maxDate && date > maxDate) {
      setError('maxDate');
    } else {
      setError(null);
    }
    onChange(date, label); // Pass raw JS Date
  };

  return (
    <div className={`form-outline text-start ${label ? 'mt-2' : icon ? '' : ''} `}>
      {label && (
        <label htmlFor={id} className="login_label labelName ">
          {label}
        </label>
      )}
      <div className="input-group ">
        {icon && (
          <span className="input-group-addon">
            <CIcon
              className={isRequired ? 'mandatory-control' : 'stock-toggle-icon '}
              icon={icon}
            />
          </span>
        )}
        <DatePicker
          id={id}
          name={name}
          selected={value || null}
          onChange={handleChange}
          renderCustomHeader={CustomHeader}
          dateFormat="MM/dd/yyyy"
          className="form-control item date-picker-custom" // Apply styles to the input
          calendarClassName="date-picker-custom-calendar" // Apply styles to the calendar
          placeholderText="MM/DD/YYYY"
          minDate={minDate || (disablePast ? new Date() : null)}
          maxDate={maxDate || null}
          required={isRequired}
          disabled={disabled}
        />
      </div>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
    </div>
  );
}

import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CIcon from '@coreui/icons-react';
import 'react-datepicker/dist/react-datepicker.css';

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
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <div className="input-group ">
        {icon && (
          <span className="input-group-addon">
            <CIcon icon={icon} />
          </span>
        )}
        <DatePicker
          id={id}
          name={name}
          selected={value || null}
          onChange={handleChange}
          dateFormat="MM/dd/yyyy"
          className="form-control item date-picker-custom" // Apply styles to the input
          calendarClassName="date-picker-custom-calendar" // Apply styles to the calendar
          placeholderText="MM/DD/YYYY"
          minDate={minDate || (disablePast ? new Date() : null)}
          maxDate={maxDate || null}
          required={isRequired}
        />
      </div>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
    </div>
  );
}

/* eslint-disable react/prop-types */
import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CIcon from '@coreui/icons-react';
import dayjs from 'dayjs';

export default function TimePickerViewRenderers({
  icon,
  label,
  title,
  id,
  value,
  onChange,
  isRequired,
  disabled,
  maxTime,
  minTime,
  message,
}) {
  const [error, setError] = React.useState(null);

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case 'maxTime':
      case 'minTime': {
        return message;
      }
      case 'invalidDate': {
        return 'Your time is not valid';
      }
      default: {
        return '';
      }
    }
  }, [error]);

  // Convert dayjs objects to Date objects for react-datepicker
  const toDate = (dayjsObj) =>
    dayjsObj && dayjs.isDayjs(dayjsObj) ? dayjsObj.toDate() : dayjsObj || null;

  const handleChange = (time) => {
    if (isRequired && !time) {
      setError('invalidDate');
    } else if (minTime && time < toDate(minTime)) {
      setError('minTime');
    } else if (maxTime && time > toDate(maxTime)) {
      setError('maxTime');
    } else {
      setError(null);
    }
    // Convert selected time (Date) back to dayjs for consistency with app
    const dayjsTime = time ? dayjs(time) : null;
    onChange(dayjsTime); // Pass dayjs object to parent
  };

  console.log({ value, asDate: toDate(value) });

  return (
    <div className="text-start mt-2">
      <label htmlFor={id} className="login_label labelName">
        {label}
      </label>
      <div className="form-outline text-start">
        <div className="input-group position-relative">
          <span className="input-group-addon" title={title}>
            <CIcon
              className={isRequired ? 'mandatory-control' : 'stock-toggle-icon '}
              icon={icon}
            ></CIcon>
          </span>
          <DatePicker
            selected={toDate(value)}
            onChange={handleChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1} // 1-minute intervals
            timeCaption="Time"
            dateFormat="h:mm aa"
            className="form-control item"
            placeholderText="Select time"
            minTime={toDate(minTime)}
            maxTime={toDate(maxTime)}
            disabled={disabled}
            required={isRequired}
          />
        </div>
        {errorMessage && <div className="text-danger">{errorMessage}</div>}
      </div>
    </div>
  );
}

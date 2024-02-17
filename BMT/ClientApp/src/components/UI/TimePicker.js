/* eslint-disable react/prop-types */
import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import CIcon from '@coreui/icons-react';

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
      case 'maxDate':
      case 'minDate': {
        return message;
      }

      case 'invalidDate': {
        return 'Your date is not valid';
      }

      default: {
        return '';
      }
    }
  }, [error]);

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              // ampm={false}
              value={value}
              onChange={onChange}
              className="form-control item"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              onError={(newError) => setError(newError)}
              slotProps={{
                textField: {
                  helperText: errorMessage,
                },
              }}
              disabled={disabled}
              minTime={minTime}
              maxTime={maxTime}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
}

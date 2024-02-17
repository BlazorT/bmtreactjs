import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';
import CIcon from '@coreui/icons-react';
import moment from 'moment';

export default function CustomDatePicker(prop) {
  const { icon, label, title, id, name, value, onChange, isRequired, message, max, min } = prop;

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
            <DatePicker
              value={value ? dayjs(value) : dayjs()}
              onChange={(e) => {
                //
                onChange(e.$d, label);
              }}
              format="MM/DD/YYYY"
              name={name}
              className="form-control item"
              defaultValue={dayjs()}
              onError={isRequired ? (newError) => setError(newError) : () => ''}
              slotProps={{
                textField: {
                  helperText: errorMessage,
                },
              }}
              maxDate={max ? max : ''}
              minDate={min ? min : ''}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import moment from 'moment';
import { CCol, CRow } from '@coreui/react';
import { CButtonGroup, CFormCheck } from '@coreui/react';
import CustomDatePicker from 'src/components/UI/DatePicker';
import { cilCalendar } from '@coreui/icons';
const DateSelector = (prop) => {
  const { date, onDateChange } = prop;
  const [selectedOptionweek, setSelectedOptionweek] = useState('week');
  const [selectedOptionday, setSelectedOptionday] = useState('day');

  const handlePrevDay = () => {
    const increasedDate = moment(date).subtract(1, 'days');
    onDateChange(increasedDate);
  };

  const handleNextDay = () => {
    const increasedDate = moment(date).add(1, 'days');
    onDateChange(increasedDate);
  };

  return (
    <CRow className="fleet-filter-header">
      <CCol md={2}>
        <CButtonGroup
          className="FloatRight mgtop"
          role="group"
          aria-label="Basic checkbox toggle button group"
          onChange={(e) => setSelectedOptionweek(e.target.value)}
        >
          <CFormCheck
            type="radio"
            button={{ color: 'primary', variant: 'outline' }}
            name="btnWeek"
            id="btnWeek"
            onChange={(e) => setSelectedOptionweek(e.target.value)}
            checked={selectedOptionweek === 'week'}
            value="week"
            autoComplete="on"
            label="Week"
          />
          <CFormCheck
            type="radio"
            button={{ color: 'primary', variant: 'outline' }}
            name="btnDay"
            value="Day"
            id="btnDay"
            autoComplete="on"
            label="Day"
          />
        </CButtonGroup>
      </CCol>
      <CCol className="mgTop-Date" md={4}>
        <CustomDatePicker
          icon={cilCalendar}
          defaultValue={'2022-04-17'}
          onChange={onDateChange}
          value={date}
        />
      </CCol>
      <CCol md={6}>
        <div className="button">
          <span onClick={handlePrevDay} className="back arrow"></span>
          <span onClick={handleNextDay} className="next arrow"></span>
        </div>
      </CCol>
    </CRow>
  );
};
export default DateSelector;

/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */

// Custom hook to manage date ranges (consider using a date library like Moment.js or Luxon for more advanced date manipulation)

function gridHeader() {
  return (
    <div className="date-range-selector d-flex w-100 p-0 m-0 ps-2 pe-2">
      {/* <span className="d-flex align-items-center justify-content-start">Go to this week</span> */}
      <div className="d-flex align-items-center justify-content-center w-100 ">
        <div className="col-md-6">
          <strong>4dsps</strong>
        </div>
        <div className="col-md-6">
          <strong>3rd Party</strong>
        </div>
      </div>
      {/* <span className="d-flex align-items-center justify-content-end">Week</span> */}
    </div>
  );
}

// DateDisplay subcomponent for formatted date rendering

export default gridHeader;

/* eslint-disable react/react-in-jsx-scope */
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

function StatusCustomeCell({ value }) {
  StatusCustomeCell.propTypes = {
    value: PropTypes.any,
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-start w-100 h-100">
      <div className="d-flex justify-content-start align-items-center ">
        <p className="m-0">
          {value.row.status === 16 ? (
            <CheckIcon fontSize="medium" className="text-success " />
          ) : (
            <CloseIcon fontSize="medium" className="text-danger " />
          )}
          {/*  {globalutil.vehiclestatuss().find((item) => item.id == value.row.status).name}*/}
        </p>
      </div>
      {value.row.GroundedIssue && <p className="m-0 text-dim">{value.row.GroundedIssue}</p>}
    </div>
  );
}

export default StatusCustomeCell;

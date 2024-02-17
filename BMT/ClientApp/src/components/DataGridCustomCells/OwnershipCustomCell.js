import React from 'react';
import PropTypes from 'prop-types';
import globalutil from 'src/util/globalutil';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
function OwnershipCustomeCell({ value }) {
  OwnershipCustomeCell.propTypes = {
    value: PropTypes.any,
  };

  return (
    <div className="d-flex flex-column">
      <p className="m-0 mb-1">
        {globalutil.ownerships().find((item) => item.id === value.row.Ownership).name}
      </p>
      <p className="m-0">{value.row.OwnershipType}</p>
      <div className="d-flex justify-content-start align-items-center mt-1">
        {value.row.status === 16 ? (
          <CheckIcon fontSize="medium" className="text-success " />
        ) : (
          <CloseIcon fontSize="medium" className="text-danger " />
        )}

        <p className="m-0 ps-1">{value.row.status === 16 ? 'Active' : 'In Active'}</p>
      </div>
    </div>
  );
}

export default OwnershipCustomeCell;

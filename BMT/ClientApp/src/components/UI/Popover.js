/* eslint-disable react/prop-types */
import React from 'react';

import { Popover as MuiPopover } from '@mui/material';

const Popover = ({
  id,
  anchorEl,
  handleClose,
  content,
  open,
  anchorVer = 'top',
  anchorHori = 'left',
}) => {
  return (
    <MuiPopover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: anchorVer,
        horizontal: anchorHori,
      }}
      transformOrigin={{
        //vertical: 'top',
        //horizontal: 'right',
      }}
      className="w-100"
    >
      {content}
    </MuiPopover>
  );
};
export default Popover;

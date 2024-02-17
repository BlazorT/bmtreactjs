/* eslint-disable react/prop-types */
import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';

import { Tooltip } from '@material-ui/core';
import CIcon from '@coreui/icons-react';
import { cilCog } from '@coreui/icons';
import { SpeedDialAction } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export const AppSpeedDial = ({ actions }) => {
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute' }}
        className=""
        icon={<SettingsOutlinedIcon />}
        direction={'right'}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.title}
            icon={action.icon}
            tooltipTitle={action.title}
            onClick={action.onClick}
            aria-disabled={action.disabled}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

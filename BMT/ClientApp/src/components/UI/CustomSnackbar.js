import * as React from 'react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Snackbar } from '@mui/material';

function CustomSnackbar(prop) {
  const { message, variant, open, setOpen } = prop;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const vertical = 'top';
  const horizontal = 'right';

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert onClose={handleClose} severity={variant} sx={{ width: '100%' }}>
        {typeof message === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: message }} />
        ) : (
          message
        )}
      </Alert>
    </Snackbar>
  );
}
export default CustomSnackbar;
// variant
// error
// warning
// info
// success

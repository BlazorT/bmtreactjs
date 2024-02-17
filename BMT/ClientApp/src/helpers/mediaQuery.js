import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

function matched() {
  const matches = useMediaQuery('(max-width:600px)');

  return matches;
}

export default matched;

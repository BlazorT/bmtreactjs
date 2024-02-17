import { Skeleton } from '@mui/material';
import React from 'react';

const DatagridSkeleton = () => {
  return (
    <Skeleton variant="rectangular" width="100%">
      <div style={{ paddingTop: '57%' }} />
    </Skeleton>
  );
};
export default DatagridSkeleton;

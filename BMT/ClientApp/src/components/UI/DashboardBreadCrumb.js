import React from 'react';

import { Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const DashboardBreadCrumb = (prop) => {
  const { breadcrumbs } = prop;

  return (
    <Breadcrumbs
      className="mt-2 mb-2"
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs.map((option, index) => {
        return (
          <div key={index}>
            {index === breadcrumbs.length - 1 ? (
              <Typography className="text-light">{option.crumb}</Typography>
            ) : (
              <Link className="text-dim" to={option.to}>
                {option.crumb}
              </Link>
            )}
          </div>
        );
      })}
    </Breadcrumbs>
  );
};
export default DashboardBreadCrumb;

import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilFilter } from '@coreui/icons';
import { useDispatch } from 'react-redux';
import { toggleFilterMenu, setFilterMenuAnchorEvent } from '../../redux/filter/filterSlice';

// eslint-disable-next-line react/prop-types
const FilterIconMenu = ({ className = '', style = { color: 'white' }, onClick }) => {
  const dispatch = useDispatch();

  const handleClick = (event) => {
    // If custom onClick is provided, use it; otherwise use default behavior
    if (onClick) {
      onClick(event);
    } else {
      dispatch(toggleFilterMenu());
      dispatch(setFilterMenuAnchorEvent(event.currentTarget));
    }
  };

  return (
    <CIcon
      style={style}
      className={`cursor-pointer ${className}`}
      icon={cilFilter}
      onClick={handleClick}
      title="Filter"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e);
        }
      }}
    />
  );
};

export default FilterIconMenu;

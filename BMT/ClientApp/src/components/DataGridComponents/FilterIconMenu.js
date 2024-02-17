import React from 'react';

import CIcon from '@coreui/icons-react';

import { cilFilter } from '@coreui/icons';
import { useDispatch } from 'react-redux';

import { toggleFilterMenu, setFilterMenuAnchorEvent } from '../../redux/filter/filterSlice';

function FilterIconMenu() {
  const dispatch = useDispatch();

  return (
    <CIcon
      style={{ color: 'white' }}
      icon={cilFilter}
      onClick={(event) => {
        dispatch(toggleFilterMenu());
        dispatch(setFilterMenuAnchorEvent(event.currentTarget));
      }}
    />
  );
}
export default FilterIconMenu;

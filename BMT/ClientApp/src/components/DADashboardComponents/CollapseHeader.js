import React from 'react';

import CIcon from '@coreui/icons-react';
import { cilChevronCircleDownAlt, cilChevronCircleUpAlt, cilInfo } from '@coreui/icons';
import { CCol, CRow, CTooltip } from '@coreui/react';

import TipsCard from '../Cards/TipsCard';
import FilterIconMenu from '../DataGridComponents/FilterIconMenu';

const CollapseHeader = (prop) => {
  const { isVisible, toggleVisible, title, isFilter } = prop;

  return (
    <CRow className="mt-3">
      <CCol className="d-flex justify-content-between align-items-center">
        <p onClick={toggleVisible} className="dashboard-tittle">
          <CIcon
            className="me-2"
            icon={isVisible ? cilChevronCircleDownAlt : cilChevronCircleUpAlt}
          />
          {title}
        </p>
      </CCol>
      <CCol className="d-flex justify-content-end align-items-center gap-2">
        <CTooltip content={<TipsCard />} placement="left">
          <CIcon icon={cilInfo} />
        </CTooltip>
        {isFilter && <FilterIconMenu />}
      </CCol>
    </CRow>
  );
};
export default CollapseHeader;

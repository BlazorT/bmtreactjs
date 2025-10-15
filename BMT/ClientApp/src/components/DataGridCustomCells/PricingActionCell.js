import React, { useState } from 'react';

import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import PricingModal from '../Modals/PriceEditModal';

const PricingActionCell = (prop) => {
  const { value, getPricing } = prop;
  const row = value?.row;

  const [showEditModal, setShowEditModal] = useState(false);
  const toggleShowEditModal = () => setShowEditModal((prev) => !prev);

  return (
    <React.Fragment>
      <PricingModal
        isOpen={showEditModal}
        toggle={toggleShowEditModal}
        initialData={{
          discount: row?.discount,
          freeQuota: row?.freeAllowed,
          unitId: row?.unitId,
          unitPrice: row?.unitPrice,
        }}
        networkData={row}
        getPricing={getPricing}
      />
      <CRow>
        {/*{canUpdate === 1 && (*/}
        <CCol>
          <CTooltip content="Edit Pricing">
            <CIcon onClick={toggleShowEditModal} className="stock-toggle-icon" icon={cilPencil} />
          </CTooltip>
        </CCol>
      </CRow>
    </React.Fragment>
  );
};
export default PricingActionCell;

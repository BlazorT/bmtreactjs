/* eslint-disable react/prop-types */
import React from 'react';
import { CCol, CFormCheck, CRow } from '@coreui/react';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import Button from '../InputsComponent/Button';

const Inputs = ({ inputFields, yesFn, submitFn, children, isBtn }) => {
  const showConfirmation = useShowConfirmation();
  const confirmationModal = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: 'Are you sure you want to cancel?',
      isOpen: true,
      onYes: () => yesFn(),
      onNo: () =>
        showConfirmation({
          isOpen: false,
        }),
    });
  };
  const getColWidth = (inputName) => {
    const fullWidthFields = ['isTermsAccepted', 'avatar', 'ssnNo', 'idNo'];
    const smallWidthFields = [
      /*'primaryContact',*/
      'isWhatsAppAsso',
      'isWhatsappAsso',
      /*'contact',*/
      'hasValidDrivingLicense',
      'licenseNo',
    ];

    if (fullWidthFields.includes(inputName)) {
      return 12;
    } else if (smallWidthFields.includes(inputName)) {
      return 3;
    } else {
      return 6;
    }
  };

  return (
    <React.Fragment>
      <CRow>
        {inputFields.map((input, index) => {
          const FieldComponent = input.component;
          const conditionalProps = Object.fromEntries(
            Object.entries(input).filter(([key, value]) => Boolean(value)),
          );
          const colWidth = getColWidth(input.name);

          return (
            <CCol key={index} xl={colWidth} className="">
              <FieldComponent {...conditionalProps} />
            </CCol>
          );
        })}
      </CRow>
      {children}
      {isBtn !== false && (
        <CRow className="CenterAlign gap-3">
          <Button title="Cancel" onClick={confirmationModal} />
          <Button title="Submit" type="submit" onClick={submitFn} />
        </CRow>
      )}
    </React.Fragment>
  );
};

export default Inputs;

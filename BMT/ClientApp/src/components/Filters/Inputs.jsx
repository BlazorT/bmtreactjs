/* eslint-disable react/prop-types */
import { CCol, CFormCheck, CFormLabel, CRow } from '@coreui/react';
import React from 'react';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import Button from '../InputsComponent/Button';

const Inputs = ({
  inputFields,
  yesFn,
  submitFn,
  children,
  isBtn,
  submitBtnTitle = 'Submit',
  submitting = false, // ✅ new prop for loading
  isDiscard = false,
}) => {
  const showConfirmation = useShowConfirmation();
  const confirmationModal = () => {
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${isDiscard ? 'discard' : 'cancel'}?`,
      isOpen: true,
      onYes: () => {
        showConfirmation({
          isOpen: false,
        });
        yesFn();
      },
      onNo: () =>
        showConfirmation({
          isOpen: false,
        }),
    });
  };

  const getColWidth = (inputName) => {
    const fullWidthFields = ['isTermsAccepted', 'avatar', 'ssnNo', 'idNo', 'networkId'];
    const smallWidthFields = [
      'isWhatsAppAsso',
      'isWhatsappAsso',
      'hasValidDrivingLicense',
      'autoReplyContent',
      'autoReplyAllowed',
      'licenseNo',
      'virtualAccount',
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
          const colWidth = input?.className?.includes('small-3')
            ? 3
            : getColWidth(input.name, input.component);

          // 🟩 1️⃣ Handle RadioGroup type specially
          {
            /* 🟩 1️⃣ Handle RadioGroup type specially */
          }
          if (input.component === 'RadioGroup') {
            return (
              <CCol key={index} xl={colWidth}>
                <CFormLabel className="labelName">{input.label}</CFormLabel>
                <div className="d-flex">
                  {input.options.map((opt) => {
                    const radioId = `${input.name}-${opt.value}`; // ✅ unique id
                    return (
                      <CFormCheck
                        key={opt.value}
                        type="radio"
                        name={input.name}
                        id={radioId}
                        value={opt.value}
                        label={opt.label}
                        inline
                        checked={input.value === opt.value}
                        onChange={input.onChange}
                        className="me-3 d-flex align-items-center"
                      />
                    );
                  })}
                </div>
              </CCol>
            );
          }

          // 🟩 2️⃣ Default behavior for all other components
          const FieldComponent = input.component;
          const conditionalProps = Object.fromEntries(
            Object.entries(input).filter(([key, value]) => Boolean(value)),
          );

          return (
            <CCol key={index} xl={colWidth}>
              <FieldComponent {...conditionalProps} />
            </CCol>
          );
        })}
      </CRow>

      {children}

      {isBtn !== false && (
        <CRow className="CenterAlign gap-3">
          <Button title="Cancel" onClick={() => confirmationModal()} disabled={submitting} />
          <Button
            title={submitting ? 'Submitting...' : submitBtnTitle} // ✅ show submitting text
            type="submit"
            onClick={submitFn}
            disabled={submitting} // ✅ disable button while submitting
          />
        </CRow>
      )}
    </React.Fragment>
  );
};

export default Inputs;

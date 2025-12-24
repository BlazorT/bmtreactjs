/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { CCol, CRow } from '@coreui/react';

export interface FilterField {
  component: React.ElementType;
  label?: string;
  value?: any;
  onChange?: (value: any) => void;
  icon?: any;
  type?: string;
  id?: string;
  name?: string;
  optionsList?: any;
  options?: any[];
  data?: any;
  placeholder?: string;
  className?: string;
  isRequired?: boolean;
  max?: any;
  min?: any;
  title?: string;
  message?: string;
  disableOption?: string;
  disabled?: boolean;
}

interface CustomFiltersProps {
  filters: any;
  fetching: (filters: any) => void;
  handleReset: () => void;
  filterFields: FilterField[];
}

const CustomFilters: React.FC<CustomFiltersProps> = ({
  filters,
  fetching,
  handleReset,
  filterFields,
}) => {
  return (
    <div className="show-stock">
      <div className="mb-0 dashboard-table">
        <CRow>
          {filterFields.map((field, index) => {
            const FieldComponent = field.component;
            return (
              <CCol key={index} md={6}>
                <FieldComponent
                  label={field.label}
                  value={field.value}
                  onChange={field.onChange}
                  icon={field.icon}
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  options={field.options}
                  data={field.data}
                  placeholder={field.placeholder}
                  className={field.className}
                  isRequired={field.isRequired}
                  max={field.max}
                  min={field.min}
                  title={field.title}
                  message={field.message}
                  disabled={field.disabled}
                  disableOption={field.disableOption}
                  optionsList={field.optionsList}
                />
              </CCol>
            );
          })}
          <CCol>
            <div className="row ">
              <div className="mt-4 FloatRight">
                {fetching && (
                  <button
                    type="button"
                    title="Click For Search Data"
                    className="btn_Default m-2 sales-btn-style alignLeft"
                    onClick={() => fetching(filters)}
                  >
                    Search
                  </button>
                )}
                <button
                  type="button"
                  title="Click For Reset Data"
                  className="btn_Default m-2 sales-btn-style alignLeft"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};

export default CustomFilters;

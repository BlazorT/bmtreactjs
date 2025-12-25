/* eslint-disable react/prop-types */
import React from 'react'; // Removed useState, useEffect as we rely on props now
import { CCol, CRow, CAlert } from '@coreui/react';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import { cilText, cilImage, cilVideo, cilFile } from '@coreui/icons';

const WhatsAppTemplateEditor = ({ value, onChange }) => {
  // If no template is loaded in Custom2, show message
  if (!value || !value.components) {
    return <CAlert color="info">Please select a WhatsApp template from the template list.</CAlert>;
  }
  console.log({ value });
  // Extract data directly from the single source of truth (Custom2 value)
  const { components, parameters } = value;

  // --- Handlers ---

  const handleParameterChange = (section, index, newValue) => {
    // Deep copy the current state
    const updatedParams = { ...parameters };

    // Update the specific value
    if (updatedParams[section][index]) {
      if (updatedParams[section][index].type === 'text') {
        updatedParams[section][index].text = newValue;
      } else {
        const mediaType = updatedParams[section][index].type;
        updatedParams[section][index][mediaType] = { link: newValue };
      }
    }

    // Return the WHOLE updated object to parent
    onChange({
      ...value,
      parameters: updatedParams,
    });
  };

  const getComponentText = (component) => {
    if (!component.text) return '';
    let text = component.text;
    let paramIndex = 1;
    return text.replace(/\{\{(\d+)\}\}/g, () => `{{${paramIndex++}}}`);
  };

  // --- Renderers ---

  const renderParameterInput = (section, index, param) => {
    const label = `${section.charAt(0).toUpperCase() + section.slice(1)} Parameter ${index + 1}`;

    if (param.type === 'text') {
      return (
        <CustomInput
          key={`${section}-${index}`}
          label={label}
          icon={cilText}
          value={param.text || ''}
          onChange={(e) => handleParameterChange(section, index, e.target.value)}
          placeholder={`Enter value for {{${index + 1}}}`}
          type="text"
          className="form-control"
        />
      );
    }

    // Handle Media Inputs
    const mediaTypes = {
      image: { icon: cilImage, label: 'Header Image URL' },
      video: { icon: cilVideo, label: 'Header Video URL' },
      document: { icon: cilFile, label: 'Header Document URL' },
    };

    if (mediaTypes[param.type]) {
      return (
        <CustomInput
          key={`${section}-${index}`}
          label={mediaTypes[param.type].label}
          icon={mediaTypes[param.type].icon}
          value={param[param.type]?.link || ''}
          onChange={(e) => handleParameterChange(section, index, e.target.value)}
          placeholder="Enter media URL..."
          type="url"
          className="form-control"
        />
      );
    }

    return null;
  };

  // Find components for preview
  const headerComponent = components.find((c) => c.type === 'HEADER');
  const bodyComponent = components.find((c) => c.type === 'BODY');
  const footerComponent = components.find((c) => c.type === 'FOOTER');
  const buttonsComponent = components.find((c) => c.type === 'BUTTONS');

  return (
    <div className="whatsapp-template-editor">
      {/* Template Preview - Read directly from saved components */}
      <div className="border rounded p-3 mb-3 bg-light">
        <div className="fw-bold mb-2">Template Preview:</div>

        {headerComponent && (
          <div className="mb-2">
            <div className="badge bg-info mb-1">HEADER</div>
            {headerComponent.format !== 'TEXT' ? (
              <div className="fst-italic text-muted small">[{headerComponent.format}]</div>
            ) : (
              <div className="small">{getComponentText(headerComponent)}</div>
            )}
          </div>
        )}

        {bodyComponent && (
          <div className="mb-2">
            <div className="badge bg-primary mb-1">BODY</div>
            <div className="small">{getComponentText(bodyComponent)}</div>
          </div>
        )}

        {footerComponent && (
          <div className="mb-2">
            <div className="badge bg-secondary mb-1">FOOTER</div>
            <div className="small">{footerComponent.text}</div>
          </div>
        )}

        {buttonsComponent && buttonsComponent.buttons && (
          <div className="mt-2">
            <div className="badge bg-success mb-1">BUTTONS</div>
            {buttonsComponent.buttons.map((btn, idx) => (
              <div key={idx} className="btn btn-sm btn-outline-primary me-2 mt-1">
                {btn.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Parameter Inputs - Read directly from saved parameters */}
      <div className="border rounded p-3">
        <div className="fw-bold mb-3">Fill Template Parameters:</div>

        <CRow>
          {parameters.header && parameters.header.length > 0 && (
            <CCol md={12} className="mb-3">
              <div className="fw-semibold text-info mb-2">Header Parameters:</div>
              {parameters.header.map((param, index) => (
                <div key={`header-${index}`} className="mb-2">
                  {renderParameterInput('header', index, param)}
                </div>
              ))}
            </CCol>
          )}

          {parameters.body && parameters.body.length > 0 && (
            <CCol md={12} className="mb-3">
              <div className="fw-semibold text-primary mb-2">Body Parameters:</div>
              {parameters.body.map((param, index) => (
                <div key={`body-${index}`} className="mb-2">
                  {renderParameterInput('body', index, param)}
                </div>
              ))}
            </CCol>
          )}
        </CRow>
      </div>
    </div>
  );
};

export default WhatsAppTemplateEditor;

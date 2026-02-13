/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { cilFile, cilImage, cilText, cilVideo } from '@coreui/icons';
import { CAlert, CBadge, CCol, CRow } from '@coreui/react';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useSelector } from 'react-redux';
import CustomInput from 'src/components/InputsComponent/CustomInput';
import { useUploadAvatar } from 'src/hooks/api/useUploadAvatar';
import { useShowToast } from 'src/hooks/useShowToast';
import Button from '../InputsComponent/Button';

dayjs.extend(utc);

const WhatsAppTemplateEditor = ({ value, onChange, onClear }) => {
  const user = useSelector((state) => state.user);
  const { uploadAvatar } = useUploadAvatar();
  const showToast = useShowToast();
  if (!value || !value.components) {
    return <CAlert color="info">Please select a WhatsApp template from the template list.</CAlert>;
  }

  const { components, parameters } = value;

  const handleMediaUpload = async (section, index, file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', '0');
      formData.append('name', file.name);
      formData.append('fileName', file.name);
      formData.append('createdBy', user?.userId || 1);
      formData.append('createdAt', dayjs().utc().format());

      const uploadAvatarRes = await uploadAvatar(formData);

      if (uploadAvatarRes?.status === true) {
        const uploadedPath =
          window.location.origin +
          '/productimages/' +
          uploadAvatarRes.keyValue.toString().split('\\').pop();
        handleParameterChange(section, index, uploadedPath);
        if (showToast) {
          showToast('File uploaded successfully', 'success');
        }
      } else if (uploadAvatarRes?.message && showToast) {
        showToast(uploadAvatarRes.message, 'error');
      }
    } catch {
      if (showToast) {
        showToast('Failed to upload file', 'error');
      }
    }
  };

  const handleParameterChange = (section, index, newValue) => {
    const updatedParams = { ...parameters };

    if (updatedParams[section][index]) {
      if (updatedParams[section][index].type === 'text') {
        updatedParams[section][index].text = newValue;
      } else {
        const mediaType = updatedParams[section][index].type;
        updatedParams[section][index][mediaType] = { link: newValue };
      }
    }

    onChange({ ...value, parameters: updatedParams });
  };

  // Replace {{1}}, {{2}} etc. in text with parameter values
  const fillTextWithParams = (component, section) => {
    if (!component.text) return '';
    let text = component.text;
    let paramIndex = 0;

    return text.replace(/\{\{(\d+)\}\}/g, () => {
      const param = parameters[section]?.[paramIndex];
      paramIndex++;
      if (!param) return '';
      // Wrap the parameter value in {{ }}
      return param.type === 'text' ? `{{${param.text}}}` : `{{[${param.type.toUpperCase()}]}}`;
    });
  };

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

    const mediaTypes = {
      image: { icon: cilImage, label: 'Header Image URL' },
      video: { icon: cilVideo, label: 'Header Video URL' },
      document: { icon: cilFile, label: 'Header Document URL' },
    };

    if (mediaTypes[param.type]) {
      return (
        <div className="d-flex flex-row align-items-center gap-3">
          <CustomInput
            key={`${section}-${index}`}
            label={mediaTypes[param.type].label}
            icon={mediaTypes[param.type].icon}
            value={param[param.type]?.link || ''}
            onChange={(e) => handleParameterChange(section, index, e.target.value)}
            placeholder="Enter media URL..."
            type="url"
            className="form-control"
            containerClass="w-75"
          />

          <div className="d-flex flex-column align-items-center gap-1 mt-3 pt-3">
            <label className="btn btn-outline-secondary btn-sm p-2 text-white d-flex align-items-center gap-2 mb-0 cursor-pointer text-nowrap">
              <FontAwesomeIcon icon={faUpload} className="text-white" />
              Upload {param.type}
              <input
                type="file"
                accept={
                  param.type === 'image' ? 'image/*' : param.type === 'video' ? 'video/*' : '*/*'
                }
                onChange={(e) => handleMediaUpload(section, index, e.target.files?.[0])}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      );
    }

    return null;
  };

  const headerComponent = components.find((c) => c.type === 'HEADER');
  const bodyComponent = components.find((c) => c.type === 'BODY');
  const footerComponent = components.find((c) => c.type === 'FOOTER');
  const buttonsComponent = components.find((c) => c.type === 'BUTTONS');

  return (
    <div className="whatsapp-template-editor mt-2">
      {/* Template Preview */}
      <div className="border rounded p-2 mb-2 bg-light">
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div className="d-flex flex-row align-items-center gap-3 mb-2">
            <div className="fw-bold">Template Preview:</div>
            <CBadge color="secondary">{value.category}</CBadge>
          </div>
          {onClear && (
            <Button title="Clear" onClick={onClear} className="h-auto w-auto px-3 py-2" />
          )}
        </div>

        {/* HEADER */}
        {headerComponent && (
          <div className="mb-2 d-flex flex-column">
            <div className="badge bg-info mb-1">HEADER</div>
            {headerComponent.format !== 'TEXT' ? (
              <div>
                {parameters.header?.[0] && parameters.header[0][parameters.header[0].type]?.link ? (
                  parameters.header[0].type === 'image' ? (
                    <img
                      src={parameters.header[0].image.link}
                      alt="Header Image"
                      style={{ maxWidth: '100%', maxHeight: 100 }}
                    />
                  ) : parameters.header[0].type === 'video' ? (
                    <video controls style={{ maxWidth: '100%', maxHeight: 150 }}>
                      <source src={parameters.header[0].video.link} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <span className="btn btn-outline-secondary btn-sm">
                        <cilFile /> Document
                      </span>
                      <span>{parameters.header[0].document.link}</span>
                    </div>
                  )
                ) : (
                  <div className="fst-italic text-muted small">[{headerComponent.format}]</div>
                )}
              </div>
            ) : (
              <div className="small">{fillTextWithParams(headerComponent, 'header')}</div>
            )}
          </div>
        )}

        {/* BODY */}
        {bodyComponent && (
          <div className="mb-2">
            <div className="badge bg-warning mb-1">BODY</div>
            <div className="small">{fillTextWithParams(bodyComponent, 'body')}</div>
          </div>
        )}

        {/* FOOTER */}
        {footerComponent && (
          <div className="mb-2">
            <div className="badge bg-secondary mb-1">FOOTER</div>
            <div className="small">{footerComponent.text}</div>
          </div>
        )}

        {/* BUTTONS */}
        {buttonsComponent?.buttons?.length > 0 && (
          <div className="mt-2 d-flex flex-column">
            <div className="badge bg-success mb-1">BUTTONS</div>
            {buttonsComponent.buttons.map((btn, idx) => (
              <div key={idx} className="btn btn-sm btn-outline-primary me-2 mt-1 fit-content-width">
                {btn.text}
              </div>
            ))}
          </div>
        )}
      </div>
      {parameters?.body?.length === 0 &&
      parameters?.footer?.length === 0 &&
      parameters?.header?.length === 0 ? null : (
        <div className="border rounded p-2">
          <div className="fw-bold mb-1">Fill Template Parameters:</div>
          <CRow>
            {parameters.header?.length > 0 && (
              <CCol md={12} className="mb-2">
                <div className="fw-semibold text-info mb-1">Header Parameters:</div>
                {parameters.header.map((param, index) => (
                  <div key={`header-${index}`} className="mb-1">
                    {renderParameterInput('header', index, param)}
                  </div>
                ))}
              </CCol>
            )}
            {parameters.body?.length > 0 && (
              <CCol md={12} className="mb-2">
                <div className="fw-semibold text-primary mb-1">Body Parameters:</div>
                {parameters.body.map((param, index) => (
                  <div key={`body-${index}`} className="mb-1">
                    {renderParameterInput('body', index, param)}
                  </div>
                ))}
              </CCol>
            )}
          </CRow>
        </div>
      )}
    </div>
  );
};

export default WhatsAppTemplateEditor;

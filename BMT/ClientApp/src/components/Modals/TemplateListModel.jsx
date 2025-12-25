/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import {
  CListGroup,
  CListGroupItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CBadge,
} from '@coreui/react';
import { useEffect } from 'react';
import useApi from 'src/hooks/useApi';
import Spinner from '../UI/Spinner';

const TemplateListModel = ({ isOpen, toggle, networkId = 0, onSelect, WABA, WAT }) => {
  const {
    data,
    loading,
    postData: fetchTemplates,
  } = useApi('Template/campaigntemplatesallnetworks');

  const {
    data: whatsappTemplateData,
    loading: whatsappTemplatesLoading,
    postData: fetchWhatsappTemplates,
  } = useApi(`https://graph.facebook.com/v13.0/${WABA}/message_templates`, 'GET', null, {
    Authorization: `Bearer ${WAT}`,
  });

  useEffect(() => {
    if (isOpen && networkId) {
      if (Number(networkId) === 2 && WAT && WABA) {
        fetchWhatsappTemplates();
      } else {
        fetchTemplates({
          keyword: '',
          status: 1,
          networkId,
        });
      }
    }
  }, [isOpen, networkId, WAT, WABA]);

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const renderWhatsAppTemplate = (template) => {
    const headerComponent = template.components?.find((c) => c.type === 'HEADER');
    const bodyComponent = template.components?.find((c) => c.type === 'BODY');
    const footerComponent = template.components?.find((c) => c.type === 'FOOTER');
    const buttonsComponent = template.components?.find((c) => c.type === 'BUTTONS');

    return (
      <CListGroupItem
        key={template.id}
        className="px-3 py-3 border rounded mb-2"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          onSelect({
            id: template.id,
            name: template.name,
            template: template.name, // template name for WhatsApp
            title: template.name,
            subject: template.language, // language code
            networkId: 2,
            whatsappTemplate: template, // full template data
          });
          toggle();
        }}
      >
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="fw-bold text-primary">{template.name}</div>
          <CBadge color={getStatusColor(template.status)}>{template.status}</CBadge>
        </div>

        <div className="mb-2">
          <CBadge color="info" className="me-2">
            {template.language}
          </CBadge>
          <CBadge color="secondary">{template.category}</CBadge>
        </div>

        <div className="border-start border-3 border-primary ps-3">
          {headerComponent && (
            <div className="mb-2">
              <div className="badge bg-info text-white mb-1" style={{ fontSize: '0.7rem' }}>
                HEADER {headerComponent.format && `(${headerComponent.format})`}
              </div>
              <div className="small text-muted">
                {headerComponent.format === 'TEXT'
                  ? truncateText(headerComponent.text, 50)
                  : `[${headerComponent.format} Media]`}
              </div>
            </div>
          )}

          {bodyComponent && (
            <div className="mb-2">
              <div className="badge bg-primary text-white mb-1" style={{ fontSize: '0.7rem' }}>
                BODY
              </div>
              <div className="small">{truncateText(bodyComponent.text, 300)}</div>
            </div>
          )}

          {footerComponent && (
            <div className="mb-2">
              <div className="badge bg-secondary text-white mb-1" style={{ fontSize: '0.7rem' }}>
                FOOTER
              </div>
              <div className="small text-muted">{truncateText(footerComponent.text, 50)}</div>
            </div>
          )}

          {buttonsComponent && buttonsComponent.buttons && (
            <div className="mt-2">
              <div className="badge bg-success text-white mb-1" style={{ fontSize: '0.7rem' }}>
                BUTTONS ({buttonsComponent.buttons.length})
              </div>
              <div className="d-flex flex-wrap gap-1">
                {buttonsComponent.buttons.slice(0, 3).map((btn, idx) => (
                  <span key={idx} className="badge bg-light text-dark border">
                    {btn.text}
                  </span>
                ))}
                {buttonsComponent.buttons.length > 3 && (
                  <span className="badge bg-light text-dark border">
                    +{buttonsComponent.buttons.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Show parameter indicators */}
        {(bodyComponent?.example?.body_text?.[0]?.length > 0 ||
          headerComponent?.example?.header_text?.length > 0 ||
          headerComponent?.format !== 'TEXT') && (
          <div className="mt-2 pt-2 border-top">
            <small className="text-warning">
              ⚠️ This template requires {bodyComponent?.example?.body_text?.[0]?.length || 0}{' '}
              parameter(s)
            </small>
          </div>
        )}
      </CListGroupItem>
    );
  };

  const renderRegularTemplate = (template, templateIndex) => (
    <CListGroupItem
      key={template.id || templateIndex}
      className="px-2 py-2 border-start-0 rounded border-end-0"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        onSelect(template);
        toggle();
      }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <div className="fw-semibold text-primary small mb-1">Name : {template.name}</div>
          {template.title && (
            <div className="text-primary small mb-1">
              <strong>Title :</strong> {template.title}
            </div>
          )}
          {template.subject && (
            <div className="text-primary small mb-1">
              <strong>Subject :</strong> {truncateText(template.subject, 50)}
            </div>
          )}
          {template.template && (
            <div className="text-primary small">
              <strong>Content:</strong> {truncateText(template.template, 80)}
            </div>
          )}
        </div>
      </div>
    </CListGroupItem>
  );

  const isWhatsApp = Number(networkId) === 2;
  const templates = isWhatsApp ? whatsappTemplateData?.data || [] : data?.data || [];
  const isLoading = isWhatsApp ? whatsappTemplatesLoading : loading;

  return (
    <CModal
      visible={isOpen}
      // onClose={toggle}
      alignment="center"
      size={isWhatsApp ? 'lg' : 'sm'}
      className="template-list-model"
      aria-labelledby="template-modal"
      aria-describedby="template-in-full-view"
    >
      <CModalHeader closeButton={true}>
        <CModalTitle>
          {isWhatsApp ? 'WhatsApp Templates' : 'Templates'}
          {templates.length > 0 && (
            <CBadge color="primary" className="ms-2">
              {templates.length}
            </CBadge>
          )}
        </CModalTitle>
      </CModalHeader>

      {isLoading ? (
        <Spinner />
      ) : templates.length === 0 ? (
        <div className="p-4 text-center text-muted">
          <div className="mb-2">📭</div>
          <div>
            {isWhatsApp
              ? 'No WhatsApp templates found. Please create templates in Meta Business Suite first.'
              : 'No templates available. Create one to get started.'}
          </div>
        </div>
      ) : (
        <CListGroup
          className="list-group-flush"
          style={{ maxHeight: '600px', overflowY: 'auto', rowGap: 6, padding: 20 }}
        >
          {isWhatsApp
            ? templates.map(renderWhatsAppTemplate)
            : templates.map((template, idx) => renderRegularTemplate(template, idx))}
        </CListGroup>
      )}
    </CModal>
  );
};

export default TemplateListModel;

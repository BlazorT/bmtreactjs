/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { CBadge, CCard, CListGroup, CListGroupItem } from '@coreui/react';
import { useEffect } from 'react';
import { getStatusColor } from 'src/helpers/campaignHelper';
import useApi from 'src/hooks/useApi';
import Spinner from '../UI/Spinner';
import { useShowToast } from 'src/hooks/useShowToast';

const WhatsappTemplate = ({ onSelect, WABA, WAT }) => {
  const showToast = useShowToast();
  const {
    data: whatsappTemplateData,
    loading: whatsappTemplatesLoading,
    postData: fetchWhatsappTemplates,
  } = useApi(`https://graph.facebook.com/v13.0/${WABA}/message_templates`, 'GET', null, {
    Authorization: `Bearer ${WAT}`,
  });

  useEffect(() => {
    if (WAT && WABA) {
      fetchWhatsappTemplates();
    }
  }, [WAT, WABA]);

  useEffect(() => {
    if (whatsappTemplateData?.error?.message) {
      showToast(whatsappTemplateData?.error?.message, 'error');
    }
  }, [whatsappTemplateData]);

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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

  const templates = whatsappTemplateData?.data || [];
  const isLoading = whatsappTemplatesLoading;

  return (
    <CCard className="mt-2">
      {isLoading ? (
        <Spinner />
      ) : templates.length === 0 ? (
        <div className="p-4 text-center text-muted">
          <div className="mb-2">📭</div>
          <div>
            {!WAT || !WAT
              ? 'Provide whatsapp buisness account id and access token to see templates'
              : 'No WhatsApp templates found. Please create templates in Meta Business Suite first.'}
          </div>
        </div>
      ) : (
        <CListGroup
          className="list-group-flush"
          style={{ maxHeight: '600px', overflowY: 'auto', rowGap: 6, padding: 20 }}
        >
          {templates.map(renderWhatsAppTemplate)}
        </CListGroup>
      )}
    </CCard>
  );
};

export default WhatsappTemplate;

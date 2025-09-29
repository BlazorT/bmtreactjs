/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { CListGroup, CListGroupItem, CModal, CModalHeader, CModalTitle } from '@coreui/react';
import { useMemo } from 'react';
import useApi from 'src/hooks/useApi';
import Spinner from '../UI/Spinner';

const TemplateListModel = ({ isOpen, toggle, networkId = 0, onSelect }) => {
  const body = useMemo(
    () =>
      isOpen
        ? {
            keyword: '',
            status: 1,
            networkId,
          }
        : null,
    [isOpen, networkId],
  );
  const {
    data,
    loading,
    error,
    postData: fetchTemplates,
  } = useApi('Template/campaigntemplatesallnetworks', 'POST', body);

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <CModal
      visible={isOpen}
      alignment="center"
      size="sm"
      className="template-list-model"
      aria-labelledby="template-modal"
      aria-describedby="template-in-full-view"
    >
      <CModalHeader closeButton={true}>
        <CModalTitle>Templates</CModalTitle>
      </CModalHeader>

      {loading ? (
        <Spinner />
      ) : (
        <CListGroup
          className="list-group-flush p"
          style={{ maxHeight: '600px', overflowY: 'auto', rowGap: 6, padding: 20 }}
        >
          {(data?.data || []).map((template, templateIndex) => (
            <CListGroupItem
              key={template.id || templateIndex}
              className="px-2 py-2 border-start-0 rounded border-end-0"
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
          ))}
        </CListGroup>
      )}
    </CModal>
  );
};

export default TemplateListModel;

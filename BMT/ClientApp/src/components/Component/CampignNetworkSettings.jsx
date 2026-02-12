/* eslint-disable react/prop-types */
import CIcon from '@coreui/icons-react';
import { cilInfo, cilPencil } from '@coreui/icons';
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CFormCheck,
  CListGroup,
  CListGroupItem,
  CRow,
  CTooltip,
} from '@coreui/react';
import React, { useState } from 'react';
import useApi from 'src/hooks/useApi';
import globalutil from 'src/util/globalutil';
import DataGridHeader from '../DataGridComponents/DataGridHeader';
import AppContainer from '../UI/AppContainer';
import Button from '../UI/Button';
import AddTemplateModal from '../Modals/AddTemplateModel';
import QuotaBadge from './QuotaBadge';

// ─── Helpers ────────────────────────────────────────────────────────────────

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const toTitleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// ─── Sub-components ──────────────────────────────────────────────────────────

const PostTypesSection = ({
  postTypeList,
  networkName,
  selectedPostTypes,
  IconName,
  handlePostTypeToggle,
}) => {
  if (postTypeList.length <= 1) return null;

  return (
    <div className="border-top pt-3 mb-3">
      <h6 className="text-white mb-2 small">Post Types:</h6>
      <div className="row g-2">
        {postTypeList.map((pt) => (
          <div key={`${IconName}-${pt.id}`} className="col-6">
            <CFormCheck
              id={`${IconName}-${pt.id}`}
              name={`${IconName}-${pt.id}`}
              label={<small className="text-primary">{toTitleCase(pt.name)}</small>}
              checked={selectedPostTypes[networkName]?.includes(pt.id) || false}
              onChange={() => handlePostTypeToggle(networkName, pt.id)}
              className="mb-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const SelectedTemplateItem = ({
  networkName,
  IconName,
  selectedTemplates,
  handleTemplateToggle,
  setShowTemplateList,
  setNetworkId,
  setEditTemplate,
  toggleShowTemplateModal,
}) => {
  const selected = selectedTemplates?.[networkName];
  if (!selected) return null;

  const parsedJson = selected?.templateJson ? JSON.parse(selected.templateJson) : null;
  const isBodyType2 = parsedJson?.templateType == 2 || !parsedJson?.templateType;
  const bodyText = parsedJson?.components?.find((c) => c?.type == 'BODY')?.text || '--';

  return (
    <CListGroupItem className="px-2 py-2 border-start-0 rounded border-end-0 d-flex">
      <div className="d-flex flex-grow-1 justify-content-between align-items-start">
        <div className="flex-grow-1">
          <div className="fw-bold text-primary text-center small mb-1">Selected Template</div>

          {isBodyType2 && selected?.template && (
            <div className="text-primary small">
              <strong>Content:</strong> {truncateText(selected.template, 80)}
            </div>
          )}

          {(!parsedJson?.templateType || parsedJson?.templateType == 1) &&
            selected?.templateJson && (
              <div className="text-primary small">
                <strong>Content:</strong> {truncateText(bodyText, 80)}
              </div>
            )}
        </div>
      </div>

      <CBadge className="d-flex gap-2 justify-content-center align-items-center">
        <CTooltip content="Edit or Preview">
          <CIcon
            onClick={() => {
              setNetworkId(selected?.id);
              setEditTemplate(selected);
              toggleShowTemplateModal();
            }}
            className="stock-toggle-icon"
            icon={cilPencil}
            style={{ cursor: 'pointer' }}
          />
        </CTooltip>
        <CFormCheck
          id={`${IconName}-${selected?.id}`}
          name={`${IconName}-${selected?.id}`}
          checked={true}
          onChange={() => {
            setShowTemplateList((prev) => ({ ...prev, [networkName]: true }));
            handleTemplateToggle(networkName, selected);
          }}
          className="mb-0"
        />
      </CBadge>
    </CListGroupItem>
  );
};

const TemplateListItem = ({
  template,
  IconName,
  networkName,
  selectedTemplates,
  handleTemplateToggle,
  setShowTemplateList,
  setEditTemplate,
  toggleShowTemplateModal,
}) => {
  const isWhatsApp = template?.networkId == 2;
  const templateJson =
    isWhatsApp && template?.templateJson ? JSON.parse(template.templateJson) : null;
  const bodyText =
    templateJson?.components?.find((c) => c.type === 'BODY')?.text || template.template;

  return (
    <CListGroupItem className="px-2 py-2 border-start-0 rounded border-end-0">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <div className="fw-semibold text-primary small mb-1">Name: {template.name}</div>
          {template.title && (
            <div className="text-primary small mb-1">
              <strong>Language:</strong> {template.title}
            </div>
          )}
          {template.subject && !isWhatsApp && (
            <div className="text-primary small mb-1">
              <strong>Subject:</strong> {truncateText(template.subject, 50)}
            </div>
          )}
          {(template.template || (isWhatsApp && templateJson)) && (
            <div className="text-primary small">
              <strong>Content:</strong> {truncateText(bodyText, 80)}
            </div>
          )}
        </div>

        <CBadge className="d-flex gap-2 justify-content-center align-items-center">
          <CTooltip content="Edit or Preview">
            <CIcon
              onClick={() => {
                setEditTemplate(template);
                toggleShowTemplateModal();
              }}
              className="stock-toggle-icon"
              icon={cilPencil}
              style={{ cursor: 'pointer' }}
            />
          </CTooltip>
          <CFormCheck
            id={`${IconName}-${template.id}`}
            name={`${IconName}-${template.id}`}
            checked={selectedTemplates?.[networkName]?.id === template.id}
            onChange={(e) => {
              if (e.target.checked) {
                setShowTemplateList((prev) => ({ ...prev, [networkName]: false }));
              }
              handleTemplateToggle(networkName, template);
            }}
            className="mb-0"
          />
        </CBadge>
      </div>
    </CListGroupItem>
  );
};

const TemplatesSection = ({
  templates,
  networkId,
  networkName,
  network,
  showTemplateList,
  selectedTemplates,
  handleTemplateToggle,
  setShowTemplateList,
  setEditTemplate,
  setNetworkId,
  toggleShowTemplateModal,
}) => {
  const hasLoaded = (networkTemplates) => networkTemplates !== undefined;

  if (templates.length === 0 && hasLoaded(templates)) return null; // handled below separately

  if (!showTemplateList?.[networkName] || templates.length === 0) return null;

  return (
    <div className="border-top pt-3 mb-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h6 className="text-primary mb-0 small">Templates ({templates.length})</h6>
        <CBadge color="primary" shape="rounded-pill" className="d-flex">
          <div
            className="pointer"
            onClick={() => {
              setNetworkId(networkId);
              setEditTemplate(null);
              toggleShowTemplateModal();
            }}
          >
            Template (+)
          </div>
        </CBadge>
      </div>

      <CListGroup
        className="list-group-flush"
        style={{ maxHeight: '200px', overflowY: 'auto', rowGap: 6 }}
      >
        {templates.map((template, idx) => (
          <TemplateListItem
            key={template.id || idx}
            template={template}
            IconName={network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase()}
            networkName={networkName}
            selectedTemplates={selectedTemplates}
            handleTemplateToggle={handleTemplateToggle}
            setShowTemplateList={setShowTemplateList}
            setEditTemplate={setEditTemplate}
            toggleShowTemplateModal={toggleShowTemplateModal}
          />
        ))}
      </CListGroup>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const CampignNetworkSettings = ({
  networksList,
  selectedNetworks,
  selectedPostTypes,
  handlePostTypeToggle,
  icons,
  handleCheckboxChange,
  setActiveTab,
  toggleAddScheduleMdl,
  handleTemplateToggle,
  selectedTemplates,
  setSelectedTemplates,
  whatsAppNetworkSettings,
}) => {
  const [loadingNetworkId, setLoadingNetworkId] = useState(null);
  const [networkTemplates, setNetworkTemplates] = useState({});
  const [isTemplateModelOpen, setIsTemplateModalOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [showTemplateList, setShowTemplateList] = useState({});
  const [networkId, setNetworkId] = useState(null);

  const toggleShowTemplateModal = () => setIsTemplateModalOpen((prev) => !prev);

  const { loading, postData: fetchTemplates } = useApi(
    'Template/campaigntemplatesallnetworks',
    'POST',
  );

  const getTemplates = async (networkId) => {
    setLoadingNetworkId(networkId);
    try {
      const response = await fetchTemplates({ keyword: '', status: 1, networkId });
      setNetworkTemplates((prev) => ({ ...prev, [networkId]: response?.data || [] }));
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingNetworkId(null);
    }
  };

  const onTemplateEdit = (updatedTemplate) => {
    setNetworkTemplates((prev) => {
      const nId = updatedTemplate.networkId;
      const existing = prev[nId] || [];
      const exists = existing.some((tpl) => tpl.id === updatedTemplate.id);

      const templateToSave = exists
        ? updatedTemplate
        : { ...updatedTemplate, id: Math.floor(100000 + Math.random() * 900000) };

      return {
        ...prev,
        [nId]: exists
          ? existing.map((tpl) => (tpl.id === updatedTemplate.id ? templateToSave : tpl))
          : [...existing, templateToSave],
      };
    });

    setSelectedTemplates((prev) => {
      const network = globalutil.networks()?.find((nn) => nn?.id === updatedTemplate?.networkId);
      if (!network) return prev;

      const networkName = network.name;
      if (prev[networkName]?.id === updatedTemplate.id) {
        return { ...prev, [networkName]: updatedTemplate };
      }
      return prev;
    });

    toggleShowTemplateModal();
    setEditTemplate(null);
  };

  const visibleNetworks = globalutil
    .networks()
    .filter((network) => networksList.some((apiNet) => apiNet?.networkId === network.id));

  return (
    <React.Fragment>
      <AppContainer>
        <DataGridHeader title="Networks" filterDisable={true} />

        <CRow className="p-2">
          {visibleNetworks.map((network, index) => {
            const networkBundle = networksList.find((apiNet) => apiNet?.networkId === network.id);
            const totalQuota = networkBundle?.purchasedQouta || 0;
            const usedQuota = networkBundle?.usedQuota || 0;
            const remainingQuota = totalQuota - usedQuota;

            const IconName = toTitleCase(network.name);
            const isSelected = selectedNetworks.includes(network.name);
            const templates = networkTemplates[network?.id] || [];
            const hasLoadedTemplates = networkTemplates[network?.id] !== undefined;

            let postTypeIds = [];
            try {
              postTypeIds = JSON.parse(network.desc || '[]');
            } catch {
              console.warn('Invalid desc format in network:', network.desc);
            }

            const postTypeList = globalutil.postTypes().filter((pt) => postTypeIds.includes(pt.id));

            // Auto-select/deselect single post type
            if (postTypeList.length === 1) {
              const singleTypeId = postTypeList[0].id;
              if (isSelected && !selectedPostTypes[network.name]?.includes(singleTypeId)) {
                handlePostTypeToggle(network.name, singleTypeId);
              } else if (!isSelected && selectedPostTypes[network.name]?.includes(singleTypeId)) {
                handlePostTypeToggle(network.name, singleTypeId);
              }
            }

            const sharedTemplateProps = {
              networkName: network.name,
              network,
              networkId: network?.id,
              showTemplateList,
              selectedTemplates,
              handleTemplateToggle,
              setShowTemplateList,
              setEditTemplate,
              setNetworkId,
              toggleShowTemplateModal,
            };

            return (
              <CCol md={6} lg={4} key={index} className="mb-4">
                <CCard className="border-0 shadow-sm">
                  <CCardBody className="p-3">
                    {/* ── Header: Icon + Checkbox + Quota ── */}
                    <div className="d-flex flex-wrap align-items-center mb-3">
                      <div className="me-2">
                        <div
                          className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center position-relative"
                          style={{ width: '60px', height: '60px' }}
                        >
                          <div className="divCircle">
                            <CIcon className="BlazorIcon" icon={icons[IconName]} size="xl" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center flex-wrap gap-1">
                            <CFormCheck
                              id={IconName}
                              name={IconName}
                              label={
                                <span className="fw-semibold text-white d-flex">
                                  {network.name}
                                </span>
                              }
                              checked={isSelected}
                              onChange={() => handleCheckboxChange(network.name)}
                              className="mb-0 d-flex align-items-center"
                            />
                            <QuotaBadge
                              totalQuota={totalQuota}
                              usedQuota={usedQuota}
                              remainingQuota={remainingQuota}
                            />
                          </div>

                          <Button
                            title="Select Templates"
                            loading={loading && loadingNetworkId === network?.id}
                            onClick={() => {
                              setShowTemplateList((prev) => ({ ...prev, [network?.name]: true }));
                              getTemplates(network?.id);
                            }}
                            className="w-auto btn btn-outline-primary btn-sm ms-2 px-2"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Post Types ── */}
                    <PostTypesSection
                      postTypeList={postTypeList}
                      networkName={network.name}
                      selectedPostTypes={selectedPostTypes}
                      IconName={IconName}
                      handlePostTypeToggle={handlePostTypeToggle}
                    />

                    {/* ── Selected Template ── */}
                    <SelectedTemplateItem {...sharedTemplateProps} IconName={IconName} />

                    {/* ── Templates List ── */}
                    {templates.length > 0 && showTemplateList?.[network?.name] && (
                      <TemplatesSection {...sharedTemplateProps} templates={templates} />
                    )}

                    {/* ── Empty Templates ── */}
                    {templates.length === 0 && hasLoadedTemplates && (
                      <div className="border-top pt-3">
                        <div className="text-center text-primary py-3">
                          <small>No templates found for this network</small>
                          <div
                            className="pointer"
                            onClick={() => {
                              setNetworkId(network?.id);
                              setEditTemplate(null);
                              toggleShowTemplateModal();
                            }}
                          >
                            Template (+)
                          </div>
                        </div>
                      </div>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            );
          })}
        </CRow>

        <AddTemplateModal
          isOpen={isTemplateModelOpen}
          toggle={toggleShowTemplateModal}
          template={editTemplate}
          onEdit={onTemplateEdit}
          whatsappNetworkSettings={whatsAppNetworkSettings}
          networkId={networkId}
        />

        {/* ── Navigation ── */}
        <div className="text-center pt-4 border-top">
          <button
            onClick={() => setActiveTab(0)}
            type="button"
            className="btn btn-outline-secondary me-3"
          >
            Back
          </button>
          <button
            onClick={() => {
              setActiveTab(2);
              toggleAddScheduleMdl();
            }}
            type="button"
            className="btn btn-primary"
          >
            Next
          </button>
        </div>
      </AppContainer>
    </React.Fragment>
  );
};

export default CampignNetworkSettings;

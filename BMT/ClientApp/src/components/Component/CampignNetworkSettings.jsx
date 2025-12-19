/* eslint-disable react/prop-types */
import CIcon from '@coreui/icons-react';
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
import { cilPencil } from '@coreui/icons';
import AddTemplateModal from '../Modals/AddTemplateModel';

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
}) => {
  const [loadingNetworkId, setLoadingNetworkId] = useState(null);
  const [networkTemplates, setNetworkTemplates] = useState({});
  const [isTemplateModelOpen, setIsTemplateModalOpen] = React.useState(false);
  const [editTemplate, setEditTemplate] = useState(null);
  const [showTemplateList, setShowTemplateList] = useState(null);

  const toggleShowTemplateModal = () => setIsTemplateModalOpen((prev) => !prev);

  const {
    data,
    loading,
    error,
    postData: fetchTemplates,
  } = useApi('Template/campaigntemplatesallnetworks', 'POST');

  const getTemplates = async (networkId) => {
    setLoadingNetworkId(networkId);
    try {
      const response = await fetchTemplates({
        keyword: '',
        status: 1,
        networkId,
      });

      // Store templates for this specific network
      setNetworkTemplates((prev) => ({
        ...prev,
        [networkId]: response?.data || [],
      }));
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingNetworkId(null);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const onTemplateEdit = (updatedTemplate) => {
    setNetworkTemplates((prev) => {
      const networkId = updatedTemplate.networkId;
      const existingTemplates = prev[networkId] || [];

      // Check if template already exists
      const exists = existingTemplates.some((tpl) => tpl.id === updatedTemplate.id);

      let templateToSave = updatedTemplate;

      if (!exists) {
        // Assign a random 6-digit id if new
        templateToSave = {
          ...updatedTemplate,
          id: Math.floor(100000 + Math.random() * 900000), // generates 100000–999999
        };
      }

      const newTemplates = exists
        ? existingTemplates.map((tpl) => (tpl.id === updatedTemplate.id ? templateToSave : tpl))
        : [...existingTemplates, templateToSave];

      return {
        ...prev,
        [networkId]: newTemplates,
      };
    });

    // Update selectedTemplates only if this template is already selected
    setSelectedTemplates((prev) => {
      const findNN = globalutil.networks()?.find((nn) => nn?.id === updatedTemplate?.networkId);
      if (!findNN) {
        return prev;
      }

      const networkName = findNN.name; // ⚠️ safer if you pass networkName explicitly
      const existing = prev[networkName];

      if (existing?.id === updatedTemplate.id) {
        return {
          ...prev,
          [networkName]: updatedTemplate,
        };
      }

      return prev; // don’t select new ones
    });

    toggleShowTemplateModal();
    setEditTemplate(null);
  };

  return (
    <React.Fragment>
      <AppContainer>
        <DataGridHeader title="Networks" filterDisable={false} />
      </AppContainer>
      <CRow className="p-2">
        {globalutil
          .networks()
          .filter((network) =>
            networksList.some(
              (apiNet) =>
                apiNet?.name?.toLowerCase()?.trim() === network.name?.toLowerCase()?.trim(),
            ),
          )
          .map((network, index) => {
            const displayLabel = network.name;
            const IconName =
              network.name.charAt(0).toUpperCase() + network.name.slice(1).toLowerCase();
            let postTypeIds = [];
            try {
              postTypeIds = JSON.parse(network.desc || '[]');
            } catch (err) {
              console.warn('Invalid desc format in network:', network.desc);
            }
            const postTypeList = globalutil.postTypes().filter((pt) => postTypeIds.includes(pt.id));
            const isSelected = selectedNetworks.includes(network.name);
            // const isLoadingThisNetwork = loadingNetworkId === network?.id;
            const templates = networkTemplates[network?.id] || [];

            // Auto-select/deselect single post type
            if (postTypeList.length === 1) {
              const singleTypeId = postTypeList[0].id;

              if (isSelected && !selectedPostTypes[network.name]?.includes(singleTypeId)) {
                handlePostTypeToggle(network.name, singleTypeId);
              } else if (!isSelected && selectedPostTypes[network.name]?.includes(singleTypeId)) {
                handlePostTypeToggle(network.name, singleTypeId);
              }
            }

            return (
              <CCol md={6} lg={4} key={index} className="mb-4">
                <CCard className="border-0 shadow-sm">
                  <CCardBody className="p-3">
                    {/* Header Section with Icon and Checkbox */}
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
                          <CFormCheck
                            id={IconName}
                            name={IconName}
                            label={
                              <span className="fw-semibold text-white d-flex">{displayLabel}</span>
                            }
                            checked={isSelected}
                            onChange={() => handleCheckboxChange(network.name)}
                            className="mb-0 d-flex align-items-center"
                          />

                          <Button
                            title="Select Templates"
                            loading={loading && loadingNetworkId === network?.id}
                            onClick={() => {
                              setShowTemplateList((prev) => ({
                                ...prev,
                                [network?.name]: true,
                              }));
                              getTemplates(network?.id);
                            }}
                            className="w-auto btn btn-outline-primary btn-sm ms-2"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Post Types Section */}
                    {postTypeList.length > 1 && (
                      <div className="border-top pt-3 mb-3">
                        <h6 className="text-white mb-2 small">Post Types:</h6>
                        <div className="row g-2">
                          {postTypeList.map((pt) => (
                            <div key={`${IconName}-${pt.id}`} className="col-6">
                              <CFormCheck
                                id={`${IconName}-${pt.id}`}
                                name={`${IconName}-${pt.id}`}
                                label={
                                  <small className="text-primary">
                                    {pt.name.charAt(0).toUpperCase() +
                                      pt.name.slice(1).toLowerCase()}
                                  </small>
                                }
                                checked={selectedPostTypes[network.name]?.includes(pt.id) || false}
                                onChange={() => handlePostTypeToggle(network.name, pt.id)}
                                className="mb-0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTemplates?.[network.name] ? (
                      <CListGroupItem
                        className="px-2 py-2 border-start-0 rounded border-end-0 d-flex"
                        //   onClick={() => handleTemplateToggle(network.name, template)}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="fw-bold text-primary text-center small mb-1">
                              Selected Template
                            </div>
                            {selectedTemplates?.[network.name]?.template && (
                              <div className="text-primary small">
                                <strong>Content:</strong>{' '}
                                {truncateText(selectedTemplates?.[network.name]?.template, 80)}
                              </div>
                            )}
                          </div>
                        </div>
                        <CBadge className="d-flex gap-2 justify-content-center align-items-center">
                          <CTooltip content="Edit or Preview">
                            <CIcon
                              onClick={() => {
                                setEditTemplate(selectedTemplates?.[network.name]);
                                toggleShowTemplateModal();
                              }}
                              className="stock-toggle-icon"
                              icon={cilPencil}
                              style={{ cursor: 'pointer' }}
                            />
                          </CTooltip>
                          <CFormCheck
                            id={`${IconName}-${selectedTemplates?.[network.name]?.id}`}
                            name={`${IconName}-${selectedTemplates?.[network.name]?.id}`}
                            checked={
                              selectedTemplates?.[network.name]?.id ===
                              selectedTemplates?.[network.name]?.id
                            }
                            onChange={(e) => {
                              setShowTemplateList((prev) => ({
                                ...prev,
                                [network?.name]: true,
                              }));

                              handleTemplateToggle(network.name, selectedTemplates?.[network.name]);
                            }}
                            className="mb-0"
                          />
                        </CBadge>
                      </CListGroupItem>
                    ) : null}

                    {/* Templates List */}
                    {templates.length > 0 && showTemplateList?.[network?.name] && (
                      <div className="border-top pt-3 mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="text-primary mb-0 small">
                            Templates ({templates.length})
                          </h6>
                          <CBadge color="primary" shape="rounded-pill" className="d-flex">
                            <div
                              className="pointer"
                              onClick={() => {
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
                          {templates.map((template, templateIndex) => (
                            <CListGroupItem
                              key={template.id || templateIndex}
                              className="px-2 py-2 border-start-0 rounded border-end-0"
                              //   onClick={() => handleTemplateToggle(network.name, template)}
                            >
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <div className="fw-semibold text-primary small mb-1">
                                    Name : {template.name}
                                  </div>
                                  {template.title && (
                                    <div className="text-primary small mb-1">
                                      <strong>Title :</strong> {template.title}
                                    </div>
                                  )}
                                  {template.subject && (
                                    <div className="text-primary small mb-1">
                                      <strong>Subject :</strong>{' '}
                                      {truncateText(template.subject, 50)}
                                    </div>
                                  )}
                                  {template.template && (
                                    <div className="text-primary small">
                                      <strong>Content:</strong>{' '}
                                      {truncateText(template.template, 80)}
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
                                    checked={selectedTemplates?.[network.name]?.id === template.id}
                                    onChange={(e) => {
                                      if (e?.target.checked) {
                                        const isLoadingThisNetwork =
                                          loadingNetworkId === network?.id;
                                        setShowTemplateList((prev) => ({
                                          ...prev,
                                          [network?.name]: false,
                                        }));
                                      }
                                      handleTemplateToggle(network.name, template);
                                    }}
                                    className="mb-0"
                                  />
                                </CBadge>
                              </div>
                            </CListGroupItem>
                          ))}
                        </CListGroup>
                      </div>
                    )}

                    {/* No templates message */}
                    {templates.length === 0 && networkTemplates[network?.id] !== undefined && (
                      <div className="border-top pt-3">
                        <div className="text-center text-primary py-3">
                          <small>No templates found for this network</small>
                          <div
                            className="pointer"
                            onClick={() => {
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
      />

      <React.Fragment>
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
      </React.Fragment>
    </React.Fragment>
  );
};

export default CampignNetworkSettings;

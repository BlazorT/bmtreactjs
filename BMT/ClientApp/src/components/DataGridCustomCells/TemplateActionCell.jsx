/* eslint-disable react/prop-types */
import React from 'react';
import useApi from 'src/hooks/useApi';
import Spinner from '../UI/Spinner';
import { CCol, CRow, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import AddTemplateModal from '../Modals/AddTemplateModel';

const TemplateActionCell = ({ template, canDelete, fetching }) => {
  const user = useSelector((state) => state.user);

  const { postData, loading } = useApi('Template/submitcampaigntemplate');
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();

  const [isTemplateModelOpen, setIsTemplateModalOpen] = React.useState(false);

  const status = template?.status;

  const toggleShowTemplateModal = () => setIsTemplateModalOpen((prev) => !prev);

  const toggleStatus = (status) => {
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${status === 1 ? 're-activate' : 'delete'} ${template?.name}?`,
      isOpen: true,
      onYes: () => onYesToggle(status),
      onNo: () => onNoConfirm(),
    });
  };

  const onYesToggle = async (status) => {
    const response = await postData({
      ...template,
      status,
      lastUpdatedBy: user?.userId,
      lastUpdatedAt: dayjs().utc().format(),
    });
    if (response.status) {
      showToast(`${template?.name} ${status === 1 ? 're-activated' : 'deleted'} successfully`);
      fetching();
    } else {
      showToast(response.message, 'error');
    }
    onNoConfirm();
  };

  const onNoConfirm = () => {
    showConfirmation({ isOpen: false });
  };
  const editUser = () => {
    toggleShowTemplateModal();
  };
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <CRow>
          {status === 2 ? (
            <CCol className="d-flex justify-content-center">
              <div className="d-flex align-items-center justify-content-center gap-4">
                <CTooltip content="Re-Activate Template">
                  <CIcon
                    onClick={() => toggleStatus(1)}
                    className="stock-toggle-icon"
                    icon={cilReload}
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>
              </div>
            </CCol>
          ) : (
            <CCol className="d-flex justify-content-center">
              <div className="d-flex align-items-center justify-content-center gap-4">
                <CTooltip content="Edit User">
                  <CIcon
                    onClick={() => editUser(template.id)}
                    className="stock-toggle-icon"
                    icon={cilPencil}
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>

                {canDelete === 1 && (
                  <CTooltip content="Delete Template">
                    <CIcon
                      className="stock-toggle-icon IconColorRed"
                      onClick={() => toggleStatus(2)}
                      icon={cilTrash}
                      style={{ cursor: 'pointer' }}
                    />
                  </CTooltip>
                )}
              </div>
            </CCol>
          )}
        </CRow>
      )}
      <AddTemplateModal
        isOpen={isTemplateModelOpen}
        toggle={toggleShowTemplateModal}
        fetchTemplates={fetching}
        template={template}
      />
    </>
  );
};

export default TemplateActionCell;

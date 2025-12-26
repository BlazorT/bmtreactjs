/* eslint-disable react/prop-types */
import React from 'react';
import { CCol, CRow, CTooltip } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import useApi from 'src/hooks/useApi';
import Spinner from '../UI/Spinner';
import { useShowToast } from 'src/hooks/useShowToast';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const TemplateActionCell = ({ template, canDelete, fetching }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { postData, loading } = useApi('Template/submitcampaigntemplate');
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();

  const status = template?.status;

  const editTemplate = () => {
    navigate('/AddVariable', {
      state: { template },
    });
  };

  const toggleStatus = (status) => {
    showConfirmation({
      header: 'Confirmation!',
      body: `Are you sure you want to ${status === 1 ? 're-activate' : 'delete'
        } ${template?.name}?`,
      isOpen: true,
      onYes: () => onYesToggle(status),
      onNo: () => showConfirmation({ isOpen: false }),
    });
  };

  const onYesToggle = async (status) => {
    const response = await postData({
      ...template,
      status,
      lastUpdatedBy: user?.userId,
      lastUpdatedAt: dayjs().utc().format(),
    });

    if (response?.status) {
      showToast(
        `${template?.name} ${status === 1 ? 're-activated' : 'deleted'
        } successfully`,
        'success',
      );
      fetching();
    } else {
      showToast(response?.message, 'error');
    }

    showConfirmation({ isOpen: false });
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <CRow>
          {status === 2 ? (
            <CCol className="d-flex justify-content-center">
              <CTooltip content="Re-Activate Template">
                <CIcon
                  onClick={() => toggleStatus(1)}
                  className="stock-toggle-icon"
                  icon={cilReload}
                  style={{ cursor: 'pointer' }}
                />
              </CTooltip>
            </CCol>
          ) : (
            <CCol className="d-flex justify-content-center">
              <div className="d-flex gap-4">
                <CTooltip content="Edit Template">
                  <CIcon
                    onClick={editTemplate}
                    className="stock-toggle-icon"
                    icon={cilPencil}
                    style={{ cursor: 'pointer' }}
                  />
                </CTooltip>

                {canDelete === 1 && (
                  <CTooltip content="Delete Template">
                    <CIcon
                      onClick={() => toggleStatus(2)}
                      className="stock-toggle-icon IconColorRed"
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
    </>
  );
};

export default TemplateActionCell;

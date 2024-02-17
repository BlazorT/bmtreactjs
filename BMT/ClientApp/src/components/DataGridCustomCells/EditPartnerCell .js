import React, { useState } from 'react';

import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow } from '@coreui/react';
import InventoryProductModal from '../Modals/InventoryProductModal';
import { useDispatch, useSelector } from 'react-redux';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { updateToast } from 'src/redux/toast/toastSlice';
import moment from 'moment';
import ServiceIntegrationModal from 'src/components/Modals/ServiceIntegrationModal';
import Tooltip from '@mui/material/Tooltip';
import useFetch from 'src/hooks/useFetch';
const EditPartnerCell = (prop) => {
  const { serviceData, getServices, canUpdate, canDelete, value } = prop;

  const dispatch = useDispatch();
  const [showAddProducutModal, setShowAddProducutModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);

  const toggleEditPartnerModal = () => {
    setShowAddPartnerModal(!showAddPartnerModal);
  };
  const {
    response: createServiceRes,
    error: createServiceErr,
    loading: createServiceLoading,
    fetchData: createService,
  } = useFetch();

  const toggleStatus = (status) => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to ${status === 5 ? 're active' : 'delete'}  ${
          serviceData.name
        }?`,
        isOpen: true,
        onYes: () => onYesToggle(status),
        onNo: () => onNoConfirm(),
      }),
    );
  };

  const onYesToggle = async (status) => {
    const service = {
      id: serviceData.id,
      name: serviceData.name,
      serviceUri: serviceData.serviceUri,
      userName: serviceData.userName,
      password: serviceData.password,
      frequency: serviceData.frequency,
      token: serviceData.token,
      status: status,
      rowVer: serviceData.rowVer,
      createdAt: serviceData.createdAt,
      lastUpdatedAt: moment().utc().format(),
    };

    await createService('/Common/submitintegrationservice', {
      method: 'POST',
      body: JSON.stringify(service),
    });

    if (createServiceRes.current?.status === true) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'Service Update Successfully',
          toastVariant: 'success',
        }),
      );

      getServices();
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: createServiceRes.current?.message,
          toastVariant: 'error',
          //  `${JSON.stringify(createUserRes.current.message)}`,
        }),
      );
    }
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  const onNoConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
  };

  return (
    <React.Fragment>
      <React.Fragment>
        {value.row.status === 6 ? (
          <CRow>
            <CCol>
              <Tooltip title="Re-Active Partner">
                <CIcon
                  onClick={() => toggleStatus(5)}
                  className="stock-toggle-icon"
                  icon={cilReload}
                />
              </Tooltip>
            </CCol>
          </CRow>
        ) : (
          <CRow>
            {canUpdate === 1 && (
              <React.Fragment>
                <CCol>
                  <Tooltip title="Edit Partner">
                    <CIcon
                      onClick={() => {
                        toggleEditPartnerModal();
                      }}
                      className="stock-toggle-icon"
                      icon={cilPencil}
                    />
                  </Tooltip>
                </CCol>
                <CCol>
                  <Tooltip title="Delete Partner">
                    <CIcon
                      className="stock-toggle-icon"
                      onClick={() => toggleStatus(6)}
                      icon={cilTrash}
                    />
                  </Tooltip>
                </CCol>
              </React.Fragment>
            )}

            <ServiceIntegrationModal
              isOpen={showAddPartnerModal}
              toggle={toggleEditPartnerModal}
              getServices={() => getServices()}
              serviceData={serviceData}
            />
          </CRow>
        )}
      </React.Fragment>
    </React.Fragment>
  );
};
export default EditPartnerCell;

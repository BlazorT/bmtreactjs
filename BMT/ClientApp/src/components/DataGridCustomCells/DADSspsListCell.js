import React, { useEffect, useState } from 'react';

import { cilLibrary, cilPencil, cilReload, cilTrash } from '@coreui/icons';
import { CCol, CRow } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';

import DspsPartnerListModal from '../Modals/DspsPartnerListModal';
import Tooltip from '@mui/material/Tooltip';
import { updateToast } from 'src/redux/toast/toastSlice';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import useFetch from 'src/hooks/useFetch';
import Loading from '../UI/Loading';
import moment from 'moment';
import globalutil from 'src/util/globalutil';
import { useFetchPartners } from 'src/hooks/api/useFetchPartners';

const DADSspsListCell = (prop) => {
  const [isPartnerListMdlOpen, setIsPartnerListMdlOpen] = useState(false);
  const { value, user, fetchDspList, canDelete, canUpdate } = prop;
  const [isLoading, setIsLoading] = useState(false);
  const [partnerData, setPartnerData] = useState([]);

  const curUser = useSelector((state) => state.user);

  const { fetchPartners } = useFetchPartners();

  const {
    response: deleteRes,
    error: deleteErr,
    loading: delLoading,
    fetchData: deleteDsp,
  } = useFetch();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPartnerListMdlOpen) {
      getPartnerList();
    }
  }, [isPartnerListMdlOpen]);

  const getPartnerList = async () => {
    const partners = await fetchPartners(value.row.id);
    setPartnerData(partners);
  };

  const toggleStatus = async (status) => {
   
    setIsLoading(delLoading.current);

    const data = {
      id: user[0].id,
      status: status,
      email: user[0].email,
      name: user[0].name,
      lastUpdatedBy: curUser.dspId,
      contact: user[0].contact,
      address: user[0].address,
    };

    await deleteDsp('/BlazorApi/dspstatusupdate', { method: 'POST', body: JSON.stringify(data) });

    if (deleteRes.current?.status === true) {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage:
            status === 2
              ? `${user[0].name} deleted successfully`
              : `${user[0].name} reactivated successfully`,
          toastVariant: 'success',
        }),
      );

      fetchDspList();
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong try again later',
          toastVariant: 'error',
        }),
      );
    }
    setIsLoading(delLoading.current);
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

  const onYesConfirm = (status) => {
    toggleStatus(status);
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {user[0]?.status === 6 ? (
            <CRow>
              <CCol>
                <Tooltip title="Re-Active DSP">
                  <CIcon
                    onClick={() =>
                      dispatch(
                        setConfirmation({
                          header: 'Confirmation!',
                          body: `Are you sure you want to re active ${user[0].name}?`,
                          isOpen: true,
                          onYes: () => onYesConfirm(1),
                          onNo: () => onNoConfirm(),
                        }),
                      )
                    }
                    className="stock-toggle-icon"
                    icon={cilReload}
                  />
                </Tooltip>
              </CCol>
            </CRow>
          ) : (
            <>
              <CRow>
                {canUpdate === 1 && (
                  <CCol className="">
                    <Tooltip title="Edit DSP">
                      <CIcon
                        onClick={() => navigate('/DspRegister', { state: { user: user[0] } })}
                        className="stock-toggle-icon"
                        icon={cilPencil}
                      />
                    </Tooltip>
                  </CCol>
                )}
                {canDelete === 1 && (
                  <CCol className="">
                    <Tooltip title="Delete DSP">
                      <CIcon
                        className="stock-toggle-icon"
                        onClick={() =>
                          dispatch(
                            setConfirmation({
                              header: 'Confirmation!',
                              body: `Are you sure you want to delete ${user[0].name}?`,
                              isOpen: true,
                              onYes: () => onYesConfirm(6),
                              onNo: () => onNoConfirm(),
                            }),
                          )
                        }
                        icon={cilTrash}
                      />
                    </Tooltip>
                  </CCol>
                )}
                <CCol className="">
                  <Tooltip title="See Partner">
                    <CIcon
                      className="stock-toggle-icon"
                      icon={cilLibrary}
                      onClick={() => setIsPartnerListMdlOpen(true)}
                    />
                  </Tooltip>
                </CCol>
              </CRow>
              <DspsPartnerListModal
                header={`${value.row.firstName.toUpperCase()}, ${value.row.state}`}
                isOpen={isPartnerListMdlOpen}
                dspId={value.row.id}
                partnerData={partnerData}
                fetchDspList={fetchDspList}
                toggle={() => setIsPartnerListMdlOpen(false)}
              />
            </>
          )}
        </>
      )}
    </React.Fragment>
  );
};
export default DADSspsListCell;

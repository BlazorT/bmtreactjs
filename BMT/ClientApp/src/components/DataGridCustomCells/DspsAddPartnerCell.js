import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cilPencil, cilReload, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow } from '@coreui/react';
import DAaddPartnerModal from '../Modals/DAaddPartnerModal';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import useFetch from 'src/hooks/useFetch';
import { useSelector } from 'react-redux';
import moment from 'moment';
import globalutil from 'src/util/globalutil';

const DspsAddPartnerCell = (prop) => {
  const dispatch = useDispatch();
  const { params, partner, allPartners, setRows } = prop;
  const [addPartnerModalOpen, setAddPartnerModalOpen] = useState(false);

  const toggleStatus = (status) => {
    dispatch(
      setConfirmation({
        header: 'Confirmation!',
        body: `Are you sure you want to ${status === 1 ? 're active' : 'delete'}  ${'ad'}?`,
        isOpen: true,
        onYes: () => onYesToggle(status),
        onNo: () => onNoConfirm(),
      }),
    );
  };

  const onYesToggle = async (status) => {
    if (params.row.uid === 0) {
      setRows((prevRows) => prevRows.filter((row) => row.fullName !== params.row.fullName));
    } else {
      setRows((prevRows) =>
        prevRows.map((row, index) =>
          index + 1 === params.row.id ? { ...row, status: status } : row,
        ),
      );
    }
    dispatch(
      updateToast({
        isToastOpen: true,
        toastMessage: `${partner.fullName} ${
          status === 1 ? 're activated' : 'deleted'
        } successfully`,
        toastVariant: 'success',
      }),
    );
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

  const onYesConfirm = () => {
    dispatch(
      setConfirmation({
        isOpen: false,
      }),
    );
    dispatch(
      updateToast({
        isToastOpen: true,
        toastMessage: 'Partner deleted succesfully',
        toastVariant: 'success',
      }),
    );
  };

  return (
    <React.Fragment>
      {params.row.status === 6 ? (
        <CRow>
          <CCol>
            <CIcon onClick={() => toggleStatus(1)} className="stock-toggle-icon" icon={cilReload} />
          </CCol>
        </CRow>
      ) : (
        <CRow>
          <CCol>
            <CIcon
              className="stock-toggle-icon"
              onClick={() => setAddPartnerModalOpen(true)}
              icon={cilPencil}
            />
          </CCol>
          <CCol>
            <CIcon className="stock-toggle-icon" onClick={() => toggleStatus(6)} icon={cilTrash} />
          </CCol>
        </CRow>
      )}

      <DAaddPartnerModal
        isOpen={addPartnerModalOpen}
        toggle={() => setAddPartnerModalOpen(!addPartnerModalOpen)}
        partner={partner}
        rows={params.row}
        setRows={setRows}
        allPartners={allPartners}
        isAdd={false}
      />
    </React.Fragment>
  );
};
export default DspsAddPartnerCell;

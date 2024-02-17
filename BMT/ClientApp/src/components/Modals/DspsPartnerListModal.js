import React, { useEffect, useState } from 'react';

import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import FilterIconMenu from '../DataGridComponents/FilterIconMenu';
import DspsAddPartnerCell from '../DataGridCustomCells/DspsAddPartnerCell';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { formatDate } from 'src/helpers/formatDate';
import DataGridHeader from '../DataGridComponents/DataGridHeader';
import DAaddPartnerModal from './DAaddPartnerModal';
import LoadingBtn from '../UI/LoadingBtn';

const DspsPartnerListModal = (prop) => {
  const { header, toggle, isOpen, partnerData, dspId, fetchDspList } = prop;

  const [addPartnerModalOpen, setAddPartnerModel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const {
    response: partnersRes,
    loading: partnersLoading,
    error: partnersError,
    fetchData: createPartners,
  } = useFetch();

  useEffect(() => {
    if (partnerData.length > 0) {
      const mappedArray = partnerData.map((data, index) => ({
        uid: data.id,
        businessName: data.businessName,
        rowVer: 1,
        createdAt: data.createdAt,
        lastUpdatedAt: moment().utc().format(0),
        fullName: data.fullName,
        primaryContact: data.primaryContact,
        dob: data.dob,
        email: data.email,
        status: data.status,
        decisionMakingAuthority: data.decisionMakingAuthority,
        createdBy: data.createdBy,
        lastUpdatedBy: data.lastUpdatedBy,
      }));
      setRows(mappedArray);
    }
    setIsLoading(false);
  }, [partnerData]);

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1,
      minWidth: 110,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      editable: false,
    },
    {
      field: 'primaryContact',
      headerName: 'Contact',
      flex: 1,
      minWidth: 110,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      editable: false,
    },
    {
      field: 'dob',
      headerName: 'Date Of Birth',
      flex: 1,
      minWidth: 110,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      editable: false,
      renderCell: (params) => formatDate(params.row.dob),
    },
    {
      field: 'decisionMakingAuthority',
      headerName: 'Decision Making',
      flex: 1,
      minWidth: 110,
      headerClassName: 'custom-header-data-grid',
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      editable: false,
      renderCell: (params) => (params.row.decisionMakingAuthority === 1 ? 'Yes' : 'No'),
    },
    {
      field: 'imageUrl',
      headerName: 'Action',
      flex: 1,
      minWidth: 110,
      headerClassName: 'custom-header-data-grid',
      filterable: false,
      sortable: false,
      disableColumnMenu: false,
      editable: false,
      renderCell: (params) => (
        <DspsAddPartnerCell
          params={params}
          partner={params.row}
          allPartners={rows}
          setRows={setRows}
        />
      ),
    },
  ];
  // const dspPartnerListCols =

  const createPartnerData = async () => {
    setIsLoading(true);
    const updatedRows = rows.map((row) => {
      const { uid, ...rest } = row;
      return {
        ...rest,
        id: uid,
        dspid: dspId,
      };
    });

    await createPartners(
      '/BlazorApi/submitdsppartners',
      {
        method: 'POST',
        body: JSON.stringify(updatedRows),
      },
      (res) => {
        if (res.status) {
          //
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'success',
            }),
          );
          fetchDspList();
          toggle();
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
              //  `${JSON.stringify(createUserRes.current.message)}`,
            }),
          );
        }
      },
    );
    setIsLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        size="sm"
        backdrop={false}
        fullscreen="sm"
        className="inventory-edit-modal"
        centered={true}
      >
        <ModalHeader className="confirmation-modal-header">
          {header}
          {/* <FilterIconMenu /> */}
        </ModalHeader>
        <ModalBody className="confirmation-modal-body">
          <div className="bg_Div mt-2 d-flex flex-column">
            <DataGridHeader
              title={`Partners (${rows.filter((item) => item.status !== 6).length})`}
              addButton={'Add Partner'}
              addBtnClick={() => setAddPartnerModel(true)}
            />
            <CustomDatagrid
              rows={rows}
              columns={columns}
              rowHeight={40}
              pagination={false}
              canExport={1}
              canPrint={1}
              loading={isLoading}
              noRowsMessage="No Partners Available"
            />
            <DAaddPartnerModal
              isOpen={addPartnerModalOpen}
              toggle={() => setAddPartnerModel(!addPartnerModalOpen)}
              rows={rows}
              allPartners={rows}
              setRows={setRows}
              isAdd={true}
            />
          </div>
        </ModalBody>
        <ModalFooter className="confirmation-modal-footer">
          {isLoading ? (
            <LoadingBtn title="Submiting..." />
          ) : (
            <React.Fragment>
              <button type="button" className="btn_Default m-2 sales-btn-style" onClick={toggle}>
                Cancel
              </button>
              <button
                type="button"
                className="btn_Default m-2 sales-btn-style"
                onClick={createPartnerData}
              >
                Save
              </button>
            </React.Fragment>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DspsPartnerListModal;

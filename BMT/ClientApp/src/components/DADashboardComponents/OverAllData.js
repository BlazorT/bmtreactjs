import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';

import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import DAOverAllModal from '../Modals/DAOverAllModal';
import { setConfirmation } from 'src/redux/confirmation_mdl/confirMdlSlice';
import { useDispatch } from 'react-redux';

function OverAllData() {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();

  const brandedColumns = [
    {
      field: 'Date',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Date',
      width: 100,
      flex: 1,
    },
    {
      field: 'OverallStanding',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Overall Standing',
      width: 150,
      flex: 1,
    },
    {
      field: 'Safety',
      headerClassName: 'custom-header-data-grid',
      headerName: 'On Road Safety Score',
      width: 170,
      flex: 1,
    },
    {
      field: 'Quality',
      headerClassName: 'custom-header-data-grid',
      headerName: 'Overall Quality Score',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 270,
      flex: 1,
      renderCell: (params) => (
        <div className="row padRight">
          <div className="col-md-6">
            <CIcon className="stock-toggle-icon" onClick={toggleModal} icon={cilPencil} />
          </div>
          <div className="col-md-6">
            <CIcon
              className="stock-toggle-icon"
              onClick={() => {
                dispatch(
                  setConfirmation({
                    header: 'Confirmation!',
                    body: `Are you sure you want to delete this data?`,
                    isOpen: true,
                    // onYes: () => onYesDelConfirm(),
                    // onNo: () => onNoConfirm(),
                  }),
                );
              }}
              icon={cilTrash}
            />
          </div>
        </div>
      ),
    },
  ];
  const brandedRow = [
    {
      id: 1,
      Date: '11-10-2023',
      OverallStanding: 'Fantastic',
      Safety: 'Fantastic',
      Quality: 'Fantastic',
    },
    {
      id: 2,
      Date: '11-10-2023',
      OverallStanding: 'Fantastic',
      Safety: 'Fantastic',
      Quality: 'Fantastic',
    },
    {
      id: 3,
      Date: '11-10-2023',
      OverallStanding: 'Fantastic',
      Safety: 'Fantastic',
      Quality: 'Fantastic',
    },
  ];
  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  return (
    <>
      <CustomDatagrid rowHeight={50} rows={brandedRow} columns={brandedColumns} />
      <DAOverAllModal isOpen={modalOpen} toggle={toggleModal} />
    </>
  );
}

export default OverAllData;

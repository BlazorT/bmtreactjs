import React, { useEffect, useState } from 'react';

import { cilChevronBottom } from '@coreui/icons';

import { useDispatch, useSelector } from 'react-redux';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import ServiceIntegrationModal from 'src/components/Modals/ServiceIntegrationModal';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import EditPartnerCell from 'src/components/DataGridCustomCells/EditPartnerCell ';

const FleetServiceIntegrated = (prop) => {
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Service Settings',
  );

  dayjs.extend(utc);

  const [showStock, setShowStock] = useState(false);
  const [showLicence, setShowLicence] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {
    response: createServiceRes,
    loading: createServiceLoading,
    error: createServiceError,
    fetchData: createService,
  } = useFetch();

  useEffect(() => {
    getServiceList();
  }, []);

  const initialFilter = {
    serviceTypeId: '',
    name: '',
    createdAt: dayjs().utc().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };

  const getServiceList = async () => {
    const fetchBody = {
      name: '',
      serviceUri: '',
      password: '',
      userName: '',
      entity: '',
      frequency: 0,
      token: '',
      credential: '',
      status: 0,
      rowVer: 0,
      createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
    };
    await createService('/Common/integrationservices', {
      method: 'POST',
      body: JSON.stringify(fetchBody),
    });

    if (createServiceRes.current?.status === true) {
      const mappedArray = createServiceRes.current.data.map((data, index) => ({
        id: data.id,
        name: data.name,
        serviceUri: data.serviceUri,
        userName: data.userName,
        password: data.password,
        entity: data.entity,
        frequency: data.frequency,
        token: data.token,
        credential: data.credential,
        status: data.status,
        rowVer: 0,
        createdAt: moment().utc().format(),
        lastUpdatedAt: moment().utc().format(),
      }));

      // getServiceList();
      setRows(mappedArray);
    } else {
      dispatch(
        updateToast({
          isToastOpen: true,
          toastMessage: 'something went wrong try again later',
          toastVariant: 'error',
        }),
      );
      setRows([]);
    }
    setIsLoading(createServiceLoading.current);
  };

  const [rows, setRows] = useState([
    {
      id: 1,
      service: 'Background verification',
      name: 'Accurate, USA',
      Interval: '5 Min',
      status: 'Active',
      imageUrl: 'Edit',
    },
  ]);
  const [columns] = useState([
    {
      field: 'name',
      flex: 1,
      minWidth: 220,
      headerClassName: 'custom-header-data-grid',
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Service Name',
    },
    {
      field: 'serviceUri',
      flex: 1,
      minWidth: 220,
      headerClassName: 'custom-header-data-grid',
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Service',
    },

    //{
    //  field: 'status',
    //  flex: 1,
    //  minWidth: 220,
    //  headerClassName: 'custom-header-data-grid',
    //  editable: false,
    //  filterable: true,
    //  sortable: true,
    //  disableColumnMenu: false,
    //  headerName: 'Status',
    //},
    {
      field: 'frequency',
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Interval',
    },
    {
      field: 'lastUpdatedAt',
      headerClassName: 'custom-header-data-grid',
      minWidth: 180,
      flex: 1,
      headerName: 'Last Updated Time',
      sortable: false,
      filterable: false,
      type: 'timestamp',
    },
    {
      field: 'imageUrl',
      /*  flex: 1,*/
      minWidth: 120,
      headerClassName: 'custom-header-data-grid',
      editable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Action',
      renderCell: (params) => (
        <EditPartnerCell
          value={params}
          getServices={() => getServiceList()}
          serviceData={createServiceRes?.current?.data.find((item) => item.id === params.row.id)}
          canUpdate={pageRoles.canUpdate}
          canDelete={pageRoles.canDelete}
        />
      ),
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);

  const toggleEditPartnerModal = () => {
    setShowAddPartnerModal(!showAddPartnerModal);
  };
  const toggleStock = () => {
    setShowStock(!showStock);
  };

  const toggleLicence = () => {
    setShowLicence(!showLicence);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="bg_Div mt-2 d-flex flex-column ">
            <DataGridHeader
              title="Integration Services"
              addButton={pageRoles.canAdd === 1 ? 'Add Service' : ''}
              addBtnClick={toggleEditPartnerModal}
              otherControls={[{ icon: cilChevronBottom, fn: toggleLicence }]}
            />
            {showLicence == true ? (
              <div className="show-stock">
                <div className="row pt-2">
                  <div className="col-md-12 col-xl-12">
                    <CustomDatagrid
                      rows={rows}
                      columns={columns}
                      pagination={true}
                      rowHeight={40}
                      canExport={pageRoles.canExport}
                      canPrint={pageRoles.canPrint}
                      hiddenCols={{
                        columnVisibilityModel: {
                          lastUpdatedAt: false,
                        },
                      }}
                      sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
                    />
                  </div>
                </div>
                <ServiceIntegrationModal
                  isOpen={showAddPartnerModal}
                  toggle={() => toggleEditPartnerModal()}
                  getServices={() => getServiceList()}
                />
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FleetServiceIntegrated;

import React, { useEffect, useState } from 'react';
import globalutil from 'src/util/globalutil';

import { useDispatch, useSelector } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import { formatDate } from 'src/helpers/formatDate';
import ShiftActionCell from 'src/components/DataGridCustomCells/ShiftActionCell';
import { formatDateTime, formatTime } from 'src/helpers/formatDate';

import { cilUser, cilChevronBottom } from '@coreui/icons';

import CustomInput from 'src/components/InputsComponent/CustomInput';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import ShiftAddModal from 'src/components/Modals/ShiftAddModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import moment from 'moment';
import useFetch from 'src/hooks/useFetch';
import AppContainer from 'src/components/UI/AppContainer';
import Loading from 'src/components/UI/Loading';
const Waves = () => {
  dayjs.extend(utc);
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Waves',

  );
  //console.log(pageRoles);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { response: getShiftDataRes, fetchData: GetShiftDataList } = useFetch();

  useEffect(() => {
    getShiftList();
  }, []);

  const [showFilter, setshowFilter] = useState(false);
  const [showGrid, setshowGrid] = useState(true);
  const [taskItemModal, settaskItemModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const getShiftList = async () => {
    const fetchBody = {
      id: 0,
      dspId: user.dspId,
      name: '',
      createdBy: 0,
      status: 0,
      rowVer: 1,
      createdAt: moment().utc().subtract(1, 'year').format(),
      lastUpdatedAt: moment().utc().format(),
     // lastUpdatedBy: moment().utc().format(),
    };
    //alert(JSON.stringify(fetchBody));
    await GetShiftDataList(
      '/Common/shifts',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        console.log({ res });
        if (res.status === true) {
          const mappedArray = res.data.map((data) => ({
            id: data.id,
            name: data.name,
            taskName: data.name,
            ancestor: data.ancestorTaskId,
            predecesor: data.predesessorTaskId,
            status: data.status,
            startTime: formatTime(data.startTime),
            endTime: formatTime(data.endTime),
            hours: data.hours,
            workBlockTime: formatTime(data.startTime),
            lastUpdatedAt: data.lastUpdatedAt,
            lastUpdatedBy: data.lastUpdatedBy,
            createdAt: formatDate(data.createdAt),
          }));

          setRows(mappedArray);
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          setRows([]);
        }
      },
    );
    setIsLoading(false);
  };
  const [rows, setRows] = useState([
    {
      id: 1,
      shiftName: '1ST Wave',
      position: 'Driver',
      startTime: '9:45 AM',
      sDuration: '10h 30m',
      workStartTime: '10:00 AM',
     
    },
    {
      id: 2,
      shiftName: '2nd Wave',
      position: 'Dispatcher',
      startTime: '9:00 AM',
      sDuration: '10h 40m',
      workStartTime: '9:15 AM',

    },
    {
      id: 3,
      shiftName: 'Dispatcher, 12:00pm, 8h 0m',
      position: 'Driver',
      startTime: '12:00 AM',
      sDuration: '9h 40m',
      workStartTime: '12:15 AM',

    },
  ]);
  const [columns] = useState([
    {
      field: 'name',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 220,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Wave Name',
    },
    //{
    //  field: 'position',
    //  headerClassName: 'custom-header-data-grid',
    //  flex: 1,
    //  minWidth: 220,
    //  editable: false,
    //  filterable: true,
    //  sortable: true,
    //  disableColumnMenu: false,
    //  headerName: 'Position',
    //},
    {
      field: 'startTime',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 220,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Wave Start Time',
    },
    {
      field: 'hours',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 180,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Wave Duration',
  
    },
    {
      field: 'workBlockTime',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 200,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Work Block Start Time',

    },
    {
    flex: 1,
    minWidth: 130,
    headerClassName: 'custom-header-data-grid',
    filterable: true,
    sortable: true,
    disableColumnMenu: false,
    headerName: 'Last Updated Time',
    field: 'lastUpdatedAt',
    editable: false,
  },
    {
      field: 'imageUrl',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 150,
      editable: false,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Action',
      renderCell: (params) => (
        <ShiftActionCell
          params={params}
          shiftData={getShiftDataRes?.current?.data.find((item) => item.id === params.row.id)}
          canUpdate={pageRoles.canUpdate}
          canDelete={pageRoles.canDelete}
          getShiftList={getShiftList}
        />
      ),
    },
  ]);

  const cellEditClick = () => {
    toggleTaskItemMdl(true);
  };

  const toggleGrid = () => {
    setshowGrid((prev) => !prev);
  };

  const toggleFilter = () => {
    setshowFilter((prev) => !prev);
  };

  const toggleTaskItemMdl = () => {
    settaskItemModal((prev) => !prev);
  };
 
  if (isLoading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
     
      <AppContainer>
        <DataGridHeader
          title="Waves"
          addButton={pageRoles.canAdd === 1 ? 'Waves' : ''  }
          addBtnClick={cellEditClick}
          otherControls={[{ icon: cilChevronBottom, fn: toggleGrid }]}
        />
        {showGrid && (
          <div className="col-md-12 ">
          <CustomDatagrid
            rows={rows}
           // search={true }
            columns={columns}
            pagination={true}
            rowHeight={50}
           /* canExport={pageRoles.canExport}*/
              sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
              hiddenCols={{
                columnVisibilityModel: {
                  lastUpdatedAt: false,
                },
              }}
           
           /* canPrint={pageRoles.canPrint}*/
            />
          </div>
        )}
      </AppContainer>

      <ShiftAddModal
        isOpen={taskItemModal}
        toggle={toggleTaskItemMdl}
        header="Manage Wave"
        getServices={() => getShiftList()}
      />
    </React.Fragment>
  );
};

export default Waves;

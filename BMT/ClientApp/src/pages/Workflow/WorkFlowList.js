import React, { useEffect, useState } from 'react';
import globalutil from 'src/util/globalutil';

import { useDispatch, useSelector } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';
import { formatDate } from 'src/helpers/formatDate';
import WorkFlowActionCell from 'src/components/DataGridCustomCells/WorkFlowActionCell';

import { cilUser, cilChevronBottom } from '@coreui/icons';

import CustomInput from 'src/components/InputsComponent/CustomInput';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import WorkflowTaskModal from 'src/components/Modals/WorkflowTaskModal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import moment from 'moment';
import useFetch from 'src/hooks/useFetch';
import AppContainer from 'src/components/UI/AppContainer';
import Loading from 'src/components/UI/Loading';
const WorkFlowList = () => {
  dayjs.extend(utc);
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Workflows',
  );

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { response: getWorkFlowSubTaskRes, fetchData: GetWorkFlowList } = useFetch();

  useEffect(() => {
    getWorkFlowList();
  }, []);

  const [showFilter, setshowFilter] = useState(false);
  const [showGrid, setshowGrid] = useState(true);
  const [taskItemModal, settaskItemModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initialFilter = {
    keyword: '',
  };

  const [filters, setFilters] = useState(initialFilter);

  const applyFilters = async () => {
    const filterBody = {
      keyword: filters.keyword,
    };
    getWorkFlowList(filterBody);
  };

  const getWorkFlowList = async (filter) => {
    const fetchBody = {
      id: 0,
      dspId: user.dspId,
      name: filter ? filters.keyword : '',
      initExpression: '',
      taskTypeId: 0,
      currentStatus: filter ? (filters.currentStatus !== '' ? filters.currentStatus : 0) : 0,
      createdAt: filters.createdAt,
      lastUpdatedAt: filters.lastUpdatedAt,
    };
    //alert(JSON.stringify(fetchBody));
    await GetWorkFlowList(
      '/Workflow/workflowtasks',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        if (res.status === true) {
          const mappedArray = res.data.map((data) => ({
            id: data.id,
            workFlowName: data.name,
            taskName: data.name,
            ancestor: data.ancestorTaskId,
            predecesor: data.predesessorTaskId,
            status: data.currentStatus,
            lastUpdatedAt: data.lastUpdatedAt,
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
  const [rows, setRows] = useState([]);
  const [columns] = useState([
    {
      field: 'workFlowName',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 220,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Work Flow Name',
    },
    {
      field: 'lastUpdatedAt',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 220,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Work Flow Date',
      renderCell: (params) => formatDate(params.row.lastUpdatedAt),
    },
    {
      field: 'status',
      headerClassName: 'custom-header-data-grid',
      flex: 1,
      minWidth: 180,
      editable: false,
      filterable: true,
      sortable: true,
      disableColumnMenu: false,
      headerName: 'Status',
      renderCell: (params) =>
        globalutil.commonstatuses().find((item) => item.id === params.row.status)?.name ||
        'Deleted',
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
        <WorkFlowActionCell
          params={params}
          tasksData={getWorkFlowSubTaskRes?.current?.data}
          fetchWorkflowTask={getWorkFlowList}
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
  const changeFilter = (e, date) => {
    if (date === 'lastUpdatedAt' || date === 'createdAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: moment(e).utc().format(),
      }));
    } else {
      const { name, value, type, checked } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <AppContainer>
        <DataGridHeader
          title="Advance Search"
          otherControls={[{ icon: cilChevronBottom, fn: toggleFilter }]}
          filterDisable={true}
        />
        {showFilter && (
          <div className="row">
            <div className="col-md-6">
              <CustomInput
                label="Keyword"
                icon={cilUser}
                type="text"
                value={filters.keyword}
                onChange={changeFilter}
                id="keyword"
                name="keyword"
                placeholder="workflow name"
                className="form-control item"
                isRequired={false}
                title=" using by workflow name "
                // message="Enter Buisness Name"
              />
            </div>
            <div className="col-md-6 mt-4">
              <div className="text-end">
                <button
                  onClick={() => applyFilters()}
                  type="button"
                  className="btn_Default m-2 sales-btn-style"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </AppContainer>
      <AppContainer>
        <DataGridHeader
          title="WorkFlows"
          addButton={pageRoles.canAdd === 1 ? 'Workflows' : ''}
          addBtnClick={cellEditClick}
          otherControls={[{ icon: cilChevronBottom, fn: toggleGrid }]}
        />
        {showGrid && (
          <CustomDatagrid
            rows={rows}
            columns={columns}
            pagination={true}
            rowHeight={50}
            canExport={pageRoles.canExport}
            sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
            canPrint={pageRoles.canPrint}
          />
        )}
      </AppContainer>

      <WorkflowTaskModal
        isOpen={taskItemModal}
        toggle={toggleTaskItemMdl}
        header="Task Settings"
        isSubTask={false}
        tasksData={getWorkFlowSubTaskRes?.current?.data}
        fetchWorkflowTask={getWorkFlowList}
      />
    </React.Fragment>
  );
};

export default WorkFlowList;

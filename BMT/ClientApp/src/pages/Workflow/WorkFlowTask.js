import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// CoreUI Icons
import { cilChevronBottom } from '@coreui/icons';

// Custom Components
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import WorkflowTaskModal from 'src/components/Modals/WorkflowTaskModal';

// Hooks
import useFetch from 'src/hooks/useFetch';

// Date Libraries
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import moment from 'moment';

// Redux Actions
import { updateToast } from 'src/redux/toast/toastSlice';

// Loading Component
import Loading from 'src/components/UI/Loading';
import { getWorkFlowCols } from 'src/configs/ColumnsConfig/workflowTaskCols';
import { getWorkflowFiltersFields } from 'src/configs/FiltersConfig/workflowFilterConfig';
import CustomFilters from 'src/components/Filters/CustomFilters';
import Form from 'src/components/UI/Form';
import AppContainer from 'src/components/UI/AppContainer';

const WorkFlowTask = () => {
  dayjs.extend(utc);
  useEffect(() => {
    fetchWorkflowTask();
  }, []);

  const { response: fetchTaskData, fetchData: fetchTasks } = useFetch();

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Workflow Task',
  );
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [showFilters, setshowFilters] = useState(false);
  const [showWorkflowGrid, setshowWorkflowGrid] = useState(true);
  const [taskItemModal, settaskItemModal] = useState(false);
  const [subtaskItemModal, setSubtaskItemModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialFilter = {
    keyword: '',
    currentStatus: 0,
    createdAt: dayjs().utc().startOf('month').format(),
    // lastUpdatedAt: dayjs().utc().startOf('day').format(),
  };
  const [filters, setFilters] = useState(initialFilter);
  const [rows, setRows] = useState([]);

  const changeFilter = (e, label) => {
    if (label === 'createdAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [label]: moment(e).utc().format(),
      }));
    } else {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const fetchWorkflowTask = async (filter) => {
    const fetchBody = {
      id: 0,
      dspId: user.dspId,
      name: filter ? filters.keyword : '',
      initExpression: '',
      taskTypeId: 0,
      currentStatus: filter ? (filters.currentStatus !== '' ? filters.currentStatus : 0) : 0,
      createdAt: filters.createdAt,
    };

    await fetchTasks(
      '/Workflow/workflowtasks',
      { method: 'POST', body: JSON.stringify(fetchBody) },
      (res) => {
        if (res.status) {
          formatApiDataAsRows(res.data);
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

  const formatApiDataAsRows = (apiData) => {
    const mappedArray = apiData
      .filter((data) => data.roleId !== 3)
      .map((data) => ({
        id: data.id,
        workFlowName: data.name,
        taskName: data.name,
        ancestor: data.ancestorTaskId,
        predecesor: data.predesessorTaskId,
        status: data.currentStatus,
        lastUpdatedAt: data.lastUpdatedAt,
      }));

    setRows(mappedArray);
  };

  const toggleTaskItemMdl = () => {
    settaskItemModal((prev) => !prev);
  };

  const AddPartnerClick = () => {
    toggleTaskItemMdl(true);
  };

  const toggleLicence = () => {
    setshowWorkflowGrid((prev) => !prev);
  };

  const toggleStock = () => {
    setshowFilters((prev) => !prev);
  };

  const handleReset = () => {
    setFilters(initialFilter);
    fetchWorkflowTask();
  };

  const workFlowCols = getWorkFlowCols(fetchTaskData, fetchWorkflowTask);
  const workflowFiltersFields = getWorkflowFiltersFields(filters, changeFilter);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <AppContainer>
        <DataGridHeader
          title="Advance Search"
          otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
          filterDisable={true}
        />
        {showFilters && (
          <CustomFilters
            filters={filters}
            changeFilter={changeFilter}
            fetching={fetchWorkflowTask}
            handleReset={handleReset}
            filterFields={workflowFiltersFields}
          />
        )}
      </AppContainer>
      <AppContainer>
        <DataGridHeader
          title="Task Items"
          addButton={pageRoles.canAdd === 1 ? 'Workflow Task' : ''}
          addBtnClick={AddPartnerClick}
          otherControls={[{ icon: cilChevronBottom, fn: toggleLicence }]}
        />
        {showWorkflowGrid && (
          <CustomDatagrid
            rows={rows}
            columns={workFlowCols}
            pagination={true}
            rowHeight={50}
            canExport={pageRoles.canExport}
            canPrint={pageRoles.canPrint}
            sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
            hiddenCols={{
              columnVisibilityModel: {
                lastUpdatedAt: false,
              },
            }}
          />
        )}
      </AppContainer>

      <WorkflowTaskModal
        isOpen={taskItemModal}
        toggle={toggleTaskItemMdl}
        header="Task Item"
        isSubTask={false}
        tasksData={fetchTaskData?.current?.data}
        fetchWorkflowTask={fetchWorkflowTask}
      />
    </React.Fragment>
  );
};

export default WorkFlowTask;

import React, { useEffect, useState } from 'react';
import useFetch from 'src/hooks/useFetch';
import { updateToast } from 'src/redux/toast/toastSlice';
import { useDispatch, useSelector } from 'react-redux';
import { cilChevronBottom } from '@coreui/icons';

import moment from 'moment';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';

import WorkflowTaskModal from 'src/components/Modals/WorkflowTaskModal';
import Loading from 'src/components/UI/Loading';
import CustomFilters from 'src/components/Filters/CustomFilters';
import { getWorkflowFiltersFields } from 'src/configs/FiltersConfig/workflowFilterConfig';
import { getWorkFlowCols } from 'src/configs/ColumnsConfig/workflowTaskCols';
import AppContainer from 'src/components/UI/AppContainer';

const WorkFlowSubTask = () => {
  dayjs.extend(utc);

  useEffect(() => {
    getWorkFlowSubTaskList();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Workflow Sub Task',
  );
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { response: getWorkFlowSubTaskRes, fetchData: GetWorkFlowSubTask } = useFetch();

  const [showFilters, setshowFilters] = useState(false);
  const [taskItemModal, settaskItemModal] = useState(false);
  const [showWorkflowGrid, setshowWorkflowGrid] = useState(true);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const initialFilter = {
    keyword: '',
    currentStatus: 0,
    createdAt: dayjs().utc().startOf('month').format(),
  };
  const [filters, setFilters] = useState(initialFilter);

  const getWorkFlowSubTaskList = async (filter) => {
    const fetchBody = {
      id: 0,
      dspId: user.dspId,
      name: filter ? filters.keyword : '',
      initExpression: '',
      taskTypeId: 0,
      currentStatus: filter ? (filters.currentStatus !== '' ? filters.currentStatus : 0) : 0,
      createdAt: filters.createdAt,
    };
    //alert(JSON.stringify(fetchBody));
    await GetWorkFlowSubTask(
      '/Workflow/workflowtasks',
      {
        method: 'POST',
        body: JSON.stringify(fetchBody),
      },
      (res) => {
        if (res.status === true) {
          const mappedArray = res.data
            .filter((item) => item.ancestorTaskId != 0)
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
        setIsLoading(false);
      },
    );
    setIsLoading(false);
  };

  const changeFilter = (e, date) => {
    if (date === 'createdAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        createdAt: moment(e).utc().format(),
      }));
    } else {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
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
    getWorkFlowSubTaskList();
  };

  const workflowFiltersFields = getWorkflowFiltersFields(filters, changeFilter);
  const workFlowCols = getWorkFlowCols(getWorkFlowSubTaskRes, getWorkFlowSubTaskList);

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
            fetching={getWorkFlowSubTaskList}
            handleReset={handleReset}
            filterFields={workflowFiltersFields}
          />
        )}
      </AppContainer>
      <AppContainer>
        <DataGridHeader
          title="Sub Task Items"
          addButton={pageRoles.canAdd === 1 && 'Workflow Sub Task'}
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
            hiddenCols={{
              columnVisibilityModel: {
                lastUpdatedAt: false,
              },
            }}
            sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
          />
        )}
      </AppContainer>

      <WorkflowTaskModal
        isOpen={taskItemModal}
        toggle={toggleTaskItemMdl}
        header="Sub Task Item"
        isSubTask={true}
        tasksData={getWorkFlowSubTaskRes?.current?.data}
        fetchWorkflowTask={getWorkFlowSubTaskList}
      />
    </React.Fragment>
  );
};

export default WorkFlowSubTask;

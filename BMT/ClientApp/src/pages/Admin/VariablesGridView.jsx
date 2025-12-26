import { cilChevronBottom } from '@coreui/icons';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import AddVariableModal from 'src/components/Modals/AddVariableModal';
import AppContainer from 'src/components/UI/AppContainer';
import { getVariableCols } from 'src/configs/ColumnsConfig/variableGridCols';
import { getVariableFilters } from 'src/configs/FiltersConfig/variableFilterConfig';
import useApi from 'src/hooks/useApi';
import usePageRoles from 'src/hooks/usePageRoles';
import globalutil from 'src/util/globalutil';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const VariablesGridView = () => {
  const pageRoles = usePageRoles('Global Template');
  const navigate = useNavigate();

  const [isShowFilters, setIsShowFilters] = React.useState(false);
  const [isShowGrid, setIsShowGrid] = React.useState(true);
  const [isVariableModelOpen, setIsVariableModalOpen] = React.useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    networkId: '',
    id: 0,
    orgid: 0,
    name: '',
    expression: '',
    isMandatory: 1,
    length: 0,
    dataTypeId: 1,
    fieldTypeId: 1,
    CreatedAt: dayjs().utc().format(),
    rowVer: 1,
  });

  const requestData = useMemo(
    () => ({
      status: filters?.status ? parseInt(filters?.status) : 0,
      networkId: filters?.networkId ? parseInt(filters?.networkId) : 0,
      title: filters?.keyword,
    }),
    [filters],
  );

  const {
    data,
    loading,
    error,
    postData: refectch,
  } = useApi('Template/getallvariablesdata', 'POST', requestData);

  const toggleShowFilters = () => setIsShowFilters((prev) => !prev);
  const toggleShowVariableModal = () => setIsVariableModalOpen((prev) => !prev);
  const toggleShowGrid = () => setIsShowGrid((prev) => !prev);

  const changeFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const fetching = () => {
    refectch(requestData);
  };
  const handleReset = () => {
    setFilters({
      keyword: '',
      status: '',
      networkId: '',
    });
    fetching();
  };

  const variableFilterFields = getVariableFilters(filters, changeFilter);
  const variableListCols = getVariableCols(pageRoles?.canDelete, fetching);
  return (
    <React.Fragment>
      <AppContainer>
        <DataGridHeader
          title="Advance Search"
          onClick={toggleShowFilters}
          otherControls={[{ icon: cilChevronBottom, fn: toggleShowFilters }]}
          filterDisable={true}
        />
        {isShowFilters && (
          <CustomFilters
            filters={filters}
            handleReset={handleReset}
            filterFields={variableFilterFields}
          />
        )}
      </AppContainer>
      <AppContainer>
        <CustomDatagrid
          rows={data?.data || []}
          columns={variableListCols}
          pagination={true}
          rowSelection={false}
          rowHeight={50}
          loading={loading || !data}
          noRowsMessage={error ? 'Error Fetching data' : ''}
          sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
          showGrid={isShowGrid}
          headerProps={{
            title: 'BMT Variables',
            onClick: toggleShowGrid,
            filterDisable: true,
            addButton: pageRoles.canAdd === 1 ? 'Variable' : '',
            addBtnClick: () => navigate('/AddVariable'),
            //addBtnClick: pageRoles.canAdd === 1 ? () => toggleShowVariableModal() : undefined,
            otherControls: [{ icon: cilChevronBottom, fn: toggleShowGrid }],
            canPrint: pageRoles?.canPrint === 1,
            canExport: pageRoles?.canExport === 1,
            fileName: 'Variables',
          }}
        />
        <AddVariableModal
          isOpen={isVariableModelOpen}
          toggle={toggleShowVariableModal}
          fetchTemplates={fetching}
        />
      </AppContainer>
    </React.Fragment>
  );
};

export default VariablesGridView;

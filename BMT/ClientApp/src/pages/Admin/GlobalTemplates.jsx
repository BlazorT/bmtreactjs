import { cilChevronBottom } from '@coreui/icons';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import AddTemplateModal from 'src/components/Modals/AddTemplateModel';
import AppContainer from 'src/components/UI/AppContainer';
import { getTemplateCols } from 'src/configs/ColumnsConfig/templateGridCols';
import { getTemplateFilters } from 'src/configs/FiltersConfig/templateFilterConfig';
import useApi from 'src/hooks/useApi';
import usePageRoles from 'src/hooks/usePageRoles';

const GlobalTemplates = () => {
  const pageRoles = usePageRoles('Global Template');

  const user = useSelector((state) => state.user);

  const [isShowFilters, setIsShowFilters] = React.useState(false);
  const [isShowGrid, setIsShowGrid] = React.useState(true);
  const [isTemplateModelOpen, setIsTemplateModalOpen] = React.useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    networkId: '',
  });

  const requestData = useMemo(
    () => ({
      status: filters?.status ? parseInt(filters?.status) : 0,
      networkId: filters?.networkId ? parseInt(filters?.networkId) : 0,
      title: filters?.keyword,
    }),
    [filters],
  );

  const networkSettingBody = useMemo(
    () => ({
      id: '2',
      orgId: user?.orgId?.toString(),
    }),
    [user],
  );

  const {
    data,
    loading,
    error,
    postData: refectch,
  } = useApi('Template/campaigntemplatesallnetworks', 'POST', requestData);

  const { data: networkSettingsData, loading: networkSettingsLoading } = useApi(
    '/Organization/orgpackagedetails',
    'POST',
    networkSettingBody,
  );

  const toggleShowFilters = () => setIsShowFilters((prev) => !prev);
  const toggleShowTemplateModal = () => setIsTemplateModalOpen((prev) => !prev);
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
  const whatsappNetworkSettings = networkSettingsData?.data?.[0] || null;
  const templateFilterFields = getTemplateFilters(filters, changeFilter);
  const tamplateListCols = getTemplateCols(pageRoles?.canDelete, fetching, whatsappNetworkSettings);
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
            filterFields={templateFilterFields}
          />
        )}
      </AppContainer>
      <AppContainer>
        <CustomDatagrid
          rows={data?.data || []}
          columns={tamplateListCols}
          pagination={true}
          rowSelection={false}
          rowHeight={50}
          loading={loading || networkSettingsLoading}
          noRowsMessage={error ? 'Error Fetching data' : ''}
          sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
          showGrid={isShowGrid}
          headerProps={{
            title: 'BMT Templates',
            onClick: toggleShowGrid,
            filterDisable: true,
            addButton: pageRoles.canAdd === 1 ? 'Template' : '',
            addBtnClick: pageRoles.canAdd === 1 ? () => toggleShowTemplateModal() : undefined,
            otherControls: [{ icon: cilChevronBottom, fn: toggleShowGrid }],
            canPrint: pageRoles?.canPrint === 1,
            canExport: pageRoles?.canExport === 1,
            fileName: 'Templates',
          }}
        />
        <AddTemplateModal
          isOpen={isTemplateModelOpen}
          toggle={toggleShowTemplateModal}
          fetchTemplates={fetching}
          whatsappNetworkSettings={whatsappNetworkSettings}
        />
      </AppContainer>
    </React.Fragment>
  );
};

export default GlobalTemplates;

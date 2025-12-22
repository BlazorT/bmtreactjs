import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { cilChevronBottom } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import AppContainer from 'src/components/UI/AppContainer';
import { getcampaignslistingCols } from 'src/configs/ColumnsConfig/campaignslistingCols';
import { getOrgFiltersFields } from 'src/configs/FiltersConfig/orgFilterConfig';
import { formatDateTime } from 'src/helpers/formatDate';
import { useFetchCampaigns } from 'src/hooks/api/useFetchCampaigns';
import useApi from 'src/hooks/useApi';
import { useFetchUsers } from 'src/hooks/api/useFetchUsers';

dayjs.extend(utc);

const campaignslisting = () => {
  const user = useSelector((state) => state.user);
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Campaigns Listing',
  );
  // console.log({ user });
  const navigate = useNavigate();

  const {
    data: orgsRes,
    loading: orgLoading,
    postData: getOrgs,
  } = useApi('/BlazorApi/orgsfulldata');
  const { data, loading, fetchCompaigns: getCompaignsList } = useFetchCampaigns();
  const { data: usersRes, loading: usersLoading, error, fetchUsers } = useFetchUsers();

  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [campaignData, setCampaignData] = useState([]);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({
    id: 0,
    orgId: user.orgId,
    rowVer: 0,
    networkId: 0,
    name: '',
    HashTags: '',
    status: 0,
    createdAt: dayjs().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });

  const orgId = user.orgId;

  useEffect(() => {
    getOrganizationLst();
    fetchUsers(
      0,
      {
        UserName: '',
        status: '',
        lastUpdatedAt: dayjs().utc().startOf('day').format(),
        createdAt: dayjs().subtract(100, 'years').startOf('month').format(),
      },
      0,
    );
  }, []);

  useEffect(() => {
    if (usersRes?.status) {
      getCampaignsList(filters);
    }
  }, [usersRes]);

  useEffect(() => {
    if (orgsRes?.data?.length > 0) {
      const orgData = orgsRes?.data;
      const findUserOrg = orgData?.find((item) => item.id === orgId);
      if (findUserOrg)
        setFilters((prevFilters) => ({
          ...prevFilters,
          orgId: findUserOrg?.id,
        }));
    }
  }, [orgsRes?.data, orgId]);

  const getCampaignsList = async (filters) => {
    const campaignsList = await getCompaignsList(filters);
    setCampaignData(campaignsList);

    const mappedArray = campaignsList.map((data) => {
      const findUser = usersRes?.data?.find((u) => u.id === data.createdBy);
      return {
        id: data.id,
        name: data.name,
        orgName: data.orgName,
        totalBudget: data?.totalBudget > 0 ? data?.totalBudget?.toFixed(2) || '--' : 'free',
        createdBy: (findUser?.firstName || '--') + ' ' + (findUser?.lastName || '--'),
        createdAt: formatDateTime(data.createdAt),
        startTime: formatDateTime(data.startTime),
        finishTime: formatDateTime(data.finishTime),
        status: data?.status,
        createdMonth: dayjs(data.createdAt).format('MMMM YYYY'), // month-year for grouping
      };
    });

    // ✅ Group by month-year
    const groupedData = _.groupBy(mappedArray, (item) => item.createdMonth);

    const groupedRows = Object.entries(groupedData).flatMap(([month, groupItems], index) => {
      // Group header row
      const groupRow = {
        id: `group-${index}`,
        month: month, // show month as group header
        name: '',
        startTime: '',
        finishTime: '',
        orgName: '',
        isGroupRow: true, // flag for rendering
      };

      // Child rows
      const childRows = groupItems.map((item, i) => ({
        id: `${item.id}-${i}`,
        campaignId: item.id,
        name: item.name, // show campaign name in children
        totalBudget: item?.totalBudget || '--',
        createdBy: item.createdBy,
        createdAt: item.createdAt,
        status: item?.status,
        startTime: item.startTime,
        finishTime: item.finishTime,
        orgName: item.orgName,
        isGroupRow: false,
      }));

      return [groupRow, ...childRows];
    });

    setRows(groupedRows);
  };

  const changeFilter = (event, fieldName, label) => {
    if (fieldName === 'createdAt' || fieldName === 'lastUpdatedAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [fieldName]: event,
      }));
    } else if (fieldName === 'orgId') {
      // 👉 Handle autocomplete / object case
      setFilters((prevFilters) => ({
        ...prevFilters,
        orgId: event?.id || 0,
      }));
    } else if (event?.target) {
      // 👉 Normal text input
      const { name, value } = event.target;

      setFilters((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const toggleFilters = () => {
    setshowFilters((prev) => !prev);
  };

  const toggleGrid = () => {
    setshowDaGrid((prev) => !prev);
  };

  const handleReset = () => {
    getCampaignsList({
      id: 0,
      orgId: user.orgId,
      rowVer: 0,
      networkId: 0,
      name: '',
      HashTags: '',
      status: 0,
      createdAt: dayjs().startOf('month').format(),
      lastUpdatedAt: dayjs().local().startOf('day').format(),
    });
    setFilters({
      id: 0,
      orgId: user.orgId,
      rowVer: 0,
      networkId: 0,
      name: '',
      HashTags: '',
      status: 0,
      createdAt: dayjs().startOf('month').format(),
      lastUpdatedAt: dayjs().local().startOf('day').format(),
    });
  };

  const getOrganizationLst = async () => {
    const orgBody = {
      id: 0,
      roleId: 0,
      orgId: 0,
      email: '',
      name: '',
      HashTags: '',
      contact: '',
      rowVer: 0,
      cityId: 0,
      status: 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: dayjs().subtract(100, 'year').utc().format(),
      lastUpdatedAt: dayjs().utc().format(),
      createdBy: 0,
      lastUpdatedBy: 0,
    };
    await getOrgs(orgBody);
  };

  const orgFilterFields = getOrgFiltersFields(
    filters,
    changeFilter,
    orgsRes?.data || [],
    user?.roleId,
  );

  const currencyName = orgsRes?.data?.find((o) => filters?.orgId == o.id)?.currencyName || '--';

  const campaignslistingCols = getcampaignslistingCols(
    getCampaignsList,
    campaignData,
    pageRoles,
    filters,
    currencyName,
  );

  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <AppContainer>
            <DataGridHeader
              title="Advance Search"
              onClick={toggleFilters}
              otherControls={[{ icon: cilChevronBottom, fn: toggleFilters }]}
              filterDisable={true}
            />

            {showFilters && (
              <CustomFilters
                filters={filters}
                changeFilter={changeFilter}
                fetching={getCampaignsList}
                handleReset={handleReset}
                filterFields={orgFilterFields}
              />
            )}
          </AppContainer>

          <AppContainer>
            <DataGridHeader
              title="Campaigns"
              onClick={toggleGrid}
              addButton={pageRoles.canAdd === 1 ? 'Campaign' : ''}
              addBtnClick={() => navigate('/campaignadd')}
              otherControls={[{ icon: cilChevronBottom, fn: toggleGrid }]}
              filterDisable
            />
            {showDaGrid && (
              <CustomDatagrid
                rows={rows}
                columns={campaignslistingCols}
                rowHeight={50}
                pagination={true}
                loading={orgLoading || loading || usersLoading}
                // loading={rows.length < 1 ? true : false}
                sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
                canExport={pageRoles.canExport}
                canPrint={pageRoles.canPrint}
                summary={[
                  {
                    field: 'totalBudget',
                    aggregates: [{ aggregate: 'sum', caption: `Total Budget (${currencyName})` }],
                  },
                  {
                    field: 'startTime',
                    aggregates: [{ aggregate: 'max', caption: 'Last Start Time' }],
                  },
                  {
                    field: 'startTime',
                    aggregates: [{ aggregate: 'min', caption: 'First Start Time' }],
                  },
                ]}
              />
            )}
          </AppContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default campaignslisting;

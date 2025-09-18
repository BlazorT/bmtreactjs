import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useFetch from 'src/hooks/useFetch';
import { cilCalendarCheck, cilChevronBottom } from '@coreui/icons';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Loading from 'src/components/UI/Loading';
import CustomFilters from 'src/components/Filters/CustomFilters';
import { getOrgFiltersFields } from 'src/configs/FiltersConfig/orgFilterConfig';
import { getcampaignslistingCols } from 'src/configs/ColumnsConfig/campaignslistingCols';
import { updateToast } from 'src/redux/toast/toastSlice';
import { formatDateTime } from 'src/helpers/formatDate';
import { useFetchCampaigns } from 'src/hooks/api/useFetchCampaigns';
import AppContainer from 'src/components/UI/AppContainer';
import _ from 'lodash';
const campaignslisting = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    getCampaignsList();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Campaigns Listing',
  );
  const navigate = useNavigate();
  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [campaignData, setCampaignData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const orgId = user.orgId;
  const Role = user.roleId;
  const [filters, setFilters] = useState({
    id: 0,
    orgId: user.orgId,
    rowVer: 0,
    networkId: 0,
    Name: '',
    HashTags: '',
    status: 0,
    createdAt: dayjs().subtract(5, 'month').startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });
  console.log("filters", filters);

  const [rows, setRows] = useState([]);
  const { data, loading, fetchCompaigns: getCompaignsList } = useFetchCampaigns();
  const getCampaignsList = async (filters) => {
    const campaignsList = await getCompaignsList(filters);
    setCampaignData(campaignsList);

    const mappedArray = campaignsList.map((data) => ({
      id: data.id,
      name: data.name,
      orgName: data.orgName,
      startTime: formatDateTime(data.startTime),
      finishTime: formatDateTime(data.finishTime),
    }));

    // ✅ Group ONLY by name
    const groupedData = _.groupBy(mappedArray, (item) => item.name);

    const groupedRows = Object.entries(groupedData).flatMap(([name, groupItems], index) => {
      // Group header row
      const groupRow = {
        id: `group-${index}`,
        name,
        startTime: '',
        finishTime: '',
        orgName: '',
        isGroupRow: true, // flag for rendering
      };

      // Child rows
      const childRows = groupItems.map((item, i) => ({
        id: `${item.id}-${i}`,
        name: '', // hide name in children
        startTime: item.startTime,
        finishTime: item.finishTime,
        orgName: item.orgName,
        isGroupRow: false,
      }));

      return [groupRow, ...childRows];
    });

    setRows(groupedRows);
    console.log(groupedRows, 'Grouped ONLY by name');
  };
  const changeFilter = (event, fieldName, label) => {
    let colName = fieldName;

    if (fieldName === 'createdAt' || fieldName === 'lastUpdatedAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [colName]: dayjs(event).utc().format(),
      }));
    } else if (event?.target) {
      // 👉 Normal text input
      const { name, value } = event.target;
      colName = name === 'networks' ? 'networkId' : name;

      setFilters((prevData) => ({
        ...prevData,
        [colName]: value,
      }));
    } else if (fieldName === 'Name') {
      // 👉 Handle autocomplete / object case
      setFilters((prevFilters) => ({
        ...prevFilters,
        //name: typeof event === 'string' ? event : event?.label || '',
        orgId: event?.id || 0,
      }));
    } else {
      console.warn('Unsupported event type:', event);
    }
  };

  const toggleFilters = () => {
    setshowFilters((prev) => !prev);
  };

  const toggleGrid = () => {
    setshowDaGrid((prev) => !prev);
  };

  const handleReset = () => {
    // getCampaignsList();
    //setFilters({
    //  id: 0,
    //  orgId: user.orgId,
    //  rowVer: 0,
    //  networkId: 0,
    //  name: '',
    //  status: 0,
    //  createdAt: dayjs().subtract(5, 'month').startOf('month').format(),
    //  lastUpdatedAt: dayjs().utc().startOf('day').format()
    //});
  };
  const {
    response: GetOrgRes,
    loading: OrgLoading,
    error: GetOrgError,
    fetchData: GetOrg,
  } = useFetch();
  useEffect(() => {
    getOrganizationLst(filters);
  }, []);
  const getOrganizationLst = async (compaign) => {
    const compaignBody = {
      id: 0,
      roleId: compaign,
      orgId: 0,
      email: '',
      name: '',
      HashTags: '',
      contact: '',
      rowVer: 0,
      cityId: filters ? (filters.state === '' ? 0 : filters.state) : 0,
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: filters
        ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
        : dayjs().subtract(1, 'year').utc().format(),
      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().format(),
      createdBy: 0,
      lastUpdatedBy: 0,
      ...filters,
    };
    await GetOrg(
      '/BlazorApi/orgsfulldata',
      { method: 'POST', body: JSON.stringify(compaignBody) },
      (res) => {
        console.log(res, 'orgs');
        if (res.status === true) {
          // setRows(mappedArray);
        } else {
          dispatch(
            updateToast({
              isToastOpen: true,
              toastMessage: res.message,
              toastVariant: 'error',
            }),
          );
          /*   setRows([]);*/
        }
        setIsLoading(OrgLoading.current);
      },
    );
  };
  useEffect(() => {
    if (GetOrgRes?.current?.data?.length > 0) {
      const orgData = GetOrgRes?.current?.data;
      const findUserOrg = orgData?.find((item) => item.id === orgId);
      // console.log(findUserOrg, 'findUserOrg')
      if (findUserOrg)
        setFilters((prevFilters) => ({
          ...prevFilters,
          name: findUserOrg,
        }));
    }
  }, [GetOrgRes?.current?.data, orgId]);
  const orgFilterFields = getOrgFiltersFields(
    filters,
    changeFilter,
    GetOrgRes?.current?.data || [],
    Role,
  );
  const campaignslistingCols = getcampaignslistingCols(getCampaignsList, campaignData, pageRoles);

  if (loading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <AppContainer>
            <DataGridHeader
              title="Campaigns Listing -> Advance Search (Organization, Network, Date To, #Tag)"
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
              title="Campaigns Listing"
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
                // loading={rows.length < 1 ? true : false}
                sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
                canExport={pageRoles.canExport}
                canPrint={pageRoles.canPrint}
              />
            )}
          </AppContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default campaignslisting;

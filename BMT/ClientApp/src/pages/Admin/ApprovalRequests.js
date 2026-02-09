import { cilChevronBottom } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import AppContainer from 'src/components/UI/AppContainer';
import { getApprovalCols } from 'src/configs/ColumnsConfig/approvalCols';
import { approvalFilterConfig } from 'src/configs/FiltersConfig/approvalFilterConfig';
import { formatDateTime } from 'src/helpers/formatDate';
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';
import useApi from 'src/hooks/useApi';
import usePageRoles from 'src/hooks/usePageRoles';
import globalutil from 'src/util/globalutil';
dayjs.extend(utc);

const ApprovalRequests = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { data, loading, fetchRecipients: getRecipientList } = useFetchRecipients();
  const { data: albums, loading: albumsLoading, fetchAlbums } = useFetchAlbums();
  const {
    postData: getOrgs,
    loading: orgsLoading,
    data: orgsData,
  } = useApi('/BlazorApi/orgsfulldata');

  const pageRoles = usePageRoles('Recipients');
  const orgId = user.orgId;
  const roleId = user.roleId;

  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [rows, setRows] = useState([]);
  const [fullRecipientsData, setFullRecipientsData] = useState([]);
  const [filters, setFilters] = useState({
    id: 0,
    orgId: user.orgId,
    contentId: '',
    rowVer: 0,
    networkId: 0,
    status: 0,
    albumid: 0,
    createdAt: dayjs().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });

  useEffect(() => {
    fetchFullRecipients();
    getRecipientsList(filters);
    getOrganizationLst();
  }, []);

  const fetchFullRecipients = async () => {
    const body = {
      id: 0,
      orgId: user.orgId,
      contentId: '',
      rowVer: 0,
      networkId: 0,
      albumid: 0,
      status: 0,
      createdAt: dayjs().subtract(5, 'year').startOf('year').format(),
      lastUpdatedAt: dayjs().utc().endOf('day').format(),
    };

    const fullList = await getRecipientList(body);
    setFullRecipientsData(fullList);
  };

  const getRecipientsList = async (filters) => {
    const recipientsList = await getRecipientList(filters);
    const albumsList = await fetchAlbums();
    // If this is the first load (no filters applied yet)
    if (fullRecipientsData.length === 0) {
      setFullRecipientsData(recipientsList); // <-- store full list once
    }

    setRows(
      recipientsList?.map((r) => ({
        ...r,
        nId: r?.networkId,
        networkId: globalutil.networks()?.find((n) => n.id === r?.networkId)?.name || '--',
        albumid: albumsList?.find((n) => n.id === r?.albumid)?.name || '--',
        createdAt: formatDateTime(r?.createdAt),
      })),
    );
  };

  const changeFilter = (event, key, label) => {
    // Handle date filters
    if (key === 'createdAt' || key === 'lastUpdatedAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: event,
      }));
    }

    // Handle autocomplete/custom dropdowns
    else if (label === 'name') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: event,
        orgId: event?.id || 1,
      }));
    }

    // Handle normal input fields
    else if (event && event.target) {
      const { name, value, type, checked } = event.target;
      const colName = name === 'networks' ? 'networkId' : name;

      setFilters((prevData) => ({
        ...prevData,
        [colName]: type === 'checkbox' ? checked : value,
      }));
    } else {
      console.warn('Invalid event passed to changeFilter:', event);
    }
  };

  const toggleFilters = () => {
    setshowFilters((prev) => !prev);
  };

  const toggleGrid = () => {
    setshowDaGrid((prev) => !prev);
  };

  const handleReset = () => {
    setFilters({
      id: 0,
      orgId: user.orgId,
      rowVer: 0,
      networkId: 0,
      status: 0,
      albumid: 0,
      createdAt: dayjs().startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });
    getRecipientsList({
      id: 0,
      orgId: user.orgId,
      contentId: '',
      rowVer: 0,
      networkId: 0,
      status: 0,
      albumid: 0,
      createdAt: dayjs().startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });
  };

  const getOrganizationLst = async () => {
    const recipientsBody = {
      id: 0,
      roleId: 0,
      orgId: 0,
      email: '',
      name: '',
      contact: '',
      rowVer: 0,
      cityId: 0,
      status: 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: dayjs().utc().subtract(1, 'year').format('YYYY-MM-DD'),
      lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
      createdBy: 0,
      lastUpdatedBy: 0,
    };
    await getOrgs(recipientsBody);
  };

  useEffect(() => {
    if (orgsData?.data?.length > 0) {
      const orgData = orgsData?.data;
      const findUserOrg = orgData?.find((item) => item.id === orgId);
      // console.log(findUserOrg, 'findUserOrg')
      if (findUserOrg)
        setFilters((prevFilters) => ({
          ...prevFilters,
          name: findUserOrg,
        }));
    }
  }, [orgsData?.data, orgId]);

  const orgFilterFields = approvalFilterConfig(filters, changeFilter, orgsData?.data || [], roleId);

  const getBothLists = () => {
    fetchFullRecipients();
    getRecipientsList({
      id: 0,
      orgId: user.orgId,
      contentId: '',
      rowVer: 0,
      networkId: 0,
      status: 0,
      createdAt: dayjs().startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });
  };
  const approvalCols = getApprovalCols(orgsData?.data);
  const dummyData = [
    {
      id: 1,
      requestedBy: 1,
      code: '659785',
      expiryDate: dayjs().add(24, 'hours').format(),
      status: 1,
    },
    {
      id: 1,
      requestedBy: 2,
      code: '134569',
      expiryDate: dayjs().add(48, 'hours').format(),
      status: 2,
    },
    {
      id: 1,
      requestedBy: 2,
      code: '123456',
      expiryDate: dayjs().add(48, 'hours').format(),
      status: 3,
    },
  ];
  return (
    <React.Fragment>
      <React.Fragment>
        <AppContainer>
          <DataGridHeader
            title="Advance Filters"
            onClick={toggleFilters}
            otherControls={[{ icon: cilChevronBottom, fn: toggleFilters }]}
            filterDisable={true}
          />

          {showFilters && (
            <CustomFilters
              filters={filters}
              changeFilter={changeFilter}
              fetching={getRecipientsList}
              handleReset={handleReset}
              filterFields={orgFilterFields}
            />
          )}
        </AppContainer>
        <AppContainer>
          <CustomDatagrid
            enableGrouping
            defaultExpandedGroups
            rowHeight={50}
            rows={dummyData}
            showGrid={showDaGrid}
            columns={approvalCols}
            groupBy={['networkId', 'albumid']}
            loading={loading || orgsLoading || albumsLoading}
            sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
            hiddenCols={{
              columnVisibilityModel: {
                lastUpdatedAt: false,
              },
            }}
            summary={[
              {
                field: 'contentId',
                aggregates: [{ aggregate: 'network_recipients', caption: 'Total Sent' }],
              },
            ]}
            headerProps={{
              title: 'Album Approval Requests',
              onClick: toggleGrid,
              otherControls: [
                {
                  icon: cilChevronBottom,
                  fn: toggleGrid,
                },
              ],
              filterDisable: true,
              canPrint: pageRoles?.canPrint === 1,
              canExport: pageRoles?.canExport === 1,
              fileName: 'Requests',
            }}
          />
        </AppContainer>
      </React.Fragment>
    </React.Fragment>
  );
};

export default ApprovalRequests;

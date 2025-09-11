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
import { getRecipientsFilterConfig } from 'src/configs/FiltersConfig/recipientsFilterConfig';
import { getrecipietslistingCols } from 'src/configs/ColumnsConfig/recipientsCols';
import { updateToast } from 'src/redux/toast/toastSlice';
import { formatDateTime } from 'src/helpers/formatDate';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';
import AppContainer from 'src/components/UI/AppContainer';
import globalutil from 'src/util/globalutil';
const recipientslisting = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Recipients',
  );
  const orgId = user.orgId;
  const Role = user.roleId;
  const navigate = useNavigate();
  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [recipientsData, setRecipientsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    id: 0,
    orgId: user.orgId,
    contentId: '',
    rowVer: 0,
    networkId: 0,
    status: 0,
    createdAt: dayjs().subtract(5, 'month').startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });

  useEffect(() => {
    getRecipientsList(filters);
  }, []);

  const [rows, setRows] = useState([]);
  const { data, loading, fetchRecipients: getRecipientList } = useFetchRecipients();
  const getRecipientsList = async (filters) => {
    console.log(filters, 'filtersfilters');
    const recipientsList = await getRecipientList(filters);
    console.log({ recipientsList });
    setRecipientsData(recipientsList);
    const networks = globalutil.networks(); // assuming it returns an array of { id, name }

    const mappedArray = recipientsList.map((data) => {
      const network = networks.find((n) => n.id === data.networkId);

      return {
        id: data.id,
        contentId: data.contentId,
        networkId: network ? network.name : '', // <-- show name instead of ID
        orgName: data.orgName,
        status: data.status,
        createdAt: formatDateTime(data.createdAt),
      };
    });

    // console.log(mappedArray, 'recipients data');
    setRows(mappedArray);
  };
  console.log("filters", filters);
  const changeFilter = (event, key, label) => {
    console.log({ event, key, label })
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
        orgId:event?.id||1      
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
    }

    else {
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
    getRecipientsList();
    setFilters({
      id: 0,
      orgId: user.orgId,
      rowVer: 0,
      networkId: 0,
      status: 0,
      createdAt: dayjs().subtract(5, 'month').startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });
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
    const recipientsBody = {
      id: 0,
      roleId: compaign,
      orgId: 0,
      email: '',
      name: '',
      contact: '',
      rowVer: 0,
      cityId: filters ? (filters.state === '' ? 0 : filters.state) : 0,
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: filters
        ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().subtract(1, 'year').format('YYYY-MM-DD'),
      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().format('YYYY-MM-DD'),
      createdBy: 0,
      lastUpdatedBy: 0,
      ...filters,
    };
    await GetOrg(
      '/BlazorApi/orgsfulldata',
      { method: 'POST', body: JSON.stringify(recipientsBody) },
      (res) => {
        console.log(res, 'orgs');
        if (res.status === true) {
          //const mappedArray = res.data.map((data, index) => ({
          //  //id: data.id,
          //  //userId: data.userId,
          //  //dspid: user.dspId.toString(),
          //  //logDesc: data.logDesc,
          //  //entityName: data.entityName,
          //  //menuId: data.menuId,
          //  //machineIp: data.machineIp,
          //  //actionType: data.actionType,
          //  //logTime: formatDateTime(data.logTime),
          //}));
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
  const orgFilterFields = getRecipientsFilterConfig(
    filters,
    changeFilter,
    GetOrgRes?.current?.data || [],
    Role,
  );
  const recipientslistingCols = getrecipietslistingCols(
    getRecipientsList,
    recipientsData,
    pageRoles,
  );

  if (loading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <AppContainer>
            <DataGridHeader
              title="Recipients Grid -> Advance Search (Organization, Network, Recipients, Date(>=))"
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
            <DataGridHeader
              title="Recipients List"
              onClick={toggleGrid}
              addButton={'Recipients'}
              addBtnClick={() => navigate('/campaignContacts')}
              otherControls={[{ icon: cilChevronBottom, fn: toggleGrid }]}
              filterDisable={true}
            />
            {showDaGrid && (
              <CustomDatagrid
                rows={rows}
                columns={recipientslistingCols}
                rowHeight={50}
                pagination={true}
                // loading={rows.length < 1 ? true : false}
                sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
                hiddenCols={{
                  columnVisibilityModel: {
                    lastUpdatedAt: false,
                  },
                }}
                //  canExport={pageRoles.canExport}
                // canPrint={pageRoles.canPrint}
              />
            )}
          </AppContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default recipientslisting;

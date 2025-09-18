import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useFetch from 'src/hooks/useFetch';

import { cilCalendarCheck, cilChevronBottom } from '@coreui/icons';
import { updateToast } from 'src/redux/toast/toastSlice';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import Loading from 'src/components/UI/Loading';
import NotificationModal from 'src/components/Modals/NotificationModal';
import CustomFilters from 'src/components/Filters/CustomFilters';

import { formatDate } from 'src/helpers/formatDate';
import globalutil from 'src/util/globalutil';

import { getorgUsersFilterFields } from 'src/configs/FiltersConfig/orgUserFilterConfig';
import { getorgUsersCols } from 'src/configs/ColumnsConfig/orgUsersCols';
import { formatDateTime } from 'src/helpers/formatDate';

import { useFetchOrgUser } from 'src/hooks/api/useFetchOrgUser';
import AppContainer from 'src/components/UI/AppContainer';

const organizationsusers = () => {
  dayjs.extend(utc);

  useEffect(() => {
    getOrgsList();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Organizations Users',
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [orgData, setOrgData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [NoticemodalOpen, setNoticemodalOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const orgId = user.orgId;
  const [filters, setFilters] = useState({
    name: '',
    state: '',
    status: 1,
    createdAt: dayjs().subtract(2, 'year').startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });

  const [rows, setRows] = useState([]);

  const { data, loading, fetchUsers: getUserbyRole } = useFetchOrgUser();
  const Role = user.roleId;
  // alert(Role);
  const getOrgsList = async (filter) => {
    const orgUsersList = await getUserbyRole(0, filter);

    console.log({ orgUsersList });
    setOrgData(orgUsersList);

    const mappedArray = orgUsersList.map((data) => ({
      id: data.id,
      completeName: data.completeName,
      roleName: data.roleName,
      orgName: data.orgName,
      contact: data.contact,
      createdAt: formatDate(data.createdAt),
      status: globalutil.statuses().find((item) => item.id === data.status)
        ? globalutil.statuses().find((item) => item.id === data.status).name
        : '',
      //status: data.status,
    }));
    console.log(mappedArray, 'orgUsersList');
    setRows(mappedArray);
  };
  const changeFilter = (e, date) => {
    console.log(e, date, 'iput');
    if (date === 'name') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        name: e,
      }));
    } else if (date === 'createdAt' || date === 'lastUpdatedAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: e,
      }));
    } else {
      // Handle custom event (e is an object like { name: 'name', value: 'Org 1' })
      if (e && e.name !== undefined && e.value !== undefined) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          [e.name]: e.value,
        }));
      }
      // Handle normal event
      else if (e?.target) {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value,
        }));
      }
    }
  };

  const NoticeModal = () => {
    setNoticemodalOpen((prev) => !prev);
  };

  const toggleFilters = () => {
    setshowFilters((prev) => !prev);
  };

  const toggleGrid = () => {
    setshowDaGrid((prev) => !prev);
  };

  const handleReset = () => {
    getOrgsList();
    setFilters({
      name: '',
      state: '',
      status: '',
      createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
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
    const compaignBody = {
      id: 0,
      roleId: compaign,
      orgId: 0,
      email: '',
      name: '',
      contact: '',
      rowVer: 0,
      cityId: filters?.state ? filters.state : 0,
      createdAt: filters
        ? dayjs(filters.createdAt).utc().format('YYYY-MM-DD')
        : dayjs().subtract(1, 'year').utc().format(),
      lastUpdatedAt: filters
        ? dayjs(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : dayjs().utc().format(),
      createdBy: 0,
      lastUpdatedBy: 0,
      ...filters,
      status: filters?.status ? parseInt(filters.status, 10) : 0, // <- force numeric
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
      console.log(findUserOrg, 'findUserOrg');
      if (findUserOrg)
        setFilters((prevFilters) => ({
          ...prevFilters,
          name: findUserOrg,
        }));
    }
  }, [GetOrgRes?.current?.data, orgId]);
  const orgFilterFields = getorgUsersFilterFields(
    filters,
    changeFilter,
    GetOrgRes?.current?.data || [],
    Role,
  );
  console.log('orgFilterFields', orgFilterFields);
  const orgUsersCols = getorgUsersCols(getOrgsList, orgData, pageRoles);

  if (loading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      {data && (
        <React.Fragment>
          <AppContainer>
            <DataGridHeader
              title="Organizations User -> Advance Search (Organization, Networks, Status, Date From)"
              onClick={toggleFilters}
              otherControls={[{ icon: cilChevronBottom, fn: toggleFilters }]}
              filterDisable={true}
            />

            {showFilters && (
              <CustomFilters
                filters={filters}
                changeFilter={changeFilter}
                fetching={getOrgsList}
                handleReset={handleReset}
                filterFields={orgFilterFields}
              />
            )}
          </AppContainer>

          <AppContainer>
            <DataGridHeader
              title="Organization Users"
              addButton={pageRoles.canAdd === 1 ? 'Organization User' : ''}
              addBtnClick={() => navigate('/UserRegister')}
              onClick={toggleGrid}
              otherControls={[
                /*  { icon: cilCalendarCheck, fn: NoticeModal },*/
                { icon: cilChevronBottom, fn: toggleGrid },
              ]}
              filterDisable
            />
            {showDaGrid && (
              <CustomDatagrid
                rows={rows}
                columns={orgUsersCols}
                rowHeight={50}
                pagination={true}
                // loading={rows.length < 1 ? true : false}
                sorting={[{ field: 'lastUpdated', sort: 'desc' }]}
                //summary={[
                //  {
                //    field: 'status',
                //    aggregates: [{ aggregate: 'statusCount', caption: 'OnBoard' }],
                //  },
                //]}
                //hiddenCols={{
                //  columnVisibilityModel: {
                //    status: false,
                //    lastUpdated: false,
                //  },
                //}}
                canExport={pageRoles.canExport}
                canPrint={pageRoles.canPrint}
              />
            )}

            <NotificationModal isOpen={NoticemodalOpen} toggle={NoticeModal} />
          </AppContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default organizationsusers;

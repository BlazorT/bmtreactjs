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

  const [networkTabs,setNetworkTabs]=useState([])

  useEffect(() => {
    
    getOrgsList();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Organization Users',
  );
  const navigate = useNavigate();

  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [orgData, setOrgData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [NoticemodalOpen, setNoticemodalOpen] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    state: '',
    status: '',
    createdAt: dayjs().subtract(5, 'month').startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });
  const [rows, setRows] = useState([]);

  const { data, loading, fetchUsers: getUserbyRole } = useFetchOrgUser();

  const getOrgsList = async (filter) => {
    const orgUsersList = await getUserbyRole(6, filter);

    console.log({ orgUsersList });
    setOrgData(orgUsersList);

    const mappedArray = orgUsersList.map((data) => ({
      id: data.id,
      completeName: data.completeName,
      roleName: data.roleName,
      orgName: data.orgName,
      contact:  data.contact,
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
    if (date === 'createdAt' || date === 'lastUpdatedAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: e,
      }));
    } else {
      const { name, value } = e.target;

      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
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

  const orgFilterFields = getorgUsersFilterFields(filters, changeFilter);
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
              title="Advance Search"
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
              otherControls={[
              /*  { icon: cilCalendarCheck, fn: NoticeModal },*/
                { icon: cilChevronBottom, fn: toggleGrid },
              ]}
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
                hiddenCols={{
                  columnVisibilityModel: {
                    status: false,
                    lastUpdated: false,
                  },
                }}
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

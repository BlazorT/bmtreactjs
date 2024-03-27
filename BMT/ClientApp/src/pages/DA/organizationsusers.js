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

import { getDaFiltersFields } from 'src/configs/FiltersConfig/daFilterConfig';
import { getdaAssociatesCols } from 'src/configs/ColumnsConfig/daAssociatesCols';
import { formatDateTime } from 'src/helpers/formatDate';

import { useFetchOrganization } from 'src/hooks/api/useFetchOrganization';
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

  const { data, loading, fetchOrganization: getUserbyRole } = useFetchOrganization();

  const getOrgsList = async (filter) => {
    const usersList = await getUserbyRole(3, filter);

     console.log({ usersList });
    setOrgData(usersList);

    const mappedArray = usersList.map((data) => ({
      id: data.id,
      name: data.name,
      cityId: data.cityId,
      compaignsCount: data.compaignsCount,
      currencyName: data.currencyName,
      state: data.stateId,
      createdAt: formatDate(data.createdAt),
      expiryTime: formatDateTime(data.expiryTime),
      status: globalutil.statuses().find((item) => item.id === data.status)
        ? globalutil.statuses().find((item) => item.id === data.status).name
        : '',
      //status: data.status,
    }));
    console.log(mappedArray, 'org');
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

  const orgFilterFields = getDaFiltersFields(filters, changeFilter);
  const daAssociatesCols = getdaAssociatesCols(getOrgsList, orgData, pageRoles);

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
                columns={daAssociatesCols}
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

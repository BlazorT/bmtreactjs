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
import { getcampaignNotiCols} from 'src/configs/ColumnsConfig/campaignNotiCols';
import { formatDateTime } from 'src/helpers/formatDate';

import { useFetchOrgUser } from 'src/hooks/api/useFetchOrgUser';
import AppContainer from 'src/components/UI/AppContainer';

const Organizationsusers = () => {
  dayjs.extend(utc);


  //useEffect(() => {
  //  getOrgsList();
  //}, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Organizations Users',
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

  //const getOrgsList = async (filter) => {
  //  const orgUsersList = await getUserbyRole(6, filter);

  //  console.log({ orgUsersList });
  //  setOrgData(orgUsersList);

  //  const mappedArray = orgUsersList.map((data) => ({
  //    id: data.id,
  //    completeName: data.completeName,
  //    roleName: data.roleName,
  //    orgName: data.orgName,
  //    contact:  data.contact,
  //    createdAt: formatDate(data.createdAt),
  //    status: globalutil.statuses().find((item) => item.id === data.status)
  //      ? globalutil.statuses().find((item) => item.id === data.status).name
  //      : '',
  //    //status: data.status,
  //  }));
  //  console.log(mappedArray, 'orgUsersList');
  //  setRows(mappedArray);
  //};

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

  //const handleReset = () => {
  //  getOrgsList();
  //  setFilters({
  //    name: '',
  //    state: '',
  //    status: '',
  //    createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
  //    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  //  });
  //};s

  const orgFilterFields = getorgUsersFilterFields(filters, changeFilter);
  const campaignNotiColsData = getcampaignNotiCols( orgData, pageRoles);
  const campaignNotiRows = [
    {
      id: 1,
      campaignName: 'Blazor Campaign',
      startDate: '2025-07-25T05:10:00',
      finishDate: '2025-07-28T17:10:00',
      networkId: 1,
      networkName: 'WhatsApp',
      totalMessage: 1000,
      totalSent: 900,
      totalFailed: 50,
      totalUnDelivered: 50,
    },
    {
      id: 2,
      campaignName: 'Blazor Campaign',
      startDate: '2025-07-25T05:10:00',
      finishDate: '2025-07-28T17:10:00',
      networkId: 2,
      networkName: 'SMS',
      totalMessage: 2000,
      totalSent: 1900,
      totalFailed: 30,
      totalUnDelivered: 70,
    },
    {
      id: 3,
      campaignName: 'React Campaign',
      startDate: '2025-07-26T08:00:00',
      finishDate: '2025-07-29T18:00:00',
      networkId: 1,
      networkName: 'WhatsApp',
      totalMessage: 1200,
      totalSent: 1150,
      totalFailed: 20,
      totalUnDelivered: 30,
    },
  ];
  //setRows(campaignNotiRows);
  if (loading) {
    return <Loading />;
  }
  return (
    <React.Fragment>
      {campaignNotiRows && (
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
               /* fetching={getOrgsList}*/
             /*   handleReset={handleReset}*/
                filterFields={orgFilterFields}
              />
            )}
          </AppContainer>

          <AppContainer>
            <DataGridHeader
              title="Campaign Notification"
              addButton={pageRoles.canAdd === 1 ? 'Campaign Notification' : ''}
              addBtnClick={() => navigate('/UserRegister')}
              onClick={toggleGrid}
              otherControls={[
              /*  { icon: cilCalendarCheck, fn: NoticeModal },*/
                { icon: cilChevronBottom, fn: toggleGrid },
              ]}
            />
            {showDaGrid && (
              <CustomDatagrid
                rows={campaignNotiRows}
                columns={campaignNotiColsData}
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

export default Organizationsusers;

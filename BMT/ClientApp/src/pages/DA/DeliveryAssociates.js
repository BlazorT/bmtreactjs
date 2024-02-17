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

import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import AppContainer from 'src/components/UI/AppContainer';

const DeliveryAssociates = () => {
  dayjs.extend(utc);

  useEffect(() => {
    getDasList();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Delivery Associates',
  );
  const navigate = useNavigate();

  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [daData, setDaData] = useState([]);
  const [NoticemodalOpen, setNoticemodalOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: '',
    state: '',
    boardingStatus: '',
    performance: '',
    createdAt: dayjs().subtract(5, 'month').startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });
  const [rows, setRows] = useState([]);

  const { data, loading, fetchUsers: getUserbyRole } = useFetchUsers();

  const getDasList = async (filter) => {
    const usersList = await getUserbyRole(3, filter);

    // console.log({ usersList });
    setDaData(usersList);

    const mappedArray = usersList.map((data) => ({
      id: data.id,
      firstName: data.firstName,
      code: data.userId,
      state: data.issuingstate,
      lastUpdatedAt: formatDate(data.createdAt),
      lastUpdated: data.lastUpdatedAt,
      daStatus: globalutil.dastatuses().find((item) => item.id === data.status)
        ? globalutil.dastatuses().find((item) => item.id === data.status).name
        : '',
      status: data.status,
      fleet: data.fleet,
    }));

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
    getDasList();
    setFilters({
      keyword: '',
      state: '',
      boardingStatus: '',
      performance: '',
      createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });
  };

  const daFilterFields = getDaFiltersFields(filters, changeFilter);
  const daAssociatesCols = getdaAssociatesCols(getDasList, daData, pageRoles);

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
                fetching={getDasList}
                handleReset={handleReset}
                filterFields={daFilterFields}
              />
            )}
          </AppContainer>

          <AppContainer>
            <DataGridHeader
              title="Delivery Associates"
              addButton={pageRoles.canAdd === 1 ? 'DA' : ''}
              addBtnClick={() => navigate('/applyForm')}
              otherControls={[
                { icon: cilCalendarCheck, fn: NoticeModal },
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
                summary={[
                  {
                    field: 'status',
                    aggregates: [{ aggregate: 'statusCount', caption: 'OnBoard' }],
                  },
                ]}
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

export default DeliveryAssociates;

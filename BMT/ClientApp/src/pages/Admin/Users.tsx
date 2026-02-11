/* eslint-disable @typescript-eslint/no-explicit-any */
import { cilChevronBottom } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import AppContainer from 'src/components/UI/AppContainer';
import { getUsersListColsFlexible } from 'src/configs/ColumnsConfig/usersListCols';
import { getUsersFiltersFields } from 'src/configs/FiltersConfig/userFilterConfig';
import { getRoleById } from 'src/constants/roles';
import { formatDate } from 'src/helpers/formatDate';
import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import usePageRoles from 'src/hooks/usePageRoles';

dayjs.extend(utc);

const Users: React.FC = () => {
  useEffect(() => {
    fetching();
  }, []);

  const { data, loading, error, fetchUsers } = useFetchUsers();
  const navigate = useNavigate();

  const pageRoles = usePageRoles('Users');

  const [filters, setFilters] = useState({
    UserName: '',
    status: '',
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
    createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
  });

  const [showFilters, setshowFilters] = useState(false);
  const [showUserGrid, setshowUserGrid] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [rows, setRows] = useState([]);

  const changeFilter = (e: any, date?: string) => {
    if (date === 'lastUpdatedAt' || date === 'createdAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: dayjs(e).utc().format(),
      }));
    } else {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const fetching = async (filter?: any) => {
    const usersList = await fetchUsers(0, filter);
    setUsersData(usersList);
    formatApiDataAsRows(usersList);
  };

  const formatApiDataAsRows = (apiData: any[]) => {
    const mappedArray: any = apiData.map((data) => ({
      id: data.id,
      picture: data.avatar ? data.avatar : 'Profile-pic.jpg',
      completeName: data.completeName,
      email: data.email,
      contact: data.contact,
      role: getRoleById(data.roleId) === 0 ? '' : getRoleById(data.roleId),
      regDate: formatDate(data.createdAt),
      lastUpdatedAt: data.lastUpdatedAt,
      status: data.status,
    }));
    // console.log(mappedArray, 'users');
    setRows(mappedArray);
  };

  const toggleStock = () => {
    setshowFilters((prev) => !prev);
  };

  const toggleLicence = () => {
    setshowUserGrid((prev) => !prev);
  };

  const handleReset = () => {
    setFilters({
      UserName: '',
      status: '',
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
      createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
    });
    fetching();
  };

  const usersListCols = getUsersListColsFlexible(fetching, usersData, pageRoles);
  const userFilterFields = getUsersFiltersFields(filters, changeFilter);

  return (
    <React.Fragment>
      <AppContainer>
        <DataGridHeader
          title="Advance Search"
          onClick={toggleStock}
          otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
          filterDisable={true}
        />
        {showFilters && (
          <CustomFilters
            filters={filters}
            fetching={fetching}
            handleReset={handleReset}
            filterFields={userFilterFields}
          />
        )}
      </AppContainer>
      <AppContainer>
        <CustomDatagrid
          rows={rows}
          columns={usersListCols}
          pagination={true}
          rowSelection={false}
          loading={loading || !data}
          noRowsMessage={error ? 'Error Fetching data' : ''}
          sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
          showGrid={showUserGrid}
          rowHeight={50}
          headerProps={{
            title: 'BMT Users',
            filterDisable: true,
            canPrint: pageRoles?.canPrint === 1,
            canExport: pageRoles?.canExport === 1,
            fileName: 'Users',
            onClick: toggleLicence,
            addButton: pageRoles?.canAdd === 1 ? 'User' : '',
            addBtnClick: pageRoles?.canAdd === 1 ? () => navigate('/UserRegister') : undefined,
            otherControls: [{ icon: cilChevronBottom, fn: toggleLicence }],
          }}
          groupBy={['']}
        />
      </AppContainer>
    </React.Fragment>
  );
};

export default Users;

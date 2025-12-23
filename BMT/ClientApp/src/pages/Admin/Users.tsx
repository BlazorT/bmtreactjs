/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cilChevronBottom } from '@coreui/icons';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import { useSelector } from 'react-redux';
import { formatDate } from 'src/helpers/formatDate';
import { getRoleById } from 'src/constants/roles';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  getUsersListCols,
  getUsersListColsFlexible,
} from 'src/configs/ColumnsConfig/usersListCols';
import CustomFilters from 'src/components/Filters/CustomFilters';
import { getUsersFiltersFields } from 'src/configs/FiltersConfig/userFilterConfig';
import { useFetchUsers } from 'src/hooks/api/useFetchUsers';
import AppContainer from 'src/components/UI/AppContainer';
import { RootState } from 'src/store';

const Users: React.FC = () => {
  dayjs.extend(utc);
  useEffect(() => {
    fetching();
  }, []);

  const { data, loading, error, fetchUsers } = useFetchUsers();
  const navigate = useNavigate();

  const pageRoles = useSelector((state: RootState): any => state.navItems.pageRoles).find(
    (item: { name: string }) => item.name === 'Users',
  );

  const [filters, setFilters] = useState({
    UserName: '',
    status: '',
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
    createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
  });
  console.log('filters', filters);

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
    console.log(usersList);
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
        <DataGridHeader
          title="BMT Users"
          onClick={toggleLicence}
          filterDisable={true}
          addButton={pageRoles.canAdd === 1 ? 'User' : ''}
          addBtnClick={pageRoles.canAdd === 1 ? () => navigate('/UserRegister') : undefined}
          otherControls={[{ icon: cilChevronBottom, fn: toggleLicence }]}
        />
        {showUserGrid && (
          <CustomDatagrid
            rows={rows}
            columns={usersListCols}
            // rowHeight={50}
            pagination={true}
            rowSelection={false}
            loading={loading || !data}
            noRowsMessage={error ? 'Error Fetching data' : ''}
            sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
            canExport={pageRoles.canExport}
            canPrint={pageRoles.canPrint}
            groupBy={['']}
          />
        )}
      </AppContainer>
    </React.Fragment>
  );
};

export default Users;

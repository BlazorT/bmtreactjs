import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import useFetch from 'src/hooks/useFetch';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { cilChevronBottom } from '@coreui/icons';
import globalutil from 'src/util/globalutil';
import Loading from 'src/components/UI/Loading';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import { getOrgListCols } from 'src/configs/ColumnsConfig/daDspsListCols';
import { getDaDspsFiltersFields } from 'src/configs/FiltersConfig/daDspsFilterConfig';
import CustomFilters from 'src/components/Filters/CustomFilters';
import { useFetchOrgs } from 'src/hooks/api/useFetchOrgs';
import AppContainer from 'src/components/UI/AppContainer';
import { useDispatch } from 'react-redux';
import { updateToast } from 'src/redux/toast/toastSlice';

const OrgList = () => {
  dayjs.extend(utc);
  useEffect(() => {
    fetchOrgList();
  }, []);
  const dispatch = useDispatch();
  const {
    response: GetCityRes,
    loading: CityLoading,
    error: createCityError,
    fetchData: GetCity,
  } = useFetch();
  useEffect(() => {
    getCityList();
  }, []);
  const getCityList = async () => {
    await GetCity(
      '/Common/cities',
      {
        method: 'POST',
        // body: JSON.stringify(fetchBody),
      },
      (res) => {
        console.log(res, 'city');
        if (res.status === true) {
          console.log(res, 'city');
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
        // setIsLoading(CityLoading.current);
      },
    );
  };
  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Organizations',
  );
  dayjs.extend(utc);
  const navigate = useNavigate();
  const { getOrgs } = useFetchOrgs();
  const [filters, setFilters] = useState({
    keyword: '',
    cityId: '',
    stateId: '',
    country: '',
    name: '',
    createdAt: dayjs().utc().startOf('year').format(),
  });
  const [showAdvSearch, setshowAdvSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orgsList, setOrgsList] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 880);
  const [rows, setRows] = useState([]);

  const applyFilters = () => {
    const filterBody = {
      name: filters.keyword,
      cityId: filters.cityId === '' ? null : filters.cityId,
      createdAt: filters.createdAt === '' ? null : filters.createdAt,
    };
    console.log(JSON.stringify(filterBody), 'filterBody');
    fetchOrgList(filterBody);
  };

  const fetchOrgList = async (filter) => {
    const orgData = await getOrgs(filter);
    setOrgsList(orgData);
    console.log(orgData, 'orgData');
    const cityList = GetCityRes?.current?.data || [];

    const mappedArray = orgData.map((data) => {
      const city = cityList.find((c) => c.id === data.cityId);

      return {
        id: data.id,
        name: data.name,
        cityId: city ? city.name : '', // <-- display city name here
        compaignsCount: data.compaignsCount,
        currencyName: data.currencyName,
        state: data.stateId,
        createdAt: formatDate(data.createdAt),
        expiryTime: formatDateTime(data.expiryTime),
        status: globalutil.statuses().find((item) => item.id === data.status)
          ? globalutil.statuses().find((item) => item.id === data.status).name
          : '',
      };
    });

    console.log(mappedArray, 'mappedArray');
    setRows(mappedArray);
    setIsLoading(false);
  };

  const toggleStock = () => {
    setshowAdvSearch((prev) => !prev);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      cityId: 1,
      createdAt: dayjs().utc().startOf('year').format(),
    });
    fetchOrgList();
  };

  const changeFilter = (e, date) => {
    if (date === 'date') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        createdAt: dayjs(e).utc().format(),
      }));
    } else {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const orgsListCols = getOrgListCols(fetchOrgList, orgsList, pageRoles);
  const daDspsFiltersFields = getDaDspsFiltersFields(
    filters,
    changeFilter,
    GetCityRes?.current?.data ? GetCityRes.current.data : [],
  );

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <AppContainer>
            <DataGridHeader
              title="Advance Search"
              onClick={toggleStock}
              otherControls={[{ icon: cilChevronBottom, fn: toggleStock }]}
              filterDisable={true}
            />

            {showAdvSearch && (
              <CustomFilters
                filters={filters}
                changeFilter={changeFilter}
                fetching={applyFilters}
                handleReset={handleReset}
                filterFields={daDspsFiltersFields}
              />
            )}
          </AppContainer>
          <AppContainer>
            {/* <DataGridHeader
              title="Organization List"
              addButton={pageRoles.canAdd === 1 ? 'New Organization' : ''}
              addBtnClick={() => navigate('/organizationadd')}
            /> */}
            <CustomDatagrid
              isHeader
              headerProps={{
                title: 'Organization List',
                addButton: pageRoles.canAdd === 1 ? 'New Organization' : '',
                addBtnClick: () => navigate('/organizationadd'),
                filterDisable: true,
              }}
              rows={rows}
                columns={orgsListCols}
              rowHeight={50}
              pagination={true}
              loading={isLoading}
              hiddenCols={{
                columnVisibilityModel: {
                  country: isMobile ? false : true,
                  state: isMobile ? false : true,
                  lastUpdatedAt: false,
                },
              }}
              canPrint={pageRoles.canPrint}
              canExport={pageRoles.canExport}
              rowSelection={false}
              sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
            />
          </AppContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default OrgList;

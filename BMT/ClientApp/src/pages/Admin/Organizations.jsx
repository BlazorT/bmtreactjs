import { cilChevronBottom } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import AppContainer from 'src/components/UI/AppContainer';
import Loading from 'src/components/UI/Loading';
import { getOrgListCols } from 'src/configs/ColumnsConfig/daDspsListCols';
import { getDaDspsFiltersFields } from 'src/configs/FiltersConfig/daDspsFilterConfig';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import { useFetchOrgs } from 'src/hooks/api/useFetchOrgs';
import useFetch from 'src/hooks/useFetch';
import usePageRoles from 'src/hooks/usePageRoles';
import { updateToast } from 'src/redux/toast/toastSlice';
import globalutil from 'src/util/globalutil';

dayjs.extend(utc);
const OrgList = () => {
  const pageRoles = usePageRoles('Organizations');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { getOrgs } = useFetchOrgs();

  const { response: GetCityRes, fetchData: GetCity } = useFetch();

  useEffect(() => {
    getCityList();
    fetchOrgList();
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
    fetchOrgList(filterBody);
  };

  const fetchOrgList = async (filter) => {
    const orgData = await getOrgs(filter);
    setOrgsList(orgData);
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
            <CustomDatagrid
              isHeader
              headerProps={{
                title: 'Organization List',
                addButton: pageRoles?.canAdd === 1 ? 'New Organization' : '',
                addBtnClick: () => navigate('/organizationadd'),
                filterDisable: true,
                canPrint: pageRoles?.canPrint === 1,
                canExport: pageRoles?.canExport === 1,
                fileName: 'Organizations',
              }}
              rows={rows}
              columns={orgsListCols}
              pagination={true}
              loading={isLoading}
              hiddenCols={{
                columnVisibilityModel: {
                  country: isMobile ? false : true,
                  state: isMobile ? false : true,
                  createdAt: false,
                },
              }}
              canPrint={pageRoles?.canPrint}
              canExport={pageRoles?.canExport}
              rowSelection={false}
              sorting={[{ columnKey: 'createdAt', direction: 'DESC' }]}
            />
          </AppContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default OrgList;

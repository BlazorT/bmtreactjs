import { cilChevronBottom } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import AppContainer from 'src/components/UI/AppContainer';
import { getOrgListCols } from 'src/configs/ColumnsConfig/daDspsListCols';
import { getDaDspsFiltersFields } from 'src/configs/FiltersConfig/daDspsFilterConfig';
import { formatDate, formatDateTime } from 'src/helpers/formatDate';
import { useFetchOrgs } from 'src/hooks/api/useFetchOrgs';
import useApi from 'src/hooks/useApi';
import usePageRoles from 'src/hooks/usePageRoles';
import globalutil from 'src/util/globalutil';

dayjs.extend(utc);
const isMobile = window.innerWidth < 880;

const OrgList = () => {
  const pageRoles = usePageRoles('Organizations');
  const navigate = useNavigate();

  const { getOrgs, orgsLoading } = useFetchOrgs();
  const { postData: getCities, loading: citiesLoading, data: cityRes } = useApi('/Common/cities');

  useEffect(() => {
    fetchOrgList();
  }, []);

  const [filters, setFilters] = useState({
    keyword: '',
    cityId: '',
    stateId: '',
    country: '',
    name: '',
    createdAt: dayjs().utc().startOf('year').format(),
  });
  const [showAdvSearch, setshowAdvSearch] = useState(false);
  const [orgsList, setOrgsList] = useState([]);
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
    const cityList = await getCities();
    const mappedArray = orgData.map((data) => {
      const city = cityList?.data?.find((c) => c.id === data.cityId);

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
  const daDspsFiltersFields = getDaDspsFiltersFields(filters, changeFilter, cityRes?.data || []);
  return (
    <React.Fragment>
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
            loading={orgsLoading || citiesLoading}
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
    </React.Fragment>
  );
};

export default OrgList;

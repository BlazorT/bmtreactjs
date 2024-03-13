import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import moment from 'moment';
import { cilChevronBottom } from '@coreui/icons';
import globalutil from 'src/util/globalutil';

import { getBusinessTypeById } from 'src/constants/buisnessType';
import { getCountryById, getStateById } from 'src/constants/countries_and_states';

import Loading from 'src/components/UI/Loading';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';

import { getDADspsListCols } from 'src/configs/ColumnsConfig/daDspsListCols';
import { getDaDspsFiltersFields } from 'src/configs/FiltersConfig/daDspsFilterConfig';
import CustomFilters from 'src/components/Filters/CustomFilters';

import { useFetchOrgs } from 'src/hooks/api/useFetchOrgs';
import AppContainer from 'src/components/UI/AppContainer';

const OrgList = () => {
  useEffect(() => {
    fetchOrgList();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Organizations',
  );
  const navigate = useNavigate();
  const { getOrgs } = useFetchOrgs();

  const [filters, setFilters] = useState({
    keyword: '',
    businessTypeId: '',
    stateId: '',
    country: '',
    createdAt: moment().utc().startOf('year').format(),
  });
  const [showAdvSearch, setshowAdvSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orgsList, setOrgsList] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 880);
  const [rows, setRows] = useState([]);

  const applyFilters = () => {
    const filterBody = {
      name: filters.keyword,
      businessTypeId: filters.businessTypeId === '' ? null : filters.businessTypeId,
      stateId: filters.stateId === '' ? null : filters.stateId,
      createdAt: filters.createdAt === '' ? null : filters.createdAt,
    };

    fetchOrgList(filterBody);
  };

  const changeFilter = (e, date) => {
    if (date === 'date') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        createdAt: moment(e).utc().format(),
      }));
    } else {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const fetchOrgList = async (filter) => {
    const orgData = await getOrgs(filter);

    setOrgsList(orgData);
    console.log(orgData);
      const mappedArray = orgData.map((data) => ({
      id: data.id,
      name: data.name,
      cityId: data.cityId,
      compaignsCount: data.compaignsCount,
      currencyName: data.currencyName,
      state: data.stateId,
      createdAt: data.createdAt,
      expiryTime: data.expiryTime,
      status: globalutil.statuses().find((item) => item.id === data.status)
        ? globalutil.statuses().find((item) => item.id === data.status).name
        : '',
      //status: data.status,
    }));
    console.log(mappedArray);
    setRows(mappedArray);
    setIsLoading(false);
  };

  const toggleStock = () => {
    setshowAdvSearch((prev) => !prev);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      businessTypeId: '',
      stateId: 1,
      country: 1,
      createdAt: moment().utc().startOf('year').format(),
    });
    fetchOrgList();
  };

  const daDspsListCols = getDADspsListCols(fetchOrgList, orgsList, pageRoles);
  const daDspsFiltersFields = getDaDspsFiltersFields(filters, changeFilter);

  return (
    <React.Fragment>
      {isLoading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <AppContainer>
            <DataGridHeader
              title="Advance Search"
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
            <DataGridHeader
              title="Organization List"
              addButton={pageRoles.canAdd === 1 ? 'Org' : ''}
              addBtnClick={() => navigate('/applyForm')}
            />
            <CustomDatagrid
              rows={rows}
              columns={daDspsListCols}
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
              rowSelection={true}
              sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}
            />
          </AppContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default OrgList;

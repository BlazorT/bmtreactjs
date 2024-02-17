import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import moment from 'moment';
import { cilChevronBottom } from '@coreui/icons';

import { getBusinessTypeById } from 'src/constants/buisnessType';
import { getCountryById, getStateById } from 'src/constants/countries_and_states';

import Loading from 'src/components/UI/Loading';

import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';

import { getDADspsListCols } from 'src/configs/ColumnsConfig/daDspsListCols';
import { getDaDspsFiltersFields } from 'src/configs/FiltersConfig/daDspsFilterConfig';
import CustomFilters from 'src/components/Filters/CustomFilters';

import { useFetchDsps } from 'src/hooks/api/useFetchDsps';
import AppContainer from 'src/components/UI/AppContainer';

const DADspsList = () => {
  useEffect(() => {
    fetchDspList();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'DSP List',
  );
  const navigate = useNavigate();
  const { getDsps } = useFetchDsps();

  const [filters, setFilters] = useState({
    keyword: '',
    businessTypeId: '',
    stateId: '',
    country: '',
    createdAt: moment().utc().startOf('year').format(),
  });
  const [showAdvSearch, setshowAdvSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dspsList, setDspsList] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 880);
  const [rows, setRows] = useState([]);

  const applyFilters = () => {
    const filterBody = {
      name: filters.keyword,
      businessTypeId: filters.businessTypeId === '' ? null : filters.businessTypeId,
      stateId: filters.stateId === '' ? null : filters.stateId,
      createdAt: filters.createdAt === '' ? null : filters.createdAt,
    };

    fetchDspList(filterBody);
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

  const fetchDspList = async (filter) => {
    const dspData = await getDsps(filter);

    setDspsList(dspData);
    const mappedArray = dspData.map((data, index) => ({
      sr: index + 1,
      id: data.id,
      firstName: data.firstName !== null ? data.name : ' ' + data.name,
      contact: data.contact,
      country: data.stateId && getCountryById(data.stateId),
      state: data.stateId && getStateById(data.stateId),
      businessType: data.businessTypeId ? getBusinessTypeById(data.businessTypeId) : '',
      partners: data.partnersCount,
      status: data.status,
      lastUpdatedAt: data.lastUpdatedAt,
      fleet: data.fleet,
    }));
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
    fetchDspList();
  };

  const daDspsListCols = getDADspsListCols(fetchDspList, dspsList, pageRoles);
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
              title="DSPS List"
              addButton={pageRoles.canAdd === 1 ? 'DSPS' : ''}
              addBtnClick={() => navigate('/dspRegister')}
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

export default DADspsList;

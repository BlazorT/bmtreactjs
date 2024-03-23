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
import moment from 'moment';
import { getOrgFiltersFields } from 'src/configs/FiltersConfig/orgFilterConfig';
import { getcampaignslistingCols } from 'src/configs/ColumnsConfig/campaignslistingCols';
import { updateToast } from 'src/redux/toast/toastSlice';
import {  formatDateTime } from 'src/helpers/formatDate';
import { useFetchCampaigns } from 'src/hooks/api/useFetchCampaigns';
import AppContainer from 'src/components/UI/AppContainer';

const campaignslisting = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user)
  useEffect(() => {    
    getCampaignsList();
  }, []);

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Compaigns',
  );
  const navigate = useNavigate();
  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [campaignData, setCampaignData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [NoticemodalOpen, setNoticemodalOpen] = useState(false);
  const [filters, setFilters] = useState({
    id: 0,
    orgId: user.orgId,
    rowVer: 0,
    networkId:0,
    name: '',  
    status: 0,
    createdAt: dayjs().subtract(5, 'month').startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });
  const [rows, setRows] = useState([]);
  const { data, loading, fetchCompaigns: getCompaignsList } = useFetchCampaigns();
  const getCampaignsList = async (filters) => {
    const campaignsList = await getCompaignsList(filters);  
    setCampaignData(campaignsList);
    const mappedArray = campaignsList.map((data) => ({
      id: data.id,
      name: data.name,
      orgName: data.orgName,
      startTime: formatDateTime(data.startTime),
      finishTime: formatDateTime(data.finishTime)
    }));
    //console.log(mappedArray, 'org');
    setRows(mappedArray);
  };

  const changeFilter = (event, date) => {
    var colName = date;
    if (date === 'createdAt' || date === 'lastUpdatedAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [colName]: event,
      }));
    } else {
      const { name, value, type, checked } = event.target;
      colName = (name == 'networks') ? "networkId" : name; // column name was replaced bc networks is not backend key value
      setFilters((prevData) => ({
        ...prevData,
        [colName]: value,

      }));
     // alert(JSON.stringify(filters));
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
    getCampaignsList();
    //setFilters({
    //  id: 0,
    //  orgId: user.orgId,
    //  rowVer: 0,
    //  networkId: 0,
    //  name: '',
    //  status: 0,
    //  createdAt: dayjs().subtract(5, 'month').startOf('month').format(),
    //  lastUpdatedAt: dayjs().utc().startOf('day').format()     
    //});
  };
  const {
    response: GetOrgRes,
    loading: OrgLoading,
    error: GetOrgError,
    fetchData: GetOrg,
  } = useFetch();
  useEffect(() => {
    getOrganizationLst(filters);
  }, []);
  const getOrganizationLst = async (compaign) => {
    const compaignBody = {
      id: 0,
      roleId: compaign,
      orgId: 0,
      email: '',
      name: '',
      contact: "",
      rowVer: 0,
      cityId: filters ? (filters.state === '' ? 0 : filters.state) : 0,
      status: filters ? (filters.status === '' ? 0 : filters.status) : 0,
      // keyword: filters ? filters.keyword : '',
      createdAt: filters
        ? moment(filters.createdAt).utc().format('YYYY-MM-DD')
        : moment().subtract(1, 'year').utc().format(),
      lastUpdatedAt: filters
        ? moment(filters.lastUpdatedAt).utc().format('YYYY-MM-DD')
        : moment().utc().format(),
      createdBy: 0,
      lastUpdatedBy: 0,
      ...filters,
    };
    await GetOrg(
      '/BlazorApi/orgsfulldata',{ method: 'POST', body: JSON.stringify(compaignBody),},
      (res) => {
        console.log(res, 'orgs');
        if (res.status === true) {
          //const mappedArray = res.data.map((data, index) => ({
          //  //id: data.id,
          //  //userId: data.userId,
          //  //dspid: user.dspId.toString(),
          //  //logDesc: data.logDesc,
          //  //entityName: data.entityName,
          //  //menuId: data.menuId,
          //  //machineIp: data.machineIp,
          //  //actionType: data.actionType,
          //  //logTime: formatDateTime(data.logTime),
          //}));

          // setRows(mappedArray);
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
        setIsLoading(OrgLoading.current);
      },
    );
  };
  const orgFilterFields = getOrgFiltersFields(filters, changeFilter, GetOrgRes?.current?.data||[]);
  const campaignslistingCols = getcampaignslistingCols(getCampaignsList, campaignData, pageRoles);

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
                fetching={getCampaignsList}
                handleReset={handleReset}
                filterFields={orgFilterFields}
              />
            )}
          </AppContainer>


          <AppContainer>
            <DataGridHeader
              title="Campaigns Listing"
              addButton={pageRoles.canAdd === 1 ? 'Campaign' : ''}
              addBtnClick={() => navigate('/campaignadd')}
              otherControls={[        
                { icon: cilChevronBottom, fn: toggleGrid },
              ]}
            />
            {showDaGrid && (
              <CustomDatagrid
                rows={rows}
                columns={campaignslistingCols}
                rowHeight={50}
                pagination={true}
                // loading={rows.length < 1 ? true : false}
                sorting={[{ field: 'lastUpdatedAt', sort: 'desc' }]}               
                hiddenCols={{
                  columnVisibilityModel: {
                    status: false,
                    lastUpdatedAt: false,
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

export default campaignslisting;

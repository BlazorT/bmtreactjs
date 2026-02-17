import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
//import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { cilChevronBottom } from '@coreui/icons';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import NotificationModal from 'src/components/Modals/NotificationModal';

import { formatDate } from 'src/helpers/formatDate';
import globalutil from 'src/util/globalutil';

import { campaignResultCols } from 'src/configs/ColumnsConfig/campaignResultCols';
import { campaignresultsFilterConfig } from 'src/configs/FiltersConfig/campaignresultsFilterConfig';

import AppContainer from 'src/components/UI/AppContainer';
import { useFetchOrgs } from 'src/hooks/api/useFetchOrgs';
import { useFetchAllNotification } from 'src/hooks/api/useFetchAllNotification';

import usePageRoles from 'src/hooks/usePageRoles';

dayjs.extend(utc);

const organizationsusers = () => {
  const pageRoles = usePageRoles('Organizations Users');
  //const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const { loading, fetchRecipients: getCampaignResult, data: orgUserList } = useFetchAllNotification();
  console.log("useFetchAllRecipients returned:", {
    loading,
    getCampaignResult,
    orgUserList,
  });
  const { getOrgs, orgsLoading, orgData } = useFetchOrgs();

  useEffect(() => {
    getCampaignResultList();
    getOrganizationLst();
  }, []);
  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);

  const [NoticemodalOpen, setNoticemodalOpen] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    name: '',
    status: 1,
    networkId: 1,
    createdAt: dayjs().subtract(5, 'year').startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });
  const [rows, setRows] = useState([]);

  const orgId = user.orgId;
  const Role = user.roleId;
  // alert(Role);

  const getCampaignResultList = async (filter) => {
    const orgCampResultList = await getCampaignResult(0, filter);
    console.log("orgCampResultList", orgCampResultList);
    const mappedArray = orgCampResultList.map((data) => ({
      id: data.id,
      recipient: data.recipient,
      networkId: globalutil.networks()?.find((n) => n.id === data?.networkId)?.name || '--',
      createdAt: formatDate(data.createdAt),
      lastUpdatedAt: formatDate(data.lastUpdatedAt),
      deliveryStatus: data.deliveryStatus,
      //status: data.status,
    }));
    setRows(mappedArray);
  };

  const changeFilter = (e, date) => {
    if (date === 'name') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        name: e,
      }));
    } else if (date === 'createdAt' || date === 'lastUpdatedAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [date]: e,
      }));
    } else {
      // Handle custom event (e is an object like { name: 'name', value: 'Org 1' })
      if (e && e.name !== undefined && e.value !== undefined) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          [e.name]: e.value,
        }));
      }
      // Handle normal event
      else if (e?.target) {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value,
        }));
      }
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
    getCampaignResultList();
    setFilters({
      keyword: '',
      name: '',
      status: 1,
      networkId: 1,
      createdAt: dayjs().subtract(1, 'month').startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });
  };

  useEffect(() => {
    getOrganizationLst(filters);
  }, []);

  const getOrganizationLst = async () => {
    const orgBody = {
      id: 0,
      roleId: 0,
      orgId: 0,
      email: '',
      name: '',
      contact: '',
      rowVer: 0,
      cityId: 0,
      createdAt: dayjs().subtract(100, 'year').utc().format(),
      lastUpdatedAt: dayjs().utc().format(),
      createdBy: 0,
      lastUpdatedBy: 0,
      status: 0, // <- force numeric
    };

    await getOrgs(orgBody);
  };

  useEffect(() => {
    if (orgData?.length > 0) {
      const findUserOrg = orgData?.find((item) => item.id === orgId);
      if (findUserOrg)
        setFilters((prevFilters) => ({
          ...prevFilters,
          name: findUserOrg,
        }));
    }
  }, [orgData, orgId]);

  const orgFilterFields = campaignresultsFilterConfig(filters, changeFilter, orgData || [], Role);
  const orgUsersCols = campaignResultCols(getCampaignResultList, orgUserList?.data || [], pageRoles);

  return (
    <React.Fragment>
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
              fetching={getCampaignResultList}
              handleReset={handleReset}
              filterFields={orgFilterFields}
            />
          )}
        </AppContainer>

        <AppContainer>
          <CustomDatagrid
            rows={rows}
            columns={orgUsersCols}
            rowHeight={50}
            pagination={true}
            sorting={[{ field: 'lastUpdated', sort: 'desc' }]}
            showGrid={showDaGrid}
            loading={orgsLoading || loading}
            headerProps={{
              title: 'Campaign Results',
             // addButton: pageRoles?.canAdd === 1 ? 'Campaign Results' : '',
          //    addBtnClick: () => navigate('/UserRegister'),
              onClick: toggleGrid,
              otherControls: [{ icon: cilChevronBottom, fn: toggleGrid }],
              filterDisable: true,
            //  canPrint: pageRoles?.canPrint === 1,
            //  canExport: pageRoles?.canExport === 1,
              fileName: 'ORGANIZATION_USERS',
            }}
          />

          <NotificationModal isOpen={NoticemodalOpen} toggle={NoticeModal} />
        </AppContainer>
      </React.Fragment>
    </React.Fragment>
  );
};

export default organizationsusers;

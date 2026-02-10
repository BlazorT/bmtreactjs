import { cilChevronBottom } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import AppContainer from 'src/components/UI/AppContainer';
import { getApprovalCols } from 'src/configs/ColumnsConfig/approvalCols';
import { approvalFilterConfig } from 'src/configs/FiltersConfig/approvalFilterConfig';
import { formatDateTime } from 'src/helpers/formatDate';
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';
import useApi from 'src/hooks/useApi';
import usePageRoles from 'src/hooks/usePageRoles';
import globalutil from 'src/util/globalutil';
dayjs.extend(utc);

const ApprovalRequests = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const {
    postData: getOrgs,
    loading: orgsLoading,
    data: orgsData,
  } = useApi('/BlazorApi/orgsfulldata');

  const {
    postData: getApprovalRequests,
    loading: approvalReqLoading,
    data: approvalReqs,
  } = useApi('/Organization/approvalrequests');

  const approvalReqsData = useMemo(
    () =>
      approvalReqs?.data
        ? approvalReqs?.data?.filter(
            (a) => a?.orgId == user?.orgId || a?.targetorgid == user?.orgId,
          )
        : [],
    [approvalReqs, user],
  );

  const pageRoles = usePageRoles('ApprovalRequests');
  const orgId = user.orgId;
  const roleId = user.roleId;

  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [filters, setFilters] = useState({
    id: 0,
    orgId: 0,
    status: 0,
    createdAt: dayjs().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });

  useEffect(() => {
    getOrganizationLst();
    fetchApprovalReq();
  }, []);

  const fetchApprovalReq = async (filters) => {
    await getApprovalRequests({
      id: 0,
      orgId: filters?.orgId || 0,
      createdAt: filters?.createdAt || dayjs().utc().startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
      status: filters?.status || 0,
      rowVer: 1,
    });
  };

  const changeFilter = (event, key, label) => {
    // Handle date filters
    if (key === 'createdAt' || key === 'lastUpdatedAt') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: event,
      }));
    }

    // Handle autocomplete/custom dropdowns
    else if (label === 'name') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: event,
        orgId: event?.id || 1,
      }));
    }

    // Handle normal input fields
    else if (event && event.target) {
      const { name, value, type, checked } = event.target;
      const colName = name === 'networks' ? 'networkId' : name;

      setFilters((prevData) => ({
        ...prevData,
        [colName]: type === 'checkbox' ? checked : value,
      }));
    } else {
      console.warn('Invalid event passed to changeFilter:', event);
    }
  };

  const toggleFilters = () => {
    setshowFilters((prev) => !prev);
  };

  const toggleGrid = () => {
    setshowDaGrid((prev) => !prev);
  };

  const handleReset = () => {
    setFilters({
      id: 0,
      orgId: 0,
      status: 0,
      createdAt: dayjs().startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });

    fetchApprovalReq({
      id: 0,
      orgId: 0,
      status: 0,
      createdAt: dayjs().startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });
  };

  const getOrganizationLst = async () => {
    const recipientsBody = {
      id: 0,
      roleId: 0,
      orgId: 0,
      email: '',
      name: '',
      contact: '',
      rowVer: 0,
      cityId: 0,
      status: 0,
      createdAt: dayjs().utc().subtract(100, 'year').format(),
      lastUpdatedAt: dayjs().utc().format(),
      createdBy: 0,
      lastUpdatedBy: 0,
    };
    await getOrgs(recipientsBody);
  };

  useEffect(() => {
    if (orgsData?.data?.length > 0) {
      const orgData = orgsData?.data;
      const findUserOrg = orgData?.find((item) => item.id === orgId);
      // console.log(findUserOrg, 'findUserOrg')
      if (findUserOrg)
        setFilters((prevFilters) => ({
          ...prevFilters,
          name: findUserOrg,
        }));
    }
  }, [orgsData?.data, orgId]);

  const orgFilterFields = approvalFilterConfig(filters, changeFilter, orgsData?.data || [], roleId);

  const approvalCols = getApprovalCols(orgsData?.data, fetchApprovalReq, user);

  return (
    <React.Fragment>
      <React.Fragment>
        <AppContainer>
          <DataGridHeader
            title="Advance Filters"
            onClick={toggleFilters}
            otherControls={[{ icon: cilChevronBottom, fn: toggleFilters }]}
            filterDisable={true}
          />

          {showFilters && (
            <CustomFilters
              filters={filters}
              changeFilter={changeFilter}
              fetching={fetchApprovalReq}
              handleReset={handleReset}
              filterFields={orgFilterFields}
            />
          )}
        </AppContainer>
        <AppContainer>
          <CustomDatagrid
            rowHeight={50}
            rows={approvalReqsData}
            showGrid={showDaGrid}
            columns={approvalCols}
            loading={orgsLoading || approvalReqLoading}
            sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
            hiddenCols={{
              columnVisibilityModel: {
                lastUpdatedAt: false,
              },
            }}
            summary={[
              {
                field: 'contentId',
                aggregates: [{ aggregate: 'network_recipients', caption: 'Total Sent' }],
              },
            ]}
            headerProps={{
              title: 'Album Approval Requests',
              onClick: toggleGrid,
              otherControls: [
                {
                  icon: cilChevronBottom,
                  fn: toggleGrid,
                },
              ],
              filterDisable: true,
              canPrint: pageRoles?.canPrint === 1,
              canExport: pageRoles?.canExport === 1,
              fileName: 'Requests',
            }}
          />
        </AppContainer>
      </React.Fragment>
    </React.Fragment>
  );
};

export default ApprovalRequests;

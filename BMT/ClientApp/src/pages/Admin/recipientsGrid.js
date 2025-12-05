import { cilChevronBottom } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomDatagrid from 'src/components/DataGridComponents/CustomDatagrid';
import DataGridHeader from 'src/components/DataGridComponents/DataGridHeader';
import CustomFilters from 'src/components/Filters/CustomFilters';
import MailOptionsModal from 'src/components/MailImports/MailOptionsModal';
import AppContainer from 'src/components/UI/AppContainer';
import { getrecipietslistingCols } from 'src/configs/ColumnsConfig/recipientsCols';
import { getRecipientsFilterConfig } from 'src/configs/FiltersConfig/recipientsFilterConfig';
import { formatDateTime } from 'src/helpers/formatDate';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';
import useApi from 'src/hooks/useApi';
import globalutil from 'src/util/globalutil';

const recipientslisting = () => {
  dayjs.extend(utc);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { data, loading, fetchRecipients: getRecipientList } = useFetchRecipients();
  const {
    postData: getOrgs,
    loading: orgsLoading,
    data: orgsData,
  } = useApi('/BlazorApi/orgsfulldata');

  const pageRoles = useSelector((state) => state.navItems.pageRoles).find(
    (item) => item.name === 'Recipients',
  );
  const orgId = user.orgId;
  const Role = user.roleId;

  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [isShowImportOptions, setIsShowImportOptions] = useState(false);
  const [rows, setRows] = useState([]);
  const [fullRecipientsData, setFullRecipientsData] = useState([]);
  const [filters, setFilters] = useState({
    id: 0,
    orgId: user.orgId,
    contentId: '',
    rowVer: 0,
    networkId: 0,
    status: 0,
    createdAt: dayjs().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });

  useEffect(() => {
    fetchFullRecipients();
    getRecipientsList(filters);
    getOrganizationLst();
  }, []);

  const fetchFullRecipients = async () => {
    const body = {
      id: 0,
      orgId: user.orgId,
      contentId: '',
      rowVer: 0,
      networkId: 0,
      status: 0,
      createdAt: dayjs().subtract(5, 'year').startOf('year').format(),
      lastUpdatedAt: dayjs().utc().endOf('day').format(),
    };

    const fullList = await getRecipientList(body);
    setFullRecipientsData(fullList);
  };

  const getRecipientsList = async (filters) => {
    const recipientsList = await getRecipientList(filters);

    // If this is the first load (no filters applied yet)
    if (fullRecipientsData.length === 0) {
      setFullRecipientsData(recipientsList); // <-- store full list once
    }

    const networks = globalutil.networks();

    const mappedArray = recipientsList.map((data) => {
      const network = networks.find((n) => n.id === data.networkId);

      return {
        id: data.id,
        contentId: data.contentId,
        networkId: network ? network.name : '',
        orgName: data.orgName,
        status: data.status,
        createdAt: formatDateTime(data.createdAt),
      };
    });

    setRows(mappedArray);
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

  const toggleIsShowImportOptions = () => setIsShowImportOptions((prev) => !prev);

  const handleReset = () => {
    setFilters({
      id: 0,
      orgId: user.orgId,
      rowVer: 0,
      networkId: 0,
      status: 0,
      createdAt: dayjs().startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });
    getRecipientsList({
      id: 0,
      orgId: user.orgId,
      contentId: '',
      rowVer: 0,
      networkId: 0,
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
      // keyword: filters ? filters.keyword : '',
      createdAt: dayjs().utc().subtract(1, 'year').format('YYYY-MM-DD'),
      lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
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

  const orgFilterFields = getRecipientsFilterConfig(
    filters,
    changeFilter,
    orgsData?.data || [],
    Role,
  );

  const getBothLists = () => {
    fetchFullRecipients();
    getRecipientsList({
      id: 0,
      orgId: user.orgId,
      contentId: '',
      rowVer: 0,
      networkId: 0,
      status: 0,
      createdAt: dayjs().startOf('month').format(),
      lastUpdatedAt: dayjs().utc().startOf('day').format(),
    });
  };
  const recipientslistingCols = getrecipietslistingCols();

  // console.log({ fullRecipientsData });
  return (
    <React.Fragment>
      <MailOptionsModal
        isOpen={isShowImportOptions}
        toggle={toggleIsShowImportOptions}
        recipientsList={fullRecipientsData}
        getRecipientList={getBothLists}
      />
      <React.Fragment>
        <AppContainer>
          <DataGridHeader
            title="Recipients Grid -> Advance Search (Organization, Network, Recipients, Date(>=))"
            onClick={toggleFilters}
            otherControls={[{ icon: cilChevronBottom, fn: toggleFilters }]}
            filterDisable={true}
          />

          {showFilters && (
            <CustomFilters
              filters={filters}
              changeFilter={changeFilter}
              fetching={getRecipientsList}
              handleReset={handleReset}
              filterFields={orgFilterFields}
            />
          )}
        </AppContainer>
        <AppContainer>
          <DataGridHeader
            title="Recipients List"
            onClick={toggleGrid}
            addSecButton={'Recipients'}
            addSecBtnClick={() => navigate('/campaignContacts')}
            addButton="Import From Gmail | Outlook"
            addBtnClick={toggleIsShowImportOptions}
            otherControls={[{ icon: cilChevronBottom, fn: toggleGrid }]}
            filterDisable={true}
          />
          {showDaGrid && (
            <CustomDatagrid
              rows={rows}
              columns={recipientslistingCols}
              rowHeight={50}
              pagination={true}
              loading={loading || orgsLoading}
              // loading={rows.length < 1 ? true : false}
              sorting={[{ columnKey: 'lastUpdatedAt', direction: 'DESC' }]}
              hiddenCols={{
                columnVisibilityModel: {
                  lastUpdatedAt: false,
                },
              }}
              //  canExport={pageRoles.canExport}
              // canPrint={pageRoles.canPrint}
            />
          )}
        </AppContainer>
      </React.Fragment>
    </React.Fragment>
  );
};

export default recipientslisting;

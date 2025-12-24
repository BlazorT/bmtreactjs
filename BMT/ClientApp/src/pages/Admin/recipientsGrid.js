import { cilChevronBottom } from '@coreui/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useState } from 'react';
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
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';
import { useFetchRecipients } from 'src/hooks/api/useFetchRecipients';
import useApi from 'src/hooks/useApi';
import globalutil from 'src/util/globalutil';
import _ from 'lodash';
import AddAlbumModel from 'src/components/Modals/AddAlbumModel';
import CrawlDomainsModal from 'src/components/Modals/CrawlDomainsModal';
import usePageRoles from 'src/hooks/usePageRoles';
dayjs.extend(utc);

const recipientslisting = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { data, loading, fetchRecipients: getRecipientList } = useFetchRecipients();
  const { data: albums, loading: albumsLoading, fetchAlbums } = useFetchAlbums();
  const {
    postData: getOrgs,
    loading: orgsLoading,
    data: orgsData,
  } = useApi('/BlazorApi/orgsfulldata');

  const pageRoles = usePageRoles('Recipients');
  const orgId = user.orgId;
  const Role = user.roleId;

  const [showFilters, setshowFilters] = useState(false);
  const [showDaGrid, setshowDaGrid] = useState(true);
  const [isShowAlbumMdl, setIsShowAlbumMdl] = useState(false);
  const [isShowCrawlerMdl, setIsShowCrawlerMdl] = useState(false);
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
    albumid: 0,
    createdAt: dayjs().startOf('month').format(),
    lastUpdatedAt: dayjs().utc().startOf('day').format(),
  });

  useEffect(() => {
    fetchFullRecipients();
    getRecipientsList(filters);
    getOrganizationLst();
  }, []);

  const toggleAlbumMdl = () => setIsShowAlbumMdl((prev) => !prev);
  const toggleCrawlerMdl = () => setIsShowCrawlerMdl((prev) => !prev);

  const fetchFullRecipients = async () => {
    const body = {
      id: 0,
      orgId: user.orgId,
      contentId: '',
      rowVer: 0,
      networkId: 0,
      albumid: 0,
      status: 0,
      createdAt: dayjs().subtract(5, 'year').startOf('year').format(),
      lastUpdatedAt: dayjs().utc().endOf('day').format(),
    };

    const fullList = await getRecipientList(body);
    setFullRecipientsData(fullList);
  };

  const getRecipientsList = async (filters) => {
    const recipientsList = await getRecipientList(filters);
    const albumsList = await fetchAlbums();
    // If this is the first load (no filters applied yet)
    if (fullRecipientsData.length === 0) {
      setFullRecipientsData(recipientsList); // <-- store full list once
    }

    // const networks = globalutil.networks();
    // const groupedData = getGroupedRecipients(recipientsList, albumsList || [], networks);
    setRows(
      recipientsList?.map((r) => ({
        ...r,
        nId: r?.networkId,
        networkId: globalutil.networks()?.find((n) => n.id === r?.networkId)?.name || '--',
        albumid: albumsList?.find((n) => n.id === r?.albumid)?.name || '--',
      })),
    );
    // const mappedArray = recipientsList.map((data) => {
    //   const network = networks.find((n) => n.id === data.networkId);

    //   return {
    //     id: data.id,
    //     contentId: data.contentId,
    //     albumid: data.albumid,
    //     networkId: network ? network.name : '',
    //     orgName: data.orgName,
    //     status: data.status,
    //     createdAt: formatDateTime(data.createdAt),
    //   };
    // });

    // setRows(mappedArray);
  };

  const getGroupedRecipients = (recipients, albums, networks) => {
    const groupedRows = [];

    // 1. Sort recipients by createdAt (latest first)
    const sortedRecipients = [...recipients].sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
    );

    // 2. Group recipients by networkId
    const recipientsByNetwork = _.groupBy(sortedRecipients, 'networkId');

    Object.entries(recipientsByNetwork).forEach(([networkId, networkRecipients]) => {
      const network = networks.find((n) => n.id === parseInt(networkId));
      const networkName = network ? network.name : `Network ${networkId}`;

      // Network header
      groupedRows.push({
        id: `network-${networkId}`,
        type: 'network-header',
        networkId: networkName,
        albumid: '',
        contentId: '',
        createdAt: '',
        isGroupHeader: true,
        level: 0,
      });

      // 3. Group by albumId
      const recipientsByAlbum = _.groupBy(networkRecipients, 'albumid');

      Object.entries(recipientsByAlbum).forEach(([albumId, albumRecipients]) => {
        // 4. Sort again inside album (latest first)
        const sortedAlbumRecipients = [...albumRecipients].sort(
          (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf(),
        );

        const album = albums.find((a) => a.id === parseInt(albumId));

        // No album case
        if (!album) {
          sortedAlbumRecipients.forEach((recipient) => {
            groupedRows.push({
              id: recipient.id,
              type: 'recipient-no-album',
              networkId: '',
              albumid: '--',
              contentId: recipient.contentId,
              createdAt: formatDateTime(recipient.createdAt),
              orgName: recipient.orgName,
              status: recipient.status,
              isGroupHeader: false,
              level: 1,
              originalData: recipient,
            });
          });
        } else {
          // Album header
          groupedRows.push({
            id: `album-${networkId}-${albumId}`,
            type: 'album-header',
            networkId: '',
            albumid: album.name,
            contentId: '',
            createdAt: '',
            isGroupHeader: true,
            level: 1,
          });

          // Album recipients
          sortedAlbumRecipients.forEach((recipient) => {
            groupedRows.push({
              id: recipient.id,
              type: 'recipient',
              networkId: '',
              albumid: '',
              contentId: recipient.contentId,
              createdAt: formatDateTime(recipient.createdAt),
              orgName: recipient.orgName,
              status: recipient.status,
              isGroupHeader: false,
              level: 2,
              originalData: recipient,
            });
          });
        }
      });
    });

    return groupedRows;
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
      albumid: 0,
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
      albumid: 0,
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
    albums,
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
  const recipientslistingCols = getrecipietslistingCols(albums);

  return (
    <React.Fragment>
      <MailOptionsModal
        isOpen={isShowImportOptions}
        toggle={toggleIsShowImportOptions}
        recipientsList={fullRecipientsData}
        getRecipientList={getBothLists}
      />
      <AddAlbumModel
        isOpen={isShowAlbumMdl}
        toggle={toggleAlbumMdl}
        refreshRecipients={() => getRecipientsList(filters)}
      />
      <CrawlDomainsModal
        isOpen={isShowCrawlerMdl}
        toggle={toggleCrawlerMdl}
        recipientsList={fullRecipientsData}
        getRecipientList={getBothLists}
      />
      <React.Fragment>
        <AppContainer>
          <DataGridHeader
            title="Recipients"
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
          <CustomDatagrid
            enableGrouping
            defaultExpandedGroups
            rowHeight={50}
            rows={rows}
            showGrid={showDaGrid}
            columns={recipientslistingCols}
            groupBy={['networkId', 'albumid']}
            loading={loading || orgsLoading || albumsLoading}
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
              title: 'Recipients List',
              onClick: toggleGrid,
              addSecButton: 'Recipients',
              addSecBtnClick: () => navigate('/campaignContacts'),
              addButton: 'Import From Gmail | Outlook',
              addBtnClick: toggleIsShowImportOptions,
              actions: [
                {
                  title: 'Add Album (+)',
                  onClick: toggleAlbumMdl,
                },
                {
                  title: 'Crawl Contacts (+)',
                  onClick: toggleCrawlerMdl,
                },
              ],
              otherControls: [
                {
                  icon: cilChevronBottom,
                  fn: toggleGrid,
                },
              ],
              filterDisable: true,
              canPrint: pageRoles?.canPrint === 1,
              canExport: pageRoles?.canExport === 1,
              fileName: 'RECIPIENTS',
            }}
          />
        </AppContainer>
      </React.Fragment>
    </React.Fragment>
  );
};

export default recipientslisting;

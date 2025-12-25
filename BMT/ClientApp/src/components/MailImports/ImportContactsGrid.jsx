/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useApi from 'src/hooks/useApi';
import { useShowToast } from 'src/hooks/useShowToast';
import CustomDatagrid from '../DataGridComponents/CustomDatagrid';
import Button from '../UI/Button';
import { CCol, CRow } from '@coreui/react';
import CustomSelectInput from '../InputsComponent/CustomSelectInput';
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';
import { cilChatBubble, cilEnvelopeClosed } from '@coreui/icons';
import AddAlbumModel from '../Modals/AddAlbumModel';
import CityBadge from '../UI/CityBadge';

const ImportContactsGrid = ({ data, getRecipientList, recipientsList, isShowCountry = false }) => {
  const COLS = useMemo(() => {
    const baseCols = [
      {
        key: 'content',
        name: 'Contact',
        editable: false,
        filterable: true,
        disableColumnMenu: false,
        headerCellClass: 'custom-header-data-grid',
      },
      {
        key: 'type',
        name: 'Network',
        editable: false,
        filterable: true,
        disableColumnMenu: true,
        headerCellClass: 'custom-header-data-grid',
        renderCell: (params) => (params.row.type === 1 ? 'Contact' : 'Email'),
      },
    ];

    if (isShowCountry) {
      return [
        baseCols[0], // Contact
        {
          key: 'country',
          name: 'Country',
          editable: false,
          filterable: true,
          disableColumnMenu: true,
          headerCellClass: 'custom-header-data-grid',
          renderCell: (params) => {
            const country = params.row?.country;
            const confidence = params.row?.countryConfidence;

            if (!country || country === '--') return <span className="text-muted">--</span>;

            return (
              <div className="d-flex align-items-center gap-1">
                <span>{country}</span>
                {confidence === 'high' && (
                  <span className="badge badge-high-confidence small">High</span>
                )}
              </div>
            );
          },
        },
        {
          key: 'city',
          name: 'City',
          editable: false,
          filterable: true,
          disableColumnMenu: true,
          headerCellClass: 'custom-header-data-grid',
          renderCell: (params) => {
            const city = params.row?.city;
            const cityMatches = params.row?.cityMatches;
            const countryCode = params.row?.countryCode;

            return (
              <CityBadge primaryCity={city} cityMatches={cityMatches} countryCode={countryCode} />
            );
          },
        },
        {
          key: 'source',
          name: 'Source',
          editable: false,
          filterable: true,
          disableColumnMenu: true,
          headerCellClass: 'custom-header-data-grid',
          renderCell: (params) => {
            const url = params.row?.source;

            if (!url || url === '--') return <span className="text-muted">--</span>;

            // Truncate long URLs
            const displayUrl = url.length > 40 ? url.substring(0, 37) + '...' : url;

            return (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-underline text-primary"
                onClick={(e) => e.stopPropagation()}
                title={url}
              >
                {displayUrl}
              </a>
            );
          },
        },
        baseCols[1], // Type
      ];
    }

    // default: show Name only
    return [
      baseCols[0], // Contact
      {
        key: 'name',
        name: 'Name',
        editable: false,
        filterable: true,
        disableColumnMenu: true,
        headerCellClass: 'custom-header-data-grid',
      },
      baseCols[1], // Type
    ];
  }, [isShowCountry]);

  const user = useSelector((state) => state.user);
  const showToast = useShowToast();

  const { data: albums, loading: albumsLoading, fetchAlbums } = useFetchAlbums();
  const { postData, loading } = useApi('/Compaigns/postCompaignContactData');

  useEffect(() => {
    fetchAlbums();
  }, []);

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [emailAlbumId, setEmailAlbumId] = useState('');
  const [smsAlbumId, setSMSAlbumId] = useState('');
  const [whatsappAlbumId, setWhatsappAlbumId] = useState('');
  const [isShowAlbumMdl, setIsShowAlbumMdl] = useState(false);

  const toggleAlbumMdl = () => setIsShowAlbumMdl((prev) => !prev);

  // Add a memoized version of data with disabled flag
  const rowsWithDisabled = useMemo(() => {
    const existingIds = new Set(recipientsList.map((r) => r.contentId));
    return data.map((row) => ({
      ...row,
      disabled: existingIds.has(row.content),
    }));
  }, [data, recipientsList]);

  const selectedContacts = useMemo(
    () => rowsWithDisabled.filter((row) => selectedRows.has(row.content) && !row.disabled),
    [rowsWithDisabled, selectedRows],
  );

  const smsAlbums = useMemo(() => albums?.filter((a) => a.networkid === 1), [albums]);
  const whatsappAlbums = useMemo(() => albums?.filter((a) => a.networkid === 2), [albums]);
  const emailAlbums = useMemo(() => albums?.filter((a) => a.networkid === 3), [albums]);

  const dataHasEmail = useMemo(
    () => selectedContacts?.some((a) => a.type === 2),
    [selectedContacts],
  );
  const dataHasContacts = useMemo(
    () => selectedContacts?.some((a) => a.type === 1),
    [selectedContacts],
  );

  // Calculate counts and city statistics
  const counts = useMemo(() => {
    const existingCount = rowsWithDisabled.filter((row) => row.disabled).length;
    const importedCount = rowsWithDisabled.length;
    const selectedCount = selectedRows.size;

    // City detection stats
    const withCity = rowsWithDisabled.filter((row) => row.city && row.city !== '--').length;
    const withHighConfidence = rowsWithDisabled.filter((row) =>
      row.cityMatches?.some((m) => m.confidence === 'high'),
    ).length;
    const withAlternatives = rowsWithDisabled.filter(
      (row) => row.cityMatches && row.cityMatches.length > 1,
    ).length;

    return {
      existingCount,
      importedCount,
      selectedCount,
      withCity,
      withHighConfidence,
      withAlternatives,
    };
  }, [rowsWithDisabled, selectedRows]);

  const submitRecipients = async () => {
    if (selectedRows?.size === 0) {
      showToast('Select at least 1 contact to add', 'warning');
      return;
    }

    if (dataHasEmail && emailAlbumId === '') {
      showToast('Select album for emails', 'warning');
      return;
    }
    if (dataHasContacts && (smsAlbumId === '' || whatsappAlbumId === '')) {
      showToast('Select albums for sms and whatsapp', 'warning');
      return;
    }

    const selectedContacts = rowsWithDisabled.filter(
      (row) => selectedRows.has(row.content) && !row.disabled,
    );

    const type1Contacts = selectedContacts
      .filter((row) => row.type === 1)
      .map((row) => row.content);

    const type3Contacts = selectedContacts
      .filter((row) => row.type === 2)
      .map((row) => row.content);

    const body = [];

    if (type1Contacts.length > 0) {
      body.push(
        {
          Id: 0,
          OrgId: user.orgId,
          NetworkId: 1,
          Albumid: parseInt(smsAlbumId),
          Contentlst: type1Contacts,
          Desc: '',
          CreatedBy: user.userId,
          CreatedAt: new Date(),
          LastUpdatedAt: new Date(),
          RowVer: 1,
        },
        {
          Id: 0,
          OrgId: user.orgId,
          NetworkId: 2,
          Albumid: parseInt(whatsappAlbumId),
          Contentlst: type1Contacts,
          Desc: '',
          CreatedBy: user.userId,
          CreatedAt: new Date(),
          LastUpdatedAt: new Date(),
          RowVer: 1,
        },
      );
    }

    if (type3Contacts.length > 0) {
      body.push({
        Id: 0,
        OrgId: user.orgId,
        NetworkId: 3,
        Albumid: parseInt(emailAlbumId),
        Contentlst: type3Contacts,
        Desc: '',
        CreatedBy: user.userId,
        CreatedAt: new Date(),
        LastUpdatedAt: new Date(),
        RowVer: 1,
      });
    }

    console.log('Request body:', body);

    const res = await postData(body);
    if (res?.status) {
      showToast(res?.message, 'success');
      getRecipientList();
      setSelectedRows(new Set());
    }
  };

  return (
    <div>
      <CRow className="mb-2">
        <AddAlbumModel
          isOpen={isShowAlbumMdl}
          toggle={toggleAlbumMdl}
          refreshRecipients={fetchAlbums}
        />
        {dataHasEmail && (
          <CCol md={dataHasContacts ? 3 : 9}>
            <CustomSelectInput
              label="Email Albums"
              icon={cilEnvelopeClosed}
              id="emailAlbumId"
              options={emailAlbums}
              className="form-control item form-select"
              value={emailAlbumId}
              disableOption="Email Album"
              title="Email Album"
              name="emailAlbumId"
              onChange={(e) => setEmailAlbumId(e.target.value)}
            />
          </CCol>
        )}
        {dataHasContacts && (
          <>
            <CCol md={dataHasEmail ? 3 : 4}>
              <CustomSelectInput
                label="SMS Albums"
                icon={cilChatBubble}
                id="smsAlbumId"
                options={smsAlbums}
                className="form-control item form-select"
                value={smsAlbumId}
                disableOption="SMS Album"
                title="SMS Album"
                name="smsAlbumId"
                onChange={(e) => setSMSAlbumId(e.target.value)}
              />
            </CCol>
            <CCol md={dataHasEmail ? 3 : 4}>
              <CustomSelectInput
                label="Whatsapp Albums"
                icon={cilChatBubble}
                id="whatsappAlbumId"
                options={whatsappAlbums}
                className="form-control item form-select"
                value={whatsappAlbumId}
                disableOption="Whatsapp Album"
                title="Whatsapp Album"
                name="whatsappAlbumId"
                onChange={(e) => setWhatsappAlbumId(e.target.value)}
              />
            </CCol>
          </>
        )}
        {(dataHasContacts || dataHasEmail) && (
          <CCol md={3} className={`mt-2 pt-4 d-flex flex-colunm justify-content-center`}>
            <Button title="Add Album" onClick={toggleAlbumMdl} className="w-100" />
          </CCol>
        )}
      </CRow>
      <CustomDatagrid
        rows={rowsWithDisabled}
        columns={COLS}
        rowSelection={true}
        selectedRows={selectedRows}
        loading={loading || albumsLoading}
        onSelectedRowsChange={(newSelectedRows) => {
          setSelectedRows(newSelectedRows);
        }}
        rowHeight={55}
        rowSelectable={(row) => !row.disabled}
        pageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        pagination={false}
        maxHeight={rowsWithDisabled?.length > 10 ? 350 : 'auto'}
        footer={
          <div className="bg-dark-color text-white p-2 flex-row d-flex align-items-center justify-content-between flex-wrap">
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div className="d-flex flex-row align-items-center gap-3">
                <div className="d-flex flex-row align-items-center gap-2">
                  <span>Existing:</span>
                  <span className="disabled-row-red rounded-1 px-1 py-0 fw-bold">
                    {counts.existingCount}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-center gap-2">
                  <span>Imported:</span>
                  <span className="rdg-row-even rounded-1 px-1 py-0 fw-bold">
                    {counts.importedCount}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-center gap-2">
                  <span>Selected:</span>
                  <span className="selected-row rounded-1 px-1 py-0 fw-bold">
                    {counts.selectedCount}
                  </span>
                </div>
              </div>
            </div>

            {/* City detection stats */}
            {isShowCountry && counts.withCity > 0 && (
              <div className="d-flex flex-row align-items-center gap-3">
                <div className="d-flex flex-row align-items-center gap-2">
                  <span className="small">With City:</span>
                  <span className="badge badge-high-confidence">
                    {counts.withCity} / {counts.importedCount}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-center gap-2">
                  <span className="small">High Confidence:</span>
                  <span className="badge badge-high-confidence">{counts.withHighConfidence}</span>
                </div>
                {counts.withAlternatives > 0 && (
                  <div className="d-flex flex-row align-items-center gap-2">
                    <span className="small">With Alternatives:</span>
                    <span className="badge badge-alternative-matches">
                      {counts.withAlternatives}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="align-items-center justify-content-end flex-row d-flex">
              <Button
                title="Submit"
                onClick={submitRecipients}
                disabled={loading}
                className="px-3 py-1 w-auto h-auto"
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ImportContactsGrid;

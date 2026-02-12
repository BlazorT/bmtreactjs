/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import '../../CSS/unsubscribe.css';
import { useSearchParams } from 'react-router-dom';
import useApi from 'src/hooks/useApi';
import dayjs from 'dayjs';
import globalutil from 'src/util/globalutil';
import { useFetchAlbums } from 'src/hooks/api/useFetchAlbums';

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4ade80"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const HomeIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const reasons = [
  'Too many emails',
  'Not relevant',
  'Never signed up',
  'Poor content',
  'Prefer another channel',
  'Other',
];

export default function UnsubscribePage() {
  const [selectedReason, setSelectedReason] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [contentList, setContentList] = useState([]);
  const [code, setCode] = useState('');
  const [missingParams, setMissingParams] = useState(false);

  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId');
  const orgId = searchParams.get('orgId');

  const { postData: unsubscribeFromBMT, loading: unsubscribeContentLoading } = useApi(
    '/Compaigns/unsubscribecontact',
  );
  const { postData: fetchUnsubscribeList, loading: unsubscribeContentListLoading } = useApi(
    '/Compaigns/contentsubscribers',
  );
  const {
    postData: getOrgs,
    loading: orgsLoading,
    data: orgsRes,
  } = useApi('/BlazorApi/orgsfulldata');
  const { data: albums, loading: albumsLoading, fetchAlbums } = useFetchAlbums();

  const orgsData = orgsRes?.data || [];
  const loading = unsubscribeContentLoading;
  const initializing = unsubscribeContentListLoading || albumsLoading || orgsLoading;
  // Check for required query params and fetch list on mount
  useEffect(() => {
    const checkParamsAndFetchList = async () => {
      // Check if all required params exist
      if (!userId || !orgId) {
        setMissingParams(true);
        setError('Missing required parameters. Please use a valid unsubscribe link.');
        return;
      }

      // Fetch the unsubscribe list
      try {
        const payload = {
          id: '',
          userId: userId,
          orgId: orgId,
        };

        const response = await fetchUnsubscribeList(payload);
        if (response && response.status && response.data && response.keyValue) {
          setCode(response.keyValue || '');
          setContentList(response.data || []);
          await fetchAlbums({
            orgId: Number(orgId),
          });
          const recipientsBody = {
            id: Number(orgId),
            roleId: 0,
            orgId: 0,
            email: '',
            name: '',
            contact: '',
            rowVer: 0,
            cityId: 0,
            status: 0,
            // keyword: filters ? filters.keyword : '',
            createdAt: dayjs().utc().subtract(100, 'year').format('YYYY-MM-DD'),
            lastUpdatedAt: dayjs().utc().format('YYYY-MM-DD'),
            createdBy: 0,
            lastUpdatedBy: 0,
          };
          await getOrgs(recipientsBody);
        } else {
          setError(response?.message || 'Failed to load unsubscribe information.');
        }
      } catch (err) {
        console.error('Error fetching unsubscribe list:', err);
        setError('An error occurred while loading your information.');
      }
    };

    checkParamsAndFetchList();
  }, [userId, orgId]);

  const handleSubmit = async () => {
    if (missingParams || !contentList.length) {
      return;
    }

    setError('');

    try {
      // Find the maximum id from contentList
      const maxId = Math.max(...contentList.map((item) => item.id));

      const payload = {
        id: maxId,
        ContentId: userId,
        OrgId: Number(orgId),
        networkId: contentList?.[0]?.networkId,
        Desc: code,
        CreatedBy: 1,
        LastUpdatedBy: 1,
        CreatedAt: dayjs().utc().format(),
        lastUpdatedAt: dayjs().utc().format(),
        Status: 1,
        rowVer: 1,
      };
      const response = await unsubscribeFromBMT(payload);
      console.log({ response });
      if (response && response.status) {
        setSuccess(true);
      } else {
        setError('Failed to unsubscribe. Please try again.');
      }
    } catch (err) {
      console.error('Error unsubscribing:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  // Show loading state during initialization
  if (initializing) {
    return (
      <div className="page">
        <div className="bg-grid" />
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
        <div className="card">
          <div className="card-header">
            <div className="logo-center">
              <img src="/BDMT_TRANSPARENT.png" alt="BDMT Logo" />
            </div>
          </div>
          <div className="card-body">
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <span className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                Loading your information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if params are missing
  if (missingParams) {
    return (
      <div className="page">
        <div className="bg-grid" />
        <div className="bg-orb-1" />
        <div className="bg-orb-2" />
        <div className="card">
          <div className="card-header">
            <div className="logo-center">
              <img src="/BDMT_TRANSPARENT.png" alt="BDMT Logo" />
            </div>
          </div>
          <div className="card-body">
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <AlertIcon />
              </div>
              <h2 style={{ color: '#e8f0fa', fontSize: '20px', marginBottom: '12px' }}>
                Invalid Link
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                {error}
              </p>
              <a href="/" className="return-home-btn" style={{ marginTop: '24px' }}>
                <HomeIcon />
                Return Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="bg-grid" />
      <div className="bg-orb-1" />
      <div className="bg-orb-2" />

      {/* ── Card ── */}
      <div className="card">
        {/* Header with Logo */}
        <div className="card-header">
          <div className="logo-center">
            <img src="/BDMT_TRANSPARENT.png" alt="BDMT Logo" />
          </div>
          <h2 className="header-title">Unsubscribe from Blazor Media Toolkit</h2>
          <p className="header-subtitle">
            We're sorry to see you go. You will no longer receive any campaigns from us.
          </p>
        </div>

        {!success ? (
          <div className="card-body">
            {/* User Info Display */}
            <div className="user-info-section">
              <label className="field-label">Your Information</label>
              <div className="user-info-box">
                <div className="user-info-item">
                  {userId.includes('@') ? <MailIcon /> : <PhoneIcon />}
                  <span>{userId}</span>
                </div>
              </div>
            </div>

            {/* Content List Display */}
            {contentList && contentList.length > 0 && (
              <div className="content-list-section">
                <label className="field-label">Unsubscribe From</label>
                <div className="content-list-box">
                  {contentList.map((item, index) => (
                    <div key={item.id || index} className="content-list-item">
                      <div className="content-item-id">Contact : {item.contentId}</div>
                      <div className="content-item-details">
                        <span>
                          Network :{' '}
                          {globalutil.networks()?.find((n) => n?.id === item.networkId)?.name ||
                            '--'}
                        </span>
                        <span>
                          Album : {albums?.find((a) => a?.id === item.albumid)?.name || ''}
                        </span>
                        <span>
                          Organization : {orgsData?.find((o) => o?.id === item.orgId)?.name || ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="error-msg">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="#f87171"
                  className="flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    fill="#031C34"
                    d="M12 8v4m0 4h.01"
                    stroke="#031C34"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span dangerouslySetInnerHTML={{ __html: error }} />
              </div>
            )}

            {/* Reason */}
            {/* <div className="reason-section">
              <label className="reason-label">
                Reason for leaving{' '}
                <span
                  style={{
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: '11px',
                    letterSpacing: 0,
                    textTransform: 'none',
                    fontWeight: 400,
                  }}
                >
                  (optional)
                </span>
              </label>
              <div className="reason-grid">
                {reasons.map((r) => (
                  <button
                    key={r}
                    className={`reason-chip ${selectedReason === r ? 'selected' : ''}`}
                    onClick={() => setSelectedReason(selectedReason === r ? null : r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div> */}

            <div className="divider" />

            {/* Submit */}
            <button
              className={`submit-btn ${loading ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={loading || !contentList.length}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Processing…
                </>
              ) : (
                'Confirm Unsubscribe'
              )}
            </button>

            {/* Go Home */}
            <a href="/" className="cancel-btn">
              <HomeIcon />
              Go Home
            </a>

            <p className="footer-note">
              Changed your mind? <a href="#">Manage preferences</a> instead of unsubscribing
              entirely.
              <br />
              View our <a href="#">Privacy Policy</a>.
            </p>
          </div>
        ) : (
          /* Success */
          <div className="success-card">
            <div className="success-icon-wrap">
              <CheckIcon />
            </div>
            <h2 className="success-title">You're unsubscribed</h2>
            <p className="success-subtitle">
              We've removed <strong>{userId}</strong> from our mailing list. You will no longer
              receive any campaigns from Blazor Media Toolkit.
            </p>
            <div className="success-detail">
              {userId.includes('@') ? <MailIcon /> : <PhoneIcon />}
              {userId}
            </div>

            <div className="success-actions">
              <a href="/" className="return-home-btn">
                <HomeIcon />
                Return Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

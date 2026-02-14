/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { cilCheckCircle, cilReload, cilWarning, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CAlert,
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CListGroup,
  CListGroupItem,
  CProgress,
  CProgressBar,
} from '@coreui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDateTime } from 'src/helpers/formatDate';
import useApi from 'src/hooks/useApi';
import { useShowToast } from 'src/hooks/useShowToast';
import globalutil from 'src/util/globalutil';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';

const JobStatusTracker = ({ jobId, jobStatus: initialJobStatus }) => {
  const showToast = useShowToast();
  const user = useSelector((state) => state.user);

  const [jobStatus, setJobStatus] = useState(initialJobStatus);
  const [pollingInterval, setPollingInterval] = useState(null);

  const { postData: fetchJobStatus, loading: fetchingStatus } = useApi(
    // eslint-disable-next-line no-undef
    process.env.REACT_APP_BMT_SERVIVE + `/job/status/${jobId}`,
    'GET',
    null,
    {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.socialApiKey || ''}`,
    },
  );

  useEffect(() => {
    if (initialJobStatus) {
      setJobStatus(initialJobStatus);
    }
  }, [initialJobStatus]);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(pollJobStatus, 5000);
    setPollingInterval(interval);

    // Initial fetch
    pollJobStatus();

    return () => {
      clearInterval(interval);
    };
  }, [jobId]); // ← remove notificationPriority from deps if it doesn't actually change polling behavior

  // New effect: stop polling when terminal state is reached
  useEffect(() => {
    if (!jobStatus) return;

    if (jobStatus.state === 'completed' || jobStatus.state === 'failed') {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }

      // Optional: show toast here instead of inside poll function
      if (jobStatus.state === 'completed') {
        showToast('Message delivery completed', 'success');
      } else if (jobStatus.state === 'failed') {
        showToast('Message delivery failed', 'error');
      }
    }
  }, [jobStatus?.state, pollingInterval, showToast]);

  const pollJobStatus = async () => {
    try {
      const { response, status } = await fetchJobStatus(null, true);
      if (status === 200 && response?.success) {
        setJobStatus(response.job);
        // Stop polling if job is completed or failed
      }
    } catch (error) {
      console.error('Error polling job status:', error);
    }
  };

  const getStateColor = (state) => {
    const colors = {
      waiting: 'secondary',
      active: 'primary',
      completed: 'success',
      failed: 'danger',
      delayed: 'warning',
    };
    return colors[state] || 'secondary';
  };

  const getStateIcon = (state) => {
    const icons = {
      waiting: cilWarning,
      active: cilReload,
      completed: cilCheckCircle,
      failed: cilX,
      delayed: cilWarning,
    };
    return icons[state] || cilWarning;
  };

  const calculateProgress = () => {
    if (!jobStatus) return 0;
    if (jobStatus.state === 'completed') return 100;
    if (jobStatus.state === 'failed') return 100;
    if (jobStatus.progress && typeof jobStatus.progress === 'number') {
      return jobStatus.progress;
    }
    return 0;
  };

  if (!jobStatus && !jobId) {
    return null;
  }

  return (
    <CCard className="border-primary">
      <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center py-2">
        <div className="d-flex align-items-center gap-2">
          <h6 className="mb-0 small">Delivery Status</h6>
          {jobId && (
            <CBadge color="light" className="text-white">
              <small>Job: {jobId}</small>
            </CBadge>
          )}
        </div>
        {jobStatus?.state !== 'completed' && (
          <Button
            title=""
            icon={<CIcon icon={cilReload} />}
            onClick={pollJobStatus}
            loading={fetchingStatus}
            className="btn-sm btn-light w-auto px-2"
          />
        )}
      </CCardHeader>

      <CCardBody className="p-2">
        {fetchingStatus && !jobStatus ? (
          <Spinner title="Fetching job status..." />
        ) : jobStatus ? (
          <>
            {/* Job State */}
            <div className="mb-2 d-flex align-items-center gap-2">
              <CIcon icon={getStateIcon(jobStatus.state)} />
              <small className="mb-0 fw-bold">Status:</small>
              <CBadge color={getStateColor(jobStatus.state)} className="text-uppercase">
                <small>{jobStatus.state}</small>
              </CBadge>
            </div>

            {/* Progress Bar */}
            {(jobStatus.state === 'active' || jobStatus.state === 'waiting') && (
              <div className="mb-2">
                <CProgress className="mb-1" height={15}>
                  <CProgressBar color={getStateColor(jobStatus.state)} value={calculateProgress()}>
                    <small>{calculateProgress()}%</small>
                  </CProgressBar>
                </CProgress>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                  {jobStatus.state === 'active' ? 'Processing...' : 'Waiting in queue...'}
                </small>
              </div>
            )}

            {/* Job Details */}
            {jobStatus.data && (
              <div className="mb-2">
                <small className="fw-bold">Details:</small>
                <div className="d-flex gap-2 flex-wrap">
                  <small className="text-white">
                    Network :{' '}
                    <span className="fw-bold text-dim">
                      {globalutil.networks().find((n) => n?.id === jobStatus.data.networkId)
                        ?.name || '--'}
                    </span>
                  </small>
                  <small className="text-white">
                    Recipients :{' '}
                    <span className="fw-bold text-dim">{jobStatus.data.recipientCount}</span>
                  </small>
                  <small className="text-white">
                    Priority :{' '}
                    <span className="fw-bold text-dim text-uppercase">
                      {jobStatus.data.priority}
                    </span>
                  </small>
                </div>
              </div>
            )}

            {/* Timestamps */}
            {jobStatus.timestamps && (
              <div className="mb-2">
                <small className="fw-bold">Timeline:</small>
                <div className="d-flex gap-2 flex-wrap">
                  <small className="text-white">
                    Created : {formatDateTime(jobStatus.timestamps.created)}
                  </small>
                  {jobStatus.timestamps.processed && (
                    <small className="text-white">
                      Processed : {formatDateTime(jobStatus.timestamps.processed)}
                    </small>
                  )}
                  {jobStatus.timestamps.finished && (
                    <small className="text-white">
                      Finished : {formatDateTime(jobStatus.timestamps.finished)}
                    </small>
                  )}
                </div>
              </div>
            )}

            {/* Results (for immediate priority or completed jobs) */}
            {jobStatus.result && jobStatus.result.results && (
              <div className="mb-2">
                <small className="fw-bold">Results:</small>
                <CListGroup className="mt-1">
                  {jobStatus.result.results.slice(0, 5).map((result, index) => (
                    <CListGroupItem
                      key={index}
                      className="d-flex justify-content-between align-items-center py-1 px-2"
                    >
                      <div>
                        <small className="fw-bold">{result.recipient}</small>
                        {result.messageId && (
                          <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                            ID: {result.messageId}
                          </small>
                        )}
                      </div>
                      <div>
                        {result.success ? (
                          <CBadge color="success">
                            <CIcon icon={cilCheckCircle} size="sm" className="me-1" />
                            <small>Sent</small>
                          </CBadge>
                        ) : (
                          <CBadge color="danger">
                            <CIcon icon={cilX} size="sm" className="me-1" />
                            <small>Failed</small>
                          </CBadge>
                        )}
                      </div>
                    </CListGroupItem>
                  ))}
                </CListGroup>
                {jobStatus.result.results.length > 5 && (
                  <small className="text-muted mt-1 d-block" style={{ fontSize: '0.7rem' }}>
                    Showing 5 of {jobStatus.result.results.length} results
                  </small>
                )}
                {jobStatus.result.messagesSent && (
                  <CAlert color="success" className="mt-2 py-2 mb-0">
                    <small className="fw-bold">
                      <CIcon icon={cilCheckCircle} className="me-1" />
                      {jobStatus.result.messagesSent} messages sent successfully!
                    </small>
                  </CAlert>
                )}
              </div>
            )}

            {/* Error */}
            {jobStatus.error && (
              <CAlert color="danger" className="py-2 mb-0">
                <small>
                  <strong>Error:</strong> {jobStatus.error}
                </small>
              </CAlert>
            )}
          </>
        ) : (
          <CAlert color="info" className="py-2 mb-0">
            <small>Waiting for job status...</small>
          </CAlert>
        )}
      </CCardBody>
    </CCard>
  );
};

export default JobStatusTracker;

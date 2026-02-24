import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { cilSend } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCol, CRow, CTooltip } from '@coreui/react';

import { useResendNotification } from 'src/hooks/api/useResendNotification';
import { useShowConfirmation } from 'src/hooks/useShowConfirmation';
import { useShowToast } from 'src/hooks/useShowToast';
import Spinner from '../UI/Spinner';

const CampaignResultActionCell = (prop) => {

  const { value } = prop;
  const showToast = useShowToast();
  const showConfirmation = useShowConfirmation();
  const { loading, resendNotification } = useResendNotification();

  const row = value?.row;

  // Cooldown config
  const COOLDOWN_SECONDS = 30 * 60; // 30 minutes

  // State
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const status = row?.deliveryStatus;
  const retries = row?.retriesAvailedCount ?? 0;
  const maxRetries = 3;
  const remainingRetries = maxRetries - retries;

  // Unique storage key per row
  const storageKey = `resend_cooldown_${row?.id}`;

  // Load cooldown from localStorage on mount
  useEffect(() => {

    if (!row?.id) return;

    const savedTime = localStorage.getItem(storageKey);

    if (savedTime) {

      const lastTime = dayjs(savedTime);
      const elapsed = dayjs().diff(lastTime, 'second');
      const remaining = COOLDOWN_SECONDS - elapsed;

      if (remaining > 0) {
        setRemainingSeconds(remaining);
      } else {
        localStorage.removeItem(storageKey);
      }
    }

  }, [row?.id]);

  // Countdown timer
  useEffect(() => {

    if (remainingSeconds <= 0) return;

    const interval = setInterval(() => {

      setRemainingSeconds(prev => {

        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem(storageKey);
          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(interval);

  }, [remainingSeconds]);

  // Format mm:ss
  const formatTime = (seconds) => {

    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  // Handle resend click
  const handleResend = () => {

    showConfirmation({
      header: 'Resend Confirmation',
      body: `Are you sure you want to resend ${row?.networkId ?? '—'} (${row?.recipient ?? '—'}) ?`,
      isOpen: true,
      onYes: onResend,
      onNo: () => showConfirmation({ isOpen: false }),
    });
  };

  // Resend API call
  const onResend = async () => {

    const response = await resendNotification(value);

    if (response?.status) {

      showToast(
        response?.message || 'Notification resent successfully',
        'success'
      );

      // Save cooldown start time
      const now = dayjs().toISOString();
      localStorage.setItem(storageKey, now);

      setRemainingSeconds(COOLDOWN_SECONDS);

    }
    else {

      showToast(
        response?.message || 'Resend failed. Please try again.',
        'error'
      );
    }

    showConfirmation({ isOpen: false });
  };

  if (loading) {
    return <Spinner />;
  }

  if (!row) return null;

  const isCooldownActive = remainingSeconds > 0;

  return (
    <React.Fragment>

      <CRow>

        <CCol className="d-flex justify-content-center">

          <div className="d-flex align-items-center justify-content-center gap-2">

            {/* Show only when FAILED and retries available */}
            {status === 8 && retries < maxRetries ? (

              <>

                <CTooltip
                  content={
                    isCooldownActive
                      ? `Available in ${formatTime(remainingSeconds)}`
                      : `Resend Notification (${remainingRetries} retries left)`
                  }
                >

                  <CIcon
                    icon={cilSend}
                    size="xl"
                    onClick={!isCooldownActive ? handleResend : undefined}
                    style={{
                      cursor: isCooldownActive ? 'not-allowed' : 'pointer',
                      color: isCooldownActive ? '#6c757d' : '#0d6efd',
                      fontSize: '30px',
                      opacity: isCooldownActive ? 0.5 : 1,
                      transition: '0.2s'
                    }}
                  />

                </CTooltip>

                {/* Show timer or retries */}
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isCooldownActive ? '#dc3545' : '#6c757d'
                  }}
                >
                  {isCooldownActive
                    ? formatTime(remainingSeconds)
                    : `${remainingRetries} left`}
                </span>

              </>

            ) : status === 8 && retries >= maxRetries ? (

              <span
                style={{
                  fontSize: '12px',
                  color: '#dc3545',
                  fontWeight: 600
                }}
              >
                Retry limit reached
              </span>

            ) : (

              <span className="text-muted">---</span>

            )}

          </div>

        </CCol>

      </CRow>

    </React.Fragment>
  );
};

export default CampaignResultActionCell;

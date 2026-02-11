/* eslint-disable react/react-in-jsx-scope */
import { cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CBadge, CTooltip } from '@coreui/react';

/* eslint-disable react/prop-types */
const QuotaBadge = ({ totalQuota, usedQuota, remainingQuota }) => {
  const isOverused = remainingQuota < 0;
  const isLimitReached = remainingQuota === 0;

  const displayRemaining = Math.max(remainingQuota, 0);
  const overusedAmount = isOverused ? Math.abs(remainingQuota) : 0;

  const badgeColor = isOverused || isLimitReached ? 'danger' : 'info';

  const badgeText = isOverused
    ? `Over by ${overusedAmount}`
    : isLimitReached
      ? 'Limit reached'
      : `${displayRemaining} left`;

  return (
    <CTooltip
      content={
        <div className="text-start small">
          <div>
            Total: <strong>{totalQuota}</strong>
          </div>
          <div>
            Used: <strong>{usedQuota}</strong>
          </div>
          <div>
            Remaining:{' '}
            <strong className={!isOverused ? '' : 'text-danger'}>{displayRemaining}</strong>
          </div>

          {isOverused && (
            <div className="mt-1 text-danger fw-semibold">
              Overused by {overusedAmount}. Payment required for extra usage.
            </div>
          )}
        </div>
      }
      placement="top"
      trigger={['hover']}
    >
      <span
        className="d-inline-flex align-items-center gap-1 small ms-1"
        style={{ cursor: 'default' }}
      >
        <CBadge color={badgeColor} className="px-2">
          {badgeText}
        </CBadge>
        <CIcon icon={cilInfo} size="sm" className="text-primary" />
      </span>
    </CTooltip>
  );
};

export default QuotaBadge;

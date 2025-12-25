/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { CTooltip } from '@coreui/react';
import { cilInfo, cilCheckCircle, cilWarning, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

/**
 * CityBadge - Displays city with confidence indicator and alternative matches
 *
 * @param {string} primaryCity - Main city detected
 * @param {Array} cityMatches - All city matches with confidence scores
 * @param {string} countryCode - Country code for context
 */
const CityBadge = ({ primaryCity, cityMatches = [], countryCode }) => {
  if (!primaryCity && (!cityMatches || cityMatches.length === 0)) {
    return <span className="text-muted">--</span>;
  }

  // Get primary match details
  const primaryMatch = cityMatches?.find((m) => m.city === primaryCity) || cityMatches?.[0];

  // Get alternative matches (excluding primary)
  const alternatives = cityMatches?.filter((m) => m.city !== primaryCity) || [];

  const getConfidenceBadge = (confidence) => {
    switch (confidence) {
      case 'high':
        return {
          color: 'success',
          icon: cilCheckCircle,
          text: 'High',
          bgClass: 'badge-high-confidence',
        };
      case 'medium':
        return {
          color: 'warning',
          icon: cilWarning,
          text: 'Medium',
          bgClass: 'badge-medium-confidence',
        };
      case 'low':
        return {
          color: 'secondary',
          icon: cilInfo,
          text: 'Low',
          bgClass: 'badge-low-confidence',
        };
      default:
        return {
          color: 'secondary',
          icon: cilInfo,
          text: 'Unknown',
          bgClass: 'badge-low-confidence',
        };
    }
  };

  const formatMethod = (method) => {
    const methodMap = {
      explicit_marker: 'Explicit mention',
      proximity_150: 'Very close (±150 chars)',
      proximity_500: 'Near (±500 chars)',
      proximity_1500: 'Page mention',
      address_pattern: 'Address format',
      frequency_: 'Mentioned multiple times',
    };

    for (const [key, label] of Object.entries(methodMap)) {
      if (method?.startsWith(key)) {
        if (key === 'frequency_') {
          const count = method.match(/\d+/)?.[0] || '?';
          return `${label} (${count}x)`;
        }
        return label;
      }
    }
    return method || 'Detected';
  };

  const badge = primaryMatch
    ? getConfidenceBadge(primaryMatch.confidence)
    : {
        color: 'secondary',
        icon: cilInfo,
        bgClass: 'badge-low-confidence',
      };

  // Build tooltip content
  const tooltipContent = (
    <div style={{ textAlign: 'left', maxWidth: '200px' }}>
      <div className="fw-bold mb-2 border-bottom pb-1">
        {primaryCity || cityMatches[0]?.city}
        {countryCode && <span className="text-muted ms-1">({countryCode})</span>}
      </div>

      {primaryMatch && (
        <div className="mb-2">
          <div className="small">
            <strong>Confidence:</strong> <span className={`text-${badge.color}`}>{badge.text}</span>
          </div>
          <div className="small">
            <strong>Method:</strong> {formatMethod(primaryMatch.method)}
          </div>
          {primaryMatch.distance !== undefined && (
            <div className="small">
              <strong>Distance:</strong> {primaryMatch.distance} chars from contact
            </div>
          )}
        </div>
      )}

      {alternatives.length > 0 && (
        <>
          <div className="fw-bold mb-1 border-top pt-2 small">Alternative Matches:</div>
          {alternatives.slice(0, 3).map((alt, idx) => {
            const altBadge = getConfidenceBadge(alt.confidence);
            return (
              <div key={idx} className="small mb-1 ps-2">
                <div className="d-flex align-items-center gap-1">
                  <CIcon icon={altBadge.icon} size="sm" className={`text-${altBadge.color}`} />
                  <strong>{alt.city}</strong>
                </div>
                <div className="text-muted" style={{ fontSize: '11px' }}>
                  {formatMethod(alt.method)}
                  {alt.distance !== undefined && ` • ${alt.distance} chars`}
                </div>
              </div>
            );
          })}
          {alternatives.length > 3 && (
            <div className="small text-muted mt-1">+{alternatives.length - 3} more...</div>
          )}
        </>
      )}
    </div>
  );

  return (
    <CTooltip content={tooltipContent} placement="top">
      <div className="d-inline-flex align-items-center gap-1 cursor-pointer">
        <span className="fw-semibold">{primaryCity || cityMatches[0]?.city}</span>
        {primaryMatch && (
          <span className={`badge ${badge.bgClass} d-inline-flex align-items-center gap-1`}>
            <CIcon icon={badge.icon} size="sm" className="badge-icon" />
            <span className="small">{badge.text}</span>
          </span>
        )}
        {alternatives.length > 0 && (
          <span className="badge badge-alternative-matches">+{alternatives.length}</span>
        )}
      </div>
    </CTooltip>
  );
};

export default CityBadge;

// Add these styles to your global CSS or styled component:
/*
.badge-high-confidence {
  background-color: rgba(25, 135, 84, 0.15);
  color: #198754;
  border: 1px solid rgba(25, 135, 84, 0.3);
}

.badge-medium-confidence {
  background-color: rgba(255, 193, 7, 0.15);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.badge-low-confidence {
  background-color: rgba(108, 117, 125, 0.15);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
}

.badge-alternative-matches {
  background-color: rgba(13, 110, 253, 0.15);
  color: #0d6efd;
  border: 1px solid rgba(13, 110, 253, 0.3);
  font-size: 0.75rem;
}

.cursor-pointer {
  cursor: pointer;
}
*/

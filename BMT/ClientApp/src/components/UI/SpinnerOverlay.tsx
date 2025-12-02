import React from 'react';

interface SpinnerOverlayProps {
  title?: string;
  info?: string;
  show?: boolean; // Optional: control visibility
}

const SpinnerOverlay: React.FC<SpinnerOverlayProps> = ({
  title = 'Loading...',
  show = true,
  info = '',
}) => {
  if (!show) return null;

  return (
    <div
      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-overlay"
      style={{
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div className="text-center">
        {/* Modern spinning loader */}
        <div
          className="spinner-border text-primary"
          style={{ width: '3.5rem', height: '3.5rem' }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        {/* Optional title */}
        {title && (
          <div className="mt-4">
            <h5 className="text-white fw-medium mb-1">{title}</h5>
            {info && <p className="text-muted small">{info}</p>}
          </div>
        )}
      </div>

      {/* Optional inline styles for smooth animation */}
    </div>
  );
};

export default SpinnerOverlay;

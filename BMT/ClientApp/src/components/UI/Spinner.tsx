import React from 'react';

interface SpinnerProps {
  title?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ title }) => {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="sr-only"></span>
      </div>
    </div>
  );
};

export default Spinner;

/* eslint-disable react/no-unknown-property */
import React from 'react';

const DatagridSkeleton: React.FC = () => {
  return (
    <div className="datagrid-skeleton">
      {/* Header skeleton */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="skeleton-item" style={{ width: '200px', height: '20px' }}></div>
        <div className="d-flex gap-2">
          <div className="skeleton-item" style={{ width: '100px', height: '28px' }}></div>
          <div className="skeleton-item" style={{ width: '80px', height: '28px' }}></div>
        </div>
      </div>

      {/* Search skeleton */}
      <div className="skeleton-item mb-3" style={{ width: '100%', height: '32px' }}></div>

      {/* Grid header skeleton */}
      <div className="d-flex border-bottom" style={{ backgroundColor: '#0c355f20' }}>
        <div
          className="skeleton-item"
          style={{ width: '50px', height: '28px', margin: '4px' }}
        ></div>
        <div
          className="skeleton-item"
          style={{ width: '150px', height: '28px', margin: '4px' }}
        ></div>
        <div
          className="skeleton-item"
          style={{ width: '120px', height: '28px', margin: '4px' }}
        ></div>
        <div
          className="skeleton-item"
          style={{ width: '100px', height: '28px', margin: '4px' }}
        ></div>
        <div className="skeleton-item flex-grow-1" style={{ height: '28px', margin: '4px' }}></div>
      </div>

      {/* Grid rows skeleton */}
      {[...Array(8)].map((_, index) => (
        <div key={index} className="d-flex border-bottom">
          <div
            className="skeleton-item"
            style={{ width: '50px', height: '26px', margin: '4px' }}
          ></div>
          <div
            className="skeleton-item"
            style={{ width: '150px', height: '26px', margin: '4px' }}
          ></div>
          <div
            className="skeleton-item"
            style={{ width: '120px', height: '26px', margin: '4px' }}
          ></div>
          <div
            className="skeleton-item"
            style={{ width: '100px', height: '26px', margin: '4px' }}
          ></div>
          <div
            className="skeleton-item flex-grow-1"
            style={{ height: '26px', margin: '4px' }}
          ></div>
        </div>
      ))}

      {/* Pagination skeleton */}
      <div className="d-flex justify-content-between align-items-center mt-3 p-2">
        <div className="skeleton-item" style={{ width: '180px', height: '18px' }}></div>
        <div className="d-flex gap-2">
          <div className="skeleton-item" style={{ width: '60px', height: '26px' }}></div>
          <div className="skeleton-item" style={{ width: '80px', height: '26px' }}></div>
          <div className="skeleton-item" style={{ width: '100px', height: '18px' }}></div>
          <div className="skeleton-item" style={{ width: '60px', height: '26px' }}></div>
          <div className="skeleton-item" style={{ width: '60px', height: '26px' }}></div>
        </div>
      </div>

      <style>{`
        .skeleton-item {
          background: linear-gradient(90deg, #0c355f 25%, #1a4c85 50%, #0c355f 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 3px;
          opacity: 0.9;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .datagrid-skeleton {
          width: 100%;
          padding: 12px;
          border: 1px solid #0c355f40;
          border-radius: 6px;
          background-color: #0a1a2c;
        }
      `}</style>
    </div>
  );
};

export default DatagridSkeleton;

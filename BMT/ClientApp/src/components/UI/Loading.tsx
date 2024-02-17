import React from 'react';

type LoadingProps = {
  title?: string;
};

const Loading: React.FC<LoadingProps> = ({ title }) => {
  return (
    <div className="custom-loader flex-column">
      <img src="Loader.gif" alt="Loading..." />
      {title && <div>{title}</div>}
    </div>
  );
};

export default Loading;

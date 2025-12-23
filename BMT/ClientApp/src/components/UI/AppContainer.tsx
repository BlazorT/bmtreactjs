import React from 'react';

type AppContainerProps = {
  children?: React.ReactNode;
  className?: string;
};
const AppContainer: React.FC<AppContainerProps> = ({ className, children }) => {
  return <div className={`bg_Div d-flex flex-column mt-2 ${className || ''}`}>{children}</div>;
};
export default AppContainer;

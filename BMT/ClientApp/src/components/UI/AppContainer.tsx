import React from 'react';

type AppContainerProps = {
  children?: React.ReactNode;
};
const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  return <div className="bg_Div d-flex flex-column mt-2">{children}</div>;
};
export default AppContainer;

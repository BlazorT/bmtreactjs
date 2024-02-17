import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({}); // data hold storeLOVS
  const [contextProduct, setContextProduct] = useState({});
  return (
    <DataContext.Provider value={{ data, setData, contextProduct, setContextProduct }}>
      {children}
    </DataContext.Provider>
  );
};

// Add prop type validation for children
DataProvider.propTypes = {
  children: PropTypes.node.isRequired
};

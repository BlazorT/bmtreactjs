// src/MyContext.js
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [storeLov, setStoreLov] = useState([]);

  return <MyContext.Provider value={{ storeLov, setStoreLov }}>{children}</MyContext.Provider>;
};
MyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useMyContext = () => {
  return useContext(MyContext);
};

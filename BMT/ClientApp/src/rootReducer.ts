import { combineReducers } from '@reduxjs/toolkit';

// Import your individual reducers here
import sidebarReducer from './redux/sidebar/sidebarSlice';
import filterReducer from './redux/filter/filterSlice';
import toastReducer from './redux/toast/toastSlice';
import confirMdlReducer from './redux/confirmation_mdl/confirMdlSlice';
import userReducer from './redux/user/userSlice';
import navItemsReducer from './redux/navItems/navItemsSlice';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  filter: filterReducer,
  toast: toastReducer,
  confirMdl: confirMdlReducer,
  user: userReducer,
  navItems: navItemsReducer,
  // Add more reducers as needed
});

export default rootReducer;

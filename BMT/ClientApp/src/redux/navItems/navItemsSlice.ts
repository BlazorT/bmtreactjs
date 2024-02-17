import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface NavItem {
  [key: string]: unknown; // Allow any property names and values
}

interface NavItemsState {
  navItems: NavItem[];
  pageRoles: NavItem[];
}

const initialState: NavItemsState = { navItems: [], pageRoles: [] };

export const navItemsSlice = createSlice({
  name: 'navItems',
  initialState,
  reducers: {
    setNavItems: (state, action: PayloadAction<NavItem[]>) => {
      state.navItems = action.payload;
    },
    setPageRoles: (state, action: PayloadAction<NavItem[]>) => {
      state.pageRoles = action.payload;
    },
  },
});

export const { setNavItems, setPageRoles } = navItemsSlice.actions;

export default navItemsSlice.reducer;

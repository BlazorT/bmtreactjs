import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  value: boolean;
}

const initialState: SidebarState = {
  value: true,
};

export const sidebarSlice = createSlice({
  name: 'sidebarShow',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.value = !state.value;
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;

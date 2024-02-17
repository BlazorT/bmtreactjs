import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface FilterState {
  filterMenu: boolean;
  filterMenuAnchorEvent: string;
}

const initialState: FilterState = {
  filterMenu: false,
  filterMenuAnchorEvent: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    toggleFilterMenu: (state) => {
      state.filterMenu = !state.filterMenu;
    },
    setFilterMenu: (state, action: PayloadAction<boolean>) => {
      state.filterMenu = action.payload;
    },
    setFilterMenuAnchorEvent: (state, action: PayloadAction<string>) => {
      state.filterMenuAnchorEvent = action.payload;
    },
  },
});

export const { toggleFilterMenu, setFilterMenu, setFilterMenuAnchorEvent } = filterSlice.actions;

export const selectFilterMenu = (state: RootState) => state.filter.filterMenu;
export const selectFilterMenuAnchorEvent = (state: RootState) => state.filter.filterMenuAnchorEvent;

export default filterSlice.reducer;

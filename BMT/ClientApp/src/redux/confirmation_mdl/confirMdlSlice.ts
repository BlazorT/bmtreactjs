import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ConfirmationDialogState = {
  header: string;
  body: string;
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
};

const initialState: ConfirmationDialogState = {
  header: '',
  body: '',
  isOpen: false,
  onYes: () => {},
  onNo: () => {},
};

export const confirMdlSlice = createSlice({
  name: 'confirMdl',
  initialState,
  reducers: {
    setConfirmation: (state, action: PayloadAction<ConfirmationDialogState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setConfirmation } = confirMdlSlice.actions;

export default confirMdlSlice.reducer;

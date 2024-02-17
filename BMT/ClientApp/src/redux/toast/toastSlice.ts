import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface ToastState {
  isToastOpen: boolean;
  toastMessage: string;
  toastVariant: string;
}

const initialState: ToastState = {
  isToastOpen: false,
  toastMessage: '',
  toastVariant: 'success',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    updateToast: (state, action: PayloadAction<Partial<ToastState>>) => {
      // action.payload should be an object with the properties you want to update
      Object.assign(state, action.payload);
    },
  },
});

export const { updateToast } = toastSlice.actions;
export const selectToast = (state: RootState) => state.toast;
export default toastSlice.reducer;

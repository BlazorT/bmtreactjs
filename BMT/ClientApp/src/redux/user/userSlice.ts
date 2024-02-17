import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type UserState = {
  userId: string;
  dspId: string;
  roleId: string;
  userInfo: Record<string, unknown>;
  isAuthenticated: boolean;
};

const initialState: UserState = {
  userId: '',
  dspId: '',
  roleId: '',
  userInfo: {},
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      const { userId, dspId, roleId, userInfo, isAuthenticated } = action.payload;

      // Update only the provided fields, keeping the rest unchanged
      if (userId !== undefined) {
        state.userId = userId;
      }
      if (dspId !== undefined) {
        state.dspId = dspId;
      }
      if (roleId !== undefined) {
        state.roleId = roleId;
      }
      if (userInfo !== undefined) {
        state.userInfo = userInfo;
      }
      if (isAuthenticated !== undefined) {
        state.isAuthenticated = isAuthenticated;
      }
    },
  },
});

// Action creator for setting user data
export const { setUserData } = userSlice.actions;

export default userSlice.reducer;

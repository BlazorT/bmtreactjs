import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type UserState = {
  userId: string;
  orgId: string;
  roleId: string;
  userInfo: Record<string, unknown>;
  orgInfo: Record<string, unknown>;
  isAuthenticated: boolean;
  socialApiKey: string;
};

const initialState: UserState = {
  userId: '',
  orgId: '',
  roleId: '',
  userInfo: {},
  orgInfo: {},
  isAuthenticated: false,
  socialApiKey: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      const { userId, orgId, roleId, userInfo, orgInfo, isAuthenticated, socialApiKey } =
        action.payload;

      // Update only the provided fields, keeping the rest unchanged
      if (userId !== undefined) {
        state.userId = userId;
      }
      if (orgId !== undefined) {
        state.orgId = orgId;
      }
      if (roleId !== undefined) {
        state.roleId = roleId;
      }
      if (userInfo !== undefined) {
        state.userInfo = userInfo;
      }
      if (orgInfo !== undefined) {
        state.orgInfo = orgInfo;
      }
      if (isAuthenticated !== undefined) {
        state.isAuthenticated = isAuthenticated;
      }
      if (socialApiKey !== undefined) {
        state.socialApiKey = socialApiKey;
      }
    },
    logout: () => initialState,
  },
});

// Action creator for setting user data
export const { setUserData, logout } = userSlice.actions;

export default userSlice.reducer;

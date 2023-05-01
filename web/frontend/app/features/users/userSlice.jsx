import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },
  reducers: {
    SaveUser: (state, action) => {
      state.users = action.payload;
    },
    updateUser: (state, action) => {
      state.users = action.payload;
    }

  },
});
export const fetchUserDetails = (state) => state.users.users;

export const { SaveUser, updateUser } = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  userDetails: null,
  userExist: false,
  isUserLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
      state.userExist = true;
      state.isUserLoading = false;
    },
    logOut: (state) => {
      state.email = "";
      state.userDetails = null;
      state.userExist = false;
      state.isUserLoading = false;
    },
    setLoading: (state, action) => {
      state.isUserLoading = action.payload;
    },
  },
});

export const { setEmail, setUserDetails, logOut, setLoading } =
  authSlice.actions;

export const selectEmail = (state) => state.auth.email;
export const selectUserDetails = (state) => state.auth.userDetails;
export const selectUserExist = (state) => state.auth.userExist;
export const selectAuthLoading = (state) => state.auth.isUserLoading;

export default authSlice.reducer;

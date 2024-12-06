import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  userDetails: null, // This will store both user details and idToken
  userExist: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload; // userDetails will store both user details and idToken
      state.userExist = true;
    },
    logOut: (state) => {
      state.email = "";
      state.userDetails = null;
      state.userExist = false;
    },
  },
});

export const { setEmail, setUserDetails, logOut } = authSlice.actions;

export const selectEmail = (state) => state.auth.email;
export const selectUserDetails = (state) => state.auth.userDetails;
export const selectUserExist = (state) => state.auth.userExist;

export default authSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import config from "config";
import { LOCAL_STORAGE, MODE } from "constants";
import { Customer, CustomerRequest } from "models/user";
import authenticationService from "services/authentication-service";
import { userService } from "services/user-service";
import { zaloService } from "services/zalo-service";
import { UpdatePhoneNumberOrLocation } from "types/api";

type initialStateType = {
  user: Customer;
};

const initialState: initialStateType = {
  user: {},
};

export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (_, { dispatch }) => {
    try {
      const userRes = await zaloService.getUser();
      dispatch(setUserInfo(userRes));
    } catch (error) {
      console.log("Error when get user info:", error);
    }
  }
);

export const getUserInfoSystem = createAsyncThunk(
  "user/getUserInfoSystem",
  async (_, { dispatch }) => {
    try {
      const userRes = await userService.getUserInfo();
      dispatch(setUserInfo(userRes));
    } catch (error) {
      console.log("Error when get user info system:", error);
    }
  }
);

export const login = createAsyncThunk(
  "authentication/login",
  async (_, { dispatch }) => {
    try {
      if (config.MODE === MODE.PRODUCTION) {
        const tokenZaloRes = await zaloService.getAccessToken();
        // console.log(tokenZaloRes);
        if (tokenZaloRes) {
          const loginRes = await authenticationService.signIn({
            token: tokenZaloRes,
          });
          // copyTextToClipboard(loginRes.accessToken);
          localStorage.setItem(
            LOCAL_STORAGE.ACCESS_TOKEN,
            loginRes.accessToken
          );
          const userRes = await userService.getUserInfo();
          dispatch(setUserInfo(userRes));
        }
      } else {
        const userRes = await userService.getUserInfo();
        dispatch(setUserInfo(userRes));
      }
    } catch (error) {
      console.log("Error when login zalo", error);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (dataUpdate: CustomerRequest, { dispatch }) => {
    try {
      await userService.updateUser(dataUpdate);
      dispatch(setUserInfo(dataUpdate));
    } catch (err) {
      console.log("Error when update user: ", err);
    }
  }
);

export const getPhoneNumberZaloProfileThunk = createAsyncThunk(
  "user/getPhoneNumberZaloProfileThunk",
  async (data: UpdatePhoneNumberOrLocation, { dispatch }) => {
    try {
      const res = await userService.updatePhoneNumberOrLocationUser(data);
      dispatch(setUserInfo(res));
    } catch (err) {
      console.log("Error when get phone number from Zalo", err);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload;
    },
  },
});

const { reducer, actions } = userSlice;

export const { setUserInfo } = actions;

export default reducer;

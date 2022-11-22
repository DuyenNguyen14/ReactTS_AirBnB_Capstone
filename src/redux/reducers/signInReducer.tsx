import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../configStore";

import {
  ACCESS_TOKEN,
  setStore,
  setStoreJSON,
  USER_LOGIN,
  http,
} from "./../../util/setting";
import { setUserInfo } from "./userReducer";

export interface UserSignIn {
  email: string;
  password: string;
}

type SignInState = {
  userLogin: any;
  stateLogin: string;
};

const initialState: SignInState = {
  userLogin: localStorage.getItem(USER_LOGIN)
    ? JSON.parse(localStorage.getItem(USER_LOGIN) as string)
    : null,
  stateLogin: "",
};

const signInReducer = createSlice({
  name: "signInReducer",
  initialState,
  reducers: {
    setUserLogin: (state: SignInState, action: PayloadAction<UserSignIn[]>) => {
      state.userLogin = action.payload;
    },
    setStateLogin: (state: SignInState, action: PayloadAction<string>) => {
      state.stateLogin = action.payload;
    },
  },
});

export const { setUserLogin, setStateLogin } = signInReducer.actions;

export default signInReducer.reducer;

//Api
export const signInApi = (userLogin: UserSignIn) => {
  return async (dispatch: AppDispatch) => {
    try {
      let result = await http.post("auth/signin", userLogin);
      console.log(result.data.content);
      setStore(ACCESS_TOKEN, result.data.content.token);
      setStoreJSON(USER_LOGIN, result.data.content);
      const action = setUserLogin(result.data.content);
      dispatch(action);
      dispatch(setUserInfo(result.data.content.user));
      console.log(result.status);
      // setUserInfo(result.data.content);
      const actionState = setStateLogin("okay");
      dispatch(actionState);
    } catch (err) {
      console.log(err);
      const actionState = setStateLogin("fail");
      dispatch(actionState);
    }
  };
};

export const getUserInfoAction = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.post("/users");

      if (result.status === 200) {
        setUserLogin(result.data.content);
      }

      console.log("result", result);
    } catch (errors: any) {
      console.log("errors", errors.response?.data);
    }
  };
};

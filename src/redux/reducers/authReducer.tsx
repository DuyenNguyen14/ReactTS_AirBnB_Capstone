import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ACCESS_TOKEN,
  http,
  setStoreJSON,
  USER_LOGIN,
} from "../../util/setting";
import { AppDispatch } from "../configStore";
import { openNotificationWithIcon } from "../../util/notification";
import { history } from "../../index";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
  role: "USER" | "ADMIN";
}

type InititalState = {
  user: User;
  isLoggedIn: null | boolean;
  signUpState: null | boolean;
};

const initialState: InititalState = {
  user: {} as User,
  isLoggedIn: null,
  signUpState: null,
};

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    setUser: (state: InititalState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setIsLoggedIn: (
      state: InititalState,
      action: PayloadAction<boolean | null>
    ) => {
      state.isLoggedIn = action.payload;
    },
    setSignUpState: (
      state: InititalState,
      action: PayloadAction<boolean | null>
    ) => {
      state.signUpState = action.payload;
    },
  },
});

export const { setUser, setIsLoggedIn, setSignUpState } = authReducer.actions;

export default authReducer.reducer;

export const signIn = (userSignin: { email: string; password: string }) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.post("/auth/signin", userSignin);
      const { user, token } = result.data.content;
      dispatch(setUser(user));
      dispatch(setIsLoggedIn(true));
      setStoreJSON(ACCESS_TOKEN, token);
      setStoreJSON(USER_LOGIN, user);
    } catch (err) {
      dispatch(setIsLoggedIn(false));
    }
  };
};

export const signUp = (userSignUp: User) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.post("/auth/signup", userSignUp);
      console.log(result.data.content);
      dispatch(setSignUpState(true));
    } catch (err) {
      console.log(err);
      dispatch(setSignUpState(false));
    }
  };
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { AppDispatch } from "../configStore";
import { setStoreJSON, USER_LOGIN, http } from "./../../util/setting";
import { Room } from "./roomReducer";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: "USER" | "ADMIN";
}

type UserState = {
  arrUsers: User[];
  totalRow: number;
  userInfo: User | null;
  rentedRoom: Room[];
};

const initialState: UserState = {
  arrUsers: [],
  totalRow: 0,
  rentedRoom: [],
  userInfo: null,
};

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setArrUser: (state: UserState, action: PayloadAction<User[]>) => {
      state.arrUsers = action.payload;
    },
    setTotalRow: (state: UserState, action: PayloadAction<number>) => {
      state.totalRow = action.payload;
    },
    getRentedRoom: (state: UserState, action: PayloadAction<Room[]>) => {
      state.rentedRoom = action.payload;
    },
    setUserInfo: (state: UserState, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
    },
  },
});

export const {
  setArrUser,
  setTotalRow,
  getRentedRoom,
  setUserInfo,
} = userReducer.actions;

export default userReducer.reducer;

// call api
export const getUserById = (userId: number | string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(`/users/${userId}`);
      dispatch(setUserInfo(result.data.content));
    } catch (err) {
      console.log(err);
    }
  };
};

export const editUserAction = (userId: number, userInfo: User) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.put(`users/${userId}`, { ...userInfo });
      if (result.status === 200) {
        Swal.fire({
          title: "Update Successfully!",
          icon: "success",
          confirmButtonColor: "#44c020",
        });
        console.log(result.data.content);
        dispatch(setUserInfo(result.data.content));
        setStoreJSON(USER_LOGIN, result.data.content);
      }
    } catch (errors: any) {
      Swal.fire({
        icon: "error",
        title: errors.response?.data.message,
        text: `${errors.response?.data.content}`,
      });
    }
  };
};

export const getUserPaginationAction = (
  pageIndex: string | null,
  pageSize: string | null,
  keyword?: string | null
) => {
  return async (dispatch: AppDispatch) => {
    try {
      if (keyword === null) {
        const result = await http.get(
          `/users/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}`
        );
        dispatch(setArrUser(result.data.content.data));
        dispatch(setTotalRow(result.data.content.totalRow));
      }
    } catch (err) {
      console.log(err);
    }
  };
};
//delete
export const deleteUserAction = (userID: number) => {
  return async () => {
    try {
      const result = await http.delete(`/users?id=${userID}`);
    } catch (err) {
      console.log(err);
    }
  };
};
//search
export const searchUserAction = (userName: string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(`/users/search/${userName}`);
      console.log(result.data.content);
      dispatch(setArrUser(result.data.content));
      dispatch(setTotalRow(result.data.content.length));
    } catch (err) {
      console.log(err);
    }
  };
};
//edit user
export const editUserByIDAction = (id: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      if (id !== null) {
        const result = await http.get(`/users/${id}`);
        console.log(result.data.content);
        dispatch(setUserInfo(result.data.content));
      }
    } catch (err) {}
  };
};
//Call api getProfile

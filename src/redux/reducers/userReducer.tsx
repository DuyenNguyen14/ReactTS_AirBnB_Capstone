import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { openNotificationWithIcon } from "../../util/notification";
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
  isSucceed: boolean;
  isFetching: boolean;
};

const initialState: UserState = {
  arrUsers: [],
  totalRow: 0,
  rentedRoom: [],
  userInfo: null,
  isSucceed: false,
  isFetching: true,
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
    setIsSucceed: (state: UserState, action: PayloadAction<boolean>) => {
      state.isSucceed = action.payload;
    },
    setIsFetching: (state: UserState, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    setArrUserAfterDeleted: (
      state: UserState,
      action: PayloadAction<number>
    ) => {
      const index = state.arrUsers.findIndex(
        (user) => user.id === action.payload
      );
      if (index !== -1) {
        state.arrUsers.splice(index, 1);
      }
    },
    serArrUserAfterEditted: (state: UserState, action: PayloadAction<User>) => {
      const index = state.arrUsers.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.arrUsers[index] = { ...action.payload };
      }
    },
  },
});

export const {
  setArrUser,
  setTotalRow,
  getRentedRoom,
  setUserInfo,
  setIsSucceed,
  setIsFetching,
  setArrUserAfterDeleted,
  serArrUserAfterEditted,
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

      Swal.fire({
        title: "Update Successfully!",
        icon: "success",
        confirmButtonColor: "#44c020",
      });
      console.log(result.data.content);
      dispatch(setUserInfo(result.data.content));
      dispatch(setIsSucceed(true));
      // nếu hành động xảy ra trong trang admin
      dispatch(serArrUserAfterEditted(result.data.content));
    } catch (errors: any) {
      Swal.fire({
        icon: "error",
        title: errors.response?.data.message,
        text: `${errors.response?.data.content}`,
      });
      dispatch(setIsSucceed(false));
    }
  };
};

export const getUserPaginationAction = (
  pageIndex: string | null,
  pageSize: string | null,
  keyword: string | null
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(
        `/users/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
      );
      dispatch(setArrUser(result.data.content.data));
      dispatch(setTotalRow(result.data.content.totalRow));
      dispatch(setIsFetching(false));
    } catch (err) {
      console.log(err);
    }
  };
};

//delete
export const deleteUserAction = (userID: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.delete(`/users?id=${userID}`);
      Swal.fire({
        title: "Xoá thành công!",
        icon: "success",
        confirmButtonColor: "#44c020",
      });
      dispatch(setArrUserAfterDeleted(userID));
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Không thể xoá người dùng này!",
        icon: "error",
        confirmButtonColor: "#44c020",
      });
    }
  };
};
// add
export const addUserApi = (userInfo: User) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.post("/users", userInfo);
      Swal.fire({
        title: "Thêm mới thành công!",
        icon: "success",
        confirmButtonColor: "#44c020",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Thêm mới thất bại!",
        icon: "error",
        confirmButtonColor: "#44c020",
      });
    }
  };
};
// upload avatar
export const uploadAvatarAction = (data: FormData) => {
  return async () => {
    try {
      const result = await http.post("users/upload-avatar", data);
      console.log(result.data);
      openNotificationWithIcon(
        "success",
        "Cập nhật ảnh đại diện thành công!",
        ""
      );
      setStoreJSON("userLogin", result.data.content);
    } catch (err) {
      console.log(err);
      openNotificationWithIcon(
        "error",
        "Cập nhật ảnh đại diện thất bại!",
        "Vui lòng thử lại!"
      );
    }
  };
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { history } from "../..";
import { openNotificationWithIcon } from "../../util/notification";
import { http } from "../../util/setting";
import { AppDispatch } from "../configStore";

export interface CommentType {
  id: number;
  maPhong: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
}

type CommentState = {
  arrComments: CommentType[];
  success: boolean;
};

const initialState: CommentState = {
  arrComments: [],
  success: false,
};

const commentReducer = createSlice({
  name: "commentReducer",
  initialState,
  reducers: {
    setArrComment: (
      state: CommentState,
      action: PayloadAction<CommentType[]>
    ) => {
      state.arrComments = action.payload;
    },
    addComment: (state: CommentState, action: PayloadAction<CommentType>) => {
      state.arrComments.push(action.payload);
    },
    setSuccess: (state: CommentState, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
  },
});

export const { setArrComment, addComment, setSuccess } = commentReducer.actions;

export default commentReducer.reducer;

// call api
export const getCommentsByRoomId = (roomId: undefined | string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(
        `/binh-luan/lay-binh-luan-theo-phong/${roomId}`
      );
      console.log(result.data.content);
      dispatch(setArrComment(result.data.content));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getAllComments = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(`/binh-luan`);
      console.log(result.data.content);
      dispatch(setArrComment(result.data.content));
    } catch (err) {
      console.log(err);
    }
  };
};

// send comment
export const sendComment = (comment: CommentType) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.post("/binh-luan", comment);
      console.log(result.data.content);
      await Swal.fire({
        title: "Thêm bình luận thành công!",
        icon: "success",
      });
      // dispatch(addComment(result.data.content));
      dispatch(setSuccess(true));
    } catch (err) {
      console.log(err);
      dispatch(setSuccess(false));
    }
  };
};

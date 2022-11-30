import { createSlice } from "@reduxjs/toolkit";
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

type RoomState = {
  arrComments: CommentType[];
};

const initialState: RoomState = {
  arrComments: [],
};

const commentReducer = createSlice({
  name: "commentReducer",
  initialState,
  reducers: {
    setArrComment: (state, action) => {
      state.arrComments = action.payload;
    },
  },
});

export const { setArrComment } = commentReducer.actions;

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

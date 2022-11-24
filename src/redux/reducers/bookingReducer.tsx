import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { openNotificationWithIcon } from "../../util/notification";
import { http } from "../../util/setting";
import { AppDispatch } from "../configStore";

export interface Booking {
  id?: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

type InitialState = {
  bookingList: Booking[];
  booking: Booking;
  bookedRoomIds: number[];
};

const initialState: InitialState = {
  bookingList: [],
  booking: {} as Booking,
  bookedRoomIds: [],
};

const bookingReducer = createSlice({
  name: "bookingReducer",
  initialState,
  reducers: {
    setBookingList: (state: InitialState, action: PayloadAction<Booking[]>) => {
      state.bookingList = action.payload;
    },
    setBookedRoomIds: (
      state: InitialState,
      action: PayloadAction<Booking[]>
    ) => {
      state.bookedRoomIds = action.payload.map(
        (room) => room && (room.maPhong as number)
      );
    },
  },
});

export const { setBookingList, setBookedRoomIds } = bookingReducer.actions;

export default bookingReducer.reducer;

export const bookingApi = (bookingInfo: Booking) => {
  return async () => {
    try {
      const result = await http.post("/dat-phong", bookingInfo);
      console.log(result.data.content);
    } catch (err) {
      console.log(err);
    }
  };
};

export const getRentedRoomByUserId = (userId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      if (userId) {
        const result = await http.get(
          `/dat-phong/lay-theo-nguoi-dung/${userId}`
        );
        console.log(result.data.content);
        dispatch(setBookingList(result.data.content));
        dispatch(setBookedRoomIds(result.data.content));
      }
    } catch (err) {
      console.log(err);
    }
  };
};

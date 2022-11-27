import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { history } from "../../index";
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
    setBookingListAfterDeleted: (
      state: InitialState,
      action: PayloadAction<number>
    ) => {
      const index = state.bookingList.findIndex(
        (booking) => booking.id === action.payload
      );
      state.bookingList.splice(index, 1);
    },
  },
});

export const { setBookingList, setBookedRoomIds, setBookingListAfterDeleted } =
  bookingReducer.actions;

export default bookingReducer.reducer;

export const bookingApi = (bookingInfo: Booking, userId: number) => {
  return async () => {
    try {
      const result = await http.post("/dat-phong", bookingInfo);
      Swal.fire({
        title: "Đặt phòng thành công!",
        icon: "success",
        html: `<a href="/profile/${userId}">Xem lịch sử đặt phòng</a>`,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          history.push(`/profile/${userId}`);
        }
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Đặt phòng thất bại!",
        icon: "error",
        html: `<p>Vui lòng kiểm tra lại thông tin đặt phòng!</p>`,
      });
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
        // dispatch(setBookedRoomIds(result.data.content));
      }
    } catch (err) {
      console.log(err);
    }
  };
};

export const cancelBookingById = (bookingId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.delete(`dat-phong/${bookingId}`);
      if (result.status === 200) {
        Swal.fire({
          title: "Huỷ đặt phòng thành công!",
          icon: "success",
          confirmButtonColor: "#44c020",
        });
        dispatch(setBookingListAfterDeleted(bookingId));
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

export const editBooking = (bookingId: number, bookingInfo: Booking) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.put(`dat-phong/${bookingId}`, bookingInfo);
      if (result.status === 200) {
        Swal.fire({
          title: "Sửa thông tin đặt phòng thành công!",
          icon: "success",
          confirmButtonColor: "#44c020",
        });
        // dispatch(setBookingListAfterDeleted(bookingId));
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { openNotificationWithIcon } from "../../util/notification";
import { http } from "../../util/setting";
import { AppDispatch } from "../configStore";
export interface Room {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh: string;
}

type InititalState = {
  arrRooms: Room[];
  room: Room;
  arrRoomId: number[];
  totalRow: number;
  isSuccessful: boolean;
  isFetching: boolean;
};

const initialState: InititalState = {
  arrRooms: [],
  room: {} as Room,
  arrRoomId: [],
  totalRow: 0,
  isSuccessful: false,
  isFetching: true,
};

const roomReducer = createSlice({
  name: "roomReducer",
  initialState,
  reducers: {
    setIsSuccessful: (state: InititalState, action: PayloadAction<boolean>) => {
      state.isSuccessful = action.payload;
    },
    setIsFetching: (state: InititalState, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    setArrRooms: (state: InititalState, action: PayloadAction<Room[]>) => {
      state.arrRooms = action.payload;
    },
    setRoom: (state: InititalState, action: PayloadAction<Room>) => {
      state.room = action.payload;
    },
    setTotalRow: (state: InititalState, action: PayloadAction<number>) => {
      state.totalRow = action.payload;
    },
    setArrRoomsAfterAdded: (
      state: InititalState,
      action: PayloadAction<Room>
    ) => {
      const index = state.arrRooms.findIndex(
        (room) => room.id === action.payload.id
      );
      console.log(index);
      if (index === -1) {
        state.arrRooms.push(action.payload);
      }
    },
    setArrRoomsAfterDeleted: (
      state: InititalState,
      action: PayloadAction<number>
    ) => {
      const index = state.arrRooms.findIndex(
        (room) => room.id === action.payload
      );
      index && state.arrRooms.splice(index, 1);
    },
    updateArrWithEdittedRoom: (
      state: InititalState,
      action: PayloadAction<Room>
    ) => {
      const index = state.arrRooms.findIndex(
        (room) => room.id === action.payload.id
      );
      state.arrRooms[index] = { ...action.payload };
    },
  },
});

export const {
  setIsSuccessful,
  setArrRooms,
  setRoom,
  setTotalRow,
  setArrRoomsAfterDeleted,
  updateArrWithEdittedRoom,
  setArrRoomsAfterAdded,
  setIsFetching,
} = roomReducer.actions;

export default roomReducer.reducer;

// call api
export const getAllRoomsApi = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get("/phong-thue");
      dispatch(setArrRooms(result.data.content));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getRoomsByLocationId = (locationid: undefined | string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(
        `/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationid}`
      );
      console.log(result.data.content);
      dispatch(setArrRooms(result.data.content));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getRoomByIdApi = (roomId: undefined | number | string) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(`/phong-thue/${roomId}`);
      dispatch(setRoom(result.data.content));
    } catch (err) {
      console.log(err);
    }
  };
};

export const addRoomApi = (room: Room) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.post("/phong-thue", room);
      console.log(result.data.content);
      dispatch(setIsSuccessful(true));
      dispatch(setArrRoomsAfterAdded(result.data.content));
      Swal.fire({
        title: result.data.message,
        icon: "success",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Không thể thêm phòng!",
        icon: "error",
      });
    }
  };
};

export const deleteRoomApi = (roomId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.delete(`/phong-thue/${roomId}`);
      console.log(result.data.content);
      dispatch(setArrRoomsAfterDeleted(roomId));
      openNotificationWithIcon("success", "Xoá phòng thành công", "");
    } catch (err) {
      console.log(err);
      openNotificationWithIcon("error", "Không thể xoá phòng!", "");
    }
  };
};

export const editRoomApi = (room: Room) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.put(`/phong-thue/${room.id}`, room);
      console.log(result.data.content);
      dispatch(setIsSuccessful(true));
      dispatch(updateArrWithEdittedRoom(result.data.content));
      Swal.fire({
        title: "Cập nhật thành công!",
        icon: "success",
      });
    } catch (err) {
      console.log(err);
      dispatch(setIsSuccessful(false));
    }
  };
};

export const uploadRoomImgApi = (roomId: number, imgFile: string | Blob) => {
  return async () => {
    try {
      const result = await http.post(
        `/phong-thue/upload-hinh-phong?maPhong=${roomId}`,
        imgFile
      );
      console.log(result.data.content);
    } catch (err) {
      console.log(err);
    }
  };
};

export const searchRoomApi = (
  pageIndex: string,
  pageSize: string,
  keyword: string | null
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(
        `/phong-thue/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
      );
      console.log(result.data.content.data);
      dispatch(setArrRooms(result.data.content.data));
      dispatch(setTotalRow(result.data.content.totalRow));
      dispatch(setIsFetching(false));
    } catch (err) {
      console.log(err);
    }
  };
};

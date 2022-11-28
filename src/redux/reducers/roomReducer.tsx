import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
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
};

const initialState: InititalState = {
  arrRooms: [],
  room: {} as Room,
  arrRoomId: [],
  totalRow: 0,
};

const roomReducer = createSlice({
  name: "roomReducer",
  initialState,
  reducers: {
    setArrRooms: (state: InititalState, action: PayloadAction<Room[]>) => {
      state.arrRooms = action.payload;
    },
    setRoom: (state: InititalState, action: PayloadAction<Room>) => {
      state.room = action.payload;
    },
    setTotalRow: (state: InititalState, action: PayloadAction<number>) => {
      state.totalRow = action.payload;
    },
  },
});

export const { setArrRooms, setRoom, setTotalRow } = roomReducer.actions;

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
  return async () => {
    try {
      const result = await http.post("/phong-thue", room);
      console.log(result.data.content);
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteRoomApi = (roomId: number) => {
  return async () => {
    try {
      const result = await http.delete(`/phong-thue/${roomId}`);
      console.log(result.data.content);
    } catch (err) {
      console.log(err);
    }
  };
};

export const editRoomApi = (room: Room) => {
  return async () => {
    try {
      const result = await http.put(`/phong-thue/${room.id}`, room);
      // console.log(result.data.content);
      Swal.fire({
        title: "Cập nhật thành công!",
        icon: "success",
      })
    } catch (err) {
      console.log(err);
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
    } catch (err) {
      console.log(err);
    }
  };
};

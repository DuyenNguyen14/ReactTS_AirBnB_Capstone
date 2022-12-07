import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { createKeywordTypeNode } from "typescript";
import { http } from "../../util/setting";
import { AppDispatch } from "../configStore";

export interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh?: string;
}

type InitialState = {
  arrLocations: Location[];
  location: Location;
  totalRow: number;
  hasMore: boolean;
  isFetching: boolean;
};

const initialState: InitialState = {
  arrLocations: [],
  location: {} as Location,
  totalRow: 0,
  hasMore: false,
  isFetching: true,
};

const locationsReducer = createSlice({
  name: "locationsReducer",
  initialState,
  reducers: {
    setArrLocations: (
      state: InitialState,
      action: PayloadAction<Location[]>
    ) => {
      state.arrLocations = action.payload;
    },
    setLocation: (state: InitialState, action: PayloadAction<Location>) => {
      state.location = action.payload;
    },
    setTotalRow: (state: InitialState, action: PayloadAction<number>) => {
      state.totalRow = action.payload;
    },
    setHasMore: (state: InitialState, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setIsFetching: (state: InitialState, action: PayloadAction<boolean>) => {
      state.isFetching = action.payload;
    },
    setArrLocationAfterEditted: (
      state: InitialState,
      action: PayloadAction<Location>
    ) => {
      const index = state.arrLocations.findIndex(
        (location) => location.id === action.payload.id
      );
      if (index !== -1) {
        state.arrLocations[index] = { ...action.payload };
      }
    },
    setArrLocationAfterAdded: (
      state: InitialState,
      action: PayloadAction<Location>
    ) => {
      const index = state.arrLocations.findIndex(
        (location) => location.id === action.payload.id
      );
      if (index === -1) {
        state.arrLocations.push(action.payload);
      }
    },
    setArrLocationAfterDeleted: (
      state: InitialState,
      action: PayloadAction<number>
    ) => {
      const index = state.arrLocations.findIndex(
        (location) => location.id === action.payload
      );
      if (index !== -1) {
        state.arrLocations.splice(index, 1);
      }
    },
  },
});

export const {
  setArrLocations,
  setLocation,
  setTotalRow,
  setHasMore,
  setIsFetching,
  setArrLocationAfterEditted,
  setArrLocationAfterAdded,
  setArrLocationAfterDeleted,
} = locationsReducer.actions;

export default locationsReducer.reducer;

// call api
export const getAllLocations = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get("/vi-tri");
      dispatch(setArrLocations(result.data.content));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getLocationByIdApi = (locationId: string | undefined | number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(`/vi-tri/${locationId}`);
      dispatch(setLocation(result.data.content));
    } catch (err) {
      console.log(err);
    }
  };
};

export const getLocationPaginationApi = (
  pageIndex: number,
  pageSize: number,
  keyword: string | null
) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.get(
        `/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`
      );
      dispatch(setArrLocations(result.data.content.data));
      dispatch(setTotalRow(result.data.content.totalRow));
      dispatch(setIsFetching(false));
    } catch (err) {
      console.log(err);
    }
  };
};

export const deleteLocationApi = (locationId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.delete(`vi-tri/${locationId}`);
      console.log(result.data.content);
      Swal.fire({
        title: "Xoá thành công!",
        icon: "success",
      });
      dispatch(setArrLocationAfterDeleted(locationId));
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Xoá thất bại!",
        icon: "error",
      });
    }
  };
};

export const uploadLocationImg = (data: FormData, locationId: number) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.post(
        `vi-tri/upload-hinh-vitri?maViTri=${locationId}`,
        data
      );
      Swal.fire({
        title: "Upload hình thành công!",
        icon: "success",
      });
      dispatch(setLocation(result.data.content));
      dispatch(setArrLocationAfterEditted(result.data.content));
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Upload hình thất bại!",
        icon: "error",
      });
    }
  };
};

export const editLocation = (locationId: number, locationInfo: Location) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.put(`vi-tri/${locationId}`, locationInfo);
      Swal.fire({
        title: "Sửa thông tin thành công!",
        icon: "success",
      });
      dispatch(setArrLocationAfterEditted(result.data.content));
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Không thể sửa thông tin!",
        icon: "error",
      });
    }
  };
};

export const addLocation = (locationInfo: Location) => {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await http.post("vi-tri", locationInfo);
      Swal.fire({
        title: "Thêm mới thành công!",
        icon: "success",
      });
      dispatch(setArrLocationAfterAdded(result.data.content));
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Không thể thêm!",
        icon: "error",
        html: "Vui lòng kiểm tra lại thông tin!",
      });
    }
  };
};

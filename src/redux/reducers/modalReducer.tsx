import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  bodyComponent: JSX.Element;
  open: boolean;
}

const initialState = {
  bodyComponent: <></>,
  open: false,
};

const modalReducer = createSlice({
  name: "modalReducer",
  initialState,
  reducers: {
    setBodyComponent: (
      state: ModalState,
      action: PayloadAction<JSX.Element>
    ) => {
      state.bodyComponent = action.payload;
    },
    setOpen: (state: ModalState, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

export const { setBodyComponent, setOpen } = modalReducer.actions;

export default modalReducer.reducer;

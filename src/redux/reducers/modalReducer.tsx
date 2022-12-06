import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  bodyComponent: JSX.Element;
  open: boolean;
  title: string;
}

const initialState = {
  bodyComponent: <></>,
  open: false,
  title: "",
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
    setTitle: (state: ModalState, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const { setBodyComponent, setOpen, setTitle } = modalReducer.actions;

export default modalReducer.reducer;
